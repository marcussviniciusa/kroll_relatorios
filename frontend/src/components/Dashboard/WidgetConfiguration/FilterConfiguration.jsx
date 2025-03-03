import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  FormHelperText,
  Tooltip,
  Divider,
  Stack,
  Chip,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DateRangeIcon from '@mui/icons-material/DateRange';

/**
 * Filter Configuration component
 * Allows configuring filters for widget data
 */
const FilterConfiguration = ({
  widget,
  onChange
}) => {
  const [newFilter, setNewFilter] = useState({
    field: '',
    operator: 'equals',
    value: '',
    enabled: true
  });
  
  // Get dimensions from the widget
  const dimensions = widget.dimensions || [];
  
  // Filter operators based on field type
  const getOperators = (fieldType) => {
    const commonOperators = [
      { value: 'equals', label: 'É igual a' },
      { value: 'not_equals', label: 'Não é igual a' },
      { value: 'contains', label: 'Contém' },
      { value: 'not_contains', label: 'Não contém' },
      { value: 'starts_with', label: 'Começa com' },
      { value: 'ends_with', label: 'Termina com' },
      { value: 'is_empty', label: 'Está vazio' },
      { value: 'is_not_empty', label: 'Não está vazio' }
    ];
    
    const numericOperators = [
      { value: 'equals', label: 'É igual a' },
      { value: 'not_equals', label: 'Não é igual a' },
      { value: 'greater_than', label: 'Maior que' },
      { value: 'less_than', label: 'Menor que' },
      { value: 'greater_than_or_equals', label: 'Maior ou igual a' },
      { value: 'less_than_or_equals', label: 'Menor ou igual a' },
      { value: 'between', label: 'Entre' },
      { value: 'is_empty', label: 'Está vazio' },
      { value: 'is_not_empty', label: 'Não está vazio' }
    ];
    
    const dateOperators = [
      { value: 'equals', label: 'É igual a' },
      { value: 'not_equals', label: 'Não é igual a' },
      { value: 'greater_than', label: 'Posterior a' },
      { value: 'less_than', label: 'Anterior a' },
      { value: 'between', label: 'Entre' },
      { value: 'last_n_days', label: 'Últimos N dias' },
      { value: 'next_n_days', label: 'Próximos N dias' },
      { value: 'this_month', label: 'Este mês' },
      { value: 'last_month', label: 'Mês passado' },
      { value: 'this_year', label: 'Este ano' },
      { value: 'last_year', label: 'Ano passado' }
    ];
    
    switch (fieldType) {
      case 'number':
      case 'currency':
      case 'percentage':
        return numericOperators;
      case 'date':
      case 'datetime':
        return dateOperators;
      default:
        return commonOperators;
    }
  };
  
  // Handle adding a new filter
  const handleAddFilter = () => {
    if (!newFilter.field) return;
    
    const updatedFilters = [...(widget.filters || []), { ...newFilter, id: Date.now() }];
    onChange('filters', updatedFilters);
    
    // Reset new filter form
    setNewFilter({
      field: '',
      operator: 'equals',
      value: '',
      enabled: true
    });
  };
  
  // Handle removing a filter
  const handleRemoveFilter = (filterId) => {
    const updatedFilters = (widget.filters || []).filter(filter => filter.id !== filterId);
    onChange('filters', updatedFilters);
  };
  
  // Handle toggling a filter
  const handleToggleFilter = (filterId) => {
    const updatedFilters = (widget.filters || []).map(filter => {
      if (filter.id === filterId) {
        return { ...filter, enabled: !filter.enabled };
      }
      return filter;
    });
    onChange('filters', updatedFilters);
  };
  
  // Handle change in new filter field
  const handleNewFilterFieldChange = (event) => {
    setNewFilter({
      ...newFilter,
      field: event.target.value,
      // Reset operator when field changes
      operator: 'equals'
    });
  };
  
  // Handle change in new filter operator
  const handleNewFilterOperatorChange = (event) => {
    setNewFilter({
      ...newFilter,
      operator: event.target.value,
      // Clear value for certain operators
      value: ['is_empty', 'is_not_empty', 'this_month', 'last_month', 'this_year', 'last_year'].includes(event.target.value) 
        ? '' 
        : newFilter.value
    });
  };
  
  // Handle change in new filter value
  const handleNewFilterValueChange = (event) => {
    setNewFilter({
      ...newFilter,
      value: event.target.value
    });
  };
  
  // Get field type for a given dimension
  const getFieldType = (fieldName) => {
    // This is a simplification. In a real application, you would get this from your metadata
    if (fieldName.includes('date') || fieldName.includes('time')) {
      return 'date';
    } else if (fieldName.includes('price') || fieldName.includes('cost') || fieldName.includes('revenue')) {
      return 'currency';
    } else if (fieldName.includes('count') || fieldName.includes('quantity') || fieldName.includes('number')) {
      return 'number';
    } else if (fieldName.includes('rate') || fieldName.includes('percentage')) {
      return 'percentage';
    }
    return 'string';
  };
  
  // Get operators for the selected field
  const operators = getOperators(getFieldType(newFilter.field));
  
  // Format filter display text
  const formatFilterText = (filter) => {
    const operatorText = operators.find(op => op.value === filter.operator)?.label || filter.operator;
    
    if (['is_empty', 'is_not_empty', 'this_month', 'last_month', 'this_year', 'last_year'].includes(filter.operator)) {
      return `${filter.field} ${operatorText}`;
    }
    
    return `${filter.field} ${operatorText} ${filter.value}`;
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Configurar Filtros
      </Typography>
      
      <Typography variant="body2" color="textSecondary" paragraph>
        Adicione filtros para limitar os dados exibidos no widget. Os filtros são aplicados antes dos dados serem processados.
      </Typography>
      
      {/* New filter form */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Adicionar novo filtro
          </Typography>
          
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="filter-field-label">Campo</InputLabel>
                <Select
                  labelId="filter-field-label"
                  id="filter-field"
                  value={newFilter.field}
                  label="Campo"
                  onChange={handleNewFilterFieldChange}
                  disabled={dimensions.length === 0}
                >
                  {dimensions.map((dimension) => (
                    <MenuItem key={dimension} value={dimension}>
                      {dimension}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Selecione um campo</FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth disabled={!newFilter.field}>
                <InputLabel id="filter-operator-label">Operador</InputLabel>
                <Select
                  labelId="filter-operator-label"
                  id="filter-operator"
                  value={newFilter.operator}
                  label="Operador"
                  onChange={handleNewFilterOperatorChange}
                >
                  {operators.map((operator) => (
                    <MenuItem key={operator.value} value={operator.value}>
                      {operator.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Valor"
                value={newFilter.value}
                onChange={handleNewFilterValueChange}
                disabled={
                  !newFilter.field || 
                  ['is_empty', 'is_not_empty', 'this_month', 'last_month', 'this_year', 'last_year'].includes(newFilter.operator)
                }
                type={getFieldType(newFilter.field) === 'number' ? 'number' : 'text'}
                InputProps={{
                  endAdornment: getFieldType(newFilter.field) === 'date' ? <DateRangeIcon color="action" /> : null
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddFilter}
                disabled={!newFilter.field || (
                  !['is_empty', 'is_not_empty', 'this_month', 'last_month', 'this_year', 'last_year'].includes(newFilter.operator) && 
                  !newFilter.value
                )}
                fullWidth
                sx={{ height: 56 }}
              >
                Adicionar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Filter list */}
      <Typography variant="subtitle1" gutterBottom>
        Filtros aplicados
        <Tooltip title="Os filtros são aplicados na ordem em que aparecem">
          <HelpOutlineIcon fontSize="small" sx={{ ml: 1, verticalAlign: 'text-bottom' }} />
        </Tooltip>
      </Typography>
      
      {(!widget.filters || widget.filters.length === 0) ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          Nenhum filtro aplicado. Os dados serão exibidos sem restrições.
        </Alert>
      ) : (
        <Stack spacing={1} sx={{ mb: 3 }}>
          {widget.filters.map((filter) => (
            <Card 
              key={filter.id} 
              variant="outlined"
              sx={{ 
                borderColor: filter.enabled ? 'divider' : 'error.main',
                bgcolor: filter.enabled ? 'inherit' : 'action.disabledBackground'
              }}
            >
              <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                <Grid container alignItems="center">
                  <Grid item xs>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        textDecoration: filter.enabled ? 'none' : 'line-through',
                        color: filter.enabled ? 'text.primary' : 'text.disabled'
                      }}
                    >
                      {formatFilterText(filter)}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Chip 
                      size="small" 
                      label={filter.enabled ? "Ativo" : "Inativo"} 
                      color={filter.enabled ? "success" : "error"}
                      onClick={() => handleToggleFilter(filter.id)}
                      sx={{ mr: 1 }}
                    />
                    <IconButton 
                      size="small" 
                      edge="end" 
                      onClick={() => handleRemoveFilter(filter.id)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
      
      {/* Date range presets */}
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="subtitle1" gutterBottom>
        Períodos pré-definidos
      </Typography>
      
      <Typography variant="body2" color="textSecondary" paragraph>
        Selecione um período pré-definido para adicionar automaticamente filtros de data.
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => {
              const dateFilter = {
                id: Date.now(),
                field: 'date', // Assuming there's a date field
                operator: 'last_n_days',
                value: '7',
                enabled: true
              };
              onChange('filters', [...(widget.filters || []), dateFilter]);
            }}
          >
            Últimos 7 dias
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => {
              const dateFilter = {
                id: Date.now(),
                field: 'date',
                operator: 'last_n_days',
                value: '30',
                enabled: true
              };
              onChange('filters', [...(widget.filters || []), dateFilter]);
            }}
          >
            Últimos 30 dias
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => {
              const dateFilter = {
                id: Date.now(),
                field: 'date',
                operator: 'this_month',
                value: '',
                enabled: true
              };
              onChange('filters', [...(widget.filters || []), dateFilter]);
            }}
          >
            Este mês
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => {
              const dateFilter = {
                id: Date.now(),
                field: 'date',
                operator: 'last_month',
                value: '',
                enabled: true
              };
              onChange('filters', [...(widget.filters || []), dateFilter]);
            }}
          >
            Mês passado
          </Button>
        </Grid>
        <Grid item>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => {
              const dateFilter = {
                id: Date.now(),
                field: 'date',
                operator: 'this_year',
                value: '',
                enabled: true
              };
              onChange('filters', [...(widget.filters || []), dateFilter]);
            }}
          >
            Este ano
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

FilterConfiguration.propTypes = {
  widget: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default FilterConfiguration;
