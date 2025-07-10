import { useLocation, Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Box,
  Typography,
  IconButton,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  People as UsersIcon,
  Lock as PermissionsIcon,
  Group as RolesIcon,
  AccountTree as HierarchyIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Menu as MenuIcon,
  ChevronLeft as CollapseIcon,
  ChevronRight as ExpandIcon
} from '@mui/icons-material';

const drawerWidth = 280;
const collapsedWidth = 72;

const navItems = [
  { text: 'Users', icon: <UsersIcon />, path: '/users' },
  { text: 'Permissions', icon: <PermissionsIcon />, path: '/permissions' },
  { text: 'Roles', icon: <RolesIcon />, path: '/roles' },
  { text: 'Hierarchy', icon: <HierarchyIcon />, path: '/hierarchy' },
];

type SidebarProps = {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  mode: 'light' | 'dark';
  toggleColorMode: () => void;
  collapsed: boolean;
  toggleCollapse: () => void;
};

export default function Sidebar({ 
  mobileOpen, 
  handleDrawerToggle, 
  mode, 
  toggleColorMode,
  collapsed,
  toggleCollapse
}: SidebarProps) {
  const location = useLocation();
  const theme = useTheme();

  const drawer = (
    <>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: collapsed ? 2 : 3,
        justifyContent: collapsed ? 'center' : 'space-between',
        minHeight: '64px',
        position: 'relative'
      }}>
        {!collapsed ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44 }}>
                AC
              </Avatar>
              <Typography variant="h6" noWrap sx={{ ml: 2 }}>
                Admin Console
              </Typography>
            </Box>
            <IconButton onClick={toggleCollapse}>
              <CollapseIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Tooltip title="Expand sidebar" placement="right">
              <IconButton 
                onClick={toggleCollapse}
                sx={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' }
                }}
              >
                <ExpandIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>

      <Divider />

      <List sx={{ p: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Tooltip title={collapsed ? item.text : ''} placement="right">
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: '8px',
                  mx: 1,
                  my: 0.5,
                  px: collapsed ? 2.5 : 3,
                  py: 1.25,
                  minHeight: '48px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 'auto',
                  mr: collapsed ? 0 : 2,
                  color: 'inherit'
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ opacity: collapsed ? 0 : 1 }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 'auto', p: 2 }}>
        <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'} placement="right">
          <ListItemButton
            onClick={toggleColorMode}
            sx={{
              borderRadius: '8px',
              px: collapsed ? 2 : 2.5,
              py: 1.25,
              justifyContent: collapsed ? 'center' : 'flex-start'
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: 'auto',
              mr: collapsed ? 0 : 2,
              color: 'inherit'
            }}>
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </ListItemIcon>
            {!collapsed && 'Toggle Theme'}
          </ListItemButton>
        </Tooltip>
      </Box>
    </>
  );

  return (
    <Box component="nav">
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            width: collapsed ? collapsedWidth : drawerWidth,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}