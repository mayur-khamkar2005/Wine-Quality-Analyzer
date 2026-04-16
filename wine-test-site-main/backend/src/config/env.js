import dotenv from 'dotenv';

dotenv.config();

const normalizeOrigin = (value) => value.trim().replace(/\/+$/, '');

const validateJwtExpiresIn = (value) => {
  if (!value || typeof value !== 'string') {
    return null;
  }
  const pattern = /^\d+[smhd]$/;
  return pattern.test(value) ? value : null;
};

const buildEnv = () => {
  const requiredVariables = ['MONGODB_URI', 'JWT_SECRET'];
  const missingVariables = requiredVariables.filter((key) => !process.env[key]);

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(', ')}`,
    );
  }

  return {
    port: Number(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: validateJwtExpiresIn(process.env.JWT_EXPIRES_IN) || '7d',
    clientUrls: (process.env.CLIENT_URL || 'http://localhost:5173')
      .split(',')
      .map(normalizeOrigin)
      .filter(Boolean),
    adminEmail: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
    adminPassword: process.env.ADMIN_PASSWORD || '',
    adminName: process.env.ADMIN_NAME || 'Platform Admin',
  };
};

export const env = buildEnv();
