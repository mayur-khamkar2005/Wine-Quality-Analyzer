import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import FormField from '../../components/forms/FormField.jsx';
import StatusMessage from '../../components/common/StatusMessage.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import {
  getApiErrorMessage,
  validateRegisterForm,
} from '../../utils/validation.js';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    isSubmitting: false,
    error: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateRegisterForm(formState);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setStatus({
        isSubmitting: true,
        error: '',
      });

      await register({
        name: formState.name.trim(),
        email: formState.email.trim(),
        password: formState.password,
      });

      navigate('/dashboard', { replace: true });
    } catch (error) {
      setStatus({
        isSubmitting: false,
        error: getApiErrorMessage(
          error,
          'Unable to create the account right now',
        ),
      });
      return;
    }

    setStatus({
      isSubmitting: false,
      error: '',
    });
  };

  return (
    <div className="auth-card ui-card">
      <div className="auth-card__header">
        <span className="page-header__eyebrow">Create Account</span>
        <h2>Start analyzing wine quality with a secure account.</h2>
        <p>
          Registration gives you prediction history, personal dashboards, and
          role-based access.
        </p>
      </div>

      <form className="page-stack" onSubmit={handleSubmit} noValidate>
        <FormField
          label="Full Name"
          name="name"
          autoComplete="name"
          enterKeyHint="next"
          value={formState.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Mayur Sharma"
        />

        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          enterKeyHint="next"
          value={formState.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@example.com"
        />

        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          enterKeyHint="next"
          value={formState.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Minimum 8 characters"
        />

        <FormField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          enterKeyHint="go"
          value={formState.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Re-enter password"
        />

        {status.error ? (
          <StatusMessage
            title="Unable to create account"
            message={status.error}
          />
        ) : null}

        <button
          type="submit"
          className="button"
          disabled={status.isSubmitting}
          aria-busy={status.isSubmitting}
        >
          {status.isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className="auth-card__footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
