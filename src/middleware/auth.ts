import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedUserI } from '../services.ts/interface';

export interface AuthenticatedRequest extends Request {
  decodedUser?: DecodedUserI;
}

const SECRET = process.env.SECRET;
if (!SECRET) {
  throw new Error('Secret not found');
}

export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      return res.status(404).json({
        message: 'Authentication failed. Please log in',
      });
    }
    jwt.verify(String(token), SECRET, (err, decodedUser) => {
      if (err) {
        return res.status(400).json({ message: 'Token expired or invalid. Please log in' });
      }
      req.decodedUser = decodedUser as DecodedUserI;
      next(); 
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

