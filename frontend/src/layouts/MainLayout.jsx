import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Group';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import BarChartIcon from '@mui/icons-material/BarChart';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 260;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: theme.palette.background.paper,
  boxShadow: '4px 0 10px rgba(0, 0, 0, 0.05)',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: theme.palette.background.paper,
  boxShadow: '4px 0 10px rgba(0, 0, 0, 0.05)',
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: '0 1px 10px rgba(0, 0, 0, 0.05)',
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const Logo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  gap: theme.spacing(1),
}));

const LogoImage = styled('img')({
  height: 40,
});

export default function MainLayout({ children }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasRole } = useAuth();
  
  const [open, setOpen] = useState(true);
  const [reportSubMenuOpen, setReportSubMenuOpen] = useState(false);
  
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleOpenNotificationsMenu = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const toggleReportSubMenu = () => {
    setReportSubMenuOpen(!reportSubMenuOpen);
  };
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: <DashboardIcon />, 
      roles: ['admin', 'manager', 'editor', 'viewer'] 
    },
    { 
      path: '/dashboards', 
      label: 'Dashboards', 
      icon: <BarChartIcon />, 
      roles: ['admin', 'manager', 'editor', 'viewer'] 
    },
    { 
      path: '/companies', 
      label: 'Empresas', 
      icon: <BusinessIcon />, 
      roles: ['admin', 'manager'] 
    },
    { 
      path: '/integrations', 
      label: 'Integrações', 
      icon: <IntegrationInstructionsIcon />, 
      roles: ['admin', 'manager', 'editor'] 
    },
    { 
      path: '/users', 
      label: 'Usuários', 
      icon: <GroupIcon />, 
      roles: ['admin'] 
    },
    { 
      path: '/settings', 
      label: 'Configurações', 
      icon: <SettingsIcon />, 
      roles: ['admin', 'manager'] 
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 2,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          
          {!open && (
            <Logo>
              <LogoImage src="/logo.png" alt="Logo" />
              <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
                Kroll Relatórios
              </Typography>
            </Logo>
          )}
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Notificações">
              <IconButton
                size="large"
                aria-label="show notifications"
                color="inherit"
                onClick={handleOpenNotificationsMenu}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Menu
              sx={{ mt: '45px' }}
              id="menu-notifications"
              anchorEl={anchorElNotifications}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElNotifications)}
              onClose={handleCloseNotificationsMenu}
            >
              <MenuItem onClick={handleCloseNotificationsMenu}>
                <Typography variant="body2">Integração Meta atualizada</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNotificationsMenu}>
                <Typography variant="body2">Relatório mensal disponível</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNotificationsMenu}>
                <Typography variant="body2">Novo usuário adicionado</Typography>
              </MenuItem>
              <Divider />
              <MenuItem 
                onClick={handleCloseNotificationsMenu}
                sx={{ justifyContent: 'center' }}
              >
                <Typography variant="body2" color="primary">Ver todas</Typography>
              </MenuItem>
            </Menu>
            
            <Box sx={{ ml: 2 }}>
              <Tooltip title="Opções da conta">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={user?.name || 'User'}
                    src={user?.avatar || ''}
                    sx={{ width: 40, height: 40 }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem 
                  component={Link} 
                  to="/profile" 
                  onClick={handleCloseUserMenu}
                >
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">Perfil</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography textAlign="center">Sair</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          {open && (
            <Logo sx={{ flexGrow: 1, justifyContent: 'flex-start', ml: 1 }}>
              <LogoImage src="/logo.png" alt="Logo" />
              <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
                Kroll Relatórios
              </Typography>
            </Logo>
          )}
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        
        <Divider />
        
        <List>
          {navItems.map((item) => {
            // Skip rendering if user doesn't have required role
            if (!hasRole(item.roles)) return null;
            
            const active = isActive(item.path);
            
            return (
              <React.Fragment key={item.path}>
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      backgroundColor: active ? 'rgba(92, 107, 192, 0.1)' : 'transparent',
                      borderLeft: active ? '4px solid #5C6BC0' : '4px solid transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(92, 107, 192, 0.05)',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: active ? 'primary.main' : 'inherit',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label} 
                      sx={{ 
                        opacity: open ? 1 : 0,
                        color: active ? 'primary.main' : 'inherit',
                        '& .MuiListItemText-primary': {
                          fontWeight: active ? 600 : 400,
                        },
                      }} 
                    />
                  </ListItemButton>
                </ListItem>
                
                {item.path === '/dashboards' && open && (
                  <>
                    <ListItemButton onClick={toggleReportSubMenu} sx={{ pl: 4 }}>
                      <ListItemText primary="Tipos de relatório" />
                      {reportSubMenuOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={reportSubMenuOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 6 }}>
                          <ListItemText primary="Meta (Facebook)" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 6 }}>
                          <ListItemText primary="Google Analytics" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 6 }}>
                          <ListItemText primary="Combinados" />
                        </ListItemButton>
                      </List>
                    </Collapse>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </List>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {open && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Kroll Relatórios v1.0.0
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              2025 Kroll Sistemas. Todos direitos reservados.
            </Typography>
          </Box>
        )}
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
