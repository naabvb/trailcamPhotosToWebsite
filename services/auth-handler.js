const crypto = require('crypto');

async function getAuthentication(request, response) {
  var authHeader = request.headers.authorization;
  if (!authHeader) return response.status(401);

  const encodedCreds = authHeader.split(' ')[1];
  const plainCreds = Buffer.from(encodedCreds, 'base64').toString().split(':');
  const username = plainCreds[0];
  const password = plainCreds[1];
  const hashable = username + ':' + password + process.env.salt;
  const hash = crypto.createHash('sha256').update(hashable).digest('hex');
  let role = 0;
  if (hash == process.env.jatkala) role = 1;
  if (hash == process.env.vastila) role = 2;
  return {
    role: role,
    key: crypto.createHash('sha256').update(hash).digest('hex'),
  };
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
  getAuthentication,
  getRole,
};
