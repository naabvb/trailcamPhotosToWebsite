import express, { CookieOptions, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
if (process.env.NODE_ENV != 'production') {
  dotenv.config();
}
import { getImages, deleteImage, getTimestamps } from './services/aws-photos';
import { getAuthentication, getRole, isAuthenticated } from './services/auth-handler';
import { jatkalaRoutes, vastilaRoutes, Role } from './constants/constants';

const app = express();
app.use(cookieParser(process.env.signedKey));
app.disable('x-powered-by');

app.get('/api/images/:imagesId', async (request: Request, response: Response) => {
  try {
    if (request.signedCookies.rkey) {
      const role = await getRole(request.signedCookies.rkey);
      const parameter = request.params.imagesId;
      if (isAuthenticated(role) && jatkalaRoutes.includes(parameter)) {
        const images = await getImages(parameter);
        response.json(images);
      }
      if (role === Role.Vastila && vastilaRoutes.includes(parameter)) {
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
    if (result.role === Role.Vastila) {
      response.cookie('rkey', result.key, options).send({ role: result.role });
    }
    if (result.role === Role.Jatkala) {
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
      const role = await getRole(request.signedCookies.rkey);
      if (isAuthenticated(role)) response.send({ role: role });
      response.send({ role: Role.None });
    } else {
      response.send({ role: Role.None });
    }
  } catch (e) {
    response.status(500);
  }
});

app.get('/api/timestamps', async (request: Request, response: Response) => {
  try {
    if (request.signedCookies.rkey) {
      const role = await getRole(request.signedCookies.rkey);
      if (isAuthenticated(role)) {
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
      if (role === Role.Vastila && request.query.img_url) {
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
