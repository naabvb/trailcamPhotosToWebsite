const cookieParser = require('cookie-parser');
const compression = require('compression');
const express = require('express');
const path = require('path');
const sslRedirect = require('heroku-ssl-redirect');
const config = require('./config.json');
const app = express();
app.use(compression());

const { getAlbum } = require('./_services/google-photos'); // Currently not in use
const { getImages, deleteImage } = require('./_services/aws-photos');
const { getAuthenticate, getRole } = require('./_services/auth-handler');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(sslRedirect());
app.use(cookieParser(config.signedKey));
app.disable('x-powered-by');

app.get('/api/images/:imagesId', async function (request, response) {
  try {
    if (request.signedCookies.rkey) {
      const role = await getRole(request.signedCookies.rkey);
      const parameter = parseInt(request.params.imagesId);
      if ((role === 1 || role === 2) && (parameter === 1 || parameter === 2)) {
        const images = await getImages(parameter);
        response.json(images);
      }
      if (role === 2 && parameter === 3) {
        const images = await getImages(parameter);
        response.json(images)
      }
      else {
        response.sendStatus(401);
      }
    }
    else {
      response.sendStatus(401);
    }
  } catch (e) {
    response.status(500);
  }
});

app.get('/api/authenticate', async function (request, response) {
  try {
    const result = await getAuthenticate(request);
    let inProd = false;
    if (process.env.NODE_ENV === 'production') {
      inProd = true;
    }
    const options = {
      httpOnly: true,
      signed: true,
      secure: inProd,
    };
    if (result.role == 2) {
      response.cookie('rkey', result.key, options).send({ role: 'vastila' });
    }
    if (result.role == 1) {
      response.cookie('rkey', result.key, options).send({ role: 'jatkala' });
    }
    else {
      response.sendStatus(401);
    }

  } catch (e) {
    response.status(500);
  }
});

app.get('/api/get-role', async function (request, response) {
  try {
    if (request.signedCookies.rkey) {
      const result = await getRole(request.signedCookies.rkey);
      if (result === 1) response.send({ role: 'jatkala' });
      if (result === 2) response.send({ role: 'vastila' });
      response.send({ role: 'no' });
    }
    else {
      response.send({ role: 'no' });
    }

  } catch (e) {
    response.status(500);
  }
});

app.get('/api/clear-role', async function (request, response) {
  response.clearCookie('rkey').sendStatus(200);
});

app.get('/api/delete-image', async function (request, response) {
  try {
    if (request.signedCookies.rkey) {
      const role = await getRole(request.signedCookies.rkey);
      if (role === 2 && request.query.img_url && request.query.img_url.length > 0) {
        const result = await deleteImage(request.query.img_url)
        if (result === true) {
          response.sendStatus(204);
        }
        else {
          response.sendStatus(200);
        }
      }
      else {
        response.sendStatus(403);
      }
    }
    else {
      response.sendStatus(401);
    }
  } catch (e) {
    response.status(500);
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`listening on ${port}`);