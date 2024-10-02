import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../DB/user';

dotenv.config();
const SECRET = process.env.SECRET;
if (!SECRET) {
  throw new Error('Secret not found');
}
const signUp = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'field missing' });
    }

    const checkExistingUser = await User.findOne({ email });
    if (checkExistingUser) {
      return res
        .status(400)
        .json({ error: `user with the ${email} already exists` });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashPassword, role });
    await newUser.save();

    return res.status(200).json({ message: "You've successfully signed up" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'One of the fields is missing' });
    }

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(400).json({ error: 'Email or password not correct' });
    }

    const verifyPassword = await bcrypt.compare(password, foundUser.password);
    if (!verifyPassword) {
      return res.status(400).json({ error: 'Email or password not correct' });
    }

    const { _id, role } = foundUser;
    const payload = { id: _id.toString(), role };
    const token = await jwt.sign(payload, SECRET, { expiresIn: '1hr' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    });

    return res
      .status(200)
      .json({ login: true, role: role, id: _id.toString() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const logOut = (req: express.Request, res: express.Response) => {
  const token = req.cookies.token
  try {
    if (!token)
      return res
        .status(401)
        .json({ message: 'Token not found. Please log in' });
    jwt.verify(String(token), SECRET, (err, decodedUser) => {
      if (err) {
        return res.status(400).json({ message: 'Authentication failed' });
      }
      res.clearCookie('token');
      req.cookies['token'] = '';
      return res.status(200).json({ message: 'Succesffuly Logged out' });
    });
  } catch (err) {
    console.log(err);
  }
};

export { signUp, login, logOut };
