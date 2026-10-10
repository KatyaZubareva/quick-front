// src/services/redis.service.ts
import { createClient } from 'redis';
import config from '../config';

class RedisService {
    private client = createClient({
      url: config.REDIS_URL,
      socket: { reconnectStrategy: (retries) => (retries > 5 ? false : 1000) }
    });
    private isConnected = false;
  
    constructor() {
      this.connect().catch(err => console.error('Redis initial connection failed:', err));
      this.client.on('error', err => console.error('Redis error:', err));
    }
  
    async connect() {
      if (!this.isConnected) {
        await this.client.connect();
        this.isConnected = true;
      }
    }
  
    async disconnect() {
      if (this.isConnected) {
        await this.client.quit();
        this.isConnected = false;
      }
    }

    async cacheResponse(key: string, value: any, ttl: number = config.REDIS_TTL): Promise<void> {
      if (!this.isConnected) return;
      await this.client.setEx(key, ttl, JSON.stringify(value));
    }

    async getCached(key: string): Promise<any | null> {
      if (!this.isConnected) return null;
      const cached = await this.client.get(key);
      return cached ? JSON.parse(cached) : null;
    }
}

export const redis = new RedisService();