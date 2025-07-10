import { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import Layout from './components/Layout/Layout';
import Users from './pages/Users';
import Permissions from './pages/Permissions';
import Roles from './pages/Roles';
import Hierarchy from './pages/Hierarchy';

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? blue[700] : blue[200],
          },
          background: {
            default: mode === 'light' ? '#f9fafc' : grey[900],
            paper: mode === 'light' ? '#ffffff' : grey[800],
          },
        },
        typography: {
          fontFamily: '"Inter", sans-serif',
          button: {
            textTransform: 'none',
          }
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 6,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                backgroundImage: 'none',
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              head: {
                fontWeight: 600,
              },
            },
          },
        },
      }),
    [mode]
  );

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout mode={mode} toggleColorMode={toggleColorMode}>
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/users" element={<Users />} />
            <Route path="/permissions" element={<Permissions />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/hierarchy" element={<Hierarchy />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}