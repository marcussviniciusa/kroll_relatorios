import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Paper, 
  Grid,
  Divider,
  Snackbar 
} from '@mui/material';
import apiService from '../services/apiConfig';

const AuthTester = () => {
  // Estado para login
  const [loginData, setLoginData] = useState({
    email: 'usuario@teste.com',
    password: 'senha123'
  });
  
  // Estado para registro
  const [registerData, setRegisterData] = useState({
    name: 'Novo Usuário',
    email: 'novo@teste.com',
    password: 'senha123',
    confirmPassword: 'senha123'
  });
  
  // Estado para recuperação de senha
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('usuario@teste.com');
  
  // Estado para feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [user, setUser] = useState(null);
  
  // Handlers para formulários
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };
  
  // Teste de login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.auth.login(loginData.email, loginData.password);
      
      setSuccess('Login realizado com sucesso!');
      setUser(response.user);
      
      // Simular armazenamento do token
      localStorage.setItem('token', response.token);
      
    } catch (err) {
      setError(err.message || 'Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  };
  
  // Teste de registro
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validação simples
    if (registerData.password !== registerData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.auth.register(registerData);
      
      setSuccess('Registro realizado com sucesso!');
      setUser(response.user);
      
      // Simular armazenamento do token
      localStorage.setItem('token', response.token);
      
    } catch (err) {
      setError(err.message || 'Erro ao realizar registro');
    } finally {
      setLoading(false);
    }
  };
  
  // Teste de recuperação de senha
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      await apiService.auth.forgotPassword(forgotPasswordEmail);
      
      setSuccess('Email de recuperação enviado com sucesso!');
      
    } catch (err) {
      setError(err.message || 'Erro ao solicitar recuperação de senha');
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    setSuccess('Logout realizado com sucesso!');
  };
  
  // Fechar alerta de sucesso
  const handleCloseSuccess = () => {
    setSuccess(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Testes de Autenticação
      </Typography>

      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      {user ? (
        <Box sx={{ mb: 4 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Usuário Autenticado
            </Typography>
            <Typography variant="body1">
              <strong>Nome:</strong> {user.name}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body1">
              <strong>Função:</strong> {user.role}
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleLogout}
              sx={{ mt: 2 }}
            >
              Fazer Logout
            </Button>
          </Paper>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Formulário de Login */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Login
              </Typography>
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              <form onSubmit={handleLogin}>
                <TextField
                  label="Email"
                  variant="outlined"
                  name="email"
                  type="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Senha"
                  variant="outlined"
                  name="password"
                  type="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={loading}
                >
                  {loading ? 'Carregando...' : 'Entrar'}
                </Button>
              </form>
            </Paper>
          </Grid>

          {/* Formulário de Registro */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Registro
              </Typography>
              
              <form onSubmit={handleRegister}>
                <TextField
                  label="Nome"
                  variant="outlined"
                  name="name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  name="email"
                  type="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Senha"
                  variant="outlined"
                  name="password"
                  type="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Confirmar Senha"
                  variant="outlined"
                  name="confirmPassword"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={loading}
                >
                  {loading ? 'Carregando...' : 'Registrar'}
                </Button>
              </form>
            </Paper>
          </Grid>

          {/* Formulário de Recuperação de Senha */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recuperação de Senha
              </Typography>
              
              <form onSubmit={handleForgotPassword}>
                <TextField
                  label="Email"
                  variant="outlined"
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={loading}
                >
                  {loading ? 'Carregando...' : 'Recuperar Senha'}
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      <Divider sx={{ my: 4 }} />
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Instruções para Teste:
        </Typography>
        <Typography variant="body2">
          <ul>
            <li>Use o email <code>usuario@teste.com</code> e senha <code>senha123</code> para testar o login.</li>
            <li>Ao testar o registro, um "usuário" será criado com os dados fornecidos (apenas em memória).</li>
            <li>O processo de recuperação de senha não envia emails reais, apenas simula a funcionalidade.</li>
          </ul>
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthTester;
