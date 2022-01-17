import { CookieOptions, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
if (process.env.NODE_ENV != 'production') {
  dotenv.config();
}
import express from 'express';
import { getImages, deleteImage, getTimestamps } from './services/aws-photos';
import { getAuthentication, getRole } from './services/auth-handler';
import { jatkalaRoutes } from './constants/constants';
import { vastilaRoutes } from './constants/constants';

const app = express();
app.use(cookieParser(process.env.signedKey));
app.disable('x-powered-by');

app.get('/api/images/:imagesId', async (request: Request, response: Response) => {
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

app.get('/api/authenticate', async (request: Request, response: Response) => {
  try {
    const result = await getAuthentication(request);
    let inProd = process.env.NODE_ENV === 'production';
    const options: CookieOptions = {
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

app.get('/api/get-role', async (request: Request, response: Response) => {
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

app.get('/api/timestamps', async (request: Request, response: Response) => {
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

app.get('/api/clear-role', async (_request: Request, response: Response) => {
  response.clearCookie('rkey').sendStatus(200);
});

app.get('/api/delete-image', async (request: Request, response: Response) => {
  try {
    if (request.signedCookies.rkey) {
      const role = await getRole(request.signedCookies.rkey);
      if (role === 'vastila' && request.query.img_url) {
        const result = await deleteImage(request.query.img_url.toString());
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

app.get('*', (_request: Request, response: Response) => {
  response.sendStatus(404);
});

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`listening on ${port}`);
