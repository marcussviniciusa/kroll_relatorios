import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CodeIcon from '@mui/icons-material/Code';
import SettingsIcon from '@mui/icons-material/Settings';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import BarChartWidget from '../Widgets/BarChartWidget';
import LineChartWidget from '../Widgets/LineChartWidget';
import PieChartWidget from '../Widgets/PieChartWidget';
import TableWidget from '../Widgets/TableWidget';
import MetricCard from '../Widgets/MetricCard';
import MapWidget from '../Widgets/MapWidget';

/**
 * Preview Widget component
 * Shows a preview of the configured widget with actual data
 */
const PreviewWidget = ({
  widget,
  data,
  loading,
  error,
  onRefresh
}) => {
  // Get the appropriate widget component based on type
  const getWidgetComponent = () => {
    if (!widget) return null;
    
    // Configuration for the widget
    const config = {
      ...widget.config,
      // Add any specific configurations needed for each widget type
    };
    
    switch (widget.type) {
      case 'bar':
        return (
          <BarChartWidget
            title={widget.title}
            description={widget.description}
            data={data}
            loading={loading}
            error={error}
            config={config}
            settings={widget.settings}
          />
        );
      case 'line':
        return (
          <LineChartWidget
            title={widget.title}
            description={widget.description}
            data={data}
            loading={loading}
            error={error}
            config={config}
            settings={widget.settings}
          />
        );
      case 'pie':
        return (
          <PieChartWidget
            title={widget.title}
            description={widget.description}
            data={data}
            loading={loading}
            error={error}
            config={config}
            settings={widget.settings}
          />
        );
      case 'table':
        return (
          <TableWidget
            title={widget.title}
            description={widget.description}
            data={data}
            loading={loading}
            error={error}
            config={config}
            settings={widget.settings}
          />
        );
      case 'metric':
        return (
          <MetricCard
            data={data}
            title={widget.title}
            description={widget.description}
            loading={loading}
            error={error}
            settings={widget.settings}
          />
        );
      case 'map':
        return (
          <MapWidget
            title={widget.title}
            description={widget.description}
            data={data}
            loading={loading}
            error={error}
            config={config}
            settings={widget.settings}
          />
        );
      default:
        return (
          <Box 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: 'background.default',
              p: 3,
              borderRadius: 1
            }}
          >
            <Typography variant="body1" align="center">
              Tipo de widget não suportado: {widget.type}
            </Typography>
          </Box>
        );
    }
  };
  
  // Format the widget configuration for display
  const formatConfigForDisplay = () => {
    // Create a clean object with only the essential properties
    const cleanConfig = {
      type: widget.type,
      title: widget.title,
      description: widget.description,
      dataSource: {
        type: widget.dataSource?.type,
        // Omit sensitive info like API keys
        ...widget.dataSource?.config && {
          endpoint: widget.dataSource.config.endpoint,
          accountId: widget.dataSource.config.accountId,
          property: widget.dataSource.config.property
        }
      },
      dimensions: widget.dimensions,
      metrics: widget.metrics,
      filters: widget.filters?.map(filter => ({
        field: filter.field,
        operator: filter.operator,
        value: filter.value,
        enabled: filter.enabled
      })),
      settings: widget.settings,
      refreshInterval: widget.refreshInterval
    };
    
    return JSON.stringify(cleanConfig, null, 2);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Pré-visualização do Widget
            </Typography>
            <Box>
              <Tooltip title="Atualizar dados">
                <IconButton onClick={onRefresh} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Capturar pré-visualização">
                <IconButton>
                  <PhotoCameraIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Ver configuração JSON">
                <IconButton>
                  <CodeIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Paper 
            sx={{ 
              p: 0, 
              height: 400, 
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 1
            }}
          >
            {getWidgetComponent()}
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Resumo da Configuração
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2">
                    <strong>Tipo:</strong> {widget.type === 'bar' ? 'Gráfico de Barras' : 
                                         widget.type === 'line' ? 'Gráfico de Linha' : 
                                         widget.type === 'pie' ? 'Gráfico de Pizza' : 
                                         widget.type === 'table' ? 'Tabela' : 
                                         widget.type === 'metric' ? 'Cartão de Métrica' : 
                                         widget.type === 'map' ? 'Mapa' : 
                                         widget.type}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2">
                    <strong>Fonte de Dados:</strong> {widget.dataSource?.type === 'meta' ? 'Meta (Facebook)' : 
                                                    widget.dataSource?.type === 'google' ? 'Google Analytics' : 
                                                    widget.dataSource?.type === 'database' ? 'Banco de Dados' : 
                                                    widget.dataSource?.type}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2">
                    <strong>Atualização:</strong> {widget.refreshInterval ? widget.refreshInterval < 60 
                                                ? `${widget.refreshInterval} segundos` 
                                                : widget.refreshInterval < 3600 
                                                ? `${Math.floor(widget.refreshInterval / 60)} minutos` 
                                                : `${Math.floor(widget.refreshInterval / 3600)} horas` 
                                              : 'Manual'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2">
                    <strong>Métricas:</strong> {widget.metrics?.length || 0}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2">
                    <strong>Dimensões:</strong> {widget.dimensions?.length || 0}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2">
                    <strong>Filtros:</strong> {widget.filters?.filter(f => f.enabled)?.length || 0} ativos
                    {widget.filters?.filter(f => !f.enabled)?.length > 0 && 
                     ` (${widget.filters.filter(f => !f.enabled).length} inativos)`}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => {
                // Go back to the first step
                // This would be implemented in the parent component
              }}
              sx={{ mt: 1 }}
            >
              Voltar para Edição
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

PreviewWidget.propTypes = {
  widget: PropTypes.object.isRequired,
  data: PropTypes.any,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onRefresh: PropTypes.func
};

export default PreviewWidget;
