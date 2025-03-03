import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  TextField, 
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import metaApiService from '../../services/metaApi.service';
import { useNotification } from '../../contexts/NotificationContext';
import MetaTokenStatus from './MetaTokenStatus';

/**
 * Componente para testar a integração com o Meta
 */
const MetaTokenTester = () => {
  const [integrationId, setIntegrationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useNotification();

  // Função para verificar o status do token
  const handleCheckToken = async () => {
    if (!integrationId.trim()) {
      showError('Por favor, informe o ID da integração');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await metaApiService.verifyIntegrationStatus(integrationId);
      setResult(response.integration);
      showSuccess('Status do token verificado com sucesso');
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      setError(error.message || 'Erro ao verificar o status do token');
      showError('Não foi possível verificar o status do token');
    } finally {
      setLoading(false);
    }
  };

  // Renderizar o resultado da verificação
  const renderResult = () => {
    if (!result) return null;

    return (
      <Card sx={{ mt: 3 }}>
        <CardHeader 
          title="Resultado da Verificação" 
          subheader={`Integração: ${result.name || 'N/A'}`}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Informações da Integração
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography variant="body2">
                  <strong>ID:</strong> {result.id}
                </Typography>
                <Typography variant="body2">
                  <strong>Conta:</strong> {result.accountId || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {result.isActive ? 'Ativo' : 'Inativo'}
                </Typography>
                {result.lastSyncedAt && (
                  <Typography variant="body2">
                    <strong>Última sincronização:</strong> {format(new Date(result.lastSyncedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Informações do Token
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography variant="body2">
                  <strong>Status:</strong> {result.tokenStatus || 'N/A'}
                </Typography>
                {result.tokenExpiresAt && (
                  <Typography variant="body2">
                    <strong>Expira em:</strong> {format(new Date(result.tokenExpiresAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </Typography>
                )}
                {result.scopes && result.scopes.length > 0 && (
                  <Typography variant="body2">
                    <strong>Permissões:</strong> {result.scopes.join(', ')}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>

          <Accordion sx={{ mt: 3 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Visualizar Componente de Status</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Paper sx={{ p: 2 }}>
                <MetaTokenStatus 
                  integrationId={integrationId} 
                  onStatusChange={(status) => console.log('Status alterado:', status)}
                />
              </Paper>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Testador de Token do Meta
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Use esta ferramenta para verificar o status de um token de integração com o Meta.
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Box component="form" noValidate>
          <TextField
            label="ID da Integração"
            fullWidth
            value={integrationId}
            onChange={(e) => setIntegrationId(e.target.value)}
            margin="normal"
            helperText="Informe o ID da integração que deseja verificar"
          />

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCheckToken}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Verificando...' : 'Verificar Token'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {renderResult()}
    </Box>
  );
};

export default MetaTokenTester;
