import { useId } from 'react';

const FormField = ({
  label,
  helper,
  error,
  as = 'input',
  children,
  className = '',
  id,
  ...props
}) => {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const helperId = `${fieldId}-helper`;
  const helperText = error || helper;
  const controlClassName = `form-field__control${as === 'select' ? ' form-field__control--select' : ''}${error ? ' form-field__control--error' : ''}`;

  return (
    <label className={`form-field ${className}`.trim()}>
      <span className="form-field__label">{label}</span>

      {as === 'select' ? (
        <select
          id={fieldId}
          className={controlClassName}
          aria-invalid={Boolean(error)}
          aria-describedby={helperText ? helperId : undefined}
          {...props}
        >
          {children}
        </select>
      ) : (
        <input
          id={fieldId}
          className={controlClassName}
          aria-invalid={Boolean(error)}
          aria-describedby={helperText ? helperId : undefined}
          {...props}
        />
      )}

      {helperText ? (
        <span
          id={helperId}
          className={`form-field__helper${error ? ' form-field__helper--error' : ''}`}
        >
          {helperText}
        </span>
      ) : null}
    </label>
  );
};

export default FormField;
