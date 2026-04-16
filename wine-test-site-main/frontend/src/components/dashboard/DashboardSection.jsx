import { motion, useReducedMotion } from 'framer-motion';

const DashboardSection = ({
  title,
  description,
  action,
  children,
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      className={`surface-card relative min-w-0 overflow-hidden p-4 text-[color:var(--text-strong)] sm:p-6 lg:p-7 ${className}`}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={prefersReducedMotion ? {} : { y: -4 }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--card-border-strong)] to-transparent" />

      {title || description || action ? (
        <div className="mb-5 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            {title ? (
              <h3 className="break-words text-lg font-semibold tracking-tight text-[color:var(--text-strong)] sm:text-xl">
                {title}
              </h3>
            ) : null}
            {description ? (
              <p className="max-w-2xl text-sm leading-6 text-[color:var(--text-soft)]">
                {description}
              </p>
            ) : null}
          </div>
          {action ? (
            <div className="w-full shrink-0 sm:w-auto">{action}</div>
          ) : null}
        </div>
      ) : null}

      <div className="min-w-0">{children}</div>
    </motion.section>
  );
};

export default DashboardSection;
