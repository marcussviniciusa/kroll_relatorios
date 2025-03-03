import React from 'react';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

const LogoWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
}));

const LogoImage = styled('img')({
  height: 60,
  marginRight: 12,
});

const Footer = styled(Box)(({ theme }) => ({
  marginTop: 'auto',
  padding: theme.spacing(3, 2),
  textAlign: 'center',
}));

export default function MinimalLayout({ children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Container component="main" maxWidth="sm" sx={{ my: 4 }}>
        <LogoWrapper>
          <RouterLink to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <LogoImage src="/logo.png" alt="Logo" />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Kroll Relatórios
            </Typography>
          </RouterLink>
        </LogoWrapper>
        
        {children}
      </Container>
      
      <Footer>
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' '}
          <Link color="inherit" href="https://kroll.com.br">
            Kroll Sistemas
          </Link>
          {'. Todos direitos reservados.'}
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 1 }}>
          v1.0.0
        </Typography>
      </Footer>
    </Box>
  );
}
