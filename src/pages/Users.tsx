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
  Tooltip
} from '@mui/material';
import { 
  AdminPanelSettings as AdminIcon,
  Edit as EditorIcon,
  Visibility as ViewerIcon,
  Person as UserIcon,
  Email as EmailIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Add as AddIcon,
  CalendarToday as LastLoginIcon
} from '@mui/icons-material';
import DataTable from '../components/DataTable/DataTable';
import usersData from '../data/users.json';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
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

const Users = () => {
  const [users, setUsers] = useState<User[]>(usersData);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'lastLogin'>>({
    name: '',
    email: '',
    role: 'Viewer',
    status: 'Active'
  });

  const handleAddUser = () => {
    const newUserWithId = {
      ...newUser,
      id: Math.max(0, ...users.map(u => u.id)) + 1,
      lastLogin: new Date().toISOString()
    };
    setUsers([...users, newUserWithId]);
    setOpen(false);
    setNewUser({
      name: '',
      email: '',
      role: 'Viewer',
      status: 'Active'
    });
  };

  const columns = [
    { 
      id: 'name', 
      label: 'Name', 
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
            <UserIcon fontSize="small" />
          </Avatar>
          <Typography fontWeight={600}>
            {value}
          </Typography>
        </Stack>
      )
    },
    { 
      id: 'email', 
      label: 'Email', 
      sortable: true,
      width: '25%',
      format: (value: string) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <EmailIcon color="action" fontSize="small" />
          <Typography variant="body2">
            {value}
          </Typography>
        </Stack>
      )
    },
    { 
      id: 'role', 
      label: 'Role', 
      sortable: true,
      width: '20%',
      format: (value: string) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          {roleIcons[value as keyof typeof roleIcons] || <UserIcon fontSize="small" />}
          <Chip 
            label={value} 
            color={roleColors[value as keyof typeof roleColors] as any}
            variant="outlined"
            size="small"
            sx={{ 
              fontWeight: 500,
              borderWidth: '2px',
              ml: 1
            }}
          />
        </Stack>
      )
    },
    { 
      id: 'status', 
      label: 'Status', 
      sortable: true,
      width: '15%',
      format: (value: string) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          {value === 'Active' ? 
            <ActiveIcon color="success" fontSize="small" /> : 
            <InactiveIcon color="error" fontSize="small" />}
          <Chip 
            label={value} 
            color={value === 'Active' ? 'success' : 'error'} 
            size="small" 
            sx={{ 
              fontWeight: 600,
              textTransform: 'uppercase',
              fontSize: '0.75rem'
            }}
          />
        </Stack>
      )
    },
    {
      id: 'lastLogin',
      label: 'Last Login',
      sortable: true,
      width: '15%',
      format: (value: string) => (
        <Tooltip title={new Date(value).toLocaleString()}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <LastLoginIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {new Date(value).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </Typography>
          </Stack>
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
            User Management
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
            Add User
          </Button>
        </Stack>
        
        <DataTable 
          columns={columns} 
          data={users}
          defaultRowsPerPage={5}
          emptyMessage="No users found. Add your first user to get started."
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
              Create New User
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Stack spacing={2.5}>
            <TextField
              autoFocus
              label="Full Name"
              fullWidth
              variant="outlined"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              InputProps={{
                sx: { borderRadius: 2 },
                startAdornment: (
                  <InputAdornment position="start">
                    <UserIcon color="action" />
                  </InputAdornment>
                )
              }}
              placeholder="e.g., John Doe"
            />
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              InputProps={{
                sx: { borderRadius: 2 },
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                )
              }}
              placeholder="e.g., john@example.com"
            />
            <TextField
              select
              label="User Role"
              fullWidth
              variant="outlined"
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              SelectProps={{ native: true }}
              InputProps={{
                sx: { borderRadius: 2 },
                startAdornment: (
                  <InputAdornment position="start">
                    <AdminIcon color="action" fontSize="small" />
                  </InputAdornment>
                )
              }}
            >
              <option value="Admin">Administrator</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </TextField>
            <TextField
              select
              label="Account Status"
              fullWidth
              variant="outlined"
              value={newUser.status}
              onChange={(e) => setNewUser({...newUser, status: e.target.value})}
              SelectProps={{ native: true }}
              InputProps={{
                sx: { borderRadius: 2 },
                startAdornment: (
                  <InputAdornment position="start">
                    <ActiveIcon color="action" fontSize="small" />
                  </InputAdornment>
                )
              }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </TextField>
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
            onClick={handleAddUser} 
            variant="contained"
            disabled={!newUser.name || !newUser.email}
            sx={{
              px: 3,
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none'
              }
            }}
          >
            Create User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;