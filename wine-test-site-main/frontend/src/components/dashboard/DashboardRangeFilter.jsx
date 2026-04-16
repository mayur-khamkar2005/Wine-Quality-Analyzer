import { motion, useReducedMotion } from 'framer-motion';

const DashboardRangeFilter = ({ options, value, onChange }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-1 gap-2.5 min-[480px]:grid-cols-2 md:grid-cols-3">
      <div className="contents">
        {options.map((option) => {
          const isActive = option.key === value;

          return (
            <motion.button
              key={option.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(option.key)}
              className={`min-h-[3.5rem] w-full rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] ${
                isActive
                  ? 'border-[color:var(--accent-border)] bg-[color:var(--accent-bg)] text-[color:var(--accent-text)] shadow-[var(--shadow-soft)]'
                  : 'border-[color:var(--card-border)] bg-[color:var(--surface)] text-[color:var(--text-strong)] hover:border-[color:var(--card-border-strong)] hover:bg-[color:var(--nav-hover-bg)]'
              }`}
              whileHover={prefersReducedMotion ? {} : { y: -2 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            >
              <span className="block text-sm font-semibold tracking-tight">
                {option.label}
              </span>
              <span className="mt-1 block text-xs text-[color:var(--text-subtle)]">
                {option.caption}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardRangeFilter;
