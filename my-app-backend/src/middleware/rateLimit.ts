import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Fallback IP-based limiter (no Redis needed for this layer)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                   // 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});