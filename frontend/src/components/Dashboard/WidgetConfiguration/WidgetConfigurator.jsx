import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box, 
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DataSourceConfiguration from './DataSourceConfiguration';
import VisualizationTypeConfiguration from './VisualizationTypeConfiguration';
import FilterConfiguration from './FilterConfiguration';
import StyleConfiguration from './StyleConfiguration';
import TitleConfiguration from './TitleConfiguration';
import PreviewWidget from './PreviewWidget';

const steps = ['Fonte de Dados', 'Tipo de Visualização', 'Filtros', 'Estilo', 'Título e Descrição'];

/**
 * Widget Configurator component
 * Provides a step-by-step interface for creating and editing widgets
 */
const WidgetConfigurator = ({
  open,
  onClose,
  onSave,
  initialWidget = null,
  availableDataSources = [],
  availableWidgetTypes = []
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  // Widget configuration state
  const [activeStep, setActiveStep] = useState(0);
  const [widget, setWidget] = useState({
    id: initialWidget?.id || null,
    type: initialWidget?.type || 'bar',
    title: initialWidget?.title || '',
    description: initialWidget?.description || '',
    dataSource: initialWidget?.dataSource || {
      type: 'meta', // meta, google, database, etc.
      config: {}
    },
    dimensions: initialWidget?.dimensions || [],
    metrics: initialWidget?.metrics || [],
    filters: initialWidget?.filters || [],
    settings: initialWidget?.settings || {
      appearance: {
        showTitle: true,
        showDescription: true,
        colorTheme: 'default',
        transparent: false,
        shadow: 'medium',
        borderRadius: 'medium'
      },
      display: {}
    },
    refreshInterval: initialWidget?.refreshInterval || 0
  });
  
  // Preview state
  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  
  // Reset when dialog opens or initial widget changes
  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setWidget(initialWidget ? { ...initialWidget } : {
        type: 'bar',
        title: '',
        description: '',
        dataSource: {
          type: 'meta',
          config: {}
        },
        dimensions: [],
        metrics: [],
        filters: [],
        settings: {
          appearance: {
            showTitle: true,
            showDescription: true,
            colorTheme: 'default',
            transparent: false,
            shadow: 'medium',
            borderRadius: 'medium'
          },
          display: {}
        },
        refreshInterval: 0
      });
      setPreviewData(null);
      setPreviewError(null);
    }
  }, [open, initialWidget]);
  
  // Handle next button click
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    
    // If moving to preview step, fetch preview data
    if (activeStep === steps.length - 1) {
      fetchPreviewData();
    }
  };
  
  // Handle back button click
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Fetch preview data
  const fetchPreviewData = async () => {
    setPreviewLoading(true);
    setPreviewError(null);
    
    try {
      // This would be an API call in the actual implementation
      // For now, we'll mock some data based on the widget type
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data based on widget type
      let mockData;
      
      switch (widget.type) {
        case 'bar':
        case 'line':
          mockData = [
            { name: 'Janeiro', value: 400 },
            { name: 'Fevereiro', value: 300 },
            { name: 'Março', value: 600 },
            { name: 'Abril', value: 800 },
            { name: 'Maio', value: 500 }
          ];
          break;
        case 'pie':
          mockData = [
            { name: 'Facebook', value: 400 },
            { name: 'Instagram', value: 300 },
            { name: 'Google', value: 200 },
            { name: 'Twitter', value: 100 }
          ];
          break;
        case 'metric':
          mockData = {
            value: 12500,
            previousValue: 10000,
            trend: 'up',
            percentage: 25
          };
          break;
        case 'table':
          mockData = [
            { id: 1, campaign: 'Campanha 1', impressions: 12500, clicks: 450, conversions: 25 },
            { id: 2, campaign: 'Campanha 2', impressions: 8700, clicks: 320, conversions: 18 },
            { id: 3, campaign: 'Campanha 3', impressions: 15200, clicks: 510, conversions: 32 }
          ];
          break;
        case 'map':
          mockData = [
            { name: 'São Paulo', location: [-23.5505, -46.6333], value: 500 },
            { name: 'Rio de Janeiro', location: [-22.9068, -43.1729], value: 350 },
            { name: 'Belo Horizonte', location: [-19.9167, -43.9345], value: 200 },
            { name: 'Salvador', location: [-12.9714, -38.5014], value: 150 }
          ];
          break;
        default:
          mockData = [];
      }
      
      setPreviewData(mockData);
    } catch (error) {
      console.error('Error fetching preview data:', error);
      setPreviewError('Erro ao carregar dados de pré-visualização');
    } finally {
      setPreviewLoading(false);
    }
  };
  
  // Update widget configuration
  const updateWidget = (path, value) => {
    setWidget(prev => {
      const newWidget = { ...prev };
      
      // Handle nested paths like 'settings.appearance.colorTheme'
      if (path.includes('.')) {
        const pathParts = path.split('.');
        let current = newWidget;
        
        // Navigate to the second last part of the path
        for (let i = 0; i < pathParts.length - 1; i++) {
          // Create object if it doesn't exist
          if (!current[pathParts[i]]) {
            current[pathParts[i]] = {};
          }
          current = current[pathParts[i]];
        }
        
        // Set the value at the final path
        current[pathParts[pathParts.length - 1]] = value;
      } else {
        // For top-level properties
        newWidget[path] = value;
      }
      
      return newWidget;
    });
  };
  
  // Handle save button click
  const handleSave = () => {
    // Call the onSave callback with the configured widget
    onSave(widget);
    onClose();
  };
  
  // Render the current step
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <DataSourceConfiguration
            widget={widget}
            onChange={updateWidget}
            availableDataSources={availableDataSources}
          />
        );
      case 1:
        return (
          <VisualizationTypeConfiguration
            widget={widget}
            onChange={updateWidget}
            availableWidgetTypes={availableWidgetTypes}
          />
        );
      case 2:
        return (
          <FilterConfiguration
            widget={widget}
            onChange={updateWidget}
          />
        );
      case 3:
        return (
          <StyleConfiguration
            widget={widget}
            onChange={updateWidget}
          />
        );
      case 4:
        return (
          <TitleConfiguration
            widget={widget}
            onChange={updateWidget}
          />
        );
      default:
        return (
          <PreviewWidget
            widget={widget}
            data={previewData}
            loading={previewLoading}
            error={previewError}
            onRefresh={fetchPreviewData}
          />
        );
    }
  };
  
  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      open={open}
      onClose={onClose}
      aria-labelledby="widget-configurator-dialog"
    >
      <DialogTitle id="widget-configurator-dialog">
        {initialWidget ? 'Editar Widget' : 'Novo Widget'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
            <Step>
              <StepLabel>Pré-visualização</StepLabel>
            </Step>
          </Stepper>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3,
              minHeight: 300,
              bgcolor: 'background.default',
              borderRadius: 1
            }}
          >
            {getStepContent(activeStep)}
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Voltar
        </Button>
        {activeStep === steps.length ? (
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSave}
          >
            Salvar
          </Button>
        ) : (
          <Button 
            variant="contained" 
            onClick={handleNext}
          >
            {activeStep === steps.length - 1 ? 'Pré-visualizar' : 'Próximo'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

WidgetConfigurator.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialWidget: PropTypes.object,
  availableDataSources: PropTypes.array,
  availableWidgetTypes: PropTypes.array
};

export default WidgetConfigurator;
