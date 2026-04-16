const DashboardTooltip = ({ active, label, payload }) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="w-max max-w-[calc(100vw-2rem)] rounded-2xl border border-[color:var(--card-border)] bg-[color:var(--tooltip-bg)] px-3 py-2 text-xs text-[color:var(--text-soft)] shadow-[var(--shadow)] backdrop-blur-xl">
      <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">
        {label}
      </p>
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div
            key={entry.dataKey}
            className="flex items-center justify-between gap-3"
          >
            <span className="text-[color:var(--text-soft)]">
              {entry.name || entry.dataKey}
            </span>
            <span className="font-semibold text-[color:var(--text-strong)]">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardTooltip;
