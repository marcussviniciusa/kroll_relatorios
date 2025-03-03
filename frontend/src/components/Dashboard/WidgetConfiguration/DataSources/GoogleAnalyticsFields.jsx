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
  Divider,
  Tooltip,
  IconButton,
  FormControlLabel,
  Switch,
  FormHelperText,
  Card,
  CardContent,
  Tab,
  Tabs
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CodeIcon from '@mui/icons-material/Code';

/**
 * Google Analytics Fields component
 * Allows configuring Google Analytics 4 data source settings
 */
const GoogleAnalyticsFields = ({
  config,
  onChange
}) => {
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [availableProperties, setAvailableProperties] = useState([]);
  const [metadataLoaded, setMetadataLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // Extract config values with defaults
  const {
    serviceAccountCredentials = '',
    propertyId = '',
    dateRangeType = 'last30days',
    customDateRange = {
      startDate: '',
      endDate: ''
    },
    metrics = [],
    dimensions = [],
    orderBy = [],
    rowLimit = 10000,
    offset = 0,
    useServiceAccount = true,
    keepEmptyRows = false
  } = config;
  
  // Date range options available in GA4
  const dateRangeOptions = [
    { value: 'today', label: 'Hoje' },
    { value: 'yesterday', label: 'Ontem' },
    { value: 'last7days', label: 'Últimos 7 dias' },
    { value: 'last14days', label: 'Últimos 14 dias' },
    { value: 'last28days', label: 'Últimos 28 dias' },
    { value: 'last30days', label: 'Últimos 30 dias' },
    { value: 'last90days', label: 'Últimos 90 dias' },
    { value: 'thisWeek', label: 'Esta semana' },
    { value: 'lastWeek', label: 'Semana passada' },
    { value: 'thisMonth', label: 'Este mês' },
    { value: 'lastMonth', label: 'Mês passado' },
    { value: 'thisYear', label: 'Este ano' },
    { value: 'lastYear', label: 'Ano passado' },
    { value: 'custom', label: 'Personalizado' }
  ];
  
  // Common GA4 dimensions
  const commonDimensions = [
    { name: 'date', displayName: 'Data' },
    { name: 'deviceCategory', displayName: 'Categoria de Dispositivo' },
    { name: 'country', displayName: 'País' },
    { name: 'region', displayName: 'Região' },
    { name: 'city', displayName: 'Cidade' },
    { name: 'browser', displayName: 'Navegador' },
    { name: 'operatingSystem', displayName: 'Sistema Operacional' },
    { name: 'landingPage', displayName: 'Página de Entrada' },
    { name: 'exitPage', displayName: 'Página de Saída' },
    { name: 'pageTitle', displayName: 'Título da Página' },
    { name: 'pagePath', displayName: 'Caminho da Página' },
    { name: 'source', displayName: 'Fonte' },
    { name: 'medium', displayName: 'Meio' },
    { name: 'campaign', displayName: 'Campanha' },
    { name: 'channelGrouping', displayName: 'Agrupamento de Canais' }
  ];
  
  // Common GA4 metrics
  const commonMetrics = [
    { name: 'sessions', displayName: 'Sessões' },
    { name: 'totalUsers', displayName: 'Total de Usuários' },
    { name: 'newUsers', displayName: 'Novos Usuários' },
    { name: 'activeUsers', displayName: 'Usuários Ativos' },
    { name: 'screenPageViews', displayName: 'Visualizações de Página' },
    { name: 'screenPageViewsPerSession', displayName: 'Visualizações por Sessão' },
    { name: 'averageSessionDuration', displayName: 'Duração Média da Sessão' },
    { name: 'bounceRate', displayName: 'Taxa de Rejeição' },
    { name: 'engagementRate', displayName: 'Taxa de Engajamento' },
    { name: 'conversions', displayName: 'Conversões' },
    { name: 'eventsPerSession', displayName: 'Eventos por Sessão' },
    { name: 'totalRevenue', displayName: 'Receita Total' },
    { name: 'transactionsPerPurchaser', displayName: 'Transações por Comprador' },
    { name: 'purchaseToViewRate', displayName: 'Taxa de Compra por Visualização' }
  ];
  
  // Fetch available properties when credentials change
  useEffect(() => {
    const fetchProperties = async () => {
      if (!serviceAccountCredentials && useServiceAccount) {
        setAvailableProperties([]);
        return;
      }
      
      setLoading(true);
      
      try {
        // In a real implementation, this would make an API call to Google Analytics
        // For now, we'll simulate the response
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setAvailableProperties([
          { id: '123456789', name: 'Website Principal' },
          { id: '987654321', name: 'E-commerce' },
          { id: '456789123', name: 'Blog' }
        ]);
        
        setConnectionStatus({
          success: true,
          message: 'Conexão estabelecida com sucesso'
        });
        
        setMetadataLoaded(true);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setConnectionStatus({
          success: false,
          message: 'Erro ao buscar propriedades: ' + error.message
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [serviceAccountCredentials, useServiceAccount]);
  
  // Handle config field change
  const handleConfigChange = (field, value) => {
    const updatedConfig = { ...config };
    
    // Handle nested fields using path notation (e.g., 'customDateRange.startDate')
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
    if ((!serviceAccountCredentials && useServiceAccount) || (!propertyId)) return;
    
    setTestingConnection(true);
    setConnectionStatus(null);
    
    try {
      // In a real implementation, this would make an API call to Google Analytics
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
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Configuração do Google Analytics 4
      </Typography>
      
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="Conexão" />
        <Tab label="Métricas e Dimensões" />
        <Tab label="Opções Avançadas" />
      </Tabs>
      
      {activeTab === 0 && (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={useServiceAccount}
                    onChange={(e) => handleConfigChange('useServiceAccount', e.target.checked)}
                  />
                }
                label="Usar Conta de Serviço (recomendado)"
              />
              <FormHelperText>
                Utilizar uma conta de serviço oferece um método mais seguro e confiável para acessar a API do Google Analytics 4.
              </FormHelperText>
            </Grid>
            
            {useServiceAccount && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Credenciais da Conta de Serviço (JSON)"
                  value={serviceAccountCredentials}
                  onChange={(e) => handleConfigChange('serviceAccountCredentials', e.target.value)}
                  placeholder='{"type": "service_account", "project_id": "...", ...}'
                  multiline
                  rows={4}
                  helperText={
                    <span>
                      JSON de credenciais da conta de serviço. 
                      <Tooltip title="Você pode criar uma conta de serviço no Google Cloud Console e baixar as credenciais em formato JSON.">
                        <HelpOutlineIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'text-bottom' }} />
                      </Tooltip>
                    </span>
                  }
                />
              </Grid>
            )}
            
            <Grid item xs={12} sm={8}>
              <FormControl fullWidth>
                <InputLabel id="property-id-label">Propriedade GA4</InputLabel>
                <Select
                  labelId="property-id-label"
                  id="property-id"
                  value={propertyId}
                  label="Propriedade GA4"
                  onChange={(e) => handleConfigChange('propertyId', e.target.value)}
                  disabled={loading || (useServiceAccount && !serviceAccountCredentials)}
                >
                  {availableProperties.map((property) => (
                    <MenuItem key={property.id} value={property.id}>
                      {property.name} ({property.id})
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
                disabled={testingConnection || (useServiceAccount && !serviceAccountCredentials) || !propertyId}
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
                <InputLabel id="date-range-label">Intervalo de Datas</InputLabel>
                <Select
                  labelId="date-range-label"
                  id="date-range"
                  value={dateRangeType}
                  label="Intervalo de Datas"
                  onChange={(e) => handleConfigChange('dateRangeType', e.target.value)}
                >
                  {dateRangeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {dateRangeType === 'custom' && (
              <>
                <Grid item xs={12} sm={6}></Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Data Inicial"
                    type="date"
                    value={customDateRange.startDate}
                    onChange={(e) => handleConfigChange('customDateRange.startDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Data Final"
                    type="date"
                    value={customDateRange.endDate}
                    onChange={(e) => handleConfigChange('customDateRange.endDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      )}
      
      {activeTab === 1 && (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="dimensions-selector"
                options={commonDimensions}
                value={commonDimensions.filter(dimension => 
                  dimensions.includes(dimension.name)
                )}
                getOptionLabel={(option) => option.displayName}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                onChange={(event, newValue) => {
                  handleConfigChange('dimensions', newValue.map(item => item.name));
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.displayName}
                      {...getTagProps({ index })}
                      size="small"
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Dimensões"
                    placeholder="Selecione dimensões"
                    helperText="Categorias para segmentar seus dados"
                  />
                )}
                disabled={!propertyId || loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="metrics-selector"
                options={commonMetrics}
                value={commonMetrics.filter(metric => 
                  metrics.includes(metric.name)
                )}
                getOptionLabel={(option) => option.displayName}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                onChange={(event, newValue) => {
                  handleConfigChange('metrics', newValue.map(item => item.name));
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.displayName}
                      {...getTagProps({ index })}
                      size="small"
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Métricas"
                    placeholder="Selecione métricas"
                    helperText="Valores numéricos que deseja medir"
                  />
                )}
                disabled={!propertyId || loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Você também pode adicionar dimensões ou métricas personalizadas digitando seu nome completo, por exemplo: "customEvent:nome_do_evento".
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}
      
      {activeTab === 2 && (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Limite de Linhas"
                type="number"
                value={rowLimit}
                onChange={(e) => handleConfigChange('rowLimit', parseInt(e.target.value, 10))}
                InputProps={{ inputProps: { min: 1, max: 100000 } }}
                helperText="Número máximo de linhas a serem retornadas"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Deslocamento (Offset)"
                type="number"
                value={offset}
                onChange={(e) => handleConfigChange('offset', parseInt(e.target.value, 10))}
                InputProps={{ inputProps: { min: 0 } }}
                helperText="Quantidade de linhas para pular"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={keepEmptyRows}
                    onChange={(e) => handleConfigChange('keepEmptyRows', e.target.checked)}
                  />
                }
                label="Manter linhas vazias"
              />
              <FormHelperText>
                Incluir linhas que não possuem valores para as métricas selecionadas
              </FormHelperText>
            </Grid>
            
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Ordenação Personalizada
                  </Typography>
                  
                  <Typography variant="body2" color="textSecondary" paragraph>
                    A ordenação é aplicada usando as métricas e dimensões selecionadas. Por padrão, os resultados são ordenados pela primeira métrica em ordem decrescente.
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    startIcon={<CodeIcon />}
                    size="small"
                    onClick={() => {
                      // Adicionar interface para configuração de ordenação personalizada
                      // Em uma implementação real, abriria um diálogo ou expandiria opções
                    }}
                    sx={{ mt: 1 }}
                  >
                    Configurar Ordenação
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
      
      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 3 }}>
        * As configurações acima definirão como os dados são obtidos da API do Google Analytics 4 para este widget.
      </Typography>
    </Box>
  );
};

GoogleAnalyticsFields.propTypes = {
  config: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default GoogleAnalyticsFields;
