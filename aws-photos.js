const aws = require('aws-sdk');
const config = require('./config.json');
const icu = require('full-icu');

async function getImages(id) {
    const newList = [];
    try {

        aws.config.setPromisesDependency();
        aws.config.update({
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            region: 'eu-north-1'
        });
        var response;
        const s3 = new aws.S3();
        if (id == 1) {
            response = await s3.listObjectsV2({
                Bucket: 'jatkalanriistakamerat'
            }).promise();
        }

        else {
            response = await s3.listObjectsV2({
                Bucket: 'jatkalanriistakamerat2'
            }).promise();

        }

        var contents = response.Contents;
        var prefix;
        if (id == 1) {
            prefix = config.bucket1;
        }
        if (id == 2) {
            prefix = config.bucket2;

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
            name = contents[i].Key;
            splitString = name.split("_");
            timestamp = splitString[1];
            date = new Date(parseInt(timestamp));
            if (date.getFullYear != today.getFullYear) {
                options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
            }
            model = date.toLocaleDateString('fi-FI', options);

            if (date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear()) {
                model = "Tänään"
            }
            if (date.getDate() == yesterday.getDate() && date.getMonth() == yesterday.getMonth() && date.getFullYear() == yesterday.getFullYear()) {
                model = "Eilen"
            }

            var newObj = { 'src': prefix + name, "thumbnail": prefix + name, "thumbnailWidth": 400, "thumbnailHeight": 300, "timestamp": timestamp, "date": date.toString(), "model": model };
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

module.exports = {
    getImages
}