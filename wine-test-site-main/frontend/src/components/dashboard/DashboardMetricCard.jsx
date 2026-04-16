import { useEffect } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';

const AnimatedMetricValue = ({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const motionValue = useMotionValue(prefersReducedMotion ? value : 0);
  const formattedValue = useTransform(
    motionValue,
    (latestValue) =>
      `${prefix}${Number(latestValue).toFixed(decimals)}${suffix}`,
  );

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: prefersReducedMotion ? 0 : 1,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => controls.stop();
  }, [motionValue, prefersReducedMotion, value]);

  return <motion.span>{formattedValue}</motion.span>;
};

const DashboardMetricCard = ({
  label,
  value,
  helper,
  badge,
  accentClassName = 'bg-[color:var(--accent-bg)]',
  prefix = '',
  suffix = '',
  decimals = 0,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const isNumeric = typeof value === 'number' && Number.isFinite(value);

  return (
    <motion.article
      className="surface-card group relative min-w-0 overflow-hidden rounded-[1.5rem] p-4 text-[color:var(--text-strong)] sm:p-5"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={prefersReducedMotion ? {} : { y: -6, scale: 1.01 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.995 }}
    >
      <div
        className={`absolute -right-10 -top-10 h-24 w-24 rounded-full blur-3xl ${accentClassName}`}
        aria-hidden="true"
      />
      <div className="relative flex h-full min-w-0 flex-col gap-4">
        <div className="flex min-w-0 flex-col gap-3 min-[480px]:flex-row min-[480px]:items-start min-[480px]:justify-between">
          <div className="min-w-0 space-y-2">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--text-subtle)]">
              {label}
            </span>
            <div className="break-words text-2xl font-semibold leading-none tracking-tight text-[color:var(--text-strong)] sm:text-3xl lg:text-4xl">
              {isNumeric ? (
                <AnimatedMetricValue
                  value={value}
                  decimals={decimals}
                  prefix={prefix}
                  suffix={suffix}
                />
              ) : (
                value
              )}
            </div>
          </div>
          {badge ? (
            <span className="inline-flex w-fit max-w-full rounded-full border border-[color:var(--accent-border)] bg-[color:var(--accent-bg)] px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[color:var(--accent-text)] break-words">
              {badge}
            </span>
          ) : null}
        </div>

        <p className="max-w-full break-words text-sm leading-6 text-[color:var(--text-soft)]">
          {helper}
        </p>
      </div>
    </motion.article>
  );
};

export default DashboardMetricCard;
