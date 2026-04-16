const HistoryPagination = ({
  page = 1,
  pages = 1,
  isDisabled = false,
  onPageChange,
}) => {
  if (pages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button
        type="button"
        className="button button--secondary"
        disabled={isDisabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span className="pagination__status" aria-live="polite">
        Page {page} of {pages}
      </span>
      <button
        type="button"
        className="button button--secondary"
        disabled={isDisabled || page >= pages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default HistoryPagination;
