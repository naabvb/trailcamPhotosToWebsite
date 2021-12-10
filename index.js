const cookieParser = require('cookie-parser');
if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}
const shrinkRay = require('shrink-ray-current');
const express = require('express');
const path = require('path');
const sslRedirect = require('heroku-ssl-redirect');
const app = express();
app.use(shrinkRay());

const { getImages, deleteImage, jatkalaRoutes, vastilaRoutes, getTimestamps } = require('./services/aws-photos');
const { getAuthentication, getRole } = require('./services/auth-handler');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(sslRedirect());
app.use(cookieParser(process.env.signedKey));
app.disable('x-powered-by');

app.get('/api/images/:imagesId', async (request, response) => {
  try {
    if (request.signedCookies.rkey) {
      const role = await getRole(request.signedCookies.rkey);
      const parameter = request.params.imagesId;
      if ((role === 'jatkala' || role === 'vastila') && jatkalaRoutes.includes(parameter)) {
        const images = await getImages(parameter);
        response.json(images);
      }
      if (role === 'vastila' && vastilaRoutes.includes(parameter)) {
        const images = await getImages(parameter);
        response.json(images);
      } else {
        response.json([]);
      }
    } else {
      response.sendStatus(401);
    }
  } catch (e) {
    response.status(500);
  }
});

app.get('/api/authenticate', async (request, response) => {
  try {
    const result = await getAuthentication(request);
    let inProd = process.env.NODE_ENV === 'production';
    const options = {
      httpOnly: true,
      signed: true,
      secure: inProd,
      sameSite: 'lax',
    };
    if (result.role === 'vastila') {
      response.cookie('rkey', result.key, options).send({ role: result.role });
    }
    if (result.role === 'jatkala') {
      response.cookie('rkey', result.key, options).send({ role: result.role });
    } else {
      response.sendStatus(401);
    }
  } catch (e) {
    response.status(500);
  }
});

app.get('/api/get-role', async (request, response) => {
  try {
    if (request.signedCookies.rkey) {
      const result = await getRole(request.signedCookies.rkey);
      if (result === 'vastila' || result === 'jatkala') response.send({ role: result });
      response.send({ role: 'none' });
    } else {
      response.send({ role: 'none' });
    }
  } catch (e) {
    response.status(500);
  }
});

app.get('/api/timestamps', async (request, response) => {
  try {
    if (request.signedCookies.rkey) {
      const role = await getRole(request.signedCookies.rkey);
      if (role === 'vastila' || role === 'jatkala') {
        const data = await getTimestamps(role);
        response.send({ timestamps: data });
      }
      response.sendStatus(401);
    } else {
      response.sendStatus(401);
    }
  } catch (e) {
    response.status(500);
  }
});

app.get('/api/clear-role', async (request, response) => {
  response.clearCookie('rkey').sendStatus(200);
});

app.get('/api/delete-image', async (request, response) => {
  try {
    if (request.signedCookies.rkey) {
      const role = await getRole(request.signedCookies.rkey);
      if (role === 'vastila' && request.query.img_url && request.query.img_url.length > 0) {
        const result = await deleteImage(request.query.img_url);
        if (result) {
          response.sendStatus(204);
        } else {
          response.sendStatus(200);
        }
      } else {
        response.sendStatus(403);
      }
    } else {
      response.sendStatus(401);
    }
  } catch (e) {
    response.status(500);
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (_request, response) => {
  response.sendStatus(404);
});

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`listening on ${port}`);
