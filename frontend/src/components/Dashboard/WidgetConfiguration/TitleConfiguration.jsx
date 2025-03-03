import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Slider,
  Tooltip,
  Divider
} from '@mui/material';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import TimerIcon from '@mui/icons-material/Timer';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

/**
 * Title Configuration component
 * Allows configuring the title, description, and refresh settings for a widget
 */
const TitleConfiguration = ({
  widget,
  onChange
}) => {
  // Handle title change
  const handleTitleChange = (event) => {
    onChange('title', event.target.value);
  };
  
  // Handle description change
  const handleDescriptionChange = (event) => {
    onChange('description', event.target.value);
  };
  
  // Handle refresh interval change
  const handleRefreshIntervalChange = (event, newValue) => {
    onChange('refreshInterval', newValue);
  };
  
  // Convert refreshInterval to human-readable text
  const refreshIntervalText = (value) => {
    if (value === 0) return 'Desativado';
    if (value < 60) return `${value} segundos`;
    if (value === 60) return '1 minuto';
    if (value < 3600) return `${Math.floor(value / 60)} minutos`;
    if (value === 3600) return '1 hora';
    return `${Math.floor(value / 3600)} horas`;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Título e Descrição
      </Typography>
      
      <Typography variant="body2" color="textSecondary" paragraph>
        Configure o título, descrição e atualização automática do widget.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Título do Widget"
              value={widget.title || ''}
              onChange={handleTitleChange}
              placeholder="Ex: Desempenho de Campanhas"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={widget.settings?.appearance?.showTitle !== false}
                  onChange={(e) => onChange('settings.appearance.showTitle', e.target.checked)}
                  sx={{ ml: 1 }}
                />
              }
              label="Exibir título"
              sx={{ mt: 1 }}
            />
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Descrição"
              value={widget.description || ''}
              onChange={handleDescriptionChange}
              placeholder="Ex: Mostra o desempenho das principais campanhas de marketing"
              multiline
              rows={3}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                    <DescriptionIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={widget.settings?.appearance?.showDescription !== false}
                  onChange={(e) => onChange('settings.appearance.showDescription', e.target.checked)}
                  sx={{ ml: 1 }}
                />
              }
              label="Exibir descrição"
              sx={{ mt: 1 }}
            />
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box>
            <Typography variant="subtitle1" gutterBottom display="flex" alignItems="center">
              Atualização Automática
              <Tooltip title="Define com que frequência o widget irá atualizar automaticamente seus dados.">
                <InfoOutlinedIcon fontSize="small" sx={{ ml: 1 }} />
              </Tooltip>
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TimerIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2">
                Intervalo de atualização: <strong>{refreshIntervalText(widget.refreshInterval || 0)}</strong>
              </Typography>
            </Box>
            
            <Slider
              value={widget.refreshInterval || 0}
              onChange={handleRefreshIntervalChange}
              step={null}
              marks={[
                { value: 0, label: 'Desativado' },
                { value: 30, label: '30s' },
                { value: 60, label: '1m' },
                { value: 300, label: '5m' },
                { value: 900, label: '15m' },
                { value: 1800, label: '30m' },
                { value: 3600, label: '1h' }
              ]}
              min={0}
              max={3600}
              valueLabelDisplay="auto"
              valueLabelFormat={refreshIntervalText}
            />
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="widget-size-label">Tamanho do Widget</InputLabel>
              <Select
                labelId="widget-size-label"
                id="widget-size"
                value={widget.size || 'medium'}
                label="Tamanho do Widget"
                onChange={(e) => onChange('size', e.target.value)}
              >
                <MenuItem value="small">Pequeno (1x1)</MenuItem>
                <MenuItem value="medium">Médio (2x1)</MenuItem>
                <MenuItem value="large">Grande (2x2)</MenuItem>
                <MenuItem value="wide">Largo (4x1)</MenuItem>
                <MenuItem value="tall">Alto (1x2)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              height: '100%',
              minHeight: 300,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 1,
              bgcolor: 'background.paper'
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Pré-visualização
            </Typography>
            
            <Paper
              variant="outlined"
              sx={{
                flex: 1,
                mt: 1,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 1
              }}
            >
              {widget.settings?.appearance?.showTitle !== false && (
                <Typography variant="h6" gutterBottom>
                  {widget.title || 'Título do Widget'}
                </Typography>
              )}
              
              {widget.settings?.appearance?.showDescription !== false && (
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {widget.description || 'Descrição do widget com informações relevantes para o usuário.'}
                </Typography>
              )}
              
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'action.hover',
                  borderRadius: 1
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  Conteúdo do Widget
                </Typography>
              </Box>
              
              {widget.refreshInterval > 0 && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'flex-end',
                    mt: 1
                  }}
                >
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimerIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                    Atualiza a cada {refreshIntervalText(widget.refreshInterval)}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

TitleConfiguration.propTypes = {
  widget: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default TitleConfiguration;
