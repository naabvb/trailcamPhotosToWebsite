const axios = require('axios');

const regex = /\["(https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9\-_]*)"/g

function extractPhotos(content) {
    const links = new Set()
    let match
    while (match = regex.exec(content)) {
        links.add(match[1])
    }
    return Array.from(links)
}

function extractExif(extracted, response) {
    var regexString = "";
    const newList = [];
    for (i = 0; i < extracted.length; i++) {
        var escapedString = extracted[i].replace(/\//g, '\\\/');
        regexString = "\\" + escapedString + "(.*\\s\\S\\s\\S[0-9]*,)";
        regexString = new RegExp(regexString, 'g');
        let match;
        while (match = regexString.exec(response)) {
            var res = match[1].split(",")
            var location = res.length - 2;
            var timestamp = res[location];
            var date = new Date(parseInt(timestamp))
            var newObj = { 'src': extracted[i] + "=w9000", "thumbnail": extracted[i] + "=w400", "thumbnailWidth": 400, "thumbnailHeight": 300, "date": date.toUTCString() }
            newList.push(newObj)
            break;
        }
    }
    return newList
}

async function getAlbum() {
    album1_id = "ID_HERE"
    try {
        const response = await axios.get(`https://photos.app.goo.gl/${album1_id}`)
        const extracted = extractPhotos(response.data);
        const extractedObjects = extractExif(extracted, response.data);
        return extractedObjects;
    }
    catch (e) {
        return null
    }
}


module.exports = {
    getAlbum
}