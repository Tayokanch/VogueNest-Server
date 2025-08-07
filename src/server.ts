import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import userRouter from './routers/userRouter';
import refreshTokenRouter from './routers/refreshTokenRouter';
import orderRouter from './routers/orderRouter';
import stripeRouter from './routers/stripe';

dotenv.config();

const app = express();

// Rate limiter for refresh token endpoint 
const refreshTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  handler: (req, res) => {
    res.status(429).json({
      error: 'Refresh token limit exceeded. Please login again.',
      code: 'RATE_LIMIT_EXCEEDED'
    });
  },
  standardHeaders: false, // Don't show retry headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(cors({
  origin: ['https://voguenestt.netlify.app', 'http://localhost:5173'],
  credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/voguenest', userRouter);
app.use('/api/voguenest', orderRouter);
app.use('/api/payment', stripeRouter);
app.use('/api/voguenest', refreshTokenLimiter, refreshTokenRouter);

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
