import { useEffect, useRef, useState } from 'react';

import { getPredictionHistory } from '../../api/wine.api.js';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StatusMessage from '../../components/common/StatusMessage.jsx';
import HistoryPagination from '../../components/history/HistoryPagination.jsx';
import HistoryTable from '../../components/history/HistoryTable.jsx';
import { normalizePaginatedPredictionHistory } from '../../utils/predictionRecords.js';
import { getApiErrorMessage } from '../../utils/validation.js';

const categoryOptions = ['', 'Poor', 'Average', 'Good', 'Excellent'];
const initialHistoryState = {
  records: [],
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
  },
};

const HistoryPage = () => {
  const hasLoadedHistoryRef = useRef(false);
  const [history, setHistory] = useState(initialHistoryState);
  const [filters, setFilters] = useState({
    page: 1,
    category: '',
  });
  const [requestVersion, setRequestVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      const isInlineRefresh = hasLoadedHistoryRef.current;

      try {
        if (isInlineRefresh) {
          setIsRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await getPredictionHistory({
          page: filters.page,
          limit: 10,
          category: filters.category || undefined,
        });

        if (isMounted) {
          const normalizedHistory = normalizePaginatedPredictionHistory(
            response?.data,
          );

          if (normalizedHistory.pagination.page !== filters.page) {
            setFilters((current) => ({
              ...current,
              page: normalizedHistory.pagination.page,
            }));
          }

          setHistory(normalizedHistory);
          hasLoadedHistoryRef.current = true;
          setError('');
        }
      } catch (requestError) {
        if (isMounted) {
          hasLoadedHistoryRef.current = true;
          setError(
            getApiErrorMessage(
              requestError,
              'Unable to fetch prediction history',
            ),
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsRefreshing(false);
        }
      }
    };

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [filters.page, filters.category, requestVersion]);

  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setFilters({
      page: 1,
      category: value,
    });
  };

  const handlePageChange = (nextPage) => {
    setFilters((current) => ({
      ...current,
      page: nextPage,
    }));
  };

  const handleRetry = () => {
    setRequestVersion((current) => current + 1);
  };

  const hasRecords = history.records.length > 0;
  const hasCategoryFilter = Boolean(filters.category);
  const totalLabel = `${history.pagination.total} record${history.pagination.total === 1 ? '' : 's'}${hasCategoryFilter ? ` in ${filters.category}` : ' stored'}`;

  if (loading && !hasRecords && !error) {
    return <LoadingSpinner fullScreen label="Loading prediction history" />;
  }

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <span className="page-header__eyebrow">History</span>
          <h2>Stored predictions and quality outcomes</h2>
          <p>
            Review previous analyses, filter by category, and track how each
            sample performed.
          </p>
        </div>
      </section>

      <section className="surface-card">
        <div className="filter-row">
          <div className="section-heading">
            <div>
              <h3>Prediction History</h3>
              <p>{totalLabel}</p>
            </div>
          </div>

          <div className="filter-row__controls">
            <label className="filter-row__label">
              <span>Category</span>
              <select
                className="form-field__control form-field__control--select"
                value={filters.category}
                onChange={handleCategoryChange}
              >
                {categoryOptions.map((option) => (
                  <option key={option || 'all'} value={option}>
                    {option || 'All Categories'}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {isRefreshing ? (
          <p className="muted-text" role="status" aria-live="polite">
            Refreshing history...
          </p>
        ) : null}

        {error ? (
          <div className="page-stack">
            <StatusMessage
              title={hasRecords ? 'Latest refresh failed' : 'Unable to load history'}
              message={error}
            />
            <div className="action-row">
              <button
                type="button"
                className="button button--secondary"
                onClick={handleRetry}
              >
                Try Again
              </button>
            </div>
          </div>
        ) : null}

        {hasRecords ? (
          <>
            <HistoryTable records={history.records} />
            <HistoryPagination
              page={history.pagination.page}
              pages={history.pagination.pages}
              isDisabled={loading || isRefreshing}
              onPageChange={handlePageChange}
            />
          </>
        ) : !error ? (
          <EmptyState
            title={
              hasCategoryFilter ? 'No predictions match this filter' : 'History is empty'
            }
            description={
              hasCategoryFilter
                ? `There are no saved ${filters.category.toLowerCase()} predictions yet. Try another category or add more analyses.`
                : 'Predictions saved from the analyzer will appear here once you start using the app.'
            }
          />
        ) : null}
      </section>
    </div>
  );
};

export default HistoryPage;
