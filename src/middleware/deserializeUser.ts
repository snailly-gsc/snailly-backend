import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../config';
import { JWTTokenPayload } from '../types';

export default async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // get token from authorization header
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (!accessToken) {
    return next();
  }

  // verify access token  
  const accessTokenPayload = verifyJWT(accessToken);

  // jika access token masih valid maka set user ke req.user
  if (accessTokenPayload.expired === false) {
    const { id, email, name } = accessTokenPayload.payload as JWTTokenPayload
    // Set user to req.user
    req.user = {
      id,
      email,
      name,
    }
    return next();
  }

  // jika access token sudah expired maka cek refresh token dan generate access token baru
  // if (accessTokenPayload.expired) {
  //   if (refreshTokenPayload.payload) {
  //     const { id, username, name, role } = refreshTokenPayload.payload as JWTTokenPayload
  //     const user = await prisma.users.findUnique({
  //       where: {
  //         id
  //       }
  //     })
  //     if (user) {
  //       const accessToken = signJWT({
  //         id: user.id,
  //         username: user.username,
  //         name: user.name,
  //         role: user.role
  //       }, '20s')
  //       res.cookie('SPAREPART_AT', accessToken, {
  //         httpOnly: true,
  //         maxAge: 24 * 60 * 60 * 1000, // 1 day ,
  //       })
  //       // Set user to req.user
  //       req.user = {
  //         id,
  //         username,
  //         name,
  //         role
  //       }
  //       return next();
  //     }
  //   }
  // }
  return next();
}