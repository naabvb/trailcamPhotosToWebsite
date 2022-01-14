const aws = require('aws-sdk');
const icu = require('full-icu');

const jatkalaRoutes = ['j1', 'j2', 'j3', 'j4'];
const vastilaRoutes = ['v1', 'v2'];

const buckets = {
  j1: { name: 'riistakamera-j1', trashBucket: 'riistakamera-trash-j1', url: process.env.j1 },
  j2: { name: 'riistakamera-j2', trashBucket: 'riistakamera-trash-j2', url: process.env.j2 },
  j3: { name: 'riistakamera-j3', trashBucket: 'riistakamera-trash-j3', url: process.env.j3 },
  j4: { name: 'riistakamera-j4', trashBucket: 'riistakamera-trash-j4', url: process.env.j4 },
  v1: { name: 'riistakamera-v1', trashBucket: 'riistakamera-trash-v1', url: process.env.v1 },
  v2: { name: 'riistakamera-v2', trashBucket: 'riistakamera-trash-v2', url: process.env.v2 },
};

aws.config.setPromisesDependency();
aws.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.awsRegion,
});

async function getTimestamps(role) {
  try {
    const s3 = new aws.S3();
    let results = await s3.listObjectsV2({ Bucket: 'trailcamtimestamps' }).promise();
    results = results.Contents;
    if (role === 'jatkala') {
      results = results.filter((result) => jatkalaRoutes.includes(result.Key));
    }
    return results.map((result) => {
      return { key: `/${result.Key}`, timestamp: result.LastModified };
    });
  } catch (e) {
    console.log('Error: ', e);
  }
}

async function getImages(id) {
  const imgList = [];
  try {
    const s3 = new aws.S3();
    const listAllKeys = (params, out = []) =>
      new Promise((resolve, reject) => {
        s3.listObjectsV2(params)
          .promise()
          .then(({ Contents, IsTruncated, NextContinuationToken }) => {
            out.push(...Contents);
            !IsTruncated
              ? resolve(out)
              : resolve(listAllKeys(Object.assign(params, { ContinuationToken: NextContinuationToken }), out));
          })
          .catch(reject);
      });
    const contents = await listAllKeys({ Bucket: buckets[id].name });
    const url = buckets[id].url;

    let fileName = '';
    let timestamp;
    let date;
    let dateType;
    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let options = { weekday: 'short', month: 'short', day: 'numeric' };

    for (let i = 0; i < contents.length; i++) {
      options = { weekday: 'short', month: 'short', day: 'numeric' };
      fileName = contents[i].Key;
      timestamp = fileName.split('_')[1];
      date = new Date(parseInt(timestamp));
      if (date.getFullYear() != today.getFullYear()) {
        options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      }
      dateType = date.toLocaleDateString('fi-FI', options);

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

function groupByDay(listOfObjects) {
  const uniqueDates = [...new Set(listOfObjects.map((obj) => obj.model))];
  return (groupedDates = uniqueDates.map((key) => {
    return { key: key, values: listOfObjects.filter((obj) => obj.model === key) };
  }));
}

async function deleteImage(url) {
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
            TableName: process.env.awsTableName,
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

module.exports = {
  vastilaRoutes,
  jatkalaRoutes,
  getImages,
  deleteImage,
  getTimestamps,
};
