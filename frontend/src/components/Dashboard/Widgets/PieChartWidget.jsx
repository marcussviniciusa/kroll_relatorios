import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper, 
  Typography, 
  useTheme, 
  CircularProgress,
  Tooltip
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip as RechartsTooltip 
} from 'recharts';

const PieChartWidget = ({ 
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
    dataKey = 'value',
    nameKey = 'name',
    colors = [],
    innerRadius = 0,
    outerRadius = '80%',
    legendPosition = 'bottom',
    labelKey = null,
    labelFormatter = null
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
    showLegend = true,
    showTooltip = true,
    showLabels = false
  } = display;
  
  // Default colors if none provided
  const defaultColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.error.main,
    theme.palette.primary.light,
    theme.palette.secondary.light,
    theme.palette.success.light,
    theme.palette.warning.light,
  ];
  
  const chartColors = colors.length > 0 ? colors : defaultColors;
  
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

  // Calculate total value for percentage calculation
  const total = data ? data.reduce((sum, item) => sum + (item[dataKey] || 0), 0) : 0;
  
  // Custom formatter for tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const value = item[dataKey];
      const percentage = (value / total * 100).toFixed(1);
      
      return (
        <Box 
          sx={{ 
            bgcolor: 'background.paper',
            p: 1.5,
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            borderRadius: 1,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ fontWeight: 600, mb: 0.5 }}
          >
            {item[nameKey]}
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Valor:</span>
            <Box component="span" sx={{ fontWeight: 500, ml: 2 }}>
              {value.toLocaleString('pt-BR')}
            </Box>
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Percentual:</span>
            <Box component="span" sx={{ fontWeight: 500, ml: 2 }}>
              {percentage}%
            </Box>
          </Typography>
        </Box>
      );
    }
    return null;
  };
  
  // Custom label renderer
  const renderCustomizedLabel = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload } = props;
    
    // If labels are disabled or no data is available
    if (!showLabels || !data || !data[index]) return null;
    
    // Calculate label position
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    
    // Format label text
    let labelText;
    if (labelKey && data[index][labelKey]) {
      labelText = data[index][labelKey];
    } else if (labelFormatter) {
      labelText = labelFormatter(data[index]);
    } else {
      const percentVal = (percent * 100).toFixed(0);
      // Only show percentage if it's at least 5%
      labelText = percentVal >= 5 ? `${percentVal}%` : '';
    }
    
    // Don't render very small labels to avoid clutter
    if (!labelText) return null;
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor="middle" 
        dominantBaseline="central"
        style={{
          fontSize: 12,
          fontWeight: 500,
          textShadow: '0px 0px 2px rgba(0,0,0,0.8)'
        }}
      >
        {labelText}
      </text>
    );
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
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                dataKey={dataKey}
                nameKey={nameKey}
                paddingAngle={innerRadius > 0 ? 2 : 0}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={chartColors[index % chartColors.length]} 
                  />
                ))}
              </Pie>
              {showLegend && (
                <Legend
                  layout="horizontal"
                  verticalAlign={legendPosition === 'top' ? 'top' : 'bottom'}
                  align="center"
                  wrapperStyle={{ paddingTop: 20 }}
                />
              )}
              {showTooltip && (
                <RechartsTooltip content={<CustomTooltip />} />
              )}
            </PieChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Paper>
  );
};

PieChartWidget.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  data: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  config: PropTypes.object,
  settings: PropTypes.object
};

export default PieChartWidget;
