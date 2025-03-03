import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Paper from '@mui/material/Paper';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import MetricCard from './Widgets/MetricCard';
import LineChartWidget from './Widgets/LineChartWidget';
import BarChartWidget from './Widgets/BarChartWidget';
import TableWidget from './Widgets/TableWidget';
import PieChartWidget from './Widgets/PieChartWidget';

// Make the grid responsive
const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * DashboardGrid component for rendering a customizable dashboard with widgets
 */
const DashboardGrid = ({ 
  widgets, 
  layout, 
  isEditing, 
  isLoading,
  onLayoutChange, 
  onAddWidget, 
  onEditWidget, 
  onDeleteWidget, 
  onDuplicateWidget,
  onRefreshWidget
}) => {
  const [widgetMenuAnchor, setWidgetMenuAnchor] = useState(null);
  const [activeWidgetId, setActiveWidgetId] = useState(null);
  
  // Default layout configuration
  const defaultLayouts = {
    lg: layout || []
  };
  
  const handleOpenWidgetMenu = (event, widgetId) => {
    event.stopPropagation();
    setWidgetMenuAnchor(event.currentTarget);
    setActiveWidgetId(widgetId);
  };
  
  const handleCloseWidgetMenu = () => {
    setWidgetMenuAnchor(null);
    setActiveWidgetId(null);
  };
  
  const handleWidgetAction = (action) => {
    handleCloseWidgetMenu();
    
    switch (action) {
      case 'edit':
        onEditWidget(activeWidgetId);
        break;
      case 'duplicate':
        onDuplicateWidget(activeWidgetId);
        break;
      case 'delete':
        onDeleteWidget(activeWidgetId);
        break;
      case 'refresh':
        onRefreshWidget(activeWidgetId);
        break;
      default:
        break;
    }
  };
  
  // Render the widget based on its type
  const renderWidget = (widget) => {
    switch (widget.type) {
      case 'metric':
        return <MetricCard data={widget.data} />;
      case 'lineChart':
        return <LineChartWidget data={widget.data} options={widget.options} />;
      case 'barChart':
        return <BarChartWidget data={widget.data} options={widget.options} />;
      case 'table':
        return <TableWidget data={widget.data} options={widget.options} />;
      case 'pieChart':
        return <PieChartWidget data={widget.data} options={widget.options} />;
      default:
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body2" color="text.secondary">
              Widget type não suportado
            </Typography>
          </Box>
        );
    }
  };
  
  return (
    <Box sx={{ width: '100%', minHeight: '80vh', position: 'relative' }}>
      {isLoading && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 10
          }}
        >
          <CircularProgress />
        </Box>
      )}
      
      {isEditing && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={onAddWidget}
          >
            Adicionar Widget
          </Button>
        </Box>
      )}
      
      <ResponsiveGridLayout
        className="layout"
        layouts={defaultLayouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={80}
        onLayoutChange={(layout) => onLayoutChange(layout)}
        isDraggable={isEditing}
        isResizable={isEditing}
        draggableHandle=".widget-drag-handle"
      >
        {widgets.map((widget) => (
          <Paper
            key={widget.id}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 1,
              '&:hover': {
                boxShadow: 3
              }
            }}
          >
            <Box 
              className="widget-drag-handle"
              sx={{ 
                p: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider',
                cursor: isEditing ? 'move' : 'default'
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {widget.title}
              </Typography>
              <IconButton 
                size="small" 
                onClick={(e) => handleOpenWidgetMenu(e, widget.id)}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <Box sx={{ p: 1, flexGrow: 1, overflow: 'auto' }}>
              {renderWidget(widget)}
            </Box>
          </Paper>
        ))}
      </ResponsiveGridLayout>
      
      <Menu
        anchorEl={widgetMenuAnchor}
        open={Boolean(widgetMenuAnchor)}
        onClose={handleCloseWidgetMenu}
      >
        <MenuItem onClick={() => handleWidgetAction('refresh')}>
          <ListItemIcon>
            <RefreshIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Atualizar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleWidgetAction('fullscreen')}>
          <ListItemIcon>
            <FullscreenIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Tela cheia</ListItemText>
        </MenuItem>
        {isEditing && (
          <>
            <MenuItem onClick={() => handleWidgetAction('edit')}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Editar</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleWidgetAction('duplicate')}>
              <ListItemIcon>
                <ContentCopyIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Duplicar</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleWidgetAction('delete')}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Excluir</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default DashboardGrid;
