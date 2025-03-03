import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Paper,
  Slider,
  Divider,
  Tabs,
  Tab,
  TextField,
  IconButton,
  Tooltip,
  Collapse
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import { alpha } from '@mui/material/styles';

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`style-tabpanel-${index}`}
      aria-labelledby={`style-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

/**
 * Style Configuration component
 * Allows configuring the visual style of widgets
 */
const StyleConfiguration = ({
  widget,
  onChange
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  
  // Extract settings with defaults
  const appearance = widget.settings?.appearance || {
    showTitle: true,
    showDescription: true,
    colorTheme: 'default',
    transparent: false,
    shadow: 'medium',
    borderRadius: 'medium'
  };
  
  // Color themes available in the application
  const colorThemes = [
    { id: 'default', name: 'Padrão', colors: ['#1976d2', '#dc004e', '#388e3c', '#f57c00', '#6d4c41'] },
    { id: 'pastel', name: 'Pastel', colors: ['#90caf9', '#f48fb1', '#a5d6a7', '#ffcc80', '#bcaaa4'] },
    { id: 'vibrant', name: 'Vibrante', colors: ['#2196f3', '#f50057', '#00c853', '#ff9100', '#8d6e63'] },
    { id: 'monochrome', name: 'Monocromático', colors: ['#212121', '#424242', '#616161', '#757575', '#9e9e9e'] },
    { id: 'corporate', name: 'Corporativo', colors: ['#0d47a1', '#1565c0', '#1976d2', '#1e88e5', '#2196f3'] }
  ];
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle appearance setting change
  const handleAppearanceChange = (setting, value) => {
    onChange(`settings.appearance.${setting}`, value);
  };
  
  // Get preview styles based on current settings
  const getPreviewStyles = () => {
    const styles = {
      borderRadius: getBorderRadiusValue(appearance.borderRadius),
      boxShadow: getShadowValue(appearance.shadow),
      backgroundColor: appearance.transparent ? 'transparent' : '#fff',
    };
    
    if (appearance.transparent) {
      styles.border = '1px dashed #ccc';
    }
    
    return styles;
  };
  
  // Convert shadow setting to actual CSS value
  const getShadowValue = (shadow) => {
    switch (shadow) {
      case 'none':
        return 'none';
      case 'light':
        return '0 2px 10px rgba(0, 0, 0, 0.05)';
      case 'strong':
        return '0 8px 30px rgba(0, 0, 0, 0.12)';
      case 'medium':
      default:
        return '0 4px 20px rgba(0, 0, 0, 0.08)';
    }
  };
  
  // Convert border radius setting to actual CSS value
  const getBorderRadiusValue = (borderRadius) => {
    switch (borderRadius) {
      case 'none':
        return '0px';
      case 'small':
        return '4px';
      case 'large':
        return '16px';
      case 'medium':
      default:
        return '8px';
    }
  };
  
  // Get the current color theme object
  const currentTheme = colorThemes.find(theme => theme.id === appearance.colorTheme) || colorThemes[0];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Estilo e Aparência
      </Typography>
      
      <Typography variant="body2" color="textSecondary" paragraph>
        Personalize a aparência visual do widget para se adequar ao seu dashboard.
      </Typography>
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="style configuration tabs"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab 
          icon={<FormatPaintIcon />} 
          label="Aparência" 
          id="style-tab-0"
          aria-controls="style-tabpanel-0"
        />
        <Tab 
          icon={<ColorLensIcon />} 
          label="Cores" 
          id="style-tab-1"
          aria-controls="style-tabpanel-1"
        />
      </Tabs>
      
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Visibilidade de Elementos
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={appearance.showTitle}
                    onChange={(e) => handleAppearanceChange('showTitle', e.target.checked)}
                  />
                }
                label="Mostrar título"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={appearance.showDescription}
                    onChange={(e) => handleAppearanceChange('showDescription', e.target.checked)}
                  />
                }
                label="Mostrar descrição"
              />
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Estilo do Contêiner
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={appearance.transparent}
                    onChange={(e) => handleAppearanceChange('transparent', e.target.checked)}
                  />
                }
                label="Fundo transparente"
              />
              
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="shadow-label">Sombra</InputLabel>
                <Select
                  labelId="shadow-label"
                  id="shadow-select"
                  value={appearance.shadow}
                  label="Sombra"
                  onChange={(e) => handleAppearanceChange('shadow', e.target.value)}
                  disabled={appearance.transparent}
                >
                  <MenuItem value="none">Nenhuma</MenuItem>
                  <MenuItem value="light">Leve</MenuItem>
                  <MenuItem value="medium">Média</MenuItem>
                  <MenuItem value="strong">Forte</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="border-radius-label">Bordas arredondadas</InputLabel>
                <Select
                  labelId="border-radius-label"
                  id="border-radius-select"
                  value={appearance.borderRadius}
                  label="Bordas arredondadas"
                  onChange={(e) => handleAppearanceChange('borderRadius', e.target.value)}
                >
                  <MenuItem value="none">Sem arredondamento</MenuItem>
                  <MenuItem value="small">Leve</MenuItem>
                  <MenuItem value="medium">Médio</MenuItem>
                  <MenuItem value="large">Forte</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box>
              <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="space-between"
                onClick={() => setAdvancedOpen(!advancedOpen)}
                sx={{ cursor: 'pointer' }}
              >
                <Typography variant="subtitle1">
                  Configurações Avançadas
                </Typography>
                <IconButton size="small">
                  {advancedOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
              
              <Collapse in={advancedOpen}>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Padding Interno (px)"
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 48 } }}
                    value={appearance.padding || 16}
                    onChange={(e) => handleAppearanceChange('padding', parseInt(e.target.value, 10))}
                    margin="normal"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={appearance.clipContent || false}
                        onChange={(e) => handleAppearanceChange('clipContent', e.target.checked)}
                      />
                    }
                    label="Ocultar conteúdo excedente"
                  />
                </Box>
              </Collapse>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Pré-visualização
            </Typography>
            
            <Paper
              sx={{
                height: 300,
                width: '100%',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                ...getPreviewStyles()
              }}
            >
              {appearance.showTitle && (
                <Typography variant="h6" gutterBottom>
                  Título do Widget
                </Typography>
              )}
              
              {appearance.showDescription && (
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Descrição do widget com informações relevantes para o usuário.
                </Typography>
              )}
              
              <Box 
                sx={{ 
                  flex: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: alpha(currentTheme.colors[0], 0.1),
                  borderRadius: 1
                }}
              >
                <Typography variant="body2" align="center">
                  Conteúdo do Widget
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Tema de Cores
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="color-theme-label">Tema de Cores</InputLabel>
              <Select
                labelId="color-theme-label"
                id="color-theme-select"
                value={appearance.colorTheme}
                label="Tema de Cores"
                onChange={(e) => handleAppearanceChange('colorTheme', e.target.value)}
              >
                {colorThemes.map((theme) => (
                  <MenuItem key={theme.id} value={theme.id}>
                    {theme.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Cores do tema selecionado
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1 }}>
                {currentTheme.colors.map((color, index) => (
                  <Tooltip key={index} title={color}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: color,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    />
                  </Tooltip>
                ))}
              </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Opções de Exibição
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={widget.settings?.display?.showGrid || true}
                  onChange={(e) => onChange('settings.display.showGrid', e.target.checked)}
                />
              }
              label="Exibir linhas de grade"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={widget.settings?.display?.showTooltip || true}
                  onChange={(e) => onChange('settings.display.showTooltip', e.target.checked)}
                />
              }
              label="Exibir tooltips"
            />
            
            {widget.type !== 'table' && widget.type !== 'metric' && (
              <FormControlLabel
                control={
                  <Switch
                    checked={widget.settings?.display?.showLegend || true}
                    onChange={(e) => onChange('settings.display.showLegend', e.target.checked)}
                  />
                }
                label="Exibir legenda"
              />
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Personalização Específica do Tipo
            </Typography>
            
            {widget.type === 'bar' && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Espaçamento entre Barras
                </Typography>
                <Slider
                  value={widget.settings?.display?.barGap || 0.2}
                  onChange={(e, newValue) => onChange('settings.display.barGap', newValue)}
                  min={0}
                  max={0.5}
                  step={0.05}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                  sx={{ mb: 3 }}
                />
              </>
            )}
            
            {widget.type === 'line' && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Espessura da Linha
                </Typography>
                <Slider
                  value={widget.settings?.display?.strokeWidth || 2}
                  onChange={(e, newValue) => onChange('settings.display.strokeWidth', newValue)}
                  min={1}
                  max={5}
                  step={0.5}
                  valueLabelDisplay="auto"
                  sx={{ mb: 3 }}
                />
              </>
            )}
            
            {widget.type === 'pie' && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Ângulo de Início (graus)
                </Typography>
                <Slider
                  value={widget.settings?.display?.startAngle || 0}
                  onChange={(e, newValue) => onChange('settings.display.startAngle', newValue)}
                  min={0}
                  max={360}
                  step={15}
                  valueLabelDisplay="auto"
                  sx={{ mb: 3 }}
                />
              </>
            )}
            
            {['bar', 'line', 'pie'].includes(widget.type) && (
              <FormControl fullWidth margin="normal">
                <InputLabel id="animation-label">Animação</InputLabel>
                <Select
                  labelId="animation-label"
                  id="animation-select"
                  value={widget.settings?.display?.animation || 'default'}
                  label="Animação"
                  onChange={(e) => onChange('settings.display.animation', e.target.value)}
                >
                  <MenuItem value="default">Padrão</MenuItem>
                  <MenuItem value="none">Nenhuma</MenuItem>
                  <MenuItem value="gentle">Suave</MenuItem>
                  <MenuItem value="wobbly">Oscilante</MenuItem>
                  <MenuItem value="stiff">Rápida</MenuItem>
                </Select>
              </FormControl>
            )}
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="empty-message-label">Mensagem Quando Vazio</InputLabel>
              <Select
                labelId="empty-message-label"
                id="empty-message-select"
                value={widget.settings?.display?.emptyMessage || 'default'}
                label="Mensagem Quando Vazio"
                onChange={(e) => onChange('settings.display.emptyMessage', e.target.value)}
              >
                <MenuItem value="default">Nenhum dado disponível</MenuItem>
                <MenuItem value="noData">Sem dados para exibir</MenuItem>
                <MenuItem value="noResults">Nenhum resultado encontrado</MenuItem>
                <MenuItem value="empty">Vazio</MenuItem>
                <MenuItem value="custom">Personalizado</MenuItem>
              </Select>
            </FormControl>
            
            {widget.settings?.display?.emptyMessage === 'custom' && (
              <TextField
                fullWidth
                label="Mensagem Personalizada"
                value={widget.settings?.display?.customEmptyMessage || ''}
                onChange={(e) => onChange('settings.display.customEmptyMessage', e.target.value)}
                margin="normal"
              />
            )}
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

StyleConfiguration.propTypes = {
  widget: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default StyleConfiguration;
