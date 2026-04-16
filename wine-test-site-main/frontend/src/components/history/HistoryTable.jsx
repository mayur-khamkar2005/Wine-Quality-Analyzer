import {
  formatDateTime,
  formatNumericValue,
  formatScaleValue,
  getCategoryClassName,
} from '../../utils/formatters.js';

const HistoryTable = ({ records = [] }) => (
  <div className="table-wrapper">
    <table className="table table--responsive">
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Score</th>
          <th>Rating</th>
          <th>Alcohol</th>
          <th>pH</th>
          <th>Volatile Acidity</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <tr key={record.id}>
            <td data-label="Date">{formatDateTime(record.createdAt)}</td>
            <td data-label="Category">
              <span className={getCategoryClassName(record.prediction.category)}>
                {record.prediction.category}
              </span>
            </td>
            <td data-label="Score">
              {formatScaleValue(record.prediction.score, 100)}
            </td>
            <td data-label="Rating">
              {formatScaleValue(record.prediction.rating, 10)}
            </td>
            <td data-label="Alcohol">
              {formatNumericValue(record.inputs.alcohol, {
                maximumFractionDigits: 1,
                suffix: '%',
              })}
            </td>
            <td data-label="pH">
              {formatNumericValue(record.inputs.pH, {
                maximumFractionDigits: 2,
              })}
            </td>
            <td data-label="Volatile Acidity">
              {formatNumericValue(record.inputs.volatileAcidity, {
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default HistoryTable;
