import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  Box,
  TextField,
  IconButton,
  useTheme,
  Typography
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

type Order = 'asc' | 'desc';

interface DataTableColumn<T> {
  id: keyof T;
  label: string;
  numeric?: boolean;
  sortable?: boolean;
  width?: string;
  format?: (value: any, row?: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  defaultSortColumn?: keyof T;
  defaultSortDirection?: Order;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  onAddNew?: () => void;
  addButtonLabel?: string;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  data,
  defaultSortColumn = columns[0]?.id,
  defaultSortDirection = 'asc',
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 10,
  onAddNew,
  addButtonLabel = 'Add New',
  emptyMessage = 'No data available'
}: DataTableProps<T>) {
  const theme = useTheme();
  const [order, setOrder] = useState<Order>(defaultSortDirection);
  const [orderBy, setOrderBy] = useState<keyof T>(defaultSortColumn);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<T[]>(data);

  useEffect(() => {
    const filtered = data.filter((item) =>
      columns.some((column) => {
        const value = item[column.id];
        return value !== undefined && 
               value !== null && 
               String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
    setFilteredData(filtered);
    setPage(0);
  }, [searchTerm, data, columns]);

  const handleRequestSort = (property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
  ): (a: { [key in Key]: any }, b: { [key in Key]: any }) => number {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] === undefined || b[orderBy] === null) return -1;
    if (a[orderBy] === undefined || a[orderBy] === null) return 1;
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  }

  const sortedData = stableSort(filteredData, getComparator(order, orderBy));
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        gap: 2
      }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: <SearchIcon color="action" />,
            sx: {
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper
            }
          }}
        />
        {onAddNew && (
          <IconButton
            onClick={onAddNew}
            color="primary"
            sx={{
              borderRadius: 2,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.getContrastText(theme.palette.primary.main),
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              }
            }}
          >
            <AddIcon />
          </IconButton>
        )}
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2, 
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHead sx={{ 
            backgroundColor: theme.palette.mode === 'light' ? '#f5f7fa' : '#424242'
          }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id as string}
                  align={column.numeric ? 'right' : 'left'}
                  sortDirection={orderBy === column.id ? order : false}
                  sx={{ 
                    fontWeight: 600,
                    width: column.width || 'auto'
                  }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                      {orderBy === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { 
                      backgroundColor: theme.palette.mode === 'light' 
                        ? 'rgba(0, 0, 0, 0.04)' 
                        : 'rgba(255, 255, 255, 0.08)'
                    }
                  }}
                >
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        key={`${index}-${column.id as string}`}
                        align={column.numeric ? 'right' : 'left'}
                      >
                        {column.format
                          ? column.format(value, row)
                          : (value !== undefined && value !== null 
                              ? String(value) 
                              : '-')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mt: 2 }}
      />
    </Box>
  );
}