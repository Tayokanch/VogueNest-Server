import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
export const refreshTokenLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    handler: (req : Request, res : Response) => {
      res.status(429).json({
        error: 'Refresh token limit exceeded. Please login again.',
        code: 'RATE_LIMIT_EXCEEDED'
      });
    },
    standardHeaders: false, // Don't show retry headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });