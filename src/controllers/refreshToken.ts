import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../DB/user';

const SECRET = process.env.SECRET;
if (!SECRET) {
  throw new Error('Secret not found');
}

const refreshToken = async (req: express.Request, res: express.Response) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json({error: 'No refresh token found'});
        }
        
        const decoded = jwt.verify(refreshToken, SECRET as jwt.Secret) as any;
        
        if(decoded.exp && decoded.exp < Date.now() / 1000){
            return res.status(401).json({error: 'Refresh token expired'});
        }
        
        const user = await User.findOne({_id: decoded.id});
        if(!user){
            return res.status(401).json({error: 'User not found'});
        }
        
        const {_id, role} = user;
        const payload = {id: _id.toString(), role};
        const accessToken = jwt.sign(payload, SECRET as jwt.Secret, {expiresIn: '15m'});
        const newRefreshToken = jwt.sign(payload, SECRET as jwt.Secret, {expiresIn: '7d'});

    res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
    });
        return res.status(200).json({accessToken});
    
    }catch(err){
        console.error(err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
}

export { refreshToken };