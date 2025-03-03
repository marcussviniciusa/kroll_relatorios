import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Paper, 
  Divider,
  useTheme
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import DashboardTester from '../components/DashboardTester';
import IntegrationsTester from '../components/IntegrationsTester';
import AuthTester from '../components/AuthTester';

// Componente TabPanel para exibir o conteúdo de cada aba
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tester-tabpanel-${index}`}
      aria-labelledby={`tester-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

// Página principal para teste da interface
const TestPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(160deg, rgba(247,249,252,1) 0%, rgba(237,241,247,1) 100%)',
      py: 4,
      px: 2
    }}>
      <Container maxWidth="lg">
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(63,81,181,0.03) 0%, rgba(0,188,212,0.03) 100%)',
            border: '1px solid rgba(63,81,181,0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700, 
              background: 'linear-gradient(45deg, #3f51b5 30%, #00bcd4 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Kroll Analytics
          </Typography>
          <Typography variant="h5" color="text.secondary" align="center" sx={{ mb: 3, maxWidth: 700 }}>
            Plataforma de Relatórios em Tempo Real
          </Typography>
          <Divider sx={{ width: '100%', mb: 3 }} />
          <Typography variant="body1" color="text.secondary" paragraph align="center" sx={{ maxWidth: 800 }}>
            Esta interface permite testar os diferentes componentes do Kroll Analytics sem depender de um backend funcional.
            Todos os dados são simulados para demonstrar a interação com a API.
          </Typography>
        </Paper>

        <Paper 
          elevation={1} 
          sx={{ 
            borderRadius: 3, 
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            aria-label="tester tabs"
            variant="fullWidth"
            sx={{ 
              background: theme.palette.background.paper,
              '& .MuiTab-root': {
                py: 2.5
              }
            }}
          >
            <Tab 
              icon={<LockPersonIcon />} 
              label="Autenticação" 
              id="tester-tab-0" 
              iconPosition="start"
            />
            <Tab 
              icon={<DashboardIcon />} 
              label="Dashboard" 
              id="tester-tab-1" 
              iconPosition="start"
            />
            <Tab 
              icon={<IntegrationInstructionsIcon />} 
              label="Integrações" 
              id="tester-tab-2" 
              iconPosition="start"
            />
          </Tabs>
        

        <Box sx={{ p: 0 }}>
          <TabPanel value={tabValue} index={0}>
            <AuthTester />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <DashboardTester />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <IntegrationsTester />
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  </Box>
  );
};

export default TestPage;
