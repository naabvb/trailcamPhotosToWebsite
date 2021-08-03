const aws = require('aws-sdk');
const icu = require('full-icu');

const buckets = {
  1: { name: 'jatkalanriistakamerat', url: process.env.bucket1 },
  2: { name: 'jatkalanriistakamerat2', url: process.env.bucket2 },
  3: { name: 'vastilanriistakamerat', url: process.env.bucket3 },
  4: { name: 'vastilanriistakamerat2', url: process.env.bucket4 },
};

async function getImages(id) {
  const imgList = [];
  try {
    aws.config.setPromisesDependency();
    aws.config.update({
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
      region: 'eu-north-1',
    });
    let contents;
    let url;
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

    if (id == 1 || id == 2 || id == 3 || id == 4) {
      contents = await listAllKeys({ Bucket: buckets[id].name });
      url = buckets[id].url;
    }

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
        date.getDate() == today.getDate() &&
        date.getMonth() == today.getMonth() &&
        date.getFullYear() == today.getFullYear()
      ) {
        dateType = 'Tänään';
      }
      if (
        date.getDate() == yesterday.getDate() &&
        date.getMonth() == yesterday.getMonth() &&
        date.getFullYear() == yesterday.getFullYear()
      ) {
        dateType = 'Eilen';
      }

      const imgObj = {
        src: url + fileName,
        thumbnail: url + fileName,
        thumbnailWidth: 400,
        thumbnailHeight: 300,
        timestamp: timestamp,
        model: dateType,
      };
      imgList.push(imgObj);
    }
  } catch (e) {
    console.log('Error: ', e);
  }
  imgList.sort(function (a, b) {
    const keyA = new Date(parseInt(a.timestamp)),
      keyB = new Date(parseInt(b.timestamp));
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
  return getByDay(imgList.reverse());
}

function getByDay(listOfObjects) {
  let dates = [];
  let bool = false;
  for (let i = 0; i < listOfObjects.length; i++) {
    bool = false;
    for (let y = 0; y < dates.length; y++) {
      if (dates[y].key == listOfObjects[i].model) {
        dates[y].values.push(listOfObjects[i]);
        bool = true;
        break;
      }
    }
    if (!bool) {
      dates.push({ key: listOfObjects[i].model, values: [listOfObjects[i]] });
    }
  }
  return dates;
}

async function deleteImage(url) {
  try {
    aws.config.setPromisesDependency();
    aws.config.update({
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
      region: 'eu-north-1',
    });

    const s3 = new aws.S3();
    const fileName = url.split('/').reverse()[0];

    if (url.startsWith('https://jatkalanriistakamerat2')) {
      await s3
        .copyObject({
          Bucket: 'trashjatkalanriistakamerat2',
          CopySource: '/jatkalanriistakamerat2/' + fileName,
          Key: fileName,
        })
        .promise();
      await s3
        .deleteObject({
          Bucket: 'jatkalanriistakamerat2',
          Key: fileName,
        })
        .promise();
      return true;
    }

    if (url.startsWith('https://jatkalanriistakamerat')) {
      await s3
        .copyObject({
          Bucket: 'trashjatkalanriistakamerat',
          CopySource: '/jatkalanriistakamerat/' + fileName,
          Key: fileName,
        })
        .promise();
      await s3
        .deleteObject({
          Bucket: 'jatkalanriistakamerat',
          Key: fileName,
        })
        .promise();
      return true;
    }

    if (url.startsWith('https://vastilanriistakamerat2')) {
      await s3
        .copyObject({
          Bucket: 'trashvastilanriistakamerat2',
          CopySource: '/vastilanriistakamerat2/' + fileName,
          Key: fileName,
        })
        .promise();
      await s3
        .deleteObject({
          Bucket: 'vastilanriistakamerat2',
          Key: fileName,
        })
        .promise();
      return true;
    }

    if (url.startsWith('https://vastilanriistakamerat')) {
      await s3
        .copyObject({
          Bucket: 'trashvastilanriistakamerat',
          CopySource: '/vastilanriistakamerat/' + fileName,
          Key: fileName,
        })
        .promise();
      await s3
        .deleteObject({
          Bucket: 'vastilanriistakamerat',
          Key: fileName,
        })
        .promise();
      return true;
    }
  } catch (e) {
    console.log('Error: ', e);
  }
  return false;
}

module.exports = {
  getImages,
  deleteImage,
};
