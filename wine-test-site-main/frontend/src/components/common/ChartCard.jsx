const ChartCard = ({ title, subtitle, children }) => (
  <section className="surface-card ui-card chart-card">
    <div className="section-heading">
      <div>
        <h3>{title}</h3>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </div>
    <div className="chart-scroll-area">{children}</div>
  </section>
);

export default ChartCard;
