import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { alpha } from '@mui/material/styles';

/**
 * MetricCard widget for displaying a single metric with trend indicator
 */
const MetricCard = ({ data }) => {
  const {
    value,
    label,
    previousValue,
    format = 'number',
    prefix = '',
    suffix = '',
    trendUp = true,
    precision = 0,
    thresholds = { warning: 0, danger: -10 }
  } = data || {};

  // Calculate percent change if both values exist
  let percentChange = 0;
  let trendDirection = 'flat';
  
  if (value !== undefined && previousValue !== undefined && previousValue !== 0) {
    percentChange = ((value - previousValue) / Math.abs(previousValue)) * 100;
    trendDirection = percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'flat';
  }

  // Format the value based on the format type
  const formatValue = (val) => {
    if (val === undefined || val === null) return '-';
    
    let formattedValue;
    
    switch (format) {
      case 'currency':
        formattedValue = val.toLocaleString('pt-BR', { 
          minimumFractionDigits: precision,
          maximumFractionDigits: precision
        });
        break;
      case 'percent':
        formattedValue = val.toLocaleString('pt-BR', { 
          minimumFractionDigits: precision,
          maximumFractionDigits: precision
        });
        break;
      case 'decimal':
        formattedValue = val.toLocaleString('pt-BR', { 
          minimumFractionDigits: precision,
          maximumFractionDigits: precision
        });
        break;
      case 'number':
      default:
        formattedValue = val.toLocaleString('pt-BR');
        break;
    }
    
    return `${prefix}${formattedValue}${suffix}`;
  };

  // Determine trend icon and color
  const getTrendIcon = () => {
    if (trendDirection === 'up') {
      return <TrendingUpIcon fontSize="small" />;
    } else if (trendDirection === 'down') {
      return <TrendingDownIcon fontSize="small" />;
    }
    return <TrendingFlatIcon fontSize="small" />;
  };

  // Determine trend color based on direction and thresholds
  const getTrendColor = () => {
    if (trendDirection === 'flat') return 'text.secondary';
    
    if (trendUp) {
      // Positive trend is good (green)
      if (trendDirection === 'up') return 'success.main';
      // Negative trend needs to be evaluated against thresholds
      if (percentChange < thresholds.danger) return 'error.main';
      if (percentChange < thresholds.warning) return 'warning.main';
      return 'error.main';
    } else {
      // Negative trend is good (green)
      if (trendDirection === 'down') return 'success.main';
      // Positive trend needs to be evaluated against thresholds
      if (percentChange > Math.abs(thresholds.danger)) return 'error.main';
      if (percentChange > Math.abs(thresholds.warning)) return 'warning.main';
      return 'error.main';
    }
  };

  return (
    <Card sx={{ height: '100%', boxShadow: 'none' }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {label || 'Métrica'}
        </Typography>
        
        <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
          {formatValue(value)}
        </Typography>
        
        {previousValue !== undefined && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              bgcolor: alpha(getTrendColor(), 0.1),
              borderRadius: 1,
              px: 1,
              py: 0.5,
              width: 'fit-content'
            }}
          >
            <Box 
              sx={{ 
                mr: 0.5, 
                display: 'flex', 
                alignItems: 'center', 
                color: getTrendColor()
              }}
            >
              {getTrendIcon()}
            </Box>
            <Typography 
              variant="body2"
              sx={{ 
                color: getTrendColor(),
                fontWeight: 'medium'
              }}
            >
              {Math.abs(percentChange).toFixed(1)}%
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
