const aws = require('aws-sdk');
const icu = require('full-icu');

async function getImages(id) {
    const newList = [];
    try {

        aws.config.setPromisesDependency();
        aws.config.update({
            accessKeyId: process.env.accessKeyId,
            secretAccessKey: process.env.secretAccessKey,
            region: 'eu-north-1'
        });
        var response;
        const s3 = new aws.S3();
        if (id == 1) {
            response = await s3.listObjectsV2({
                Bucket: 'jatkalanriistakamerat'
            }).promise();
        }

        if (id == 2) {
            response = await s3.listObjectsV2({
                Bucket: 'jatkalanriistakamerat2'
            }).promise();
        }

        if (id == 3) {
            response = await s3.listObjectsV2({
                Bucket: 'vastilanriistakamerat'
            }).promise();
        }

        if (id == 4) {
            response = await s3.listObjectsV2({
                Bucket: 'vastilanriistakamerat2'
            }).promise();
        }

        var contents = response.Contents;
        var prefix;
        if (id == 1) {
            prefix = process.env.bucket1;
        }
        if (id == 2) {
            prefix = process.env.bucket2;
        }
        if (id == 3) {
            prefix = process.env.bucket3;
        }

        if (id == 4) {
            prefix = process.env.bucket4;
        }

        var name = "";
        var splitString = "";
        var timestamp;
        var date;
        var model;
        var today = new Date();
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        var options = { weekday: 'short', month: 'short', day: 'numeric' };

        for (let i = 0; i < contents.length; i++) {
            options = { weekday: 'short', month: 'short', day: 'numeric' };
            name = contents[i].Key;
            splitString = name.split("_");
            timestamp = splitString[1];
            date = new Date(parseInt(timestamp));
            if (date.getFullYear() != today.getFullYear()) {
                options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
            }
            model = date.toLocaleDateString('fi-FI', options);

            if (date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear()) {
                model = "Tänään"
            }
            if (date.getDate() == yesterday.getDate() && date.getMonth() == yesterday.getMonth() && date.getFullYear() == yesterday.getFullYear()) {
                model = "Eilen"
            }

            var newObj = { 'src': prefix + name, "thumbnail": prefix + name, "thumbnailWidth": 400, "thumbnailHeight": 300, "timestamp": timestamp, "model": model };
            newList.push(newObj);
        }

    } catch (e) {
        console.log('Error: ', e);
    }
    newList.sort(function (a, b) {
        var keyA = new Date(parseInt(a.timestamp)),
            keyB = new Date(parseInt(b.timestamp));
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;

    })
    return getByDay(newList.reverse());
}

function getByDay(listOfObjects) {
    var dates = [];
    var obj;
    var bool = false;
    for (let i = 0; i < listOfObjects.length; i++) {
        bool = false;
        for (let y = 0; y < dates.length; y++) {
            if (dates[y].key == listOfObjects[i].model) {
                dates[y].values.push(listOfObjects[i])
                bool = true
                break;
            }
        }
        if (bool == false) {
            obj = { "key": listOfObjects[i].model, "values": [listOfObjects[i]] }
            dates.push(obj);
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
            region: 'eu-north-1'
        });

        const s3 = new aws.S3();
        let name = url.split('/').reverse()[0];
        let mode = 0;

        if (url.startsWith("https://jatkalanriistakamerat2")) {
            mode = 2
            await s3.copyObject({
                Bucket: 'trashjatkalanriistakamerat2',
                CopySource: '/jatkalanriistakamerat2/' + name,
                Key: name
            }).promise();
            await s3.deleteObject({
                Bucket: 'jatkalanriistakamerat2',
                Key: name
            }).promise();
            return true;
        }

        if (url.startsWith("https://jatkalanriistakamerat")) {
            mode = 1
            await s3.copyObject({
                Bucket: 'trashjatkalanriistakamerat',
                CopySource: '/jatkalanriistakamerat/' + name,
                Key: name
            }).promise();
            await s3.deleteObject({
                Bucket: 'jatkalanriistakamerat',
                Key: name
            }).promise();
            return true;
        }

        if (url.startsWith("https://vastilanriistakamerat2")) {
            mode = 4
            await s3.copyObject({
                Bucket: 'trashvastilanriistakamerat2',
                CopySource: '/vastilanriistakamerat2/' + name,
                Key: name
            }).promise();
            await s3.deleteObject({
                Bucket: 'vastilanriistakamerat2',
                Key: name
            }).promise();
            return true;
        }

        if (url.startsWith("https://vastilanriistakamerat")) {
            mode = 3
            await s3.copyObject({
                Bucket: 'trashvastilanriistakamerat',
                CopySource: '/vastilanriistakamerat/' + name,
                Key: name
            }).promise();
            await s3.deleteObject({
                Bucket: 'vastilanriistakamerat',
                Key: name
            }).promise();
            return true;
        }

        if (mode === 0) {
            return false;
        }

    } catch (e) {
        console.log('Error: ', e);
    }
    return false;
}

module.exports = {
    getImages,
    deleteImage
}