import { useState } from 'react';
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
  InputAdornment,
  Tooltip,
  Autocomplete
} from '@mui/material';
import { 
  Add as AddIcon,
  Security as PermissionIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  People as RoleIcon,
  CheckCircle as ActiveIcon
} from '@mui/icons-material';
import DataTable from '../components/DataTable/DataTable';
import permissionsData from '../data/permissions.json';

type Permission = {
  id: number;
  name: string;
  description: string;
  category: string;
  assignedTo: string[];
};

const roleOptions = ['Admin', 'Editor', 'Viewer'];

const categoryData = [
  { value: 'Users', color: 'primary' },
  { value: 'Content', color: 'secondary' },
  { value: 'Settings', color: 'info' }
];

const Permissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>(permissionsData);
  const [open, setOpen] = useState(false);
  const [newPermission, setNewPermission] = useState<Omit<Permission, 'id'>>({
    name: '',
    description: '',
    category: 'Users',
    assignedTo: []
  });

  const handleAddPermission = () => {
    const newPermissionWithId = {
      ...newPermission,
      id: permissions.length > 0 ? Math.max(...permissions.map(p => p.id)) + 1 : 1,
    };
    setPermissions([...permissions, newPermissionWithId]);
    setOpen(false);
    setNewPermission({
      name: '',
      description: '',
      category: 'Users',
      assignedTo: []
    });
  };

  const columns = [
    { 
      id: 'name', 
      label: 'Permission', 
      sortable: true,
      width: '25%',
      format: (value: string) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ 
            bgcolor: 'primary.light', 
            color: 'primary.dark',
            width: 36,
            height: 36
          }}>
            <PermissionIcon fontSize="small" />
          </Avatar>
          <Typography fontWeight={600}>
            {value}
          </Typography>
        </Stack>
      )
    },
    { 
      id: 'description', 
      label: 'Description', 
      sortable: true,
      width: '30%',
      format: (value: string) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <DescriptionIcon color="action" fontSize="small" />
          <Typography variant="body2" color="text.secondary" sx={{ 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {value}
          </Typography>
        </Stack>
      )
    },
    { 
      id: 'category', 
      label: 'Category', 
      sortable: true,
      width: '20%',
      format: (value: string) => {
        const category = categoryData.find(c => c.value === value) || categoryData[0];
        return (
          <Chip 
            label={value} 
            size="small"
            color={category.color as any}
            sx={{ 
              fontWeight: 500,
              textTransform: 'capitalize'
            }}
          />
        );
      }
    },
    { 
      id: 'assignedTo', 
      label: 'Assigned Roles', 
      sortable: false,
      width: '25%',
      format: (value: string[]) => (
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {value.map((role) => (
            <Tooltip key={role} title={`Assigned to ${role}`}>
              <Chip 
                label={role} 
                size="small"
                icon={<RoleIcon fontSize="small" />}
                sx={{ 
                  fontWeight: 500,
                  backgroundColor: 'action.selected',
                  '.MuiChip-icon': {
                    color: 'text.secondary'
                  }
                }}
              />
            </Tooltip>
          ))}
        </Stack>
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
            Permission Management
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
            Create Permission
          </Button>
        </Stack>
        
        <DataTable 
          columns={columns} 
          data={permissions}
          defaultRowsPerPage={5}
          emptyMessage="No permissions found. Create your first permission to get started."
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
              New Permission
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Stack spacing={2.5}>
            <TextField
              autoFocus
              label="Permission Key"
              fullWidth
              variant="outlined"
              value={newPermission.name}
              onChange={(e) => setNewPermission({...newPermission, name: e.target.value})}
              InputProps={{
                sx: { borderRadius: 2 },
                startAdornment: (
                  <InputAdornment position="start">
                    <PermissionIcon color="action" />
                  </InputAdornment>
                )
              }}
              placeholder="e.g., user_create"
            />
            <TextField
              label="Description"
              fullWidth
              variant="outlined"
              value={newPermission.description}
              onChange={(e) => setNewPermission({...newPermission, description: e.target.value})}
              InputProps={{
                sx: { borderRadius: 2 },
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon color="action" />
                  </InputAdornment>
                )
              }}
              multiline
              rows={3}
              placeholder="Describe what this permission allows"
            />
            <TextField
              select
              label="Category"
              fullWidth
              variant="outlined"
              value={newPermission.category}
              onChange={(e) => setNewPermission({...newPermission, category: e.target.value})}
              SelectProps={{ native: true }}
              InputProps={{
                sx: { borderRadius: 2 },
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryIcon color="action" />
                  </InputAdornment>
                )
              }}
            >
              {categoryData.map((category) => (
                <option key={category.value} value={category.value}>{category.value}</option>
              ))}
            </TextField>
            <Autocomplete
              multiple
              options={roleOptions}
              value={newPermission.assignedTo}
              onChange={(event, newValue) => {
                setNewPermission({...newPermission, assignedTo: newValue});
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assign to Roles"
                  InputProps={{
                    ...params.InputProps,
                    sx: { borderRadius: 2 },
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <RoleIcon color="action" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    )
                  }}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    icon={<RoleIcon fontSize="small" />}
                    sx={{ 
                      mr: 1,
                      '.MuiChip-icon': {
                        color: 'text.secondary'
                      }
                    }}
                  />
                ))
              }
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
            variant="outlined"
            sx={{
              px: 3,
              borderRadius: 2,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddPermission} 
            variant="contained"
            disabled={!newPermission.name || !newPermission.description}
            sx={{
              px: 3,
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none'
              }
            }}
          >
            Create Permission
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Permissions;