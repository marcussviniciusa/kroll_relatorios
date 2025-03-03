import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  CircularProgress, 
  TextField,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { 
  Facebook as FacebookIcon, 
  Analytics as AnalyticsIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import metaApiService from '../../services/metaApi.service';
import { useNotification } from '../../contexts/NotificationContext';
import { logError } from '../../utils/errorHandler';

/**
 * Componente para testar a integração com o Meta (Facebook)
 */
const MetaIntegrationTester = ({ integrationId }) => {
  // Estados
  const [loading, setLoading] = useState(false);
  const [adAccounts, setAdAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [startDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // 30 dias atrás
  const [endDate] = useState(new Date());
  const [metrics, setMetrics] = useState(null);
  
  // Notificações
  const { showSuccess, showError } = useNotification();

  // Carregar contas de anúncios
  const loadAdAccounts = async () => {
    try {
      setLoading(true);
      
      const accounts = await metaApiService.getAdAccounts(integrationId);
      setAdAccounts(accounts || []);
      
      if (accounts && accounts.length > 0) {
        setSelectedAccount(accounts[0].id);
      }
      
      setLoading(false);
    } catch (err) {
      logError(err, 'MetaIntegrationTester.loadAdAccounts');
      showError('Não foi possível carregar as contas de anúncios. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  // Carregar métricas da conta de anúncios
  const loadMetrics = async () => {
    if (!selectedAccount) {
      showError('Selecione uma conta de anúncios primeiro.');
      return;
    }
    
    try {
      setLoading(true);
      
      const data = await metaApiService.getAdAccountMetrics(
        integrationId, 
        selectedAccount,
        format(startDate, 'yyyy-MM-dd'),
        format(endDate, 'yyyy-MM-dd')
      );
      
      setMetrics(data.metrics);
      showSuccess('Métricas carregadas com sucesso!');
      
      setLoading(false);
    } catch (err) {
      logError(err, 'MetaIntegrationTester.loadMetrics');
      showError('Não foi possível carregar as métricas. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  // Renderizar métricas
  const renderMetrics = () => {
    if (!metrics) return null;
    
    return (
      <Card sx={{ mt: 3 }}>
        <CardHeader 
          title="Métricas da Conta de Anúncios" 
          subheader={`Período: ${format(startDate, 'dd/MM/yyyy', { locale: ptBR })} a ${format(endDate, 'dd/MM/yyyy', { locale: ptBR })}`}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" gutterBottom>
                Alcance
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography variant="body2">
                  <strong>Impressões:</strong> {metrics.impressions.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" gutterBottom>
                Engajamento
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography variant="body2">
                  <strong>Cliques:</strong> {metrics.clicks.toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  <strong>CTR:</strong> {(metrics.ctr * 100).toFixed(2)}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" gutterBottom>
                Conversões
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography variant="body2">
                  <strong>Conversões:</strong> {metrics.conversions.toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Custo por Conversão:</strong> R$ {(metrics.spend / metrics.conversions).toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Custos
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body2">
                <strong>Investimento Total:</strong> R$ {metrics.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
              <Typography variant="body2">
                <strong>CPC Médio:</strong> R$ {metrics.cpc.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Teste de Integração com o Meta
      </Typography>
      
      <Paper sx={{ p: 3, mt: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FacebookIcon />}
            onClick={loadAdAccounts}
            disabled={loading}
          >
            Carregar Contas de Anúncios
          </Button>
        </Box>
        
        {adAccounts.length > 0 && (
          <>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Conta de Anúncios</InputLabel>
              <Select
                value={selectedAccount}
                label="Conta de Anúncios"
                onChange={(e) => setSelectedAccount(e.target.value)}
              >
                {adAccounts.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name} ({account.id})
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Selecione uma conta de anúncios para visualizar métricas</FormHelperText>
            </FormControl>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Período: Últimos 30 dias
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<AssessmentIcon />}
              onClick={loadMetrics}
              disabled={loading || !selectedAccount}
            >
              {loading ? 'Carregando...' : 'Carregar Métricas'}
            </Button>
          </>
        )}
      </Paper>
      
      {renderMetrics()}
    </Box>
  );
};

export default MetaIntegrationTester;
