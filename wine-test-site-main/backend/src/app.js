import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';

import { env } from './config/env.js';
import {
  errorHandler,
  notFoundHandler,
} from './middlewares/error.middleware.js';
import { apiLimiter } from './middlewares/rate-limit.middleware.js';
import { apiRouter } from './routes/index.js';
import { ApiError } from './utils/ApiError.js';

export const app = express();
app.disable('x-powered-by');

app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = origin?.replace(/\/+$/, '');

      if (!normalizedOrigin || env.clientUrls.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new ApiError(403, 'CORS origin denied'));
    },
    credentials: true,
  }),
);

app.use(helmet());
app.use(compression());
app.use(apiLimiter);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Wine Quality Analyzer API is healthy',
    data: {
      environment: env.nodeEnv,
      uptimeSeconds: Number(process.uptime().toFixed(1)),
      database:
        mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    },
  });
});

app.use('/api/v1', apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
