import { motion, useReducedMotion } from 'framer-motion';

const toneClasses = {
  emerald: 'border-[color:var(--sage-border)] bg-[color:var(--sage-bg)]',
  amber: 'border-[color:var(--gold-border)] bg-[color:var(--gold-bg)]',
  violet: 'border-[color:var(--plum-border)] bg-[color:var(--plum-bg)]',
  sky: 'border-[color:var(--accent-border)] bg-[color:var(--accent-bg)]',
  rose: 'border-[color:var(--accent-border)] bg-[color:var(--accent-bg)]',
};

const DashboardInsightsPanel = ({ insights, emptyAction }) => {
  const prefersReducedMotion = useReducedMotion();

  if (!insights.length) {
    return (
      <div className="flex min-h-[20rem] flex-col items-start justify-center gap-4 rounded-[1.5rem] border border-dashed border-[color:var(--card-border)] bg-[color:var(--nav-hover-bg)] p-5 text-[color:var(--text-soft)]">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--text-subtle)]">
            Insights
          </p>
          <h4 className="text-xl font-semibold text-[color:var(--text-strong)]">
            No fresh signals yet
          </h4>
          <p className="max-w-md text-sm leading-6 text-[color:var(--text-soft)]">
            Save more wine analyses and this panel will start surfacing trend
            shifts, category patterns, and standout performance.
          </p>
        </div>
        {emptyAction}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {insights.map((insight, index) => (
        <motion.article
          key={insight.id}
          className={`rounded-[1.35rem] border p-4 text-[color:var(--text-strong)] shadow-[var(--shadow-soft)] backdrop-blur-xl ${toneClasses[insight.tone] || toneClasses.rose}`}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            delay: index * 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={prefersReducedMotion ? {} : { y: -3 }}
        >
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--text-subtle)]">
            {insight.eyebrow}
          </p>
          <h4 className="mt-2 text-base font-semibold tracking-tight text-[color:var(--text-strong)]">
            {insight.title}
          </h4>
          <p className="mt-2 text-sm leading-6 text-[color:var(--text-soft)]">
            {insight.description}
          </p>
        </motion.article>
      ))}
    </div>
  );
};

export default DashboardInsightsPanel;
