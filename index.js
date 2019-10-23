const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const config = require('./config.json');
const app = express();

const { getAlbum } = require('./google-photos');
const { getImages } = require('./aws-photos');
const { getAuthenticate, getRole } = require('./auth-handler');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(cookieParser(config.signedKey));

app.get('/api/images/1', async function (request, response) {
  try {
    const results = await getImages(1)
    response.json(results);
  }
  catch (e) {
    response.status(500);
  }

});

app.get('/api/images/2', async function (request, response) {
  try {
    const results = await getImages(2)
    response.json(results);
  }
  catch (e) {
    response.status(500);
  }

});

app.get('/api/authenticate', async function (request, response) {
  try {
    const result = await getAuthenticate(request);
    const options = {
      httpOnly: true,
      signed: true,
    };
    console.log(result);
    if (result.role == 2) {
      response.cookie('rkey', result.key, options).send({ role: 'vastila' });
    }
    if (result.role == 1) {
      response.cookie('rkey', result.key, options).send({ role: 'jatkala' });
    }
    else {
      response.status(401).send();
    }

  } catch (e) {
    response.status(500);
  }

});

app.get('/api/get-role', async function (request, response) {
  try {
    if (request.signedCookies.rkey) {
       const result = await getRole(request.signedCookies.rkey);
       if (result == true) response.send({role: 'jatkala'});
       response.send({});
    }
    else {
      response.send({role: 'no'});

    }

  } catch(e) {
    response.status(500);
  }
})

app.get('/api/clear-role', async function (request, resposne) {
  response.clearCookie('rkey').end();
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});




const port = process.env.PORT || 5000;
app.listen(port);
console.log(`listening on ${port}`);