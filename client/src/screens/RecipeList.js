import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Typography,
  Box,
  Rating,
} from '@mui/material';
import { Add, Edit, Delete, Logout } from '@mui/icons-material';

const RecipeList = () => {
  const navigate = useNavigate();
  
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/recipes/getAllRecipes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipes(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch recipes');
      setLoading(false);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleAdd = () => {
    navigate('/add');
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/recipes/deleteRecipe/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchRecipes(); // Refresh the list
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete recipe');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with Add and Logout buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant="h4">Recipe List</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAdd}
            sx={{ mr: 2 }}
          >
            Add New Recipe
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Recipe Table */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="subtitle1" fontWeight="bold">Recipe Title</Typography></TableCell>
              <TableCell><Typography variant="subtitle1" fontWeight="bold">Studio</Typography></TableCell>
              <TableCell><Typography variant="subtitle1" fontWeight="bold">Rating</Typography></TableCell>
              <TableCell align="right"><Typography variant="subtitle1" fontWeight="bold">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">Loading...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} align="center" style={{ color: 'red' }}>{error}</TableCell>
              </TableRow>
            ) : recipes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">No recipes found</TableCell>
              </TableRow>
            ) : recipes.map((recipe) => (
              <TableRow key={recipe._id} hover>
                <TableCell>{recipe.recipeName}</TableCell>
                <TableCell>{recipe.cuisine}</TableCell>
                <TableCell>
                  <Rating value={recipe.rating} precision={0.5} readOnly />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(recipe._id)}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(recipe._id)}
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default RecipeList;
