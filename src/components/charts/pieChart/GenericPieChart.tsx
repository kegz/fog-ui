import React from 'react';
import { Box, Typography, Grid, IconButton } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import { statusSummaryProps } from './type';

export const GenericPieChart: React.FC<statusSummaryProps> = ({ title, data, onRefresh, onExportCsv, }) => {
  return (
    <Box data-testid="generic-pie-chart" role="region" aria-label={`${title} chart`}>
      <Typography
        variant="h5"
        sx={{ mb: 2 }}
        data-testid="pie-chart-title"
        id="pie-chart-title"
      >
        {title}
      </Typography>
      <Box
        sx={{ height: 200 }}
        data-testid="pie-chart-container"
        role="img"
        aria-labelledby="pie-chart-title"
      >
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              outerRadius={80}
              labelLine={false}
              aria-label="Pie chart visualization"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  data-testid={`pie-segment-${index}`}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Legend */}
      <Grid
        container
        spacing={1}
        data-testid="pie-chart-legend"
        role="list"
        aria-label="Chart legend"
      >
        {data.map((item, index) => (
          <Grid
            key={index}
            data-testid={`pie-legend-item-${index}`}
            role="listitem"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box
                sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color, mr: 1 }}
                aria-hidden="true"
              />
              <Typography
                variant="body2"
                fontWeight="bold"
                data-testid={`pie-legend-label-${index}`}
              >
                {item.count} {item.status}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              data-testid={`pie-legend-percentage-${index}`}
            >
              {item.percentage}% set to {item.status}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Action buttons */}
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignSelf: { xs: 'flex-end', md: 'flex-start' }, ml: 'auto', gap: 0.5 }}
        data-testid="pie-chart-actions"
      >
        {onRefresh ? (
          <IconButton
            size="small"
            onClick={onRefresh}
            data-testid="pie-chart-refresh-button"
            aria-label="Refresh chart data"
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        ) : null}
        {onExportCsv ? (
          <IconButton
            size="small"
            onClick={onExportCsv}
            data-testid="pie-chart-export-button"
            aria-label="Export chart data to CSV"
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        ) : null}
      </Box>
    </Box>
  );
};

