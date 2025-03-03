import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert, Tabs, Tab, Button } from '@mui/material';
import apiService from '../services/apiConfig';

// Componente para exibir os dados de integração em formato de tabela
const MetricsTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <Typography color="text.secondary">Nenhum dado disponível</Typography>;
  }

  // Agrupar métricas por nome para exibição
  const groupedMetrics = data.reduce((groups, item) => {
    if (!groups[item.name]) {
      groups[item.name] = [];
    }
    groups[item.name].push(item);
    return groups;
  }, {});

  return (
    <Box sx={{ mt: 2 }}>
      {Object.keys(groupedMetrics).map(metricName => (
        <Box key={metricName} sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            {metricName.replace(/_/g, ' ').toUpperCase()}
          </Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Data</th>
                  <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ddd' }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {groupedMetrics[metricName].map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{item.date}</td>
                    <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

// Componente principal para teste de integrações
const IntegrationsTester = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [metaIntegrations, setMetaIntegrations] = useState([]);
  const [gaIntegrations, setGaIntegrations] = useState([]);
  
  const [metaMetrics, setMetaMetrics] = useState([]);
  const [gaMetrics, setGaMetrics] = useState([]);

  // Carregar a lista de integrações disponíveis
  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setLoading(true);
        
        // Buscar integrações do Meta
        const metaResponse = await apiService.meta.getAll();
        setMetaIntegrations(metaResponse.integrations || []);
        
        // Buscar integrações do Google Analytics
        const gaResponse = await apiService.googleAnalytics.getAll();
        setGaIntegrations(gaResponse.integrations || []);
        
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar integrações:', err);
        setError('Não foi possível carregar as integrações. Por favor, tente novamente.');
        setLoading(false);
      }
    };

    fetchIntegrations();
  }, []);

  // Função para carregar métricas do Meta
  const loadMetaMetrics = async () => {
    if (metaIntegrations.length === 0) return;
    
    try {
      setLoading(true);
      const response = await apiService.meta.getMetrics(metaIntegrations[0].id, {
        period: 'last7days',
        metrics: 'page_impressions,page_engagement'
      });
      setMetaMetrics(response.metrics || []);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar métricas do Meta:', err);
      setError('Não foi possível carregar métricas do Meta. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  // Função para carregar métricas do Google Analytics
  const loadGaMetrics = async () => {
    if (gaIntegrations.length === 0) return;
    
    try {
      setLoading(true);
      const response = await apiService.googleAnalytics.getMetrics(gaIntegrations[0].id, {
        period: 'last7days',
        metrics: 'pageviews,sessions,users'
      });
      setGaMetrics(response.metrics || []);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar métricas do Google Analytics:', err);
      setError('Não foi possível carregar métricas do Google Analytics. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  // Mudança de abas
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    // Carregar os dados correspondentes quando mudar de aba
    if (newValue === 0 && metaMetrics.length === 0) {
      loadMetaMetrics();
    } else if (newValue === 1 && gaMetrics.length === 0) {
      loadGaMetrics();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Teste de Integrações
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Meta (Facebook)" />
          <Tab label="Google Analytics" />
        </Tabs>
      </Box>

      {/* Conteúdo da aba Meta */}
      <Box role="tabpanel" hidden={tabIndex !== 0} sx={{ py: 3 }}>
        {tabIndex === 0 && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Integrações Facebook disponíveis
              </Typography>
              
              {metaIntegrations.length === 0 ? (
                <Typography color="text.secondary">Nenhuma integração encontrada</Typography>
              ) : (
                metaIntegrations.map(integration => (
                  <Paper key={integration.id} sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">{integration.accountName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID da Conta: {integration.accountId}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Button 
                          variant="outlined" 
                          onClick={loadMetaMetrics}
                          disabled={loading}
                        >
                          Carregar Métricas
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                ))
              )}
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Métricas do Facebook
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <MetricsTable data={metaMetrics} />
              )}
            </Box>
          </>
        )}
      </Box>

      {/* Conteúdo da aba Google Analytics */}
      <Box role="tabpanel" hidden={tabIndex !== 1} sx={{ py: 3 }}>
        {tabIndex === 1 && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Integrações Google Analytics disponíveis
              </Typography>
              
              {gaIntegrations.length === 0 ? (
                <Typography color="text.secondary">Nenhuma integração encontrada</Typography>
              ) : (
                gaIntegrations.map(integration => (
                  <Paper key={integration.id} sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">{integration.propertyName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID da Propriedade: {integration.propertyId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          View: {integration.viewName} ({integration.viewId})
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Button 
                          variant="outlined" 
                          onClick={loadGaMetrics}
                          disabled={loading}
                        >
                          Carregar Métricas
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                ))
              )}
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Métricas do Google Analytics
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <MetricsTable data={gaMetrics} />
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default IntegrationsTester;
