import aws from 'aws-sdk';
import { buckets, Cameras, jatkalaRoutes, Role } from '../constants/constants';
import { ImageItem } from '../interfaces/aws-photos';

aws.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.awsRegion,
});

export async function getTimestamps(role: Role) {
  try {
    const s3 = new aws.S3();
    let results = (await s3.listObjectsV2({ Bucket: 'trailcamtimestamps' }).promise()).Contents;
    if (results) {
      if (role === Role.Jatkala) {
        results = results.filter((result) => jatkalaRoutes.includes(result.Key!!));
      }
      return results.map((result) => {
        return { key: `/${result.Key}`, timestamp: result.LastModified };
      });
    }
    throw 'Could not load timestamps';
  } catch (e) {
    console.log('Error: ', e);
  }
}

async function updateImageNames(queryId: Cameras | string, filename: string) {
  const dynamoDb = new aws.DynamoDB.DocumentClient();
  const currentNames = await getImageNamesFromDb(queryId);
  const newItems = currentNames.filter((name) => name !== filename);
  await dynamoDb
    .put({ TableName: process.env.trailcamImagesTable!, Item: { cam: queryId, images: newItems } })
    .promise();
}

async function getImageNamesFromDb(queryId: Cameras | string): Promise<string[]> {
  const dynamoDb = new aws.DynamoDB.DocumentClient();
  return await (
    await dynamoDb.get({ TableName: process.env.trailcamImagesTable!, Key: { cam: queryId } }).promise()
  ).Item!.images;
}

export async function getImages(queryId: string) {
  let id: Cameras;
  if (!Object.keys(Cameras).includes(queryId)) {
    return [];
  }
  id = queryId as Cameras;
  const imgList: ImageItem[] = [];
  try {
    const contents = await getImageNamesFromDb(id);
    const url = buckets[id].url;
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };

    for (let i = 0; i < contents.length; i++) {
      options = { weekday: 'short', month: 'short', day: 'numeric' };
      const filename = contents[i];
      const src = `${url}${filename}`;
      const timestamp = filename.split('_')[1];
      const date = new Date(parseInt(timestamp));
      if (date.getFullYear() != today.getFullYear()) {
        options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      }
      let dateType = date.toLocaleDateString('fi-FI', options);

      if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      ) {
        dateType = 'Tänään';
      }
      if (
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()
      ) {
        dateType = 'Eilen';
      }

      imgList.push({
        src: src,
        thumbnail: src,
        thumbnailWidth: 400,
        thumbnailHeight: 300,
        timestamp: timestamp,
        model: dateType,
      });
    }
  } catch (e) {
    console.log('Error: ', e);
  }
  imgList.sort((a, b) => {
    const keyA = new Date(parseInt(a.timestamp)),
      keyB = new Date(parseInt(b.timestamp));
    if (keyA < keyB) return 1;
    if (keyA > keyB) return -1;
    return 0;
  });
  return groupByDay(imgList);
}

function groupByDay(listOfObjects: ImageItem[]) {
  const uniqueDates = [...new Set(listOfObjects.map((obj) => obj.model))];
  return uniqueDates.map((key) => {
    return { key: key, values: listOfObjects.filter((obj) => obj.model === key) };
  });
}

export async function deleteImage(url: string) {
  try {
    const s3 = new aws.S3();
    const dynamoDb = new aws.DynamoDB();
    const filename = url.split('/').reverse()[0];
    for (let [key, value] of Object.entries(buckets)) {
      if (url.startsWith(value.url)) {
        await s3
          .copyObject({
            Bucket: value.trashBucket,
            CopySource: `/${value.name}/${filename}`,
            Key: filename,
          })
          .promise();
        await s3
          .deleteObject({
            Bucket: value.name,
            Key: filename,
          })
          .promise();
        await dynamoDb
          .updateItem({
            TableName: process.env.trailcamDeleteTable!,
            Key: {
              cam: { S: key },
            },
            UpdateExpression: 'set deleteRequired = :deleteRequired',
            ExpressionAttributeValues: {
              ':deleteRequired': { BOOL: true },
            },
          })
          .promise();
        await updateImageNames(key, filename);
        return true;
      }
    }
  } catch (e) {
    console.log('Error: ', e);
  }
  return false;
}
