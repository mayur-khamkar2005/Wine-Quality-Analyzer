import { useTheme } from '../../hooks/useTheme.js';

const ThemeToggleButton = ({ compact = false }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={`theme-toggle${compact ? ' theme-toggle--compact' : ''}${isDark ? ' theme-toggle--dark' : ''}`}
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__thumb" />
      </span>
      <span className="theme-toggle__content">
        <strong>{isDark ? 'Dark Mode' : 'Light Mode'}</strong>
        {!compact ? (
          <small>
            {isDark
              ? 'Use the minimal black interface'
              : 'Use the minimal white interface'}
          </small>
        ) : null}
      </span>
    </button>
  );
};

export default ThemeToggleButton;
