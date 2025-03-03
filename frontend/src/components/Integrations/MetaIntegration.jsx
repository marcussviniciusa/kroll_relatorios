import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  CircularProgress, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Collapse
} from '@mui/material';
import { 
  Facebook as FacebookIcon, 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import metaApiService from '../../services/metaApi.service';
import { useNotification } from '../../contexts/NotificationContext';
import { logError } from '../../utils/errorHandler';
import MetaTokenStatus from './MetaTokenStatus';

/**
 * Componente para gerenciar integrações com o Meta (Facebook)
 */
const MetaIntegration = ({ companyId }) => {
  // Estados
  const [loading, setLoading] = useState(false);
  const [integrations, setIntegrations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [integrationName, setIntegrationName] = useState('');
  const [fbLoginStatus, setFbLoginStatus] = useState(null);
  const [expandedIntegration, setExpandedIntegration] = useState(null);
  
  // Notificações
  const { showSuccess, showError, showInfo } = useNotification();

  // Carregar integrações existentes
  useEffect(() => {
    if (companyId) {
      loadIntegrations();
    }
  }, [companyId, loadIntegrations]);

  // Inicializar SDK do Facebook
  useEffect(() => {
    const initFbSdk = async () => {
      try {
        await metaApiService.initializeFbSdk();
      } catch (err) {
        logError(err, 'MetaIntegration.initFbSdk');
        showError('Não foi possível inicializar o SDK do Facebook. Verifique sua conexão com a internet.');
      }
    };

    initFbSdk();
  }, [showError]);

  // Carregar integrações da empresa
  const loadIntegrations = async () => {
    try {
      setLoading(true);
      
      const data = await metaApiService.getCompanyIntegrations(companyId);
      setIntegrations(data || []);
      
      setLoading(false);
    } catch (err) {
      logError(err, 'MetaIntegration.loadIntegrations');
      showError('Não foi possível carregar as integrações. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  // Abrir diálogo para adicionar nova integração
  const handleOpenDialog = () => {
    setOpenDialog(true);
    setIntegrationName('');
    setFbLoginStatus(null);
  };

  // Fechar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Iniciar processo de login no Facebook
  const handleFacebookLogin = async () => {
    try {
      setLoading(true);
      
      const authResponse = await metaApiService.loginWithFacebook();
      setFbLoginStatus({
        success: true,
        accessToken: authResponse.accessToken,
        userID: authResponse.userID
      });
      
      showInfo('Login no Facebook realizado com sucesso!');
      setLoading(false);
    } catch (err) {
      logError(err, 'MetaIntegration.handleFacebookLogin');
      setFbLoginStatus({
        success: false,
        error: err.message
      });
      showError(err);
      setLoading(false);
    }
  };

  // Salvar a nova integração
  const handleSaveIntegration = async () => {
    if (!integrationName.trim()) {
      showError('Por favor, forneça um nome para a integração.');
      return;
    }

    if (!fbLoginStatus || !fbLoginStatus.success) {
      showError('Por favor, faça login no Facebook antes de salvar.');
      return;
    }

    try {
      setLoading(true);
      
      await metaApiService.connectAccount(companyId, {
        accessToken: fbLoginStatus.accessToken,
        name: integrationName
      });
      
      showSuccess('Integração com o Meta conectada com sucesso!');
      setLoading(false);
      handleCloseDialog();
      
      // Recarregar a lista de integrações
      loadIntegrations();
    } catch (err) {
      logError(err, 'MetaIntegration.handleSaveIntegration');
      showError(err);
      setLoading(false);
    }
  };

  // Remover uma integração
  const handleRemoveIntegration = async (integrationId) => {
    if (!window.confirm('Tem certeza que deseja remover esta integração?')) {
      return;
    }

    try {
      setLoading(true);
      
      await metaApiService.disconnectAccount(integrationId);
      
      showSuccess('Integração removida com sucesso!');
      setLoading(false);
      
      // Atualizar a lista de integrações
      setIntegrations(integrations.filter(item => item.id !== integrationId));
    } catch (err) {
      logError(err, 'MetaIntegration.handleRemoveIntegration');
      showError(err);
      setLoading(false);
    }
  };

  // Alternar a expansão de uma integração para mostrar detalhes do token
  const handleToggleExpand = (integrationId) => {
    setExpandedIntegration(expandedIntegration === integrationId ? null : integrationId);
  };

  // Atualizar o status de uma integração quando o status do token mudar
  const handleTokenStatusChange = (integrationId, updatedStatus) => {
    setIntegrations(prevIntegrations => 
      prevIntegrations.map(integration => 
        integration.id === integrationId 
          ? { ...integration, isActive: updatedStatus.tokenStatus === 'active' } 
          : integration
      )
    );
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Integrações com Meta (Facebook)
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          disabled={loading}
        >
          Adicionar Integração
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && integrations.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Nenhuma integração com o Meta configurada.
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<FacebookIcon />} 
            onClick={handleOpenDialog}
            sx={{ mt: 2 }}
          >
            Conectar conta do Facebook
          </Button>
        </Paper>
      ) : (
        <List>
          {integrations.map((integration) => (
            <Paper key={integration.id} sx={{ mb: 2, overflow: 'hidden' }}>
              <ListItem 
                sx={{ 
                  borderLeft: integration.isActive ? '4px solid #4CAF50' : '4px solid #F44336',
                  pl: 2
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FacebookIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">{integration.name}</Typography>
                      {integration.isActive ? (
                        <Chip 
                          size="small" 
                          color="success" 
                          label="Ativo" 
                          icon={<CheckCircleIcon />} 
                          sx={{ ml: 2 }} 
                        />
                      ) : (
                        <Chip 
                          size="small" 
                          color="error" 
                          label="Inativo" 
                          icon={<ErrorIcon />} 
                          sx={{ ml: 2 }} 
                        />
                      )}
                      <IconButton 
                        size="small"
                        onClick={() => handleToggleExpand(integration.id)}
                        sx={{ ml: 1 }}
                      >
                        {expandedIntegration === integration.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        ID da Conta: {integration.accountId}
                      </Typography>
                      {integration.lastSyncedAt && (
                        <Typography variant="body2" color="text.secondary">
                          Última sincronização: {new Date(integration.lastSyncedAt).toLocaleString()}
                        </Typography>
                      )}
                      
                      {/* Exibir status do token quando expandido */}
                      <Collapse in={expandedIntegration === integration.id} timeout="auto" unmountOnExit>
                        <Box sx={{ mt: 2, mb: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                          <MetaTokenStatus 
                            integrationId={integration.id} 
                            onStatusChange={(status) => handleTokenStatusChange(integration.id, status)}
                          />
                        </Box>
                      </Collapse>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Atualizar dados">
                    <IconButton edge="end" aria-label="refresh" sx={{ mr: 1 }}>
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remover integração">
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => handleRemoveIntegration(integration.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          ))}
        </List>
      )}

      {/* Diálogo para adicionar nova integração */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Conectar conta do Meta (Facebook)</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" paragraph>
              Para integrar com o Meta, você precisa autorizar o acesso à sua conta do Facebook e selecionar as páginas ou contas de anúncios que deseja conectar.
            </Typography>

            <TextField
              label="Nome da Integração"
              fullWidth
              margin="normal"
              value={integrationName}
              onChange={(e) => setIntegrationName(e.target.value)}
              helperText="Forneça um nome descritivo para identificar esta integração"
            />

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<FacebookIcon />}
                onClick={handleFacebookLogin}
                disabled={loading || (fbLoginStatus && fbLoginStatus.success)}
                sx={{ mb: 2 }}
              >
                {fbLoginStatus && fbLoginStatus.success ? 'Conectado ao Facebook' : 'Conectar com Facebook'}
              </Button>

              {fbLoginStatus && fbLoginStatus.success && (
                <Chip 
                  color="success" 
                  icon={<CheckCircleIcon />} 
                  label="Conectado com sucesso! Clique em 'Salvar' para finalizar a integração."
                  sx={{ mt: 2 }}
                />
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            onClick={handleSaveIntegration} 
            variant="contained" 
            disabled={loading || !fbLoginStatus || !fbLoginStatus.success || !integrationName.trim()}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MetaIntegration;
