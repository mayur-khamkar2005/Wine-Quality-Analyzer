import { USER_ROLES } from '../constants/roles.js';
import { env } from '../config/env.js';
import { User } from '../models/user.model.js';

export const ensureAdminUser = async () => {
  if (!env.adminEmail || !env.adminPassword) {
    console.info('Admin credentials not configured, skipping admin setup');
    return;
  }

  try {
    const existingAdmin = await User.findOne({ email: env.adminEmail });

    if (existingAdmin) {
      if (existingAdmin.role !== USER_ROLES.ADMIN) {
        existingAdmin.role = USER_ROLES.ADMIN;
        await existingAdmin.save();
        console.info('Existing user promoted to admin');
      }
      return;
    }

    await User.create({
      name: env.adminName,
      email: env.adminEmail,
      password: env.adminPassword,
      role: USER_ROLES.ADMIN,
      lastLoginAt: null,
    });
    console.info('Admin user created successfully');
  } catch (error) {
    console.error('Failed to ensure admin user:', error.message);
  }
};
