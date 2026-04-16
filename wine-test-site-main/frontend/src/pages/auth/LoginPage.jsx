import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import FormField from '../../components/forms/FormField.jsx';
import StatusMessage from '../../components/common/StatusMessage.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import {
  getApiErrorMessage,
  validateLoginForm,
} from '../../utils/validation.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    isSubmitting: false,
    error: '',
  });

  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateLoginForm(formState);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setStatus({
        isSubmitting: true,
        error: '',
      });

      await login({
        email: formState.email.trim(),
        password: formState.password,
      });

      navigate(redirectTo, { replace: true });
    } catch (error) {
      setStatus({
        isSubmitting: false,
        error: getApiErrorMessage(error, 'Unable to log in right now'),
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
        <span className="page-header__eyebrow">Welcome Back</span>
        <h2>Login to your analyzer workspace.</h2>
        <p>
          Use your account to run predictions, review history, and open the
          analytics dashboard.
        </p>
      </div>

      <form className="page-stack" onSubmit={handleSubmit} noValidate>
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
          autoComplete="current-password"
          enterKeyHint="go"
          value={formState.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter your password"
        />

        {status.error ? (
          <StatusMessage title="Unable to sign in" message={status.error} />
        ) : null}

        <button
          type="submit"
          className="button"
          disabled={status.isSubmitting}
          aria-busy={status.isSubmitting}
        >
          {status.isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <p className="auth-card__footer">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
};

export default LoginPage;
