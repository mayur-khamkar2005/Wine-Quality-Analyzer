import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const buildLoopTransition = (duration, delay = 0) => ({
  duration,
  delay,
  repeat: Infinity,
  repeatType: 'mirror',
  ease: 'easeInOut',
});

const AnimatedBackdrop = ({ variant = 'app' }) => {
  const prefersReducedMotion = useReducedMotion();

  const glowOneMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.95 },
        animate: {
          opacity: [0.24, 0.34, 0.28],
          x: [0, 18, -10],
          y: [0, 20, -8],
          scale: [0.96, 1.04, 0.98],
        },
        transition: buildLoopTransition(15),
      };

  const glowTwoMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.92 },
        animate: {
          opacity: [0.18, 0.28, 0.22],
          x: [0, -20, 10],
          y: [0, -16, 8],
          scale: [0.98, 1.08, 1],
        },
        transition: buildLoopTransition(18, 0.6),
      };

  const haloOneMotion = prefersReducedMotion
    ? {}
    : {
        animate: {
          rotate: [0, 6, -4],
          scale: [1, 1.04, 0.98],
          opacity: [0.2, 0.32, 0.24],
        },
        transition: buildLoopTransition(14, 0.3),
      };

  const haloTwoMotion = prefersReducedMotion
    ? {}
    : {
        animate: {
          rotate: [0, -5, 3],
          scale: [1, 1.06, 0.99],
          opacity: [0.18, 0.28, 0.22],
        },
        transition: buildLoopTransition(16, 0.8),
      };

  const beamOneMotion = prefersReducedMotion
    ? {}
    : {
        animate: {
          x: [0, 30, -12],
          y: [0, -10, 6],
          rotate: [-10, -5, -8],
        },
        transition: buildLoopTransition(17, 0.2),
      };

  const beamTwoMotion = prefersReducedMotion
    ? {}
    : {
        animate: {
          x: [0, -24, 14],
          y: [0, 12, -6],
          rotate: [9, 4, 7],
        },
        transition: buildLoopTransition(19, 0.7),
      };

  return (
    <motion.div
      className={`animated-backdrop animated-backdrop--${variant}`}
      aria-hidden="true"
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={prefersReducedMotion ? {} : { opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <motion.span
        className="animated-backdrop__glow animated-backdrop__glow--one"
        {...glowOneMotion}
      />
      <motion.span
        className="animated-backdrop__glow animated-backdrop__glow--two"
        {...glowTwoMotion}
      />
      <motion.span
        className="animated-backdrop__halo animated-backdrop__halo--one"
        {...haloOneMotion}
      />
      <motion.span
        className="animated-backdrop__halo animated-backdrop__halo--two"
        {...haloTwoMotion}
      />
      <motion.span
        className="animated-backdrop__beam animated-backdrop__beam--one"
        {...beamOneMotion}
      />
      <motion.span
        className="animated-backdrop__beam animated-backdrop__beam--two"
        {...beamTwoMotion}
      />
    </motion.div>
  );
};

export default memo(AnimatedBackdrop);
