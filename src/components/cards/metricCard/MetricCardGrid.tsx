import React from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { colorMap, MetricCardGridProps } from "./MetricCardType";
import { metricCardComponentStyle } from "../../../style/muiComponentStyles/sharedComponentStyles";

export const MetricCardGrid: React.FC<MetricCardGridProps> = ({ data }) => {
  const theme = useTheme();
  const styles = metricCardComponentStyle(theme);

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      sx={styles.root}
      data-testid="metric-card-grid"
      role="list"
      aria-label="Metrics"
    >
      {data.map((item, index) => {
        const trendDiff = item.trend ? item.trend.current - item.trend.original : null;
        const trendPositive = trendDiff !== null ? trendDiff > 0 : null;

        const trendColor = trendPositive && item.trend?.desiredOutcome === "incline" ? "green" : !trendPositive && item.trend?.desiredOutcome === "decline" ? "green" : "red";

        return (
          <Grid
            container
            key={index}
            sx={styles.card}
            data-testid={`metric-card-${index}`}
            role="listitem"
          >
            <Box>
              <Box
                sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 1.5, borderRadius: "12px", backgroundColor: `${colorMap[item.color]}22`, color: colorMap[item.color], }}
                data-testid={`metric-card-icon-${index}`}
                aria-hidden="true"
              >
                {item.icon}
              </Box>

              <Typography
                variant="h6"
                fontWeight="bold"
                color={colorMap[item.color]}
                mt={1}
                data-testid={`metric-card-value-${index}`}
                aria-label={`${item.title}: ${item.value}${item.isPercentage ? ' percent' : ''}`}
              >
                {item.value}
                {item.isPercentage && "%"}
              </Typography>

              {item.trend && (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  data-testid={`metric-card-trend-${index}`}
                  role="status"
                  aria-label={`Trend: ${trendPositive ? 'up' : 'down'} ${Math.abs(trendDiff ?? 0).toFixed(1)} percent`}
                >
                  {trendPositive ? (<ArrowUpRight size={16} color={trendColor} aria-hidden="true" />) : (<ArrowDownRight size={16} color={trendColor} aria-hidden="true" />)}
                  <Typography variant="body2" sx={{ color: trendColor, fontWeight: 500 }} >
                    {trendPositive ? `+${Math.abs(trendDiff ?? 0).toFixed(1)}%` : `-${Math.abs(trendDiff ?? 0).toFixed(1)}%`}
                  </Typography>
                </Box>
              )}

              <Typography
                variant="body2"
                color="text.secondary"
                data-testid={`metric-card-title-${index}`}
              >
                {item.title}
              </Typography>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

