const config = require('../config.json');
var crypto = require('crypto');

async function getAuthenticate(request, response) {
    var authHeader = request.headers.authorization;
    if (!authHeader) return response.status(401);

    var encodedCreds = authHeader.split(' ')[1];
    var plainCreds = (Buffer.from(encodedCreds, 'base64')).toString().split(':')
    var username = plainCreds[0]
    var password = plainCreds[1]
    var hashable = username + ":" + password + config.salt;
    var hash = crypto.createHash('sha256').update(hashable).digest('hex');
    var role = 0;
    if (hash == config.jatkala) role = 1;
    if (hash == config.vastila) role = 2;
    return { "role": role, "key": crypto.createHash('sha256').update(hash).digest('hex') };
}

async function getRole(rkey) {
    if (rkey == crypto.createHash('sha256').update(config.jatkala).digest('hex')) {
        return 1;
    }
    if (rkey == crypto.createHash('sha256').update(config.vastila).digest('hex')) {
        return 2;
    }
    return 0;
}



module.exports = {
    getAuthenticate,
    getRole
}