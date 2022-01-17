import aws from 'aws-sdk';
import { ListObjectsV2Request } from 'aws-sdk/clients/s3';
import { buckets, Cameras, jatkalaRoutes } from '../constants/constants';
import { ImageItem } from '../interfaces/aws-photos';

aws.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.awsRegion,
});

export async function getTimestamps(role: string) {
  try {
    const s3 = new aws.S3();
    let results = (await s3.listObjectsV2({ Bucket: 'trailcamtimestamps' }).promise()).Contents;
    if (results) {
      if (role === 'jatkala') {
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

async function getKeys(params: ListObjectsV2Request) {
  const s3 = new aws.S3();
  const listAllKeys = (params: ListObjectsV2Request, out: aws.S3.ObjectList = []): Promise<aws.S3.ObjectList> =>
    new Promise((resolve, reject) => {
      s3.listObjectsV2(params)
        .promise()
        .then(({ Contents, IsTruncated, NextContinuationToken }) => {
          Contents ? out.push(...Contents) : null;
          !IsTruncated
            ? resolve(out)
            : resolve(listAllKeys(Object.assign(params, { ContinuationToken: NextContinuationToken }), out));
        })
        .catch(reject);
    });
  return await listAllKeys(params);
}

export async function getImages(queryId: string) {
  let id: Cameras;
  if (!Object.keys(Cameras).includes(queryId)) {
    return [];
  }
  id = queryId as Cameras;
  const imgList: ImageItem[] = [];
  try {
    const contents = await getKeys({ Bucket: buckets[id].name });
    const url = buckets[id].url;
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };

    for (let i = 0; i < contents.length; i++) {
      options = { weekday: 'short', month: 'short', day: 'numeric' };
      const fileName = contents[i].Key || '';
      const timestamp = fileName.split('_')[1];
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
        src: url + fileName,
        thumbnail: url + fileName,
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
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
  return groupByDay(imgList.reverse());
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
    const fileName = url.split('/').reverse()[0];
    for (let [key, value] of Object.entries(buckets)) {
      if (url.startsWith(value.url)) {
        await s3
          .copyObject({
            Bucket: value.trashBucket,
            CopySource: `/${value.name}/${fileName}`,
            Key: fileName,
          })
          .promise();
        await s3
          .deleteObject({
            Bucket: value.name,
            Key: fileName,
          })
          .promise();
        await dynamoDb
          .updateItem({
            TableName: process.env.awsTableName!!,
            Key: {
              cam: { S: key },
            },
            UpdateExpression: 'set deleteRequired = :deleteRequired',
            ExpressionAttributeValues: {
              ':deleteRequired': { BOOL: true },
            },
          })
          .promise();
        return true;
      }
    }
  } catch (e) {
    console.log('Error: ', e);
  }
  return false;
}
