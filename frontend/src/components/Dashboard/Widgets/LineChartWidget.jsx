import React, { useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Chart from 'chart.js/auto';

/**
 * LineChartWidget component for displaying line charts in the dashboard
 */
const LineChartWidget = ({ data, options = {} }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const theme = useTheme();
  
  // Default chart options
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: theme.palette.text.secondary
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.divider,
          drawBorder: false
        },
        ticks: {
          color: theme.palette.text.secondary
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 3,
        hitRadius: 10,
        hoverRadius: 5
      }
    }
  };
  
  // Process chart data
  const processData = () => {
    if (!data || !data.datasets) {
      return {
        labels: [],
        datasets: []
      };
    }
    
    // Map theme colors to datasets if no color is provided
    const themeColors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.error.main
    ];
    
    const processedDatasets = data.datasets.map((dataset, index) => {
      const color = dataset.borderColor || themeColors[index % themeColors.length];
      
      return {
        ...dataset,
        borderColor: color,
        backgroundColor: alpha(color, 0.1),
        borderWidth: 2,
        pointBackgroundColor: color,
        pointBorderColor: theme.palette.background.paper,
        pointBorderWidth: 2
      };
    });
    
    return {
      labels: data.labels || [],
      datasets: processedDatasets
    };
  };
  
  // Helper function to create alpha colors
  const alpha = (color, opacity) => {
    // If color is already in rgba format
    if (color.startsWith('rgba')) return color;
    
    // If color is in hex format, convert to rgba
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    // If color is named color, use rgba with opacity
    return `${color.split(')')[0]})`.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
  };
  
  useEffect(() => {
    // Clean up previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      // Merge options and create chart
      const mergedOptions = {
        ...defaultOptions,
        ...options
      };
      
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: processData(),
        options: mergedOptions
      });
    }
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, options, theme]);
  
  return (
    <Box sx={{ width: '100%', height: '100%', minHeight: 200 }}>
      <canvas ref={chartRef} />
    </Box>
  );
};

export default LineChartWidget;
