import crypto from 'crypto';
import { Role } from '../constants/constants';
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
  let role = Role.None;
  if (hash === process.env.jatkala) role = Role.Jatkala;
  if (hash === process.env.vastila) role = Role.Vastila;
  return {
    role: role,
    key: crypto.createHash('sha256').update(hash).digest('hex'),
  };
}

export async function getRole(rkey: string): Promise<Role> {
  if (rkey === crypto.createHash('sha256').update(process.env.jatkala!!).digest('hex')) {
    return Role.Jatkala;
  }
  if (rkey === crypto.createHash('sha256').update(process.env.vastila!!).digest('hex')) {
    return Role.Vastila;
  }
  return Role.None;
}

export function isAuthenticated(role: Role) {
  return role === Role.Jatkala || role === Role.Vastila;
}
