import { useState } from 'react';

import { createPrediction } from '../../api/wine.api.js';
import EmptyState from '../../components/common/EmptyState.jsx';
import StatusMessage from '../../components/common/StatusMessage.jsx';
import FormField from '../../components/forms/FormField.jsx';
import {
  formatNumericValue,
  formatMetricName,
  formatScaleValue,
  getCategoryClassName,
} from '../../utils/formatters.js';
import { normalizePredictionRecord } from '../../utils/predictionRecords.js';
import { createInitialWineForm, wineSections } from '../../utils/wineFields.js';
import {
  getApiErrorMessage,
  validateWineForm,
} from '../../utils/validation.js';

const WineAnalyzerPage = () => {
  const [formState, setFormState] = useState(createInitialWineForm);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState({
    isSubmitting: false,
    error: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormState(createInitialWineForm());
    setErrors({});
    setResult(null);
    setStatus({
      isSubmitting: false,
      error: '',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateWineForm(formState);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload = Object.entries(formState).reduce(
      (accumulator, [key, value]) => ({
        ...accumulator,
        [key]: Number(value),
      }),
      {},
    );

    try {
      setStatus({
        isSubmitting: true,
        error: '',
      });

      const response = await createPrediction(payload);
      const nextRecord = response?.data?.record
        ? normalizePredictionRecord(response.data.record, 'latest-prediction')
        : null;

      if (!nextRecord) {
        throw new Error('Prediction result was empty');
      }

      setResult(nextRecord);
    } catch (requestError) {
      setStatus({
        isSubmitting: false,
        error: getApiErrorMessage(
          requestError,
          'Unable to generate a prediction right now',
        ),
      });
      return;
    }

    setStatus({
      isSubmitting: false,
      error: '',
    });
  };

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <span className="page-header__eyebrow">Analyzer</span>
          <h2>Predict wine quality from chemistry inputs</h2>
          <p>
            Submit the standard wine parameters below to generate a score,
            category, and analysis snapshot.
          </p>
        </div>
      </section>

      <div className="split-grid split-grid--analyzer">
        <form className="page-stack" onSubmit={handleSubmit} noValidate>
          {wineSections.map((section) => (
            <section key={section.title} className="surface-card">
              <div className="section-heading">
                <div>
                  <h3>{section.title}</h3>
                  <p>{section.description}</p>
                </div>
              </div>

              <div className="form-grid">
                {section.fields.map((field) => (
                  <FormField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    type="number"
                    step={field.step}
                    min={field.min}
                    max={field.max}
                    value={formState[field.name]}
                    onChange={handleChange}
                    error={errors[field.name]}
                    helper={field.helper}
                    placeholder={field.placeholder}
                    inputMode="decimal"
                  />
                ))}
              </div>
            </section>
          ))}

          {status.error ? (
            <StatusMessage
              title="Prediction request failed"
              message={status.error}
            />
          ) : null}

          <div className="action-row">
            <button
              type="submit"
              className="button"
              disabled={status.isSubmitting}
              aria-busy={status.isSubmitting}
            >
              {status.isSubmitting ? 'Running Prediction...' : 'Run Prediction'}
            </button>
            <button
              type="button"
              className="button button--secondary"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </form>

        <div className="page-stack">
          <section className="surface-card analysis-card">
            <div className="section-heading">
              <div>
                <h3>Prediction Result</h3>
                <p>
                  Quality score, category, and the feature contribution summary.
                </p>
              </div>
            </div>

            {result ? (
              <div className="analysis-card__content">
                <div className="analysis-summary">
                  <span
                    className={getCategoryClassName(result.prediction.category)}
                  >
                    {result.prediction.category}
                  </span>
                  <strong>{formatScaleValue(result.prediction.score, 100)}</strong>
                  <p>Rating {formatScaleValue(result.prediction.rating, 10)}</p>
                </div>

                {result.prediction.metrics.length > 0 ? (
                  <div className="metric-list">
                    {result.prediction.metrics.map((metric) => (
                      <div key={metric.name} className="metric-list__row">
                        <div className="metric-list__header">
                          <span>{formatMetricName(metric.name)}</span>
                          <strong>
                            {formatNumericValue(metric.score, {
                              maximumFractionDigits: 0,
                              suffix: '%',
                            })}
                          </strong>
                        </div>
                        <div className="metric-list__track">
                          <div
                            className="metric-list__fill"
                            style={{ width: `${metric.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="muted-text">
                    Feature contribution details are not available for this
                    prediction yet.
                  </p>
                )}
              </div>
            ) : (
              <EmptyState
                title="Prediction waiting..."
                description="Enter the wine chemistry values and run the analyzer to see the prediction output here."
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default WineAnalyzerPage;
