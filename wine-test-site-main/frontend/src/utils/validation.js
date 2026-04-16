import { wineFields } from './wineFields.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!email || typeof email !== 'string') {
    errors.email = 'Email is required';
  } else if (!emailPattern.test(email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!password || typeof password !== 'string') {
    errors.password = 'Password is required';
  } else if (password.trim().length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  }

  return errors;
};

export const validateRegisterForm = ({
  name,
  email,
  password,
  confirmPassword,
}) => {
  const errors = {};

  if (!name || typeof name !== 'string') {
    errors.name = 'Name is required';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }

  if (!email || typeof email !== 'string') {
    errors.email = 'Email is required';
  } else if (!emailPattern.test(email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!password || typeof password !== 'string') {
    errors.password = 'Password is required';
  } else if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
    errors.password =
      'Password must contain at least one letter, one number, and 8 characters';
  }

  if (!confirmPassword || typeof confirmPassword !== 'string') {
    errors.confirmPassword = 'Please confirm your password';
  } else if (confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export const validateWineForm = (formState) => {
  const errors = {};

  if (!formState || typeof formState !== 'object') {
    return { form: 'Invalid form data' };
  }

  wineFields.forEach((field) => {
    const rawValue = formState[field.name];

    if (rawValue === '' || rawValue === undefined || rawValue === null) {
      errors[field.name] = `${field.label} is required`;
      return;
    }

    const numericValue = Number(rawValue);

    if (Number.isNaN(numericValue)) {
      errors[field.name] = `${field.label} must be numeric`;
      return;
    }

    if (numericValue < field.min || numericValue > field.max) {
      errors[field.name] =
        `${field.label} must be between ${field.min} and ${field.max}`;
    }
  });

  return errors;
};

export const getApiErrorMessage = (error, fallbackMessage) => {
  if (!error) {
    return fallbackMessage;
  }

  if (typeof error === 'string' && error.trim()) {
    return error.trim();
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message.trim();
  }

  const firstErrorMessage = error?.errors?.find(
    (entry) => typeof entry?.message === 'string' && entry.message.trim(),
  )?.message;

  if (firstErrorMessage) {
    return firstErrorMessage.trim();
  }

  if (
    typeof error?.response?.data?.message === 'string' &&
    error.response.data.message.trim()
  ) {
    return error.response.data.message.trim();
  }

  return fallbackMessage;
};
