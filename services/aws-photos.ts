import aws from 'aws-sdk';
import { ParsedYears, ValidMonths } from '../interfaces/graphs';
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

export async function getGraphsData() {
  const [j1, j2, j3, j4] = await Promise.all([
    getImageNamesFromDb(Cameras.j1),
    getImageNamesFromDb(Cameras.j2),
    getImageNamesFromDb(Cameras.j3),
    getImageNamesFromDb(Cameras.j4),
  ]);
  return {
    j1: generateGraphDataForCamera(j1),
    j2: generateGraphDataForCamera(j2),
    j3: generateGraphDataForCamera(j3),
    j4: generateGraphDataForCamera(j4),
  };
}

function generateGraphDataForCamera(images: string[]) {
  const parsedYears = parseYears(images);
  return {
    thisYear: parseMonths(parsedYears.imagesForThisYear),
    lastYear: parseMonths(parsedYears.imagesForLastYear),
    lastLastYear: parseMonths(parsedYears.imagesForLastLastYear),
  };
}

function parseYears(images: string[]) {
  const currentYear = new Date().getFullYear();
  const lastYear = new Date().getFullYear() - 1;
  const lastLastYear = new Date().getFullYear() - 2;
  const imagesForThisYear: ParsedYears = { year: currentYear, timestamps: [] };
  const imagesForLastYear: ParsedYears = { year: lastYear, timestamps: [] };
  const imagesForLastLastYear: ParsedYears = { year: lastLastYear, timestamps: [] };
  images.forEach((image) => {
    const [, timestamp] = image.split('_');
    const imageYear = new Date(parseInt(timestamp)).getFullYear();
    if (imageYear === currentYear) {
      return imagesForThisYear.timestamps.push(parseInt(timestamp));
    }
    if (imageYear === lastYear) {
      return imagesForLastYear.timestamps.push(parseInt(timestamp));
    }
    if (imageYear === lastLastYear) {
      return imagesForLastLastYear.timestamps.push(parseInt(timestamp));
    }
  });
  return { imagesForThisYear, imagesForLastYear, imagesForLastLastYear };
}

function parseMonths(parsedYears: ParsedYears) {
  const { year, timestamps } = parsedYears;
  const months = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 };
  timestamps.forEach((timestamp) => {
    const month = (new Date(timestamp).getMonth() + 1) as ValidMonths;
    months[month] = months[month] + 1;
  });
  const graphData = [];
  let total = 0;
  for (const [index, [key, value]] of Object.entries(Object.entries(months))) {
    if (year === new Date().getFullYear()) {
      const maxMonth = new Date().getMonth() + 1;
      if (parseInt(index) < maxMonth) {
        graphData.push({ amount: value, date: `${key}` });
        total = total + value;
        continue;
      }
      break;
    }
    graphData.push({ amount: value, date: `${key}` });
    total = total + value;
  }
  return { graphData, total, year };
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
    contents.sort((a, b) => {
      const keyA = new Date(parseInt(a.split('_')[1]));
      const keyB = new Date(parseInt(b.split('_')[1]));
      if (keyA < keyB) return 1;
      if (keyA > keyB) return -1;
      return 0;
    });
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
        model: dateType,
      });
    }
  } catch (e) {
    console.log('Error: ', e);
  }
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
    const [filename] = url.split('/').reverse();
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
