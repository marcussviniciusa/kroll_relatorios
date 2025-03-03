import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Autocomplete,
  Grid,
  FormHelperText,
  Divider,
  Alert,
  Button,
  CircularProgress
} from '@mui/material';
import MetaApiFields from './DataSources/MetaApiFields';
import GoogleAnalyticsFields from './DataSources/GoogleAnalyticsFields';
import DatabaseFields from './DataSources/DatabaseFields';

/**
 * Data Source Configuration component
 * Allows selecting and configuring data sources for widgets
 */
const DataSourceConfiguration = ({
  widget,
  onChange,
  availableDataSources = []
}) => {
  const [loading, setLoading] = useState(false);
  const [availableMetrics, setAvailableMetrics] = useState([]);
  const [availableDimensions, setAvailableDimensions] = useState([]);
  const [error, setError] = useState(null);
  
  // Default data sources if none provided
  const defaultDataSources = [
    { id: 'meta', name: 'Meta (Facebook)', icon: 'facebook' },
    { id: 'google', name: 'Google Analytics', icon: 'analytics' },
    { id: 'database', name: 'Banco de Dados', icon: 'database' }
  ];
  
  // Use provided data sources or default
  const dataSources = availableDataSources.length > 0 
    ? availableDataSources 
    : defaultDataSources;
  
  // Get the current data source configuration
  const dataSource = widget.dataSource || { type: 'meta', config: {} };
  
  // Load available metrics and dimensions when data source changes
  useEffect(() => {
    const fetchMetadata = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real implementation, this would fetch actual metadata from the API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data based on data source type
        if (dataSource.type === 'meta') {
          setAvailableMetrics([
            { id: 'impressions', name: 'Impressões', dataType: 'number' },
            { id: 'reach', name: 'Alcance', dataType: 'number' },
            { id: 'clicks', name: 'Cliques', dataType: 'number' },
            { id: 'spend', name: 'Gasto', dataType: 'currency' },
            { id: 'cpc', name: 'Custo por Clique', dataType: 'currency' },
            { id: 'cpm', name: 'Custo por 1000 Impressões', dataType: 'currency' },
            { id: 'frequency', name: 'Frequência', dataType: 'number' },
            { id: 'actions', name: 'Ações', dataType: 'number' },
            { id: 'conversions', name: 'Conversões', dataType: 'number' }
          ]);
          
          setAvailableDimensions([
            { id: 'campaign_name', name: 'Campanha', dataType: 'string' },
            { id: 'adset_name', name: 'Conjunto de Anúncios', dataType: 'string' },
            { id: 'ad_name', name: 'Anúncio', dataType: 'string' },
            { id: 'age', name: 'Faixa Etária', dataType: 'string' },
            { id: 'gender', name: 'Gênero', dataType: 'string' },
            { id: 'country', name: 'País', dataType: 'string' },
            { id: 'region', name: 'Região', dataType: 'string' },
            { id: 'publisher_platform', name: 'Plataforma', dataType: 'string' },
            { id: 'device_platform', name: 'Dispositivo', dataType: 'string' }
          ]);
        } else if (dataSource.type === 'google') {
          setAvailableMetrics([
            { id: 'activeUsers', name: 'Usuários Ativos', dataType: 'number' },
            { id: 'newUsers', name: 'Novos Usuários', dataType: 'number' },
            { id: 'sessions', name: 'Sessões', dataType: 'number' },
            { id: 'engagedSessions', name: 'Sessões Engajadas', dataType: 'number' },
            { id: 'screenPageViews', name: 'Visualizações de Página', dataType: 'number' },
            { id: 'conversions', name: 'Conversões', dataType: 'number' },
            { id: 'eventCount', name: 'Total de Eventos', dataType: 'number' },
            { id: 'averageSessionDuration', name: 'Duração Média da Sessão', dataType: 'time' },
            { id: 'bounceRate', name: 'Taxa de Rejeição', dataType: 'percentage' }
          ]);
          
          setAvailableDimensions([
            { id: 'date', name: 'Data', dataType: 'date' },
            { id: 'deviceCategory', name: 'Categoria de Dispositivo', dataType: 'string' },
            { id: 'city', name: 'Cidade', dataType: 'string' },
            { id: 'country', name: 'País', dataType: 'string' },
            { id: 'browser', name: 'Navegador', dataType: 'string' },
            { id: 'operatingSystem', name: 'Sistema Operacional', dataType: 'string' },
            { id: 'channelGrouping', name: 'Canal', dataType: 'string' },
            { id: 'source', name: 'Origem', dataType: 'string' },
            { id: 'medium', name: 'Meio', dataType: 'string' },
            { id: 'campaign', name: 'Campanha', dataType: 'string' }
          ]);
        } else if (dataSource.type === 'database') {
          setAvailableMetrics([
            { id: 'revenue', name: 'Receita', dataType: 'currency' },
            { id: 'orders', name: 'Pedidos', dataType: 'number' },
            { id: 'customers', name: 'Clientes', dataType: 'number' },
            { id: 'averageOrderValue', name: 'Valor Médio de Pedido', dataType: 'currency' },
            { id: 'conversionRate', name: 'Taxa de Conversão', dataType: 'percentage' }
          ]);
          
          setAvailableDimensions([
            { id: 'date', name: 'Data', dataType: 'date' },
            { id: 'product', name: 'Produto', dataType: 'string' },
            { id: 'category', name: 'Categoria', dataType: 'string' },
            { id: 'customer', name: 'Cliente', dataType: 'string' },
            { id: 'region', name: 'Região', dataType: 'string' },
            { id: 'paymentMethod', name: 'Método de Pagamento', dataType: 'string' },
            { id: 'shippingMethod', name: 'Método de Envio', dataType: 'string' }
          ]);
        }
      } catch (err) {
        console.error('Error fetching metadata:', err);
        setError('Erro ao carregar metadados da fonte de dados');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetadata();
  }, [dataSource.type]);
  
  // Handle data source type change
  const handleDataSourceTypeChange = (event) => {
    const newType = event.target.value;
    onChange('dataSource', { 
      type: newType, 
      config: {} // Reset config when changing data source type
    });
    
    // Reset metrics and dimensions
    onChange('metrics', []);
    onChange('dimensions', []);
  };
  
  // Handle data source config change
  const handleDataSourceConfigChange = (config) => {
    onChange('dataSource', {
      ...dataSource,
      config
    });
  };
  
  // Handle metrics selection change
  const handleMetricsChange = (event, newValues) => {
    onChange('metrics', newValues.map(metric => metric.id));
  };
  
  // Handle dimensions selection change
  const handleDimensionsChange = (event, newValues) => {
    onChange('dimensions', newValues.map(dimension => dimension.id));
  };
  
  // Render data source specific config fields
  const renderDataSourceConfig = () => {
    switch (dataSource.type) {
      case 'meta':
        return (
          <MetaApiFields
            config={dataSource.config}
            onChange={handleDataSourceConfigChange}
          />
        );
      case 'google':
        return (
          <GoogleAnalyticsFields
            config={dataSource.config}
            onChange={handleDataSourceConfigChange}
          />
        );
      case 'database':
        return (
          <DatabaseFields
            config={dataSource.config}
            onChange={handleDataSourceConfigChange}
          />
        );
      default:
        return null;
    }
  };
  
  // Get selected metrics and dimensions objects
  const selectedMetrics = availableMetrics.filter(metric => 
    widget.metrics && widget.metrics.includes(metric.id)
  );
  
  const selectedDimensions = availableDimensions.filter(dimension => 
    widget.dimensions && widget.dimensions.includes(dimension.id)
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Configurar Fonte de Dados
      </Typography>
      
      <Typography variant="body2" color="textSecondary" paragraph>
        Selecione a fonte de dados para seu widget e configure os parâmetros necessários.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="data-source-type-label">Fonte de Dados</InputLabel>
            <Select
              labelId="data-source-type-label"
              id="data-source-type"
              value={dataSource.type}
              label="Fonte de Dados"
              onChange={handleDataSourceTypeChange}
            >
              {dataSources.map((source) => (
                <MenuItem key={source.id} value={source.id}>
                  {source.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              A fonte de onde os dados serão obtidos
            </FormHelperText>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          {renderDataSourceConfig()}
        </Grid>
        
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Métricas e Dimensões
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    multiple
                    id="metrics-selector"
                    options={availableMetrics}
                    value={selectedMetrics}
                    getOptionLabel={(option) => option.name}
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
                        label="Métricas"
                        placeholder="Selecione métricas"
                        helperText="Valores numéricos a serem exibidos"
                      />
                    )}
                    onChange={handleMetricsChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    multiple
                    id="dimensions-selector"
                    options={availableDimensions}
                    value={selectedDimensions}
                    getOptionLabel={(option) => option.name}
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
                        label="Dimensões"
                        placeholder="Selecione dimensões"
                        helperText="Atributos para agrupar os dados"
                      />
                    )}
                    onChange={handleDimensionsChange}
                  />
                </Grid>
              </Grid>
              
              {(selectedMetrics.length === 0 || selectedDimensions.length === 0) && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Selecione pelo menos uma métrica e uma dimensão para continuar
                </Alert>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

DataSourceConfiguration.propTypes = {
  widget: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  availableDataSources: PropTypes.array
};

export default DataSourceConfiguration;
