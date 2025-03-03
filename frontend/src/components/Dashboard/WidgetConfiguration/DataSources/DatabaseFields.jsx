import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Tooltip,
  IconButton,
  FormControlLabel,
  Switch,
  FormHelperText,
  Card,
  CardContent,
  Tab,
  Tabs,
  Paper
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import TableChartIcon from '@mui/icons-material/TableChart';

/**
 * Database Fields component
 * Allows configuring database connection and query settings
 */
const DatabaseFields = ({
  config,
  onChange
}) => {
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [availableTables, setAvailableTables] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [queryMode, setQueryMode] = useState('builder');
  
  // Extract config values with defaults
  const {
    connectionType = 'mysql',
    host = '',
    port = '',
    database = '',
    username = '',
    password = '',
    table = '',
    customQuery = '',
    fields = [],
    limit = 1000,
    orderBy = '',
    orderDirection = 'DESC',
    useCaching = true,
    cacheDuration = 3600
  } = config;
  
  // Database connection types
  const connectionTypes = [
    { value: 'mysql', label: 'MySQL' },
    { value: 'postgres', label: 'PostgreSQL' },
    { value: 'mssql', label: 'SQL Server' },
    { value: 'oracle', label: 'Oracle' },
    { value: 'mongodb', label: 'MongoDB' },
    { value: 'sqlite', label: 'SQLite' }
  ];
  
  // Fetch available tables when connection changes
  useEffect(() => {
    const fetchTables = async () => {
      if (!host || !database || !username) {
        setAvailableTables([]);
        return;
      }
      
      setLoading(true);
      
      try {
        // In a real implementation, this would make an API call to the backend
        // For now, we'll simulate the response
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock tables based on the selected database type
        const mockTables = connectionType === 'mongodb' 
          ? ['users', 'products', 'orders', 'categories', 'transactions']
          : ['users', 'products', 'orders', 'categories', 'transactions', 'customers', 'suppliers'];
        
        setAvailableTables(mockTables);
        
        setConnectionStatus({
          success: true,
          message: 'Conexão estabelecida com sucesso'
        });
      } catch (error) {
        console.error('Error fetching tables:', error);
        setConnectionStatus({
          success: false,
          message: 'Erro ao buscar tabelas: ' + error.message
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTables();
  }, [host, database, username, connectionType]);
  
  // Handle config field change
  const handleConfigChange = (field, value) => {
    const updatedConfig = { ...config };
    updatedConfig[field] = value;
    onChange(updatedConfig);
  };
  
  // Test connection
  const handleTestConnection = async () => {
    if (!host || !database || !username) return;
    
    setTestingConnection(true);
    setConnectionStatus(null);
    
    try {
      // In a real implementation, this would make an API call to the backend
      // For now, we'll simulate the response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success
      setConnectionStatus({
        success: true,
        message: 'Conexão estabelecida com sucesso'
      });
    } catch (error) {
      console.error('Error testing connection:', error);
      setConnectionStatus({
        success: false,
        message: 'Erro ao testar conexão: ' + error.message
      });
    } finally {
      setTestingConnection(false);
    }
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Configuração de Banco de Dados
      </Typography>
      
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="Conexão" />
        <Tab label="Consulta" />
        <Tab label="Opções Avançadas" />
      </Tabs>
      
      {activeTab === 0 && (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="connection-type-label">Tipo de Banco de Dados</InputLabel>
                <Select
                  labelId="connection-type-label"
                  id="connection-type"
                  value={connectionType}
                  label="Tipo de Banco de Dados"
                  onChange={(e) => handleConfigChange('connectionType', e.target.value)}
                >
                  {connectionTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Host"
                value={host}
                onChange={(e) => handleConfigChange('host', e.target.value)}
                placeholder="localhost ou endereço IP"
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Porta"
                value={port}
                onChange={(e) => handleConfigChange('port', e.target.value)}
                placeholder={connectionType === 'mysql' ? '3306' : 
                            connectionType === 'postgres' ? '5432' : 
                            connectionType === 'mssql' ? '1433' : 
                            connectionType === 'mongodb' ? '27017' : ''}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome do Banco de Dados"
                value={database}
                onChange={(e) => handleConfigChange('database', e.target.value)}
                placeholder="nome_do_banco"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Usuário"
                value={username}
                onChange={(e) => handleConfigChange('username', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => handleConfigChange('password', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={handleTestConnection}
                disabled={testingConnection || !host || !database || !username}
                startIcon={testingConnection ? <CircularProgress size={20} /> : <RefreshIcon />}
              >
                {testingConnection ? 'Testando...' : 'Testar Conexão'}
              </Button>
            </Grid>
            
            {connectionStatus && (
              <Grid item xs={12}>
                <Alert 
                  severity={connectionStatus.success ? 'success' : 'error'}
                  icon={connectionStatus.success ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />}
                >
                  {connectionStatus.message}
                </Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      )}
      
      {activeTab === 1 && (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Modo de Consulta
                </Typography>
                <Grid container spacing={1}>
                  <Grid item>
                    <Button
                      variant={queryMode === 'builder' ? 'contained' : 'outlined'}
                      size="small"
                      startIcon={<TableChartIcon />}
                      onClick={() => setQueryMode('builder')}
                    >
                      Construtor
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant={queryMode === 'sql' ? 'contained' : 'outlined'}
                      size="small"
                      startIcon={<CodeIcon />}
                      onClick={() => setQueryMode('sql')}
                    >
                      SQL Personalizado
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            
            {queryMode === 'builder' ? (
              <>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="table-label">Tabela</InputLabel>
                    <Select
                      labelId="table-label"
                      id="table"
                      value={table}
                      label="Tabela"
                      onChange={(e) => handleConfigChange('table', e.target.value)}
                      disabled={loading || !connectionStatus?.success}
                    >
                      {availableTables.map((tableName) => (
                        <MenuItem key={tableName} value={tableName}>
                          {tableName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Campos (separados por vírgula)"
                    value={Array.isArray(fields) ? fields.join(', ') : fields}
                    onChange={(e) => handleConfigChange('fields', e.target.value.split(',').map(f => f.trim()))}
                    placeholder="id, nome, valor, data_criacao"
                    helperText="Deixe em branco para selecionar todos os campos (*)"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ordenar por"
                    value={orderBy}
                    onChange={(e) => handleConfigChange('orderBy', e.target.value)}
                    placeholder="data_criacao"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="order-direction-label">Direção</InputLabel>
                    <Select
                      labelId="order-direction-label"
                      id="order-direction"
                      value={orderDirection}
                      label="Direção"
                      onChange={(e) => handleConfigChange('orderDirection', e.target.value)}
                    >
                      <MenuItem value="ASC">Crescente (ASC)</MenuItem>
                      <MenuItem value="DESC">Decrescente (DESC)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Limite de Registros"
                    type="number"
                    value={limit}
                    onChange={(e) => handleConfigChange('limit', parseInt(e.target.value, 10))}
                    InputProps={{ inputProps: { min: 1, max: 10000 } }}
                  />
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Consulta SQL Personalizada"
                  value={customQuery}
                  onChange={(e) => handleConfigChange('customQuery', e.target.value)}
                  placeholder="SELECT * FROM tabela WHERE condição ORDER BY campo LIMIT 1000"
                  multiline
                  rows={6}
                  helperText={
                    <span>
                      Escreva sua consulta SQL personalizada. Use parâmetros com $ para valores dinâmicos (ex: $data_inicio).
                      <Tooltip title="Cuidado com injeção SQL. Não use esta opção para consultas que possam comprometer a segurança.">
                        <HelpOutlineIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'text-bottom' }} />
                      </Tooltip>
                    </span>
                  }
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Prévia da Consulta
                </Typography>
                <Box sx={{ bgcolor: 'background.default', p: 1, borderRadius: 1 }}>
                  <Typography variant="body2" fontFamily="monospace" component="pre" sx={{ overflowX: 'auto' }}>
                    {queryMode === 'sql' ? customQuery : 
                      `SELECT ${fields.length > 0 ? fields.join(', ') : '*'} 
FROM ${table}
${orderBy ? `ORDER BY ${orderBy} ${orderDirection}` : ''}
LIMIT ${limit}`}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
      
      {activeTab === 2 && (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={useCaching}
                    onChange={(e) => handleConfigChange('useCaching', e.target.checked)}
                  />
                }
                label="Usar cache para melhorar desempenho"
              />
              <FormHelperText>
                Armazena os resultados da consulta em cache para reduzir o tempo de carregamento e o uso do banco de dados.
              </FormHelperText>
            </Grid>
            
            {useCaching && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Duração do Cache (segundos)"
                  type="number"
                  value={cacheDuration}
                  onChange={(e) => handleConfigChange('cacheDuration', parseInt(e.target.value, 10))}
                  InputProps={{ inputProps: { min: 60, max: 86400 } }}
                  helperText="Tempo em segundos para manter os dados em cache (60s - 24h)"
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Segurança
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                As credenciais de banco de dados são armazenadas de forma segura e criptografada. As consultas são parametrizadas para evitar injeção SQL.
              </Alert>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={config.readOnly !== false}
                    onChange={(e) => handleConfigChange('readOnly', e.target.checked)}
                    defaultChecked
                  />
                }
                label="Modo somente leitura (recomendado)"
              />
              <FormHelperText>
                Restringe as consultas a operações SELECT para garantir a segurança dos dados.
              </FormHelperText>
            </Grid>
          </Grid>
        </Box>
      )}
      
      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 3 }}>
        * As configurações acima definirão como os dados são obtidos do banco de dados para este widget.
      </Typography>
    </Box>
  );
};

DatabaseFields.propTypes = {
  config: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default DatabaseFields;
