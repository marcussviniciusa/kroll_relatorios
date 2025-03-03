import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Autocomplete,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
  Card,
  CardContent,
  Tooltip,
  IconButton
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * Meta API Configuration Fields component
 * Allows configuring Meta (Facebook) API data source settings
 */
const MetaApiFields = ({
  config,
  onChange
}) => {
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [availableAccounts, setAvailableAccounts] = useState([]);
  const [availableCampaigns, setAvailableCampaigns] = useState([]);
  
  // Extract config values with defaults
  const {
    accessToken = '',
    accountId = '',
    datePreset = 'last_30d',
    includeDeleted = false,
    useCaching = true,
    level = 'campaign',
    campaigns = [],
    adSets = [],
    timePeriod = {
      since: '',
      until: ''
    }
  } = config;
  
  // Date presets available in Meta API
  const datePresets = [
    { value: 'today', label: 'Hoje' },
    { value: 'yesterday', label: 'Ontem' },
    { value: 'this_month', label: 'Este mês' },
    { value: 'last_month', label: 'Mês passado' },
    { value: 'this_quarter', label: 'Este trimestre' },
    { value: 'last_3d', label: 'Últimos 3 dias' },
    { value: 'last_7d', label: 'Últimos 7 dias' },
    { value: 'last_14d', label: 'Últimos 14 dias' },
    { value: 'last_28d', label: 'Últimos 28 dias' },
    { value: 'last_30d', label: 'Últimos 30 dias' },
    { value: 'last_90d', label: 'Últimos 90 dias' },
    { value: 'last_quarter', label: 'Último trimestre' },
    { value: 'last_year', label: 'Último ano' },
    { value: 'this_year', label: 'Este ano' },
    { value: 'lifetime', label: 'Todo o período' }
  ];
  
  // Report levels available in Meta API
  const reportLevels = [
    { value: 'account', label: 'Conta' },
    { value: 'campaign', label: 'Campanha' },
    { value: 'adset', label: 'Conjunto de Anúncios' },
    { value: 'ad', label: 'Anúncio' }
  ];
  
  // Fetch available accounts when access token changes
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!accessToken) {
        setAvailableAccounts([]);
        return;
      }
      
      setLoading(true);
      
      try {
        // In a real implementation, this would make an API call to Meta
        // For now, we'll simulate the response
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setAvailableAccounts([
          { id: 'act_123456789', name: 'Conta Principal de Marketing' },
          { id: 'act_987654321', name: 'Conta Secundária de Marketing' },
          { id: 'act_456789123', name: 'Conta de Testes' }
        ]);
        
        setConnectionStatus({
          success: true,
          message: 'Conexão estabelecida com sucesso'
        });
      } catch (error) {
        console.error('Error fetching accounts:', error);
        setConnectionStatus({
          success: false,
          message: 'Erro ao buscar contas: ' + error.message
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAccounts();
  }, [accessToken]);
  
  // Fetch available campaigns when account changes
  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!accessToken || !accountId) {
        setAvailableCampaigns([]);
        return;
      }
      
      try {
        // In a real implementation, this would make an API call to Meta
        // For now, we'll simulate the response
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setAvailableCampaigns([
          { id: '6273849501', name: 'Campanha de Conversão - Produto A' },
          { id: '6273849502', name: 'Campanha de Tráfego - Blog' },
          { id: '6273849503', name: 'Remarketing - Clientes Existentes' },
          { id: '6273849504', name: 'Campanha de Alcance - Marca' },
          { id: '6273849505', name: 'Conversão - Produto B' }
        ]);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };
    
    fetchCampaigns();
  }, [accessToken, accountId]);
  
  // Handle config field change
  const handleConfigChange = (field, value) => {
    const updatedConfig = { ...config };
    
    // Handle nested fields using path notation (e.g., 'timePeriod.since')
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updatedConfig[parent] = {
        ...updatedConfig[parent],
        [child]: value
      };
    } else {
      updatedConfig[field] = value;
    }
    
    onChange(updatedConfig);
  };
  
  // Test connection
  const handleTestConnection = async () => {
    if (!accessToken) return;
    
    setTestingConnection(true);
    setConnectionStatus(null);
    
    try {
      // In a real implementation, this would make an API call to Meta
      // For now, we'll simulate the response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success
      setConnectionStatus({
        success: true,
        message: 'Conexão estabelecida com sucesso'
      });
    } catch (error) {
      console.error('Error testing connection:', error);
      setConnectionStatus({
        success: false,
        message: 'Erro ao testar conexão: ' + error.message
      });
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Configuração da API do Meta (Facebook)
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Access Token"
            value={accessToken}
            onChange={(e) => handleConfigChange('accessToken', e.target.value)}
            placeholder="EAABsbCS1LpIBA..."
            type="password"
            helperText={
              <span>
                Token de acesso à API do Facebook. 
                <Tooltip title="Você pode obter um access token no Facebook for Developers. Certifique-se de incluir as permissões: ads_read, ads_management, business_management">
                  <HelpOutlineIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'text-bottom' }} />
                </Tooltip>
              </span>
            }
          />
        </Grid>
        
        <Grid item xs={12} sm={8}>
          <FormControl fullWidth>
            <InputLabel id="account-id-label">Conta de Anúncios</InputLabel>
            <Select
              labelId="account-id-label"
              id="account-id"
              value={accountId}
              label="Conta de Anúncios"
              onChange={(e) => handleConfigChange('accountId', e.target.value)}
              disabled={loading || !accessToken}
            >
              {availableAccounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name} ({account.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleTestConnection}
            disabled={testingConnection || !accessToken}
            startIcon={testingConnection ? <CircularProgress size={20} /> : <RefreshIcon />}
            sx={{ height: '56px' }}
          >
            {testingConnection ? 'Testando...' : 'Testar Conexão'}
          </Button>
        </Grid>
        
        {connectionStatus && (
          <Grid item xs={12}>
            <Alert 
              severity={connectionStatus.success ? 'success' : 'error'}
              icon={connectionStatus.success ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />}
            >
              {connectionStatus.message}
            </Alert>
          </Grid>
        )}
        
        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="date-preset-label">Período Predefinido</InputLabel>
            <Select
              labelId="date-preset-label"
              id="date-preset"
              value={datePreset}
              label="Período Predefinido"
              onChange={(e) => handleConfigChange('datePreset', e.target.value)}
            >
              {datePresets.map((preset) => (
                <MenuItem key={preset.value} value={preset.value}>
                  {preset.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="level-label">Nível do Relatório</InputLabel>
            <Select
              labelId="level-label"
              id="level"
              value={level}
              label="Nível do Relatório"
              onChange={(e) => handleConfigChange('level', e.target.value)}
            >
              {reportLevels.map((level) => (
                <MenuItem key={level.value} value={level.value}>
                  {level.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          {datePreset === 'custom' && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data Inicial"
                  type="date"
                  value={timePeriod.since}
                  onChange={(e) => handleConfigChange('timePeriod.since', e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data Final"
                  type="date"
                  value={timePeriod.until}
                  onChange={(e) => handleConfigChange('timePeriod.until', e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          )}
        </Grid>
        
        {level !== 'account' && (
          <Grid item xs={12}>
            <Autocomplete
              multiple
              id="campaigns-selector"
              options={availableCampaigns}
              value={availableCampaigns.filter(campaign => campaigns.includes(campaign.id))}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, newValue) => {
                handleConfigChange('campaigns', newValue.map(item => item.id));
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Campanhas"
                  placeholder="Selecione campanhas"
                  helperText="Deixe em branco para incluir todas"
                />
              )}
              disabled={!accountId || loading}
            />
          </Grid>
        )}
        
        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={includeDeleted}
                onChange={(e) => handleConfigChange('includeDeleted', e.target.checked)}
              />
            }
            label="Incluir itens excluídos"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={useCaching}
                onChange={(e) => handleConfigChange('useCaching', e.target.checked)}
              />
            }
            label="Usar cache para melhorar desempenho"
          />
        </Grid>
      </Grid>
      
      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 2 }}>
        * As configurações acima definirão como os dados são obtidos da API do Meta (Facebook) para este widget.
      </Typography>
    </Box>
  );
};

MetaApiFields.propTypes = {
  config: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default MetaApiFields;
