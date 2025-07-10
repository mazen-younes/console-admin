import { ReactNode, useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';

type LayoutProps = {
  children: ReactNode;
  mode: 'light' | 'dark';
  toggleColorMode: () => void;
};

export default function Layout({ children, mode, toggleColorMode }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        mobileOpen={mobileOpen} 
        handleDrawerToggle={handleDrawerToggle}
        mode={mode}
        toggleColorMode={toggleColorMode}
        collapsed={collapsed}
        toggleCollapse={toggleCollapse}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${collapsed ? 72 : 280}px)` },
          marginLeft: { sm: `${collapsed ? 72 : 280}px` },
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
}