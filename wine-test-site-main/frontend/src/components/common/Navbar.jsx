import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth.js';
import ThemeToggleButton from './ThemeToggleButton.jsx';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/analyzer', label: 'Analyzer' },
    { to: '/history', label: 'History' },
  ];

  if (user?.role === 'admin') {
    links.push({ to: '/admin', label: 'Admin' });
  }

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 px-4 pt-3 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-[1.75rem] border border-[color:var(--card-border)] bg-[color:var(--card)] shadow-[var(--shadow)] backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:px-6">
          <div className="min-w-0">
            <h1 className="mt-1 truncate text-lg font-semibold tracking-tight text-[color:var(--text-strong)] sm:text-xl">
              Wine Quality Analyzer
            </h1>
          </div>

          <button
            type="button"
            className="inline-flex min-h-[3rem] min-w-[3rem] items-center justify-center rounded-2xl border border-[color:var(--card-border)] bg-[color:var(--surface)] p-3 text-[color:var(--text-strong)] transition hover:bg-[color:var(--nav-hover-bg)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] lg:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
            aria-label={
              isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span className="sr-only">
              {isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            </span>
            <div className="relative h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition ${isMenuOpen ? 'translate-y-[0.45rem] rotate-45' : ''}`}
              />
              <span
                className={`absolute left-0 top-[0.45rem] h-0.5 w-5 rounded-full bg-current transition ${isMenuOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`absolute left-0 top-[0.9rem] h-0.5 w-5 rounded-full bg-current transition ${isMenuOpen ? '-translate-y-[0.45rem] -rotate-45' : ''}`}
              />
            </div>
          </button>
        </div>

        <div
          className={`${isMenuOpen ? 'block' : 'hidden'} border-t border-[color:var(--card-border)] lg:block`}
        >
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-6 lg:py-4">
            <nav
              id="primary-navigation"
              className="grid gap-2 lg:flex lg:flex-wrap lg:items-center"
              aria-label="Primary navigation"
            >
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `inline-flex min-h-[3rem] w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] lg:w-auto ${
                      isActive
                        ? 'border border-[color:var(--accent-border)] bg-[color:var(--accent-bg)] text-[color:var(--rose)] shadow-[var(--shadow-soft)]'
                        : 'text-[color:var(--text-soft)] hover:bg-[color:var(--nav-hover-bg)] hover:text-[color:var(--text-strong)]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="grid gap-3 lg:flex lg:flex-wrap lg:items-center lg:justify-end">
              <div className="min-w-0 rounded-2xl border border-[color:var(--card-border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--text-strong)] shadow-[var(--shadow-soft)]">
                <strong className="block truncate text-sm font-semibold">
                  {user?.name || 'Workspace User'}
                </strong>
                <span className="mt-1 block truncate text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">
                  {user?.role || 'member'}
                </span>
              </div>
              <ThemeToggleButton compact />
              <button
                type="button"
                className="button button--secondary w-full lg:w-auto"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
