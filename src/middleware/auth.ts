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

export const middleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  
  try {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Access token required. Please log in',
      });
    }
    
    const accessToken = authHeader.split(' ')[1];
    
    jwt.verify(accessToken, SECRET, (err, decodedUser) => {
      if (err) {
        return res.status(401).json({ 
          message: 'Access token expired or invalid. Please refresh token' 
        });
      }
      req.decodedUser = decodedUser as DecodedUserI;
      next(); 
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

