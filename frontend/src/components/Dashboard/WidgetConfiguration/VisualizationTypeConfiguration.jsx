import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Alert
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import SpeedIcon from '@mui/icons-material/Speed';
import MapIcon from '@mui/icons-material/Map';

/**
 * Visualization Type Configuration component
 * Allows selecting and configuring the visualization type for widgets
 */
const VisualizationTypeConfiguration = ({
  widget,
  onChange,
  availableWidgetTypes = []
}) => {
  // Default widget types if none provided
  const defaultWidgetTypes = [
    { id: 'bar', name: 'Gráfico de Barras', icon: BarChartIcon, description: 'Comparação de valores entre categorias' },
    { id: 'line', name: 'Gráfico de Linha', icon: ShowChartIcon, description: 'Tendências ao longo do tempo' },
    { id: 'pie', name: 'Gráfico de Pizza', icon: PieChartIcon, description: 'Distribuição proporcional' },
    { id: 'table', name: 'Tabela', icon: TableChartIcon, description: 'Dados detalhados em formato tabular' },
    { id: 'metric', name: 'Cartão de Métrica', icon: SpeedIcon, description: 'Exibição de valor único com tendência' },
    { id: 'map', name: 'Mapa', icon: MapIcon, description: 'Visualização geográfica de dados' }
  ];
  
  // Use provided widget types or default
  const widgetTypes = availableWidgetTypes.length > 0 
    ? availableWidgetTypes 
    : defaultWidgetTypes;
  
  // Handle widget type change
  const handleWidgetTypeChange = (type) => {
    onChange('type', type);
    
    // Update display settings based on widget type
    const updatedSettings = { ...widget.settings };
    
    switch (type) {
      case 'bar':
        updatedSettings.display = {
          ...(updatedSettings.display || {}),
          showLegend: true,
          showGrid: true,
          showTooltip: true,
          orientation: 'vertical',
          stacked: false
        };
        break;
      case 'line':
        updatedSettings.display = {
          ...(updatedSettings.display || {}),
          showLegend: true,
          showGrid: true,
          showTooltip: true,
          showArea: false,
          connectNulls: true,
          curveType: 'linear'
        };
        break;
      case 'pie':
        updatedSettings.display = {
          ...(updatedSettings.display || {}),
          showLegend: true,
          showTooltip: true,
          showLabels: true,
          innerRadius: 0, // 0 for pie, >0 for donut
          explodeSlices: false
        };
        break;
      case 'table':
        updatedSettings.display = {
          ...(updatedSettings.display || {}),
          showPagination: true,
          pageSizeOptions: [5, 10, 25],
          defaultPageSize: 10,
          sortable: true,
          filterable: true
        };
        break;
      case 'metric':
        updatedSettings.display = {
          ...(updatedSettings.display || {}),
          showTrend: true,
          showPercentage: true,
          showIcon: true,
          compactNumber: true
        };
        break;
      case 'map':
        updatedSettings.display = {
          ...(updatedSettings.display || {}),
          showTooltip: true,
          showLegend: true,
          showZoomControls: true,
          defaultZoom: 5
        };
        break;
      default:
        // No specific settings
    }
    
    onChange('settings', updatedSettings);
  };
  
  // Handle display settings change
  const handleDisplaySettingChange = (setting, value) => {
    onChange(`settings.display.${setting}`, value);
  };
  
  // Render type-specific config options
  const renderTypeSpecificOptions = () => {
    switch (widget.type) {
      case 'bar':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="bar-orientation-label">Orientação</InputLabel>
                <Select
                  labelId="bar-orientation-label"
                  id="bar-orientation"
                  value={widget.settings?.display?.orientation || 'vertical'}
                  label="Orientação"
                  onChange={(e) => handleDisplaySettingChange('orientation', e.target.value)}
                >
                  <MenuItem value="vertical">Vertical</MenuItem>
                  <MenuItem value="horizontal">Horizontal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={widget.settings?.display?.stacked || false}
                    onChange={(e) => handleDisplaySettingChange('stacked', e.target.checked)}
                  />
                }
                label="Barras empilhadas"
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={widget.settings?.display?.showGrid || true}
                    onChange={(e) => handleDisplaySettingChange('showGrid', e.target.checked)}
                  />
                }
                label="Mostrar grade"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={widget.settings?.display?.showLegend || true}
                    onChange={(e) => handleDisplaySettingChange('showLegend', e.target.checked)}
                  />
                }
                label="Mostrar legenda"
              />
            </Grid>
          </Grid>
        );
      
      case 'line':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="curve-type-label">Tipo de Curva</InputLabel>
                <Select
                  labelId="curve-type-label"
                  id="curve-type"
                  value={widget.settings?.display?.curveType || 'linear'}
                  label="Tipo de Curva"
                  onChange={(e) => handleDisplaySettingChange('curveType', e.target.value)}
                >
                  <MenuItem value="linear">Linear</MenuItem>
                  <MenuItem value="natural">Natural</MenuItem>
                  <MenuItem value="monotone">Monotônica</MenuItem>
                  <MenuItem value="step">Degrau</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={widget.settings?.display?.showArea || false}
                    onChange={(e) => handleDisplaySettingChange('showArea', e.target.checked)}
                  />
                }
                label="Preencher área"
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={widget.settings?.display?.connectNulls || true}
                    onChange={(e) => handleDisplaySettingChange('connectNulls', e.target.checked)}
                  />
                }
                label="Conectar valores nulos"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={widget.settings?.display?.showGrid || true}
                    onChange={(e) => handleDisplaySettingChange('showGrid', e.target.checked)}
                  />
                }
                label="Mostrar grade"
              />
            </Grid>
          </Grid>
        );
      
      case 'pie':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="inner-radius-label">Tipo</InputLabel>
                <Select
                  labelId="inner-radius-label"
                  id="inner-radius"
                  value={widget.settings?.display?.innerRadius > 0 ? 'donut' : 'pie'}
                  label="Tipo"
                  onChange={(e) => handleDisplaySettingChange('innerRadius', e.target.value === 'donut' ? 60 : 0)}
                >
                  <MenuItem value="pie">Pizza</MenuItem>
                  <MenuItem value="donut">Rosca</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={widget.settings?.display?.explodeSlices || false}
                    onChange={(e) => handleDisplaySettingChange('explodeSlices', e.target.checked)}
                  />
                }
                label="Destacar fatias"
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={widget.settings?.display?.showLabels || true}
                    onChange={(e) => handleDisplaySettingChange('showLabels', e.target.checked)}
                  />
                }
                label="Mostrar rótulos"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={widget.settings?.display?.showLegend || true}
                    onChange={(e) => handleDisplaySettingChange('showLegend', e.target.checked)}
                  />
                }
                label="Mostrar legenda"
              />
            </Grid>
          </Grid>
        );
        
      case 'table':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={widget.settings?.display?.showPagination || true}
                    onChange={(e) => handleDisplaySettingChange('showPagination', e.target.checked)}
                  />
                }
                label="Mostrar paginação"
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={widget.settings?.display?.sortable || true}
                    onChange={(e) => handleDisplaySettingChange('sortable', e.target.checked)}
                  />
                }
                label="Permitir ordenação"
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={widget.settings?.display?.filterable || true}
                    onChange={(e) => handleDisplaySettingChange('filterable', e.target.checked)}
                  />
                }
                label="Permitir filtragem"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="page-size-label">Linhas por página</InputLabel>
                <Select
                  labelId="page-size-label"
                  id="page-size"
                  value={widget.settings?.display?.defaultPageSize || 10}
                  label="Linhas por página"
                  onChange={(e) => handleDisplaySettingChange('defaultPageSize', e.target.value)}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
        
      case 'metric':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={widget.settings?.display?.showTrend || true}
                    onChange={(e) => handleDisplaySettingChange('showTrend', e.target.checked)}
                  />
                }
                label="Mostrar tendência"
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={widget.settings?.display?.showPercentage || true}
                    onChange={(e) => handleDisplaySettingChange('showPercentage', e.target.checked)}
                  />
                }
                label="Mostrar percentual"
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={widget.settings?.display?.showIcon || true}
                    onChange={(e) => handleDisplaySettingChange('showIcon', e.target.checked)}
                  />
                }
                label="Mostrar ícone"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={widget.settings?.display?.compactNumber || true}
                    onChange={(e) => handleDisplaySettingChange('compactNumber', e.target.checked)}
                  />
                }
                label="Números compactos"
              />
            </Grid>
          </Grid>
        );
      
      case 'map':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={widget.settings?.display?.showTooltip || true}
                    onChange={(e) => handleDisplaySettingChange('showTooltip', e.target.checked)}
                  />
                }
                label="Mostrar tooltip"
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={widget.settings?.display?.showZoomControls || true}
                    onChange={(e) => handleDisplaySettingChange('showZoomControls', e.target.checked)}
                  />
                }
                label="Controles de zoom"
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={widget.settings?.display?.showLegend || true}
                    onChange={(e) => handleDisplaySettingChange('showLegend', e.target.checked)}
                  />
                }
                label="Mostrar legenda"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="default-zoom-label">Zoom padrão</InputLabel>
                <Select
                  labelId="default-zoom-label"
                  id="default-zoom"
                  value={widget.settings?.display?.defaultZoom || 5}
                  label="Zoom padrão"
                  onChange={(e) => handleDisplaySettingChange('defaultZoom', e.target.value)}
                >
                  <MenuItem value={3}>Baixo (3)</MenuItem>
                  <MenuItem value={5}>Médio (5)</MenuItem>
                  <MenuItem value={8}>Alto (8)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      
      default:
        return null;
    }
  };
  
  // Check if the selected widget type is valid for the data
  const isWidgetTypeValid = () => {
    // For simplicity, we'll just check if we have metrics and dimensions
    // In a real implementation, we would check compatibility with data types
    const hasMetrics = widget.metrics && widget.metrics.length > 0;
    const hasDimensions = widget.dimensions && widget.dimensions.length > 0;
    
    if (!hasMetrics || !hasDimensions) {
      return false;
    }
    
    // Specific validations based on widget type
    switch (widget.type) {
      case 'metric':
        // Metric widget should have exactly one metric
        return widget.metrics.length === 1;
      default:
        return true;
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Tipo de Visualização
      </Typography>
      
      <Typography variant="body2" color="textSecondary" paragraph>
        Escolha como os dados serão visualizados. Cada tipo é otimizado para diferentes casos de uso.
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {widgetTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = widget.type === type.id;
          
          return (
            <Grid item xs={12} sm={6} md={4} key={type.id}>
              <Card 
                variant={isSelected ? "outlined" : "elevation"}
                sx={{ 
                  height: '100%',
                  border: isSelected ? `2px solid ${(theme) => theme.palette.primary.main}` : undefined,
                  bgcolor: isSelected ? 'action.selected' : undefined
                }}
              >
                <CardActionArea 
                  onClick={() => handleWidgetTypeChange(type.id)}
                  sx={{ height: '100%' }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Icon fontSize="large" color={isSelected ? "primary" : "action"} />
                    <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 500 }}>
                      {type.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {type.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      
      {widget.type && (
        <>
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Configurações de Visualização
          </Typography>
          
          {!isWidgetTypeValid() && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              O tipo de visualização selecionado pode não ser compatível com os dados escolhidos.
              {widget.type === 'metric' && widget.metrics?.length !== 1 && (
                <Typography variant="body2">
                  Cartões de métrica exigem exatamente uma métrica selecionada.
                </Typography>
              )}
            </Alert>
          )}
          
          {renderTypeSpecificOptions()}
        </>
      )}
    </Box>
  );
};

VisualizationTypeConfiguration.propTypes = {
  widget: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  availableWidgetTypes: PropTypes.array
};

export default VisualizationTypeConfiguration;
