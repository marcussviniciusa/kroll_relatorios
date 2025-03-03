import React, { useState, useEffect } from 'react';
import {
  Box, 
  Typography, 
  Grid, 
  Paper, 
  CircularProgress, 
  Alert,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  useTheme,
  Divider,
  Button,
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import apiService from '../services/apiConfig';

// Registrar os componentes ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const DashboardTester = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [widgets, setWidgets] = useState([]);
  const [widgetData, setWidgetData] = useState({});

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        // Pegar o primeiro dashboard disponível (para teste)
        const response = await apiService.dashboards.getById('dashboard-1');
        setDashboard(response.dashboard);
        setWidgets(response.widgets || []);
        
        // Buscar dados para cada widget
        const dataPromises = response.widgets.map(widget => 
          apiService.widgets.getData(widget.id, { period: 'last7days' })
        );
        
        const dataResults = await Promise.all(dataPromises);
        
        // Organizar os dados por widget ID
        const widgetDataMap = {};
        response.widgets.forEach((widget, index) => {
          widgetDataMap[widget.id] = dataResults[index].data;
        });
        
        setWidgetData(widgetDataMap);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
        setError('Não foi possível carregar o dashboard. Por favor, tente novamente.');
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Função para gerar cores de gradiente
  const createGradient = (ctx, chartArea, startColor, endColor) => {
    if (!ctx || !chartArea) {
      return startColor;
    }
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);
    return gradient;
  };

  // Componente para renderizar diferentes tipos de gráficos
  const renderWidgetContent = (widget) => {
    const data = widgetData[widget.id] || {};
    
    // Widget sem dados
    if (!data) {
      return <Typography>Sem dados disponíveis</Typography>;
    }
    
    // Verificar o tipo de dados para renderização adequada
    if (data.datasets && data.labels) {
      // Dados de gráfico com datasets e labels
      // Determinar tipo de gráfico baseado no widget.type
      const chartType = widget.type === 'bar' ? 'bar' : 'line';
      
      // Configurações para diferentes tipos de gráficos
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        animations: {
          tension: {
            duration: 1000,
            easing: 'linear',
            from: 0.5,
            to: 0.3,
            loop: false
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 10,
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            backgroundColor: theme.palette.background.paper,
            titleColor: theme.palette.text.primary,
            bodyColor: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
            borderWidth: 1,
            padding: 10,
            boxShadow: '0px 2px 6px rgba(0,0,0,0.05)',
            usePointStyle: true,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: theme.palette.divider,
              drawBorder: false,
            },
            ticks: {
              font: {
                size: 10
              }
            }
          },
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              font: {
                size: 10
              }
            }
          }
        }
      };
      
      // Adicionar gradientes aos datasets
      const chartData = {
        labels: data.labels,
        datasets: data.datasets.map((dataset, index) => {
          const colors = [
            { start: 'rgba(92, 107, 192, 0.2)', end: 'rgba(92, 107, 192, 0.7)', border: '#5C6BC0' },
            { start: 'rgba(38, 166, 154, 0.2)', end: 'rgba(38, 166, 154, 0.7)', border: '#26A69A' },
            { start: 'rgba(236, 64, 122, 0.2)', end: 'rgba(236, 64, 122, 0.7)', border: '#EC407A' },
          ];
          
          const colorSet = colors[index % colors.length];
          
          return {
            ...dataset,
            borderColor: colorSet.border,
            backgroundColor: function(context) {
              const chart = context.chart;
              const {ctx, chartArea} = chart;
              if (!chartArea) return colorSet.start;
              return createGradient(ctx, chartArea, colorSet.start, colorSet.end);
            },
            tension: 0.3,
            pointBackgroundColor: colorSet.border,
            pointRadius: 3,
            pointHoverRadius: 5,
            fill: true,
          };
        })
      };
      
      return (
        <Box sx={{ height: 250 }}>
          {chartType === 'line' ? 
            <Line options={options} data={chartData} /> : 
            <Bar options={options} data={chartData} />
          }
        </Box>
      );
      
    } else if (data.value !== undefined) {
      // Dados do tipo valor/métrica (card com número grande)
      const trendColor = data.trend === 'up' ? theme.palette.success.main : theme.palette.error.main;
      const trendIcon = data.trend === 'up' ? <TrendingUpIcon sx={{ fontSize: 20 }} /> : <TrendingDownIcon sx={{ fontSize: 20 }} />;
      
      // Dados para um pequeno gráfico sparkline - simulado
      const sparklineData = {
        labels: ['', '', '', '', '', '', '', '', '', ''],
        datasets: [{
          data: Array(10).fill().map(() => Math.random() * 100 + 50),
          borderColor: trendColor,
          backgroundColor: 'rgba(0,0,0,0)',
          borderWidth: 2,
          pointRadius: 0,
        }]
      };
      
      const sparklineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: false },
          tooltip: { enabled: false }
        },
        scales: {
          x: { display: false },
          y: { display: false }
        },
        elements: {
          line: { tension: 0.4 }
        }
      };
      
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
              {data.value.toLocaleString()}
            </Typography>
            <Typography 
              variant="body2" 
              component="span" 
              sx={{ ml: 1, color: trendColor, display: 'flex', alignItems: 'center' }}
            >
              {trendIcon} {data.change}%
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Anterior: {data.previousValue.toLocaleString()}
          </Typography>

          <Box sx={{ height: 40, mt: 'auto', mb: 1 }}>
            <Line data={sparklineData} options={sparklineOptions} />
          </Box>
        </Box>
      );
      
    } else if (Array.isArray(data)) {
      // Dados de array - criar um gráfico de rosca
      const chartData = {
        labels: data.map((item, idx) => item.label || `Item ${idx+1}`),
        datasets: [
          {
            data: data.map(item => typeof item.value === 'number' ? item.value : 1),
            backgroundColor: [
              'rgba(92, 107, 192, 0.8)',
              'rgba(66, 165, 245, 0.8)',
              'rgba(38, 166, 154, 0.8)',
              'rgba(102, 187, 106, 0.8)',
              'rgba(236, 64, 122, 0.8)',
              'rgba(239, 83, 80, 0.8)',
            ],
            borderColor: theme.palette.background.paper,
            borderWidth: 2,
          },
        ],
      };
      
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 10,
              font: {
                size: 11
              }
            }
          }
        },
        cutout: '70%',
        animation: {
          animateScale: true,
          animateRotate: true
        }
      };
      
      return (
        <Box sx={{ height: 250 }}>
          <Doughnut data={chartData} options={options} />
        </Box>
      );
      
    } else {
      // Tipo de dados não reconhecido - exibir como JSON formatado
      return (
        <Box sx={{ 
          height: 250, 
          overflow: 'auto', 
          backgroundColor: 'rgba(0,0,0,0.03)', 
          p: 2, 
          borderRadius: 1,
          fontFamily: 'monospace',
          fontSize: '12px' 
        }}>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </Box>
      );
    }
  };

  // Função para atualizar o dashboard
  const refreshDashboard = async () => {
    try {
      setLoading(true);
      // Pegar o primeiro dashboard disponível (para teste)
      const response = await apiService.dashboards.getById('dashboard-1');
      setDashboard(response.dashboard);
      setWidgets(response.widgets || []);
      
      // Buscar dados para cada widget
      const dataPromises = response.widgets.map(widget => 
        apiService.widgets.getData(widget.id, { period: 'last7days' })
      );
      
      const dataResults = await Promise.all(dataPromises);
      
      // Organizar os dados por widget ID
      const widgetDataMap = {};
      response.widgets.forEach((widget, index) => {
        widgetDataMap[widget.id] = dataResults[index].data;
      });
      
      setWidgetData(widgetDataMap);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao atualizar dashboard:', err);
      setError('Não foi possível atualizar o dashboard.');
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Cabeçalho do Dashboard */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DashboardIcon 
              sx={{ 
                mr: 1, 
                color: theme.palette.primary.main, 
                fontSize: 28 
              }} 
            />
            <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
              {dashboard?.name || 'Dashboard Analítico'}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {dashboard?.description || 'Visão geral de performance e métricas principais'}
          </Typography>
        </Box>
        
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />} 
          onClick={refreshDashboard}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: 'none'
          }}
        >
          Atualizar
        </Button>
      </Box>

      {/* Área de Widgets */}
      <Grid container spacing={3}>
        {widgets.map(widget => (
          <Grid 
            item 
            xs={12} 
            md={widget.size === 'small' ? 4 : widget.size === 'medium' ? 6 : 12} 
            key={widget.id}
          >
            <Card 
              elevation={0} 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.3s',
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <CardHeader
                title={widget.title}
                titleTypographyProps={{ variant: 'subtitle1', fontWeight: 'medium' }}
                action={
                  <IconButton size="small">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                }
                sx={{ 
                  pb: 0,
                  '& .MuiCardHeader-content': { overflow: 'hidden' },
                  '& .MuiCardHeader-title': { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
                }}
              />
              <CardContent sx={{ 
                pt: 1, 
                px: 2.5, 
                pb: 2.5, 
                flexGrow: 1, 
                display: 'flex',
                flexDirection: 'column'
              }}>
                {renderWidgetContent(widget)}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardTester;
