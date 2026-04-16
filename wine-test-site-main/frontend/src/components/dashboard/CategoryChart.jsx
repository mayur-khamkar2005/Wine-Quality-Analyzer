import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import DashboardTooltip from './DashboardTooltip.jsx';

const CategoryChart = ({ data, colors, total }) => (
  <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(12rem,15rem)] lg:items-center">
    <div className="overflow-x-auto">
      <div className="h-[18rem] w-full min-w-0 sm:h-[20rem]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<DashboardTooltip />} />
            <Pie
              data={data}
              dataKey="count"
              nameKey="category"
              innerRadius={70}
              outerRadius={108}
              paddingAngle={4}
              stroke="transparent"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={colors[entry.category] || colors.default}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="grid gap-3">
      <div className="rounded-[1.4rem] border border-[color:var(--card-border)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow-soft)]">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--text-subtle)]">
          Tracked
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--text-strong)] sm:text-3xl">
          {total}
        </p>
        <p className="mt-2 text-sm text-[color:var(--text-soft)]">
          Predictions included in the current range.
        </p>
      </div>

      <div className="grid gap-2">
        {data.map((entry) => (
          <div
            key={entry.category}
            className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-[color:var(--card-border)] bg-[color:var(--surface)] px-3 py-2.5 shadow-[var(--shadow-soft)]"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: colors[entry.category] || colors.default,
                }}
              />
              <span className="truncate text-sm text-[color:var(--text-soft)]">
                {entry.category}
              </span>
            </div>
            <span className="shrink-0 text-sm font-semibold text-[color:var(--text-strong)]">
              {entry.share}%
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CategoryChart;
