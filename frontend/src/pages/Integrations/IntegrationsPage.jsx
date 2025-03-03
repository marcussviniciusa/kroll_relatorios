import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Divider,
  Breadcrumbs,
  Link,
  Button
} from '@mui/material';
import { 
  Facebook as FacebookIcon, 
  Analytics as AnalyticsIcon,
  Home as HomeIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import MetaIntegration from '../../components/Integrations/MetaIntegration';

/**
 * Página principal para gerenciar integrações com plataformas externas
 */
const IntegrationsPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  
  // ID da empresa atual (em uma aplicação real, isso viria do contexto ou da rota)
  const companyId = 'comp-123'; // Exemplo de ID de empresa
  
  // Manipulador de mudança de aba
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Breadcrumbs de navegação */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link 
          underline="hover" 
          color="inherit" 
          href="/" 
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          Integrações
        </Typography>
      </Breadcrumbs>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Integrações
        </Typography>
        
        <Button 
          component={RouterLink} 
          to="/integrations/tester" 
          variant="outlined" 
          color="primary"
          startIcon={<SpeedIcon />}
        >
          Testar Integrações
        </Button>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Conecte sua conta a plataformas externas para importar dados e métricas para seus dashboards.
      </Typography>
      
      <Paper sx={{ mt: 3, mb: 5 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<FacebookIcon />} 
            label="Meta (Facebook)" 
            iconPosition="start" 
          />
          <Tab 
            icon={<AnalyticsIcon />} 
            label="Google Analytics" 
            iconPosition="start" 
          />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {/* Conteúdo da aba Meta */}
          <Box role="tabpanel" hidden={tabIndex !== 0}>
            {tabIndex === 0 && (
              <MetaIntegration companyId={companyId} />
            )}
          </Box>
          
          {/* Conteúdo da aba Google Analytics */}
          <Box role="tabpanel" hidden={tabIndex !== 1}>
            {tabIndex === 1 && (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6">
                  Integração com Google Analytics
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                  A integração com Google Analytics será implementada em breve.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Sobre as Integrações
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Typography variant="subtitle1" gutterBottom>
          Meta (Facebook)
        </Typography>
        <Typography variant="body2" paragraph>
          A integração com o Meta permite importar dados de suas páginas do Facebook, Instagram e campanhas de anúncios.
          Você pode visualizar métricas como alcance, engajamento, cliques e conversões diretamente em seus dashboards.
        </Typography>
        
        <Typography variant="subtitle1" gutterBottom>
          Google Analytics
        </Typography>
        <Typography variant="body2" paragraph>
          A integração com o Google Analytics permite importar dados de tráfego do seu site ou aplicativo.
          Você pode visualizar métricas como usuários, sessões, taxa de rejeição e conversões diretamente em seus dashboards.
        </Typography>
        
        <Typography variant="body2" sx={{ mt: 3, fontStyle: 'italic' }}>
          Nota: Todas as integrações respeitam as políticas de privacidade das respectivas plataformas e requerem autenticação explícita do usuário.
        </Typography>
      </Paper>
    </Container>
  );
};

export default IntegrationsPage;
