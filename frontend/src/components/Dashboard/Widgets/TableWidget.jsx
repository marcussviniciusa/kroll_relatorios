import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper, 
  Typography, 
  useTheme, 
  CircularProgress,
  Tooltip,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  IconButton
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const TableWidget = ({ 
  title, 
  description, 
  data, 
  loading, 
  error, 
  config = {},
  settings = {}
}) => {
  const theme = useTheme();
  
  // Extract config options with defaults
  const {
    columns = [],
    defaultSortColumn = null,
    defaultSortDirection = 'asc',
    cellFormatters = {},
    rowsPerPageOptions = [5, 10, 25],
    defaultRowsPerPage = 10,
    onRowClick = null
  } = config;
  
  // Extract settings
  const {
    appearance = {},
    display = {}
  } = settings;
  
  const {
    showTitle = true,
    showDescription = true,
    colorTheme = 'default',
    transparent = false,
    shadow = 'medium',
    borderRadius = 'medium'
  } = appearance;
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);
  
  // Generate shadow styles based on setting
  const getShadowStyle = () => {
    if (transparent) return {};
    
    switch (shadow) {
      case 'none':
        return {};
      case 'light':
        return { boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' };
      case 'strong':
        return { boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' };
      case 'medium':
      default:
        return { boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' };
    }
  };
  
  // Generate border radius styles
  const getBorderRadiusStyle = () => {
    switch (borderRadius) {
      case 'none':
        return { borderRadius: 0 };
      case 'small':
        return { borderRadius: theme.shape.borderRadius / 2 };
      case 'large':
        return { borderRadius: theme.shape.borderRadius * 2 };
      case 'medium':
      default:
        return { borderRadius: theme.shape.borderRadius };
    }
  };
  
  // Sort handler
  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(column);
  };
  
  // Get sorted and paginated data
  const getSortedData = () => {
    if (!data || !sortColumn) return data || [];
    
    const sorted = [...data].sort((a, b) => {
      // Get values to compare
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];
      
      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
      if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? 1 : -1;
      
      // Compare strings case-insensitive
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      // Compare dates
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === 'asc' 
          ? aValue.getTime() - bValue.getTime() 
          : bValue.getTime() - aValue.getTime();
      }
      
      // Regular comparison
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  };
  
  // Get data for current page
  const getPaginatedData = () => {
    const sortedData = getSortedData();
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };
  
  // Page change handler
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Rows per page change handler
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Format cell value based on column type
  const formatCellValue = (column, value) => {
    // Check if there's a custom formatter for this column
    if (cellFormatters && cellFormatters[column.field]) {
      return cellFormatters[column.field](value);
    }
    
    // Default formatters based on column type
    if (column.type === 'date' && value) {
      return new Date(value).toLocaleDateString();
    }
    
    if (column.type === 'datetime' && value) {
      return new Date(value).toLocaleString();
    }
    
    if (column.type === 'currency' && value !== null && value !== undefined) {
      return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(value);
    }
    
    if (column.type === 'number' && value !== null && value !== undefined) {
      return new Intl.NumberFormat('pt-BR').format(value);
    }
    
    if (column.type === 'percentage' && value !== null && value !== undefined) {
      return `${new Intl.NumberFormat('pt-BR', { 
        maximumFractionDigits: 2 
      }).format(value)}%`;
    }
    
    // Default: return as is
    return value;
  };

  return (
    <Paper 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        p: 2,
        bgcolor: transparent ? 'transparent' : 'background.paper',
        ...getShadowStyle(),
        ...getBorderRadiusStyle(),
      }}
      elevation={transparent ? 0 : 1}
    >
      {/* Widget header */}
      {(showTitle && title) && (
        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 500, flex: 1 }}>
            {title}
          </Typography>
          
          {description && (
            <Tooltip title={description} placement="top">
              <InfoOutlinedIcon fontSize="small" color="action" sx={{ ml: 1 }} />
            </Tooltip>
          )}
        </Box>
      )}
      
      {/* Description if not in tooltip */}
      {(showDescription && description && !showTitle) && (
        <Typography 
          variant="body2" 
          color="textSecondary" 
          sx={{ mb: 2 }}
        >
          {description}
        </Typography>
      )}
      
      {/* Table content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <CircularProgress size={40} />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="body2" color="error" align="center">
              Erro ao carregar dados: {error}
            </Typography>
          </Box>
        ) : !data || data.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="body2" color="textSecondary" align="center">
              Nenhum dado disponível
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell 
                        key={column.field}
                        align={column.align || 'left'}
                        padding={column.disablePadding ? 'none' : 'normal'}
                        sortDirection={sortColumn === column.field ? sortDirection : false}
                        sx={{ 
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          width: column.width,
                          minWidth: column.minWidth,
                          maxWidth: column.maxWidth,
                        }}
                      >
                        {column.sortable !== false ? (
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              cursor: 'pointer',
                              userSelect: 'none',
                              '&:hover': {
                                color: 'primary.main'
                              }
                            }}
                            onClick={() => handleSort(column.field)}
                          >
                            {column.headerName}
                            {sortColumn === column.field ? (
                              <Box component="span" sx={{ ml: 0.5 }}>
                                {sortDirection === 'asc' ? (
                                  <ArrowUpwardIcon fontSize="small" />
                                ) : (
                                  <ArrowDownwardIcon fontSize="small" />
                                )}
                              </Box>
                            ) : null}
                          </Box>
                        ) : (
                          column.headerName
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getPaginatedData().map((row, rowIndex) => (
                    <TableRow 
                      key={row.id || rowIndex}
                      hover
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                      sx={{ 
                        cursor: onRowClick ? 'pointer' : 'inherit',
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      {columns.map((column) => (
                        <TableCell 
                          key={`${row.id || rowIndex}-${column.field}`}
                          align={column.align || 'left'}
                          sx={{ 
                            whiteSpace: column.wrap ? 'normal' : 'nowrap',
                            width: column.width,
                            minWidth: column.minWidth,
                            maxWidth: column.maxWidth,
                          }}
                        >
                          {formatCellValue(column, row[column.field])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Linhas por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
            />
          </>
        )}
      </Box>
    </Paper>
  );
};

TableWidget.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  data: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  config: PropTypes.object,
  settings: PropTypes.object
};

export default TableWidget;
