import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Box, Typography, Grid, Divider } from "@mui/material";
import { TrendAnalyticsChartProps } from "./types";

export const TrendAnalyticsChart: React.FC<TrendAnalyticsChartProps> = ({ chartData }) => {
  const { title, xAxisKey, data, series, metrics } = chartData;

  return (
    <Box
      sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.12)", p: 3, width: "100%" }}
      data-testid="trend-analytics-chart"
      role="region"
      aria-label={`${title} analytics chart`}
    >
      <Typography
        variant="subtitle1"
        fontWeight={600}
        sx={{ mb: 2 }}
        data-testid="trend-chart-title"
        id="trend-chart-title"
      >
        {title}
      </Typography>

      <Box
        data-testid="trend-chart-container"
        role="img"
        aria-labelledby="trend-chart-title"
        aria-label="Line chart showing trend analytics"
      >
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {series.map((s, idx) => (
              <Line
                key={idx}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                data-testid={`trend-line-${idx}`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {metrics && metrics.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Grid
            container
            spacing={2}
            data-testid="trend-chart-metrics"
            role="list"
            aria-label="Chart metrics"
          >
            {metrics.map((m, i) => (
              <Grid
                key={i}
                data-testid={`trend-metric-${i}`}
                role="listitem"
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  data-testid={`trend-metric-label-${i}`}
                >
                  {m.label}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  data-testid={`trend-metric-value-${i}`}
                  aria-label={`${m.label}: ${m.value}`}
                >
                  {m.value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

