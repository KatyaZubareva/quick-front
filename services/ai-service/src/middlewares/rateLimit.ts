import { Request, Response, NextFunction } from 'express';
import { redis } from '../services/redis.service';
import config from '../config';

export const rateLimit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const ip = req.ip || 'unknown';
  const key = `rate_limit:${ip}`;
  const limit = 10;
  const windowSec = 60;
  
  try {
    const current = Number(await redis.getCached(key)) || 0;
    
    if (current >= limit) {
      res.status(429).json({ 
        error: 'Too many requests',
        limit,
        remaining: 0,
        window: `${windowSec} seconds`
      });
      return;
    }

    await redis.cacheResponse(key, current + 1, windowSec);
    next();
  } catch (error) {
    console.error('Rate limit error:', error);
    next();
  }
};