const StatCard = ({ label, value, helper, tone = 'rose' }) => (
  <article className={`stat-card ui-card stat-card--${tone}`}>
    <span className="stat-card__label">{label}</span>
    <strong className="stat-card__value">{value}</strong>
    {helper ? <span className="stat-card__helper">{helper}</span> : null}
  </article>
);

export default StatCard;
