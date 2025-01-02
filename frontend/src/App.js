import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import {
  Fullscreen as FullscreenIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import BranchTable from './components/BranchTable';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
    },
  });

  const handleLogin = (credentials) => {
    setIsAuthenticated(true);
    setUser(credentials);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Branch Management System
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1">Welcome, {user.username}</Typography>
              <IconButton color="inherit" onClick={handleFullScreen}>
                <FullscreenIcon />
              </IconButton>
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <BranchTable />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
