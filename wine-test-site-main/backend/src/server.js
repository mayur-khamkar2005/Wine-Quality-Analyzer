import mongoose from 'mongoose';
import { app } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { ensureAdminUser } from './services/bootstrap.service.js';

const startServer = async () => {
  try {
    await connectDatabase();
    await ensureAdminUser();

    const server = app.listen(env.port, () => {
      console.info(`API server running on port ${env.port}`);
    });

    const shutdown = async (signal) => {
      console.info(`Received ${signal}. Starting graceful shutdown.`);

      server.close(async () => {
        await mongoose.connection.close();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
