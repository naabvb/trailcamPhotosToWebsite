import crypto from 'crypto';
import { Request } from 'express';

export async function getAuthentication(request: Request) {
  const authHeader = request.headers.authorization;
  if (!authHeader) return {};

  const encodedCreds = authHeader.split(' ')[1];
  const plainCreds = Buffer.from(encodedCreds, 'base64').toString().split(':');
  const username = plainCreds[0];
  const password = plainCreds[1];
  const hashable = username + ':' + password + process.env.salt;
  const hash = crypto.createHash('sha256').update(hashable).digest('hex');
  let role = 'none';
  if (hash === process.env.jatkala) role = 'jatkala';
  if (hash === process.env.vastila) role = 'vastila';
  return {
    role: role,
    key: crypto.createHash('sha256').update(hash).digest('hex'),
  };
}

export async function getRole(rkey: string): Promise<string> {
  if (rkey === crypto.createHash('sha256').update(process.env.jatkala!!).digest('hex')) {
    return 'jatkala';
  }
  if (rkey === crypto.createHash('sha256').update(process.env.vastila!!).digest('hex')) {
    return 'vastila';
  }
  return 'none';
}
