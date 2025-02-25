import express from 'express';
import http from 'http';
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
    //origin: 'https://voguenestt.netlify.app',
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/voguenest', userRouter);
app.use('/api/voguenest', orderRouter);
app.use('/api/voguenest', cookieValidatorRouter);
app.use('/api/payment', stripeRouter);

const PORT = process.env.PORT || 8050;  
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});

const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
  throw new Error('MONGODB_URL is not defined');
}


mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((error: Error) => {
    console.error('Error connecting to MongoDB:', error.message);
    console.error(error.stack);
    process.exit(1);  
  });
