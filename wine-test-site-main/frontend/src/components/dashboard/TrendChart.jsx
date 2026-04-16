import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import DashboardTooltip from './DashboardTooltip.jsx';

const TrendChart = ({ data, colors }) => (
  <div className="overflow-x-auto">
    <div className="h-[18rem] w-full min-w-0 sm:h-[20rem]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 12, right: 8, left: -18, bottom: 0 }}
        >
          <defs>
            <linearGradient id="dashboardScoreFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.primary} stopOpacity={0.36} />
              <stop
                offset="95%"
                stopColor={colors.primary}
                stopOpacity={0.02}
              />
            </linearGradient>
            <linearGradient id="dashboardBarFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={colors.secondary}
                stopOpacity={0.42}
              />
              <stop
                offset="100%"
                stopColor={colors.secondary}
                stopOpacity={0.08}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke={colors.grid}
            strokeDasharray="4 4"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            stroke={colors.axis}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
            tickMargin={10}
            minTickGap={20}
          />
          <YAxis
            yAxisId="score"
            stroke={colors.axis}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            width={38}
            domain={[0, 100]}
          />
          <YAxis
            yAxisId="count"
            orientation="right"
            hide
            domain={[0, 'dataMax + 1']}
          />
          <Tooltip
            content={<DashboardTooltip />}
            cursor={{ stroke: colors.grid, strokeWidth: 1 }}
          />
          <Bar
            yAxisId="count"
            dataKey="count"
            name="Predictions"
            fill="url(#dashboardBarFill)"
            radius={[999, 999, 0, 0]}
            maxBarSize={22}
          />
          <Area
            yAxisId="score"
            type="monotone"
            dataKey="averageScore"
            name="Average score"
            stroke={colors.primary}
            strokeWidth={3}
            fill="url(#dashboardScoreFill)"
            activeDot={{ r: 5, strokeWidth: 0, fill: colors.primary }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default TrendChart;
