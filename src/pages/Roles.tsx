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
  Tooltip,
  InputAdornment
} from '@mui/material';
import { 
  AdminPanelSettings as AdminIcon,
  Edit as EditorIcon,
  Visibility as ViewerIcon,
  Group as UsersIcon,
  Add as AddIcon,
  DateRange as DateIcon,
  Description as DescriptionIcon,
  People as MembersIcon
} from '@mui/icons-material';
import DataTable from '../components/DataTable/DataTable';
import rolesData from '../data/roles.json';

type Role = {
  id: number;
  name: string;
  description: string;
  usersCount: number;
  createdAt: string;
  permissions: string[];
};

const roleIcons = {
  'Admin': <AdminIcon fontSize="small" color="primary" />,
  'Editor': <EditorIcon fontSize="small" color="secondary" />,
  'Viewer': <ViewerIcon fontSize="small" color="info" />
};

const roleColors = {
  'Admin': 'primary',
  'Editor': 'secondary',
  'Viewer': 'info'
};

const allPermissions = [
  'user:create',
  'user:edit',
  'content:create',
  'content:edit',
  'settings:view'
];

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>(rolesData.map(role => {
    // Get unique random permissions for each role
    const shuffled = [...allPermissions].sort(() => 0.5 - Math.random());
    const selectedCount = Math.min(Math.floor(Math.random() * 3) + 2, allPermissions.length);
    const uniquePermissions = shuffled.slice(0, selectedCount);
    
    return {
      ...role,
      permissions: uniquePermissions
    };
  }));

  const [open, setOpen] = useState(false);
  const [newRole, setNewRole] = useState<Omit<Role, 'id' | 'usersCount' | 'createdAt' | 'permissions'>>({
    name: '',
    description: ''
  });

  const handleAddRole = () => {
    const newRoleWithId = {
      ...newRole,
      id: Math.max(0, ...roles.map(r => r.id)) + 1,
      usersCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      permissions: []
    };
    setRoles([...roles, newRoleWithId]);
    setOpen(false);
    setNewRole({
      name: '',
      description: ''
    });
  };

  const columns = [
    { 
      id: 'name', 
      label: 'Role', 
      sortable: true,
      width: '20%',
      format: (value: string) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ 
            bgcolor: `${roleColors[value as keyof typeof roleColors]}.light`, 
            color: `${roleColors[value as keyof typeof roleColors]}.dark`,
            width: 36,
            height: 36
          }}>
            {roleIcons[value as keyof typeof roleIcons] || <UsersIcon fontSize="small" />}
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
      id: 'permissions', 
      label: 'Permissions', 
      sortable: false,
      width: '25%',
      format: (value: string[]) => (
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {value.map((perm, index) => (
            <Tooltip key={`${perm}-${index}`} title={perm}>
              <Chip
                label={perm.split(':')[1]}
                size="small"
                sx={{
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  bgcolor: 'action.selected',
                  textTransform: 'capitalize'
                }}
              />
            </Tooltip>
          ))}
        </Stack>
      )
    },
    { 
      id: 'usersCount', 
      label: 'Users', 
      sortable: true,
      numeric: true,
      width: '10%',
      format: (value: number) => (
        <Tooltip title={`${value} user${value !== 1 ? 's' : ''}`}>
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
    { 
      id: 'createdAt', 
      label: 'Created', 
      sortable: true,
      width: '15%',
      format: (value: string) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <DateIcon color="action" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {new Date(value).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </Typography>
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
            Role Management
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
            New Role
          </Button>
        </Stack>
        
        <DataTable 
          columns={columns} 
          data={roles}
          defaultRowsPerPage={5}
          emptyMessage="No roles found. Create your first role to get started."
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
              Create New Role
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Stack spacing={2.5}>
            <TextField
              autoFocus
              label="Role Name"
              fullWidth
              variant="outlined"
              value={newRole.name}
              onChange={(e) => setNewRole({...newRole, name: e.target.value})}
              InputProps={{
                sx: { borderRadius: 2 },
                startAdornment: (
                  <InputAdornment position="start">
                    <UsersIcon color="action" />
                  </InputAdornment>
                )
              }}
              placeholder="e.g., Content Moderator"
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={newRole.description}
              onChange={(e) => setNewRole({...newRole, description: e.target.value})}
              InputProps={{
                sx: { borderRadius: 2 },
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon color="action" />
                  </InputAdornment>
                )
              }}
              placeholder="Describe the role's purpose and permissions"
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
            onClick={handleAddRole} 
            variant="contained"
            disabled={!newRole.name}
            sx={{
              px: 3,
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none'
              }
            }}
          >
            Create Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Roles;