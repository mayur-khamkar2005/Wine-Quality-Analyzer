import { motion, useReducedMotion } from 'framer-motion';

import {
  formatDateTime,
  formatNumericValue,
  formatScaleValue,
} from '../../utils/formatters.js';

const categoryClasses = {
  Excellent:
    'border-[color:var(--accent-border)] bg-[color:var(--accent-bg)] text-[color:var(--accent-text)]',
  Good: 'border-[color:var(--sage-border)] bg-[color:var(--sage-bg)] text-[color:var(--sage-text)]',
  Average:
    'border-[color:var(--gold-border)] bg-[color:var(--gold-bg)] text-[color:var(--gold-text)]',
  Poor: 'border-[color:var(--plum-border)] bg-[color:var(--plum-bg)] text-[color:var(--plum-text)]',
  Unknown:
    'border-[color:var(--card-border)] bg-[color:var(--surface)] text-[color:var(--text-strong)]',
};

const RecentActivityPanel = ({ records }) => {
  const prefersReducedMotion = useReducedMotion();

  if (!records.length) {
    return (
      <div className="flex min-h-[15rem] flex-col items-start justify-center rounded-[1.5rem] border border-dashed border-[color:var(--card-border)] bg-[color:var(--nav-hover-bg)] p-5 text-[color:var(--text-soft)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--text-subtle)]">
          Recent activity
        </p>
        <h4 className="mt-2 text-xl font-semibold text-[color:var(--text-strong)]">
          No predictions in this range
        </h4>
        <p className="mt-2 max-w-md text-sm leading-6 text-[color:var(--text-soft)]">
          Switch to a wider time window or generate a few new analyses to
          populate this activity feed.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((record, index) => (
        <motion.article
          key={record.id}
          className="surface-card group min-w-0 rounded-[1.45rem] p-4 text-[color:var(--text-strong)]"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            delay: index * 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={prefersReducedMotion ? {} : { y: -5 }}
        >
          <div className="flex min-w-0 flex-col gap-3 min-[480px]:flex-row min-[480px]:items-start min-[480px]:justify-between">
            <span
              className={`inline-flex w-fit max-w-full rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.14em] ${categoryClasses[record.prediction.category] || categoryClasses.Unknown}`}
            >
              {record.prediction.category}
            </span>
            <span className="break-words text-xs leading-5 text-[color:var(--text-subtle)]">
              {formatDateTime(record.createdAt)}
            </span>
          </div>

          <div className="mt-4 space-y-2">
            <h4 className="break-words text-xl font-semibold tracking-tight text-[color:var(--text-strong)] sm:text-2xl">
              {formatScaleValue(record.prediction.score, 100)}
            </h4>
            <p className="text-sm text-[color:var(--text-soft)]">
              Rating {formatScaleValue(record.prediction.rating, 10)}
            </p>
          </div>

          <dl className="mt-5 grid grid-cols-1 gap-3 text-sm min-[480px]:grid-cols-2">
            <div className="rounded-2xl border border-[color:var(--card-border)] bg-[color:var(--surface)] p-3">
              <dt className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">
                Alcohol
              </dt>
              <dd className="mt-1 font-semibold text-[color:var(--text-strong)]">
                {formatNumericValue(record.inputs.alcohol, {
                  maximumFractionDigits: 1,
                  suffix: '%',
                })}
              </dd>
            </div>
            <div className="rounded-2xl border border-[color:var(--card-border)] bg-[color:var(--surface)] p-3">
              <dt className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">
                pH
              </dt>
              <dd className="mt-1 font-semibold text-[color:var(--text-strong)]">
                {formatNumericValue(record.inputs.pH, {
                  maximumFractionDigits: 2,
                })}
              </dd>
            </div>
          </dl>
        </motion.article>
      ))}
    </div>
  );
};

export default RecentActivityPanel;
