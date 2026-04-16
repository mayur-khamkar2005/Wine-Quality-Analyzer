import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';

import AnimatedBackdrop from '../components/common/AnimatedBackdrop.jsx';
import Navbar from '../components/common/Navbar.jsx';

const AppLayout = () => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="app-shell">
      <AnimatedBackdrop variant="app" />
      <Navbar />
      <main className="page-shell layout-container">
        <AnimatePresence mode="wait">
          <motion.div
            className="page-shell__content"
            key={location.pathname}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AppLayout;
