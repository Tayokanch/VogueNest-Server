import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedUserI } from '../services.ts/interface';

const SECRET = process.env.SECRET;
if (!SECRET) {
  throw new Error('Secret not found');
}

export const validateCookie = (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({ message: 'Token expired, Please login' });
    }

    const decodedUser = jwt.verify(token, SECRET) as DecodedUserI;
    return res
      .status(200)
      .json({ login: true, role: decodedUser.role, id: decodedUser.id });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
