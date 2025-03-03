import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Tabs, 
  Tab, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Facebook as FacebookIcon, 
  Analytics as AnalyticsIcon,
  Key as KeyIcon
} from '@mui/icons-material';
import MetaIntegrationTester from '../../components/Integrations/MetaIntegrationTester';
import MetaTokenTester from '../../components/Integrations/MetaTokenTester';
import metaApiService from '../../services/metaApi.service';
import { useNotification } from '../../contexts/NotificationContext';
import { logError } from '../../utils/errorHandler';

/**
 * Página para testar integrações
 */
const IntegrationsTester = () => {
  // Estados
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [metaIntegrations, setMetaIntegrations] = useState([]);
  const [selectedMetaIntegration, setSelectedMetaIntegration] = useState('');
  
  // Notificações
  const { showError } = useNotification();

  // Carregar todas as integrações disponíveis
  const loadIntegrations = useCallback(async () => {
    try {
      setLoading(true);
      
      // Carregar integrações do Meta
      const metaData = await metaApiService.getCompanyIntegrations(1); // Usando ID 1 como exemplo
      setMetaIntegrations(metaData || []);
      
      setLoading(false);
    } catch (err) {
      logError(err, 'IntegrationsTester.loadIntegrations');
      showError('Não foi possível carregar as integrações. Por favor, tente novamente.');
      setLoading(false);
    }
  }, [showError]);

  // Carregar integrações ao montar o componente
  useEffect(() => {
    loadIntegrations();
  }, [loadIntegrations]);

  // Mudar aba ativa
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Teste de Integrações
        </Typography>
        
        <Paper sx={{ mt: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            aria-label="integration tabs"
          >
            <Tab icon={<FacebookIcon />} label="Meta (Facebook)" />
            <Tab icon={<KeyIcon />} label="Status de Token" />
            <Tab icon={<AnalyticsIcon />} label="Google Analytics" disabled />
          </Tabs>
          
          {loading && activeTab === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <Box>
                  {metaIntegrations.length === 0 ? (
                    <Alert severity="info" sx={{ mb: 3 }}>
                      Nenhuma integração com o Meta encontrada. Adicione uma integração primeiro.
                    </Alert>
                  ) : (
                    <>
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Selecione uma integração Meta</InputLabel>
                        <Select
                          value={selectedMetaIntegration}
                          label="Selecione uma integração Meta"
                          onChange={(e) => setSelectedMetaIntegration(e.target.value)}
                        >
                          {metaIntegrations.map((integration) => (
                            <MenuItem key={integration.id} value={integration.id}>
                              {integration.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      
                      {selectedMetaIntegration && (
                        <MetaIntegrationTester integrationId={selectedMetaIntegration} />
                      )}
                    </>
                  )}
                </Box>
              )}
              
              {activeTab === 1 && (
                <Box>
                  <MetaTokenTester />
                </Box>
              )}
              
              {activeTab === 2 && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Teste de integração com Google Analytics em desenvolvimento.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default IntegrationsTester;
