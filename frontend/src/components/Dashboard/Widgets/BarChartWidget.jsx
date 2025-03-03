import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper, 
  Typography, 
  useTheme, 
  CircularProgress,
  Tooltip
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const BarChartWidget = ({ 
  title, 
  description, 
  data, 
  loading, 
  error, 
  config = {},
  settings = {}
}) => {
  const theme = useTheme();
  
  // Extract config options with defaults
  const {
    xAxisKey = 'name',
    barDataKeys = ['value'],
    barColors = [theme.palette.primary.main],
    stacked = false,
    horizontal = false,
    showGrid = true,
    valueFormatter = (value) => value,
    xAxisFormatter = (value) => value,
    yAxisFormatter = (value) => value,
  } = config;
  
  // Extract settings
  const {
    appearance = {},
    display = {}
  } = settings;
  
  const {
    showTitle = true,
    showDescription = true,
    colorTheme = 'default',
    transparent = false,
    shadow = 'medium',
    borderRadius = 'medium'
  } = appearance;
  
  const {
    animate = true,
    numberFormat = 'pt-BR'
  } = display;
  
  // Generate shadow styles based on setting
  const getShadowStyle = () => {
    if (transparent) return {};
    
    switch (shadow) {
      case 'none':
        return {};
      case 'light':
        return { boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' };
      case 'strong':
        return { boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' };
      case 'medium':
      default:
        return { boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' };
    }
  };
  
  // Generate border radius styles
  const getBorderRadiusStyle = () => {
    switch (borderRadius) {
      case 'none':
        return { borderRadius: 0 };
      case 'small':
        return { borderRadius: theme.shape.borderRadius / 2 };
      case 'large':
        return { borderRadius: theme.shape.borderRadius * 2 };
      case 'medium':
      default:
        return { borderRadius: theme.shape.borderRadius };
    }
  };
  
  // Format number based on locale
  const formatNumber = (value) => {
    if (typeof value !== 'number') return value;
    
    return new Intl.NumberFormat(numberFormat).format(value);
  };

  // Get colors for bars
  const barColorPalette = useMemo(() => {
    // If using theme colors
    if (colorTheme === 'default') {
      return [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.info.main,
        theme.palette.error.main
      ];
    }
    
    // Use specific colors if provided
    if (barColors && barColors.length > 0) {
      return barColors;
    }
    
    // Default fallback
    return [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main
    ];
  }, [theme, colorTheme, barColors]);
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper 
          sx={{ 
            p: 1.5, 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            maxWidth: 250
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {xAxisFormatter(label)}
          </Typography>
          
          {payload.map((entry, index) => (
            <Box key={`tooltip-item-${index}`} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box 
                component="span" 
                sx={{ 
                  display: 'inline-block', 
                  width: 10, 
                  height: 10, 
                  borderRadius: '50%', 
                  backgroundColor: entry.color, 
                  mr: 1 
                }} 
              />
              <Typography variant="body2" component="span" sx={{ fontWeight: 500 }}>
                {entry.name}:
              </Typography>
              <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                {formatNumber(valueFormatter(entry.value))}
              </Typography>
            </Box>
          ))}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        p: 2,
        bgcolor: transparent ? 'transparent' : 'background.paper',
        ...getShadowStyle(),
        ...getBorderRadiusStyle(),
      }}
      elevation={transparent ? 0 : 1}
    >
      {/* Widget header */}
      {(showTitle && title) && (
        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 500, flex: 1 }}>
            {title}
          </Typography>
          
          {description && (
            <Tooltip title={description} placement="top">
              <InfoOutlinedIcon fontSize="small" color="action" sx={{ ml: 1 }} />
            </Tooltip>
          )}
        </Box>
      )}
      
      {/* Description if not in tooltip */}
      {(showDescription && description && !showTitle) && (
        <Typography 
          variant="body2" 
          color="textSecondary" 
          sx={{ mb: 2 }}
        >
          {description}
        </Typography>
      )}
      
      {/* Chart content */}
      <Box sx={{ flex: 1, mt: 1, height: '100%', minHeight: 150 }}>
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <CircularProgress size={40} />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="body2" color="error" align="center">
              Erro ao carregar dados: {error}
            </Typography>
          </Box>
        ) : !data || data.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="body2" color="textSecondary" align="center">
              Nenhum dado disponível
            </Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout={horizontal ? 'vertical' : 'horizontal'}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />}
              
              {horizontal ? (
                <>
                  <XAxis 
                    type="number" 
                    tickFormatter={yAxisFormatter} 
                    tickMargin={10}
                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                    axisLine={{ stroke: theme.palette.divider }}
                    tickLine={{ stroke: theme.palette.divider }}
                  />
                  <YAxis 
                    dataKey={xAxisKey} 
                    type="category" 
                    tickFormatter={xAxisFormatter}
                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                    axisLine={{ stroke: theme.palette.divider }}
                    tickLine={{ stroke: theme.palette.divider }}
                  />
                </>
              ) : (
                <>
                  <XAxis 
                    dataKey={xAxisKey} 
                    tickFormatter={xAxisFormatter}
                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                    axisLine={{ stroke: theme.palette.divider }}
                    tickLine={{ stroke: theme.palette.divider }}
                  />
                  <YAxis 
                    tickFormatter={yAxisFormatter}
                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                    axisLine={{ stroke: theme.palette.divider }}
                    tickLine={{ stroke: theme.palette.divider }}
                  />
                </>
              )}
              
              <RechartsTooltip content={<CustomTooltip />} />
              
              <Legend />
              
              {barDataKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId={stacked ? 'stack' : null}
                  fill={barColorPalette[index % barColorPalette.length]}
                  animationDuration={animate ? 1500 : 0}
                  animationEasing="ease-out"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Paper>
  );
};

BarChartWidget.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  data: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  config: PropTypes.object,
  settings: PropTypes.object
};

export default BarChartWidget;
