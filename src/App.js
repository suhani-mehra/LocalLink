// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SignUp from './SignUp';
import LocalCircle from './LocalCircle';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6fa8dc',
    },
    background: {
      default: '#444444',
    },
  },
});

// Simple auth check (replace with your actual auth logic)
const isAuthenticated = () => {
  return localStorage.getItem('user') !== null;
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/signup" replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/"
            element={<LocalCircle />}
          />
          <Route
            path="/signup"
            element={<SignUp />}
          />
          {/* Redirect unauthenticated users trying to access restricted paths */}
          <Route
            path="/app"
            element={
              isAuthenticated() ? <LocalCircle /> : <Navigate to="/" replace />
            }
          />
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;