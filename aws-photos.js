const aws = require('aws-sdk');
const config = require('./config.json');

async function getImages() {
    const newList = [];

    try {

        aws.config.setPromisesDependency();
        aws.config.update({
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            region: 'eu-north-1'
        });

        const s3 = new aws.S3();
        const response = await s3.listObjectsV2({
            Bucket: 'jatkalanriistakamerat'
        }).promise();

        var contents = response.Contents;
        var prefix = "https://jatkalanriistakamerat.s3.eu-north-1.amazonaws.com/";
        var name = "";
        var splitString = "";
        var timestamp;
        var date;
        for (let i = 0; i < contents.length; i++) {
            name = contents[i].Key;
            splitString = name.split("_");
            timestamp = splitString[1];
            date = new Date(parseInt(timestamp))
            var newObj = { 'src': prefix + name, "thumbnail": prefix + name, "thumbnailWidth": 400, "thumbnailHeight": 300, "timestamp": timestamp, "date": date.toString() };
            newList.push(newObj);
        }

    } catch (e) {
        console.log('Error: ', e);
    }
    // TODO: Ordering!
    return newList;
}

module.exports = {
    getImages
}