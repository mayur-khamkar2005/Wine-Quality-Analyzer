import { Suspense, lazy, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

import {
  getAllPredictionHistory,
  getDashboardSummary,
} from '../../api/wine.api.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StatusMessage from '../../components/common/StatusMessage.jsx';
import DashboardInsightsPanel from '../../components/dashboard/DashboardInsightsPanel.jsx';
import DashboardMetricCard from '../../components/dashboard/DashboardMetricCard.jsx';
import DashboardRangeFilter from '../../components/dashboard/DashboardRangeFilter.jsx';
import DashboardSection from '../../components/dashboard/DashboardSection.jsx';
import RecentActivityPanel from '../../components/dashboard/RecentActivityPanel.jsx';
import { useTheme } from '../../hooks/useTheme.js';
import {
  DASHBOARD_RANGE_OPTIONS,
  buildCategoryBreakdown,
  buildDashboardInsights,
  buildDashboardSnapshot,
  buildTrendSeries,
  filterRecordsByRange,
  formatRangeWindow,
  getRangeOption,
  normalizeHistoryRecords,
} from '../../utils/dashboard.js';
import { formatDateTime } from '../../utils/formatters.js';
import { getApiErrorMessage } from '../../utils/validation.js';

const TrendChart = lazy(
  () => import('../../components/dashboard/TrendChart.jsx'),
);
const CategoryChart = lazy(
  () => import('../../components/dashboard/CategoryChart.jsx'),
);

const defaultSummary = {
  stats: {
    totalPredictions: 0,
    averageScore: 0,
    bestScore: 0,
    mostCommonCategory: 'N/A',
    lastPredictionAt: null,
  },
};

const getAverageDeltaBadge = (windowAverage, baselineAverage) => {
  if (!windowAverage || !baselineAverage) {
    return 'Fresh window';
  }

  const delta = Number((windowAverage - baselineAverage).toFixed(1));

  if (delta === 0) {
    return 'In line with all-time';
  }

  return `${delta > 0 ? '+' : ''}${delta} vs all-time`;
};

const getChartPalette = (isDark) => ({
  primary: isDark ? '#f5f5f5' : '#111111',
  secondary: isDark ? '#a1a1aa' : '#52525b',
  grid: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(17, 17, 17, 0.1)',
  axis: isDark ? '#d4d4d8' : '#52525b',
  category: {
    Excellent: isDark ? '#ffffff' : '#000000',
    Good: isDark ? '#d4d4d8' : '#3f3f46',
    Average: isDark ? '#a1a1aa' : '#71717a',
    Poor: isDark ? '#71717a' : '#a1a1aa',
    default: isDark ? '#e4e4e7' : '#d4d4d8',
  },
});

const ChartFallback = ({ label }) => (
  <div className="flex min-h-[18rem] items-center justify-center rounded-[1.5rem] border border-[color:var(--card-border)] bg-[color:var(--surface)] shadow-[var(--shadow-soft)]">
    <LoadingSpinner label={label} />
  </div>
);

const DashboardPage = () => {
  const prefersReducedMotion = useReducedMotion();
  const { isDark } = useTheme();
  const [summary, setSummary] = useState(defaultSummary);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [range, setRange] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [summaryResponse, historyResponse] = await Promise.all([
          getDashboardSummary(),
          getAllPredictionHistory({ limit: 200 }),
        ]);

        if (isMounted) {
          setSummary(summaryResponse?.data?.summary || defaultSummary);
          setHistoryRecords(
            normalizeHistoryRecords(historyResponse?.data?.records),
          );
          setError('');
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            getApiErrorMessage(
              requestError,
              'Unable to load dashboard insights',
            ),
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading dashboard insights" />;
  }

  if (error) {
    return <StatusMessage title="Unable to load dashboard" message={error} />;
  }

  const palette = getChartPalette(isDark);
  const allTimeStats = summary?.stats || defaultSummary.stats;
  const selectedRange = getRangeOption(range);
  const filteredRecords = filterRecordsByRange(historyRecords, range);
  const filteredStats = buildDashboardSnapshot(filteredRecords);
  const trendData = buildTrendSeries(historyRecords, range);
  const categoryData = buildCategoryBreakdown(filteredRecords);
  const insights = buildDashboardInsights(filteredRecords, range);
  const recentRecords = filteredRecords.slice(0, 6);
  const rangeWindowLabel = formatRangeWindow(historyRecords, range);
  const hasAnyHistory = allTimeStats.totalPredictions > 0;
  const hasFilteredData = filteredRecords.length > 0;
  const spotlightValue = hasFilteredData
    ? filteredStats.averageScore
    : allTimeStats.averageScore;

  const primaryButtonClass = 'button';

  return (
    <motion.div
      className="grid gap-5 overflow-x-hidden lg:gap-6"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <section className="relative overflow-hidden rounded-[2rem] border border-[color:var(--card-border-strong)] bg-[color:var(--card)] p-4 text-[color:var(--text-strong)] shadow-[var(--shadow)] backdrop-blur-2xl sm:p-6 lg:p-8">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-[color:var(--accent-bg)] via-[color:var(--gold-bg)] to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-10 top-10 h-36 w-36 rounded-full bg-[color:var(--accent-bg)] blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-16 left-8 h-44 w-44 rounded-full bg-[color:var(--gold-bg)] blur-3xl"
          aria-hidden="true"
        />

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="space-y-3">
                <h2 className="max-w-3xl text-2xl font-semibold leading-tight tracking-tight text-[color:var(--text-strong)] sm:text-3xl lg:text-4xl xl:text-5xl">
                  Wine quality intelligence with a cleaner, sharper control
                  center.
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-[color:var(--text-soft)] sm:text-base">
                  Monitor score momentum, inspect category behavior, and surface
                  quick insights from your saved wine analyses without losing
                  clarity on small screens.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 text-xs text-[color:var(--text-soft)] min-[480px]:grid-cols-2 xl:flex xl:flex-wrap">
              <span className="max-w-full break-words rounded-full border border-[color:var(--card-border)] bg-[color:var(--surface)] px-3 py-1.5 shadow-[var(--shadow-soft)]">
                Window: {selectedRange.label}
              </span>
              <span className="max-w-full break-words rounded-full border border-[color:var(--card-border)] bg-[color:var(--surface)] px-3 py-1.5 shadow-[var(--shadow-soft)]">
                Showing: {rangeWindowLabel}
              </span>
              <span className="max-w-full break-words rounded-full border border-[color:var(--card-border)] bg-[color:var(--surface)] px-3 py-1.5 shadow-[var(--shadow-soft)]">
                Last synced: {formatDateTime(allTimeStats.lastPredictionAt)}
              </span>
            </div>

            <DashboardRangeFilter
              options={DASHBOARD_RANGE_OPTIONS}
              value={range}
              onChange={setRange}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="rounded-[1.6rem] border border-[color:var(--card-border)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-5">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--text-subtle)]">
                Window average
              </p>
              <div className="mt-3 flex flex-col gap-2 min-[480px]:flex-row min-[480px]:items-end">
                <span className="break-words text-3xl font-semibold tracking-tight text-[color:var(--text-strong)] sm:text-4xl">
                  {hasAnyHistory ? `${spotlightValue}/100` : '0/100'}
                </span>
                <span className="text-sm text-[color:var(--text-soft)]">
                  {getAverageDeltaBadge(
                    filteredStats.averageScore,
                    allTimeStats.averageScore,
                  )}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[color:var(--text-soft)]">
                {hasFilteredData
                  ? `${filteredStats.qualityRate}% of predictions in this range were rated good or excellent.`
                  : 'No predictions landed inside this filter yet, so the dashboard is standing by for new activity.'}
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-[color:var(--card-border)] bg-[color:var(--surface-strong)] p-4 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-5">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--text-subtle)]">
                All-time health
              </p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[color:var(--card-border)] bg-[color:var(--surface)] p-3 min-w-0">
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">
                    Saved
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-[color:var(--text-strong)] truncate">
                    {allTimeStats.totalPredictions}
                  </p>
                </div>
                <div className="rounded-2xl border border-[color:var(--card-border)] bg-[color:var(--surface)] p-3 min-w-0">
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--text-subtle)]">
                    Best
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-[color:var(--text-strong)] truncate">
                    {allTimeStats.bestScore}/100
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-[color:var(--text-soft)]">
                Top category overall:{' '}
                <span className="font-semibold text-[color:var(--text-strong)]">
                  {allTimeStats.mostCommonCategory}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {!hasAnyHistory ? (
        <DashboardSection
          title="No saved predictions yet"
          description="Run your first analysis and the dashboard will unlock trend charts, smart insights, and recent activity cards."
        >
          <div className="flex flex-col gap-4 rounded-[1.5rem] border border-dashed border-[color:var(--card-border)] bg-[color:var(--nav-hover-bg)] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h4 className="text-xl font-semibold tracking-tight text-[color:var(--text-strong)]">
                Start building your quality history
              </h4>
              <p className="max-w-xl text-sm leading-6 text-[color:var(--text-soft)]">
                The analyzer is already wired into your account, so every new
                prediction will immediately feed the premium dashboard
                experience.
              </p>
            </div>
            <Link
              to="/analyzer"
              className={`${primaryButtonClass} w-full sm:w-auto`}
            >
              Open Analyzer
            </Link>
          </div>
        </DashboardSection>
      ) : null}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard
          label="Predictions"
          value={filteredStats.totalPredictions}
          helper={`${selectedRange.label} activity across ${filteredStats.activeDays || 0} active day${filteredStats.activeDays === 1 ? '' : 's'}.`}
          badge={`${allTimeStats.totalPredictions} all-time`}
          accentClassName="bg-[color:var(--accent-bg)]"
        />
        <DashboardMetricCard
          label="Average Score"
          value={filteredStats.averageScore}
          suffix="/100"
          decimals={1}
          helper="Average quality score inside the selected range."
          badge={getAverageDeltaBadge(
            filteredStats.averageScore,
            allTimeStats.averageScore,
          )}
          accentClassName="bg-[color:var(--gold-bg)]"
        />
        <DashboardMetricCard
          label="Best Score"
          value={filteredStats.bestScore}
          suffix="/100"
          helper="Top-performing prediction captured in this view."
          badge={filteredStats.bestScore ? 'Peak quality' : 'No peak yet'}
          accentClassName="bg-[color:var(--plum-bg)]"
        />
        <DashboardMetricCard
          label="Top Category"
          value={filteredStats.mostCommonCategory}
          helper="Most frequent quality band in the selected window."
          badge={`${filteredStats.qualityRate}% high-quality`}
          accentClassName="bg-[color:var(--sage-bg)]"
        />
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <DashboardSection
          title="Score trend"
          description={`Average score and prediction volume across the ${selectedRange.label.toLowerCase()} view.`}
        >
          {hasFilteredData ? (
            <Suspense
              fallback={<ChartFallback label="Rendering score trend" />}
            >
              <TrendChart data={trendData} colors={palette} />
            </Suspense>
          ) : (
            <div className="flex min-h-[19rem] flex-col items-start justify-center rounded-[1.5rem] border border-dashed border-[color:var(--card-border)] bg-[color:var(--nav-hover-bg)] p-5 text-[color:var(--text-soft)]">
              <h4 className="text-xl font-semibold text-[color:var(--text-strong)]">
                No trend data in this window
              </h4>
              <p className="mt-2 max-w-md text-sm leading-6 text-[color:var(--text-soft)]">
                There were no saved analyses in the current filter. Expand the
                range or generate new predictions to restore the trend line.
              </p>
              <button
                type="button"
                className={`${primaryButtonClass} mt-4 w-full sm:w-auto`}
                onClick={() => setRange('yearly')}
              >
                Switch to 12 Months
              </button>
            </div>
          )}
        </DashboardSection>

        <DashboardSection
          title="Insights panel"
          description="Quick intelligence generated from your saved records."
        >
          <DashboardInsightsPanel
            insights={insights}
            emptyAction={
              <button
                type="button"
                className={`${primaryButtonClass} w-full sm:w-auto`}
                onClick={() => setRange('yearly')}
              >
                View broader range
              </button>
            }
          />
        </DashboardSection>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <DashboardSection
          title="Category distribution"
          description="See how prediction quality is split across the current range."
        >
          {hasFilteredData ? (
            <Suspense
              fallback={<ChartFallback label="Rendering category chart" />}
            >
              <CategoryChart
                data={categoryData}
                colors={palette.category}
                total={filteredStats.totalPredictions}
              />
            </Suspense>
          ) : (
            <div className="flex min-h-[19rem] items-center justify-center rounded-[1.5rem] border border-dashed border-[color:var(--card-border)] bg-[color:var(--nav-hover-bg)] p-5 text-center text-[color:var(--text-soft)]">
              <div className="space-y-2">
                <h4 className="text-xl font-semibold text-[color:var(--text-strong)]">
                  No categories to compare
                </h4>
                <p className="max-w-md text-sm leading-6 text-[color:var(--text-soft)]">
                  This range does not contain predictions yet, so the quality
                  mix will appear after the next saved analysis.
                </p>
              </div>
            </div>
          )}
        </DashboardSection>

        <DashboardSection
          title="Recent activity"
          description={`Latest saved predictions inside the ${selectedRange.label.toLowerCase()} view.`}
        >
          <RecentActivityPanel records={recentRecords} />
        </DashboardSection>
      </section>
    </motion.div>
  );
};

export default DashboardPage;
