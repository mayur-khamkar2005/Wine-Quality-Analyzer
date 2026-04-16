const LoadingSpinner = ({ fullScreen = false, label = 'Loading...' }) => (
  <div
    className={fullScreen ? 'loading-screen' : 'loading-inline'}
    role="status"
    aria-live="polite"
  >
    <div className="spinner" aria-hidden="true" />
    <p>{label}</p>
  </div>
);

export default LoadingSpinner;
