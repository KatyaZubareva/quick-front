import express from 'express';
import cors from 'cors';
import aiRouter from './controllers/ai.controller';
import config from './config';
import { debugRoutes } from './utils/debugRoutes';

const app = express();

const allowedOrigins = config.ALLOWED_ORIGINS.filter(origin => {
  try {
    new URL(origin);
    return true;
  } catch {
    return false;
  }
});

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '100kb' }));

app.get('/status', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/ai', aiRouter);

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    allowedMethods: ['GET', 'POST'] 
  });
});

app.on('after:init', () => {
  debugRoutes(app);
});

export default app;