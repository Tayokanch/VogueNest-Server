import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routers/userRouter';
import orderRouter from './routers/orderRouter';
import cookieValidatorRouter from './routers/cookieValidator';
import stripeRouter from './routers/stripe';
dotenv.config();

const app = express();

app.use(
  cors({
    origin: 'https://voguenestt.netlify.app',
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/voguenest', userRouter);
app.use('/api/voguenest', orderRouter);
app.use('/api/voguenest', cookieValidatorRouter);
app.use('/api/payment', stripeRouter);

const server = http.createServer(app);
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server runing on http://localhost:${PORT}/`);
});

if (!process.env.MONGODB_URL) {
  throw new Error('MONGODB_URL is not defined');
}
const MONGODB_URL: string = process.env.MONGODB_URL;

if (!process.env.MONGODB_URL) {
  throw new Error('MONGODB_URL is not defined');
}

///DATABASE CONNECTION
mongoose.Promise;
mongoose.connect(MONGODB_URL);
mongoose.connection.on('error', (error: Error) =>
  console.log('This is the error', error)
);
