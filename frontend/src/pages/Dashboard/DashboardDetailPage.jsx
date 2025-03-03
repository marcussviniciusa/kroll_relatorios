import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Divider, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Skeleton,
  Snackbar,
  Alert,
  Breadcrumbs,
  Link,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EditIcon from '@mui/icons-material/Edit';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link as RouterLink } from 'react-router-dom';

import DashboardGrid from '../../components/Dashboard/DashboardGrid';
import WidgetForm from '../../components/Dashboard/WidgetForm';
import DateRangeSelector from '../../components/Dashboard/DateRangeSelector';
import ShareDashboardDialog from '../../components/Dashboard/ShareDashboardDialog';

import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { handleApiError } from '../../utils/errorHandler';

const API_URL = process.env.REACT_APP_API_BASE_URL;

const DashboardHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  marginBottom: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
}));

const HeaderActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export default function DashboardDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [dashboard, setDashboard] = useState(null);
  const [widgets, setWidgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // UI state
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [addWidgetDialogOpen, setAddWidgetDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  
  // Date range filter
  const [dateRange, setDateRange] = useState({
    type: 'last7Days',
    startDate: null,
    endDate: null
  });
  
  // Load dashboard data
  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch dashboard with widgets included
      const response = await axios.get(`${API_URL}/dashboards/${id}?includeWidgets=true&incrementViews=true`);
      
      setDashboard(response.data.data);
      
      // Extract widgets from dashboard response
      if (response.data.data.widgets) {
        setWidgets(response.data.data.widgets);
      }
      
      // Set initial date range from dashboard filters if available
      if (response.data.data.filters && response.data.data.filters.defaultDateRange) {
        setDateRange({
          type: response.data.data.filters.defaultDateRange,
          startDate: null,
          endDate: null
        });
      }
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      showAlert(apiError.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [id]);
  
  // Load dashboard on initial render and when ID changes
  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);
  
  // Menu handlers
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  // Widget actions
  const handleAddWidget = () => {
    setAddWidgetDialogOpen(true);
    handleMenuClose();
  };
  
  const handleCreateWidget = async (widgetData) => {
    try {
      const response = await axios.post(`${API_URL}/dashboards/${id}/widgets`, widgetData);
      
      // Add new widget to state
      setWidgets(prev => [...prev, response.data.data]);
      
      showAlert('Widget criado com sucesso', 'success');
      setAddWidgetDialogOpen(false);
    } catch (err) {
      const apiError = handleApiError(err);
      showAlert(`Erro ao criar widget: ${apiError.message}`, 'error');
    }
  };
  
  const handleUpdateWidget = async (widgetId, widgetData) => {
    try {
      const response = await axios.put(`${API_URL}/dashboards/${id}/widgets/${widgetId}`, widgetData);
      
      // Update widget in state
      setWidgets(prev => 
        prev.map(widget => 
          widget.id === widgetId ? response.data.data : widget
        )
      );
      
      showAlert('Widget atualizado com sucesso', 'success');
    } catch (err) {
      const apiError = handleApiError(err);
      showAlert(`Erro ao atualizar widget: ${apiError.message}`, 'error');
    }
  };
  
  const handleDeleteWidget = async (widgetId) => {
    try {
      await axios.delete(`${API_URL}/dashboards/${id}/widgets/${widgetId}`);
      
      // Remove widget from state
      setWidgets(prev => prev.filter(widget => widget.id !== widgetId));
      
      showAlert('Widget excluído com sucesso', 'success');
    } catch (err) {
      const apiError = handleApiError(err);
      showAlert(`Erro ao excluir widget: ${apiError.message}`, 'error');
    }
  };
  
  // Dashboard actions
  const handleRefreshDashboard = async () => {
    try {
      setRefreshing(true);
      
      await axios.post(`${API_URL}/dashboards/${id}/refresh`);
      
      // Reload dashboard data
      await loadDashboard();
      
      showAlert('Dashboard atualizado com sucesso', 'success');
    } catch (err) {
      const apiError = handleApiError(err);
      showAlert(`Erro ao atualizar dashboard: ${apiError.message}`, 'error');
    } finally {
      setRefreshing(false);
    }
  };
  
  const handleShareDashboard = () => {
    setShareDialogOpen(true);
    handleMenuClose();
  };
  
  const handleDuplicateDashboard = async () => {
    try {
      const response = await axios.post(`${API_URL}/dashboards/${id}/duplicate`, {
        name: `${dashboard.name} (Cópia)`
      });
      
      showAlert('Dashboard duplicado com sucesso', 'success');
      
      // Navigate to the new dashboard
      navigate(`/dashboards/${response.data.data.id}`);
    } catch (err) {
      const apiError = handleApiError(err);
      showAlert(`Erro ao duplicar dashboard: ${apiError.message}`, 'error');
    }
    
    handleMenuClose();
  };
  
  const handleEditDashboard = () => {
    navigate(`/dashboards/${id}/edit`);
    handleMenuClose();
  };
  
  const handleDeleteDashboard = async () => {
    try {
      await axios.delete(`${API_URL}/dashboards/${id}`);
      
      showAlert('Dashboard excluído com sucesso', 'success');
      
      // Navigate back to dashboards list
      navigate('/dashboards');
    } catch (err) {
      const apiError = handleApiError(err);
      showAlert(`Erro ao excluir dashboard: ${apiError.message}`, 'error');
    }
    
    setDeleteDialogOpen(false);
    handleMenuClose();
  };
  
  const handleExportDashboard = async (format) => {
    try {
      let url;
      
      if (format === 'pdf') {
        url = `${API_URL}/dashboards/${id}/export/pdf`;
      } else if (format === 'image') {
        url = `${API_URL}/dashboards/${id}/export/image`;
      } else {
        url = `${API_URL}/dashboards/${id}/export`;
      }
      
      // Trigger browser download
      window.open(url, '_blank');
      
      showAlert(`Dashboard exportado como ${format.toUpperCase()}`, 'success');
    } catch (err) {
      const apiError = handleApiError(err);
      showAlert(`Erro ao exportar dashboard: ${apiError.message}`, 'error');
    }
    
    handleMenuClose();
  };
  
  // Utility functions
  const showAlert = (message, severity = 'success') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
  };
  
  const handleAlertClose = () => {
    setAlertMessage('');
  };
  
  // Layout update handler
  const handleLayoutUpdate = async (layout) => {
    try {
      // Update layout in dashboard
      await axios.put(`${API_URL}/dashboards/${id}/layout`, { layout });
      
      // Update widgets in state with new positions
      const updatedWidgets = widgets.map(widget => {
        const layoutItem = layout.find(item => item.i === widget.position.i);
        if (layoutItem) {
          return {
            ...widget,
            position: {
              ...widget.position,
              x: layoutItem.x,
              y: layoutItem.y,
              w: layoutItem.w,
              h: layoutItem.h
            }
          };
        }
        return widget;
      });
      
      setWidgets(updatedWidgets);
    } catch (err) {
      const apiError = handleApiError(err);
      showAlert(`Erro ao atualizar layout: ${apiError.message}`, 'error');
    }
  };
  
  // Date range change handler
  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };
  
  // Loading state
  if (loading) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={100} sx={{ mb: 3, borderRadius: 1 }} />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1 }} />
      </Box>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Box textAlign="center" py={5}>
        <Typography variant="h5" color="error" gutterBottom>
          Erro ao carregar dashboard
        </Typography>
        <Typography color="textSecondary" paragraph>
          {error}
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={loadDashboard}
          startIcon={<RefreshIcon />}
        >
          Tentar novamente
        </Button>
      </Box>
    );
  }
  
  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 2 }}
      >
        <Link component={RouterLink} to="/dashboards" color="inherit">
          Dashboards
        </Link>
        <Typography color="text.primary">
          {dashboard?.name || 'Carregando...'}
        </Typography>
      </Breadcrumbs>

      {/* Dashboard header */}
      <DashboardHeader>
        <HeaderActions>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={500}>
              {dashboard?.name}
            </Typography>
            {dashboard?.description && (
              <Typography variant="body1" color="textSecondary">
                {dashboard.description}
              </Typography>
            )}
          </Box>
          
          <ButtonGroup>
            {/* Date range selector */}
            <DateRangeSelector 
              value={dateRange} 
              onChange={handleDateRangeChange}
              availableRanges={dashboard?.filters?.availableDateRanges}
            />
            
            {/* Refresh button */}
            <Tooltip title="Atualizar dados">
              <IconButton 
                color="primary"
                onClick={handleRefreshDashboard}
                disabled={refreshing}
              >
                {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>
            
            {/* Add widget button */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddWidget}
            >
              Adicionar Widget
            </Button>
            
            {/* Share button */}
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ShareIcon />}
              onClick={handleShareDashboard}
            >
              Compartilhar
            </Button>
            
            {/* More options menu */}
            <IconButton
              aria-label="Mais opções"
              aria-controls="dashboard-menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="dashboard-menu"
              anchorEl={menuAnchorEl}
              keepMounted
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEditDashboard}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                Editar Dashboard
              </MenuItem>
              <MenuItem onClick={handleDuplicateDashboard}>
                <ListItemIcon>
                  <ContentCopyIcon fontSize="small" />
                </ListItemIcon>
                Duplicar
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleExportDashboard('pdf')}>
                <ListItemIcon>
                  <FileDownloadIcon fontSize="small" />
                </ListItemIcon>
                Exportar como PDF
              </MenuItem>
              <MenuItem onClick={() => handleExportDashboard('image')}>
                <ListItemIcon>
                  <FileDownloadIcon fontSize="small" />
                </ListItemIcon>
                Exportar como Imagem
              </MenuItem>
              <Divider />
              <MenuItem 
                onClick={() => {
                  setDeleteDialogOpen(true);
                  handleMenuClose();
                }}
                sx={{ color: 'error.main' }}
              >
                <ListItemIcon>
                  <DeleteIcon fontSize="small" color="error" />
                </ListItemIcon>
                Excluir Dashboard
              </MenuItem>
            </Menu>
          </ButtonGroup>
        </HeaderActions>
      </DashboardHeader>
      
      {/* Dashboard content */}
      <DashboardGrid 
        widgets={widgets}
        onLayoutChange={handleLayoutUpdate}
        onWidgetUpdate={handleUpdateWidget}
        onWidgetDelete={handleDeleteWidget}
        dateRange={dateRange}
      />
      
      {/* Add widget dialog */}
      <Dialog
        open={addWidgetDialogOpen}
        onClose={() => setAddWidgetDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Adicionar Widget</DialogTitle>
        <DialogContent dividers>
          <WidgetForm 
            dashboardId={id}
            companyId={dashboard?.CompanyId}
            onSubmit={handleCreateWidget}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddWidgetDialogOpen(false)}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Share dashboard dialog */}
      <ShareDashboardDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        dashboardId={id}
        dashboardName={dashboard?.name}
      />
      
      {/* Delete dashboard confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Excluir Dashboard</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o dashboard <strong>{dashboard?.name}</strong>?
          </Typography>
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            Esta ação não pode ser desfeita. Todos os widgets deste dashboard também serão excluídos.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleDeleteDashboard} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Alerts */}
      <Snackbar
        open={!!alertMessage}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
