const StatusMessage = ({
  title = 'Something went wrong',
  message,
  tone = 'error',
}) => (
  <div
    className={`status-card status-card--${tone}`}
    role={tone === 'error' ? 'alert' : 'status'}
    aria-live={tone === 'error' ? 'assertive' : 'polite'}
  >
    <strong className="status-card__title">{title}</strong>
    {message ? <p className="status-card__message">{message}</p> : null}
  </div>
);

export default StatusMessage;
