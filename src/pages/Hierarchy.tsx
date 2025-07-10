import { useState, useEffect } from 'react';
import { 
  Box, 
  Chip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  Typography,
  Paper,
  Avatar,
  Stack,
  Divider,
  InputAdornment,
  Tooltip
} from '@mui/material';
import { 
  Business as OrganizationIcon,
  Groups as DepartmentIcon,
  Group as TeamIcon,
  Add as AddIcon,
  People as MembersIcon,
  AccountTree as ParentIcon
} from '@mui/icons-material';
import DataTable from '../components/DataTable/DataTable';
import hierarchyData from '../data/hierarchy.json';

type HierarchyItem = {
  id: number;
  name: string;
  type: string;
  parent: string | null;
  members: number;
};

const typeIcons = {
  'Organization': <OrganizationIcon fontSize="small" />,
  'Department': <DepartmentIcon fontSize="small" />,
  'Team': <TeamIcon fontSize="small" />
};

const typeColors = {
  'Organization': 'primary',
  'Department': 'secondary',
  'Team': 'info'
};

const Hierarchy = () => {
  const [hierarchy, setHierarchy] = useState<HierarchyItem[]>(hierarchyData);
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState<Omit<HierarchyItem, 'id'>>({
    name: '',
    type: 'Department',
    parent: null,
    members: 0
  });

  const handleAddItem = () => {
    const newItemWithId = {
      ...newItem,
      id: Math.max(0, ...hierarchy.map(h => h.id)) + 1,
    };
    setHierarchy([...hierarchy, newItemWithId]);
    setOpen(false);
    setNewItem({
      name: '',
      type: 'Department',
      parent: null,
      members: 0
    });
  };

  const columns = [
    { 
      id: 'name', 
      label: 'Name', 
      sortable: true,
      width: '30%',
      format: (value: string, row?: HierarchyItem) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ 
            bgcolor: row?.type ? `${typeColors[row.type as keyof typeof typeColors]}.light` : 'grey.300', 
            color: row?.type ? `${typeColors[row.type as keyof typeof typeColors]}.dark` : 'grey.500',
            width: 36,
            height: 36
          }}>
            {row?.type ? typeIcons[row.type as keyof typeof typeIcons] : <TeamIcon fontSize="small" />}
          </Avatar>
          <Typography fontWeight={600}>
            {value || '-'}
          </Typography>
        </Stack>
      )
    },
    { 
      id: 'type', 
      label: 'Type', 
      sortable: true,
      width: '20%',
      format: (value: string) => (
        <Chip 
          label={value || 'Unknown'} 
          size="small" 
          color={value ? (typeColors[value as keyof typeof typeColors] as any) : 'default'}
          sx={{ fontWeight: 500, textTransform: 'capitalize' }}
        />
      )
    },
    { 
      id: 'parent', 
      label: 'Parent', 
      sortable: true,
      width: '25%',
      format: (value: string | null) => (
        value ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <ParentIcon color="action" fontSize="small" />
            <Typography variant="body2">
              {value}
            </Typography>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            None
          </Typography>
        )
      )
    },
    { 
      id: 'members', 
      label: 'Members', 
      sortable: true,
      numeric: true,
      format: (value: number) => (
        <Tooltip title={`${value} member${value !== 1 ? 's' : ''}`}>
          <Chip
            label={value}
            color={value > 0 ? 'primary' : 'default'}
            size="small"
            icon={<MembersIcon fontSize="small" />}
            sx={{ 
              fontWeight: 500,
              '.MuiChip-icon': {
                color: value > 0 ? 'inherit' : 'text.secondary'
              }
            }}
          />
        </Tooltip>
      )
    },
  ];

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3 },
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }}>
      <Paper sx={{ 
        p: 3,
        borderRadius: 4,
        boxShadow: '0 2px 16px rgba(0,0,0,0.08)'
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h1" sx={{ 
            fontWeight: 700,
            letterSpacing: '-0.5px'
          }}>
            Organizational Hierarchy
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none'
              }
            }}
          >
            Add Item
          </Button>
        </Stack>
        
        <DataTable 
          columns={columns} 
          data={hierarchy}
          defaultRowsPerPage={5}
          emptyMessage="No hierarchy items found. Add one to get started."
        />
      </Paper>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundImage: 'none'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 600,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 2.5
        }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar sx={{ 
              bgcolor: 'primary.50', 
              color: 'primary.main',
              width: 32,
              height: 32
            }}>
              <AddIcon fontSize="small" />
            </Avatar>
            <Typography variant="h6">
              Add New Item
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Stack spacing={2.5}>
            <TextField
              autoFocus
              label="Name"
              fullWidth
              variant="outlined"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
              placeholder="e.g., Marketing Department"
              required
            />
            
            <TextField
              select
              label="Type"
              fullWidth
              variant="outlined"
              value={newItem.type}
              onChange={(e) => setNewItem({...newItem, type: e.target.value})}
              SelectProps={{ native: true }}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            >
              <option value="Organization">Organization</option>
              <option value="Department">Department</option>
              <option value="Team">Team</option>
            </TextField>
            
            <TextField
              select
              label="Parent"
              fullWidth
              variant="outlined"
              value={newItem.parent || ''}
              onChange={(e) => setNewItem({...newItem, parent: e.target.value || null})}
              SelectProps={{ native: true }}
              InputProps={{
                sx: { borderRadius: 2 },
                startAdornment: (
                  <InputAdornment position="start">
                    <ParentIcon color="action" />
                  </InputAdornment>
                )
              }}
            >
              <option value="">None</option>
              {hierarchy.map(item => (
                <option key={item.id} value={item.name}>{item.name}</option>
              ))}
            </TextField>
            
            <TextField
              label="Members"
              type="number"
              fullWidth
              variant="outlined"
              value={newItem.members}
              onChange={(e) => setNewItem({...newItem, members: parseInt(e.target.value) || 0})}
              InputProps={{
                sx: { borderRadius: 2 },
                startAdornment: (
                  <InputAdornment position="start">
                    <MembersIcon color="action" />
                  </InputAdornment>
                ),
                inputProps: { min: 0 }
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ 
          p: 2.5,
          bgcolor: 'background.default',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Button 
            onClick={() => setOpen(false)} 
            variant="text"
            sx={{
              px: 3,
              color: 'text.secondary'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddItem} 
            variant="contained"
            disabled={!newItem.name}
            sx={{
              px: 3,
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none'
              }
            }}
          >
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Hierarchy;