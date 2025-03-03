import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Chip,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  TextField
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ptBR from 'date-fns/locale/pt-BR';
import {
  Edit as EditIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  Fullscreen as FullscreenIcon,
  CloudDownload as DownloadIcon,
  Add as AddIcon,
  ContentCopy as DuplicateIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { format, subDays } from 'date-fns';

import DashboardGrid from '../../components/Dashboard/DashboardGrid';
import WidgetDialog from '../../components/Dashboard/WidgetDialog';
import PageHeader from '../../components/Layout/PageHeader';
import { fetchDashboard, updateDashboard, createWidget, updateWidget, deleteWidget } from '../../store/dashboardSlice';
import { setActiveDateRange } from '../../store/filtersSlice';

/**
 * Dashboard page component
 */
const DashboardPage = () => {
  const { dashboardId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const { 
    currentDashboard, 
    widgets, 
    loading, 
    error 
  } = useSelector(state => state.dashboard);
  
  const { activeDateRange } = useSelector(state => state.filters);
  const { activeCompany } = useSelector(state => state.company);
  
  // Local state
  const [isEditing, setIsEditing] = useState(false);
  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
  const [dateRangeAnchorEl, setDateRangeAnchorEl] = useState(null);
  const [customDateRange, setCustomDateRange] = useState({
    startDate: subDays(new Date(), 7),
    endDate: new Date()
  });
  const [widgetDialogOpen, setWidgetDialogOpen] = useState(false);
  const [currentWidget, setCurrentWidget] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [shareLinkPassword, setShareLinkPassword] = useState('');
  const [shareLinkExpiration, setShareLinkExpiration] = useState('30');
  
  // Date range options
  const dateRangeOptions = [
    { label: 'Hoje', value: 'today' },
    { label: 'Ontem', value: 'yesterday' },
    { label: 'Últimos 7 dias', value: 'last7Days' },
    { label: 'Últimos 30 dias', value: 'last30Days' },
    { label: 'Este mês', value: 'thisMonth' },
    { label: 'Mês passado', value: 'lastMonth' },
    { label: 'Este ano', value: 'thisYear' },
    { label: 'Personalizado', value: 'custom' }
  ];
  
  // Get current date range label
  const getCurrentDateRangeLabel = () => {
    const option = dateRangeOptions.find(opt => opt.value === activeDateRange);
    if (option) return option.label;
    
    if (activeDateRange === 'custom') {
      return `${format(customDateRange.startDate, 'dd/MM/yyyy')} - ${format(customDateRange.endDate, 'dd/MM/yyyy')}`;
    }
    
    return 'Período';
  };
  
  // Fetch dashboard data
  useEffect(() => {
    if (dashboardId && activeCompany) {
      dispatch(fetchDashboard({ 
        dashboardId, 
        companyId: activeCompany.id,
        dateRange: activeDateRange,
        customDateRange: activeDateRange === 'custom' ? customDateRange : undefined
      }));
    }
  }, [dashboardId, activeCompany, activeDateRange, dispatch]);
  
  // Handle layout change
  const handleLayoutChange = (layout) => {
    if (!isEditing || !currentDashboard) return;
    
    dispatch(updateDashboard({
      id: currentDashboard.id,
      layout
    }));
  };
  
  // Handle edit mode toggle
  const handleToggleEditMode = () => {
    setIsEditing(prev => !prev);
  };
  
  // Open actions menu
  const handleOpenActionsMenu = (event) => {
    setActionsAnchorEl(event.currentTarget);
  };
  
  // Close actions menu
  const handleCloseActionsMenu = () => {
    setActionsAnchorEl(null);
  };
  
  // Open date range menu
  const handleOpenDateRangeMenu = (event) => {
    setDateRangeAnchorEl(event.currentTarget);
  };
  
  // Close date range menu
  const handleCloseDateRangeMenu = () => {
    setDateRangeAnchorEl(null);
  };
  
  // Handle date range change
  const handleDateRangeChange = (value) => {
    dispatch(setActiveDateRange(value));
    handleCloseDateRangeMenu();
  };
  
  // Open add widget dialog
  const handleAddWidget = () => {
    setCurrentWidget(null);
    setWidgetDialogOpen(true);
  };
  
  // Open edit widget dialog
  const handleEditWidget = (widgetId) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      setCurrentWidget(widget);
      setWidgetDialogOpen(true);
    }
  };
  
  // Handle saving widget
  const handleSaveWidget = (widgetData) => {
    if (currentWidget) {
      // Update existing widget
      dispatch(updateWidget({
        ...currentWidget,
        ...widgetData
      }));
    } else {
      // Create new widget
      dispatch(createWidget({
        ...widgetData,
        dashboardId: currentDashboard.id
      }));
    }
    
    setWidgetDialogOpen(false);
  };
  
  // Delete a widget
  const handleDeleteWidget = (widgetId) => {
    if (window.confirm('Tem certeza que deseja excluir este widget?')) {
      dispatch(deleteWidget(widgetId));
    }
  };
  
  // Duplicate a widget
  const handleDuplicateWidget = (widgetId) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      dispatch(createWidget({
        ...widget,
        id: undefined,
        title: `${widget.title} (cópia)`,
        dashboardId: currentDashboard.id
      }));
    }
  };
  
  // Refresh a widget
  const handleRefreshWidget = (widgetId) => {
    // This would trigger a refresh of just this widget data
    console.log(`Refreshing widget ${widgetId}`);
  };
  
  // Open share dialog
  const handleOpenShareDialog = () => {
    // Generate temporary share link
    setShareLink(`https://kroll-relatorios.com/s/${currentDashboard.id}/${Math.random().toString(36).substring(2, 10)}`);
    setShareDialogOpen(true);
    handleCloseActionsMenu();
  };
  
  // Close share dialog
  const handleCloseShareDialog = () => {
    setShareDialogOpen(false);
  };
  
  // Copy share link to clipboard
  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    // Show success toast here
  };
  
  // Create and save share link
  const handleCreateShareLink = () => {
    // This would call the API to create a real share link
    handleCloseShareDialog();
    // Show success toast here
  };
  
  if (loading && !currentDashboard) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Erro ao carregar dashboard: {error}
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/dashboards')}>
          Voltar para Dashboards
        </Button>
      </Box>
    );
  }
  
  if (!currentDashboard) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Dashboard não encontrado</Typography>
        <Button variant="outlined" onClick={() => navigate('/dashboards')}>
          Voltar para Dashboards
        </Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ pb: 5 }}>
      {/* Page Header */}
      <PageHeader 
        title={currentDashboard.name}
        breadcrumbs={[
          { label: 'Dashboards', link: '/dashboards' },
          { label: currentDashboard.name }
        ]}
      >
        <Stack direction="row" spacing={1}>
          {/* Date Range Selector */}
          <Button
            variant="outlined"
            color="primary"
            startIcon={<CalendarIcon />}
            onClick={handleOpenDateRangeMenu}
            size="small"
          >
            {getCurrentDateRangeLabel()}
          </Button>
          
          {/* Edit Mode Toggle */}
          <Button
            variant="outlined"
            color={isEditing ? "success" : "primary"}
            startIcon={<EditIcon />}
            onClick={handleToggleEditMode}
            size="small"
          >
            {isEditing ? 'Salvar Alterações' : 'Editar Dashboard'}
          </Button>
          
          {/* Share Button */}
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ShareIcon />}
            onClick={handleOpenShareDialog}
            size="small"
          >
            Compartilhar
          </Button>
          
          {/* More Actions Button */}
          <IconButton onClick={handleOpenActionsMenu}>
            <MoreVertIcon />
          </IconButton>
        </Stack>
      </PageHeader>
      
      {/* Dashboard Description */}
      {currentDashboard.description && (
        <Box sx={{ px: 3, pb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {currentDashboard.description}
          </Typography>
        </Box>
      )}
      
      {/* Dashboard Tags */}
      {currentDashboard.tags && currentDashboard.tags.length > 0 && (
        <Box sx={{ px: 3, pb: 2, display: 'flex', gap: 1 }}>
          {currentDashboard.tags.map(tag => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Box>
      )}
      
      {/* Dashboard Grid */}
      <Box sx={{ px: 3 }}>
        <DashboardGrid
          widgets={widgets}
          layout={currentDashboard.layout}
          isEditing={isEditing}
          isLoading={loading}
          onLayoutChange={handleLayoutChange}
          onAddWidget={handleAddWidget}
          onEditWidget={handleEditWidget}
          onDeleteWidget={handleDeleteWidget}
          onDuplicateWidget={handleDuplicateWidget}
          onRefreshWidget={handleRefreshWidget}
        />
      </Box>
      
      {/* Widget Dialog */}
      <WidgetDialog
        open={widgetDialogOpen}
        onClose={() => setWidgetDialogOpen(false)}
        widget={currentWidget}
        onSave={handleSaveWidget}
      />
      
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onClose={handleCloseShareDialog} maxWidth="md" fullWidth>
        <DialogTitle>Compartilhar Dashboard</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Link de compartilhamento
            </Typography>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              variant="outlined"
            >
              <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <Typography variant="body2" noWrap>{shareLink}</Typography>
              </Box>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<ContentCopyIcon />}
                onClick={handleCopyShareLink}
              >
                Copiar
              </Button>
            </Paper>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Expiração do link</InputLabel>
              <Select
                value={shareLinkExpiration}
                onChange={(e) => setShareLinkExpiration(e.target.value)}
                label="Expiração do link"
              >
                <MenuItem value="1">1 dia</MenuItem>
                <MenuItem value="7">7 dias</MenuItem>
                <MenuItem value="30">30 dias</MenuItem>
                <MenuItem value="90">90 dias</MenuItem>
                <MenuItem value="never">Nunca expirar</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Senha (opcional)"
              type="password"
              value={shareLinkPassword}
              onChange={(e) => setShareLinkPassword(e.target.value)}
              helperText="Se definida, os usuários precisarão inserir esta senha para acessar o dashboard."
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseShareDialog}>Cancelar</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreateShareLink}
          >
            Criar Link
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Actions Menu */}
      <Menu
        anchorEl={actionsAnchorEl}
        open={Boolean(actionsAnchorEl)}
        onClose={handleCloseActionsMenu}
      >
        <MenuItem onClick={() => {
          handleCloseActionsMenu();
          window.print();
        }}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <Typography>Exportar como PDF</Typography>
        </MenuItem>
        
        <MenuItem onClick={() => {
          handleCloseActionsMenu();
          // Full screen functionality
        }}>
          <ListItemIcon>
            <FullscreenIcon fontSize="small" />
          </ListItemIcon>
          <Typography>Modo de apresentação</Typography>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => {
          handleCloseActionsMenu();
          dispatch(fetchDashboard({ 
            dashboardId, 
            companyId: activeCompany.id,
            dateRange: activeDateRange,
            customDateRange: activeDateRange === 'custom' ? customDateRange : undefined,
            forceRefresh: true
          }));
        }}>
          <ListItemIcon>
            <RefreshIcon fontSize="small" />
          </ListItemIcon>
          <Typography>Atualizar dados</Typography>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => {
          handleCloseActionsMenu();
          if (window.confirm('Tem certeza que deseja duplicar este dashboard?')) {
            // Duplicate dashboard logic
          }
        }}>
          <ListItemIcon>
            <DuplicateIcon fontSize="small" />
          </ListItemIcon>
          <Typography>Duplicar dashboard</Typography>
        </MenuItem>
        
        <MenuItem onClick={() => {
          handleCloseActionsMenu();
          if (window.confirm('Tem certeza que deseja excluir este dashboard?')) {
            // Delete dashboard logic
            navigate('/dashboards');
          }
        }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <Typography>Excluir dashboard</Typography>
        </MenuItem>
      </Menu>
      
      {/* Date Range Menu */}
      <Menu
        anchorEl={dateRangeAnchorEl}
        open={Boolean(dateRangeAnchorEl)}
        onClose={handleCloseDateRangeMenu}
      >
        {dateRangeOptions.map((option) => (
          <MenuItem 
            key={option.value}
            onClick={() => handleDateRangeChange(option.value)}
            selected={activeDateRange === option.value}
          >
            {option.label}
          </MenuItem>
        ))}
        
        {activeDateRange === 'custom' && (
          <Box sx={{ p: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <Stack spacing={2}>
                <DatePicker
                  label="Data inicial"
                  value={customDateRange.startDate}
                  onChange={(date) => setCustomDateRange(prev => ({ ...prev, startDate: date }))}
                  format="dd/MM/yyyy"
                />
                <DatePicker
                  label="Data final"
                  value={customDateRange.endDate}
                  onChange={(date) => setCustomDateRange(prev => ({ ...prev, endDate: date }))}
                  format="dd/MM/yyyy"
                />
                <Button 
                  variant="contained" 
                  onClick={() => handleDateRangeChange('custom')}
                >
                  Aplicar
                </Button>
              </Stack>
            </LocalizationProvider>
          </Box>
        )}
      </Menu>
    </Box>
  );
};

export default DashboardPage;
