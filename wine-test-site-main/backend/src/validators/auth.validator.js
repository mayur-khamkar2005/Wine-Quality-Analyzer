import { z } from 'zod';

const emailSchema = z
  .string()
  .trim()
  .email('Enter a valid email address')
  .transform((value) => value.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(64, 'Password must be at most 64 characters long')
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d).+$/,
    'Password must contain at least one letter and one number',
  );

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(80, 'Name is too long'),
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

export const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
  })
  .strict();
