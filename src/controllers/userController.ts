import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../DB/user";
import data from "../DB/data";

dotenv.config();
const SECRET = process.env.SECRET;
if (!SECRET) {
  throw new Error("Secret not found");
}
const signUp = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "field missing" });
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
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "One of the fields is missing" });
    }

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(400).json({ error: "Inavlid email or password" });
    }

    const verifyPassword = await bcrypt.compare(password, foundUser.password);
    if (!verifyPassword) {
      return res.status(400).json({ error: "Email or password not correct" });
    }

    const { _id, role, name } = foundUser;
    const payload = { id: _id.toString(), role };
    const token = jwt.sign(payload, SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, SECRET, { expiresIn: "7d" });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/refreshToken",
    });

    return res.status(200).json({
      login: true,
      role: role,
      id: _id.toString(),
      accessToken: token,
      username: name,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const logOut = (req: express.Request, res: express.Response) => {
  const token = req.cookies.token;
  token
    ? console.log("Here's Token :", token)
    : console.log("I can't find Token");
  try {
    if (!token)
      return res
        .status(401)
        .json({ message: "Token not found. Please log in" });
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(204).end();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUser = (req: express.Request, res: express.Response) => {
  try {
    if (data) {
      return res.status(200).json({ users: data });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export { signUp, login, logOut, getUser };
