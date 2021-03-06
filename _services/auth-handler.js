var crypto = require('crypto');

async function getAuthenticate(request, response) {
    var authHeader = request.headers.authorization;
    if (!authHeader) return response.status(401);

    var encodedCreds = authHeader.split(' ')[1];
    var plainCreds = (Buffer.from(encodedCreds, 'base64')).toString().split(':')
    var username = plainCreds[0]
    var password = plainCreds[1]
    var hashable = username + ":" + password + process.env.salt;
    var hash = crypto.createHash('sha256').update(hashable).digest('hex');
    var role = 0;
    if (hash == process.env.jatkala) role = 1;
    if (hash == process.env.vastila) role = 2;
    return { "role": role, "key": crypto.createHash('sha256').update(hash).digest('hex') };
}

async function getRole(rkey) {
    if (rkey == crypto.createHash('sha256').update(process.env.jatkala).digest('hex')) {
        return 1;
    }
    if (rkey == crypto.createHash('sha256').update(process.env.vastila).digest('hex')) {
        return 2;
    }
    return 0;
}



module.exports = {
    getAuthenticate,
    getRole
}