import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  Tooltip, 
  CircularProgress, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon, 
  Error as ErrorIcon, 
  Warning as WarningIcon, 
  Info as InfoIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import metaApiService from '../../services/metaApi.service';
import { useNotification } from '../../contexts/NotificationContext';

/**
 * Componente para exibir o status do token de uma integração com o Meta
 * @param {Object} props
 * @param {string} props.integrationId - ID da integração
 * @param {Function} props.onStatusChange - Função chamada quando o status muda
 */
const MetaTokenStatus = ({ integrationId, onStatusChange }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { showError, showSuccess } = useNotification();

  // Função para carregar o status do token
  const loadTokenStatus = async () => {
    try {
      setLoading(true);
      const response = await metaApiService.verifyIntegrationStatus(integrationId);
      setStatus(response.integration);
      
      // Notificar o componente pai sobre a mudança de status
      if (onStatusChange) {
        onStatusChange(response.integration);
      }
    } catch (error) {
      showError('Não foi possível verificar o status do token');
      console.error('Erro ao verificar status do token:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar status do token ao montar o componente
  useEffect(() => {
    if (integrationId) {
      loadTokenStatus();
    }
  }, [integrationId, loadTokenStatus]);

  // Função para atualizar o status do token
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadTokenStatus();
      showSuccess('Status do token atualizado com sucesso');
    } catch (error) {
      // Erro já tratado em loadTokenStatus
    } finally {
      setRefreshing(false);
    }
  };

  // Função para reconectar a conta
  const handleReconnect = () => {
    setOpenDialog(true);
  };

  // Função para fechar o diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Função para iniciar o processo de reconexão
  const handleConfirmReconnect = async () => {
    setOpenDialog(false);
    // Aqui você pode redirecionar para a página de conexão
    // ou abrir um modal para o processo de reconexão
    // Por enquanto, apenas mostramos uma mensagem
    showSuccess('Redirecionando para a página de reconexão...');
  };

  // Renderizar o indicador de carregamento
  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" p={2}>
        <CircularProgress size={24} />
        <Typography variant="body2" ml={1}>
          Verificando status do token...
        </Typography>
      </Box>
    );
  }

  // Renderizar mensagem de erro se não houver status
  if (!status) {
    return (
      <Box display="flex" alignItems="center" p={2}>
        <ErrorIcon color="error" />
        <Typography variant="body2" ml={1} color="error">
          Não foi possível obter o status do token
        </Typography>
      </Box>
    );
  }

  // Definir cor e ícone com base no status do token
  let statusColor = 'default';
  let StatusIcon = InfoIcon;
  let statusText = 'Desconhecido';
  let tooltipText = 'Status do token desconhecido';

  switch (status.tokenStatus) {
    case 'active':
      statusColor = 'success';
      StatusIcon = CheckCircleIcon;
      statusText = 'Ativo';
      tooltipText = status.tokenExpiresAt 
        ? `Token válido até ${format(new Date(status.tokenExpiresAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`
        : 'Token válido (sem data de expiração)';
      break;
    case 'expired':
      statusColor = 'error';
      StatusIcon = ErrorIcon;
      statusText = 'Expirado';
      tooltipText = 'O token de acesso expirou. É necessário reconectar a conta.';
      break;
    case 'invalid':
      statusColor = 'error';
      StatusIcon = ErrorIcon;
      statusText = 'Inválido';
      tooltipText = 'O token de acesso é inválido. É necessário reconectar a conta.';
      break;
    case 'not_found':
      statusColor = 'warning';
      StatusIcon = WarningIcon;
      statusText = 'Não encontrado';
      tooltipText = 'Token não encontrado. É necessário reconectar a conta.';
      break;
    default:
      statusColor = 'default';
      StatusIcon = InfoIcon;
      statusText = status.tokenStatus || 'Desconhecido';
      tooltipText = 'Status do token desconhecido';
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="subtitle2" mr={1}>
          Status do Token:
        </Typography>
        <Tooltip title={tooltipText}>
          <Chip
            icon={<StatusIcon />}
            label={statusText}
            color={statusColor}
            size="small"
            variant="outlined"
          />
        </Tooltip>
        <Tooltip title="Atualizar status">
          <Button
            size="small"
            startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{ ml: 1 }}
          >
            {refreshing ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </Tooltip>
      </Box>

      {/* Exibir informações adicionais do token */}
      {status.tokenStatus === 'active' && status.tokenExpiresAt && (
        <Typography variant="body2" color="textSecondary">
          Expira em: {formatDistanceToNow(new Date(status.tokenExpiresAt), { locale: ptBR, addSuffix: true })}
        </Typography>
      )}

      {/* Exibir escopos do token se disponíveis */}
      {status.tokenStatus === 'active' && status.scopes && status.scopes.length > 0 && (
        <Box mt={1}>
          <Typography variant="body2" color="textSecondary">
            Permissões: {status.scopes.join(', ')}
          </Typography>
        </Box>
      )}

      {/* Botão de reconexão para tokens com problemas */}
      {['expired', 'invalid', 'not_found'].includes(status.tokenStatus) && (
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleReconnect}
          >
            Reconectar Conta
          </Button>
        </Box>
      )}

      {/* Diálogo de confirmação para reconexão */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Reconectar Conta do Meta</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você está prestes a reconectar sua conta do Meta. Isso irá solicitar um novo token de acesso.
            Deseja continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmReconnect} color="primary" variant="contained">
            Reconectar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MetaTokenStatus;
