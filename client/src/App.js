import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import './App.css';

// Screens
import RecipeList from './screens/RecipeList';
import Login from './screens/Login';
import Register from './screens/Register';
import AddEditRecipe from './screens/AddEditRecipe';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recipes" element={<RecipeList />} />
            <Route path="/add" element={<AddEditRecipe />} />
            <Route path="/edit/:id" element={<AddEditRecipe />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
