import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Rating,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const AddEditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState('');
  const [recipe, setRecipe] = useState({
    recipeName: '',
    cuisine: '',
    ingredients: '',
    instructions: '',
    prepTime: '',
    cookTime: '',
    totalTime: '',
    servings: '',
    difficulty: '',
    averageRating: 0,
  });

  useEffect(() => {
    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/recipes/getAllRecipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipe(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch recipe');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (id) {
        await axios.put(`http://localhost:5000/api/recipes/updateRecipe/${id}`, recipe, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/recipes/createRecipe', recipe, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate('/recipes');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save recipe');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ marginTop: 4, marginBottom: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            {id ? 'Edit Recipe' : 'Add New Recipe'}
          </Typography>
          {error && (
            <Typography color="error" align="center" gutterBottom>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Recipe Name"
              name="recipeName"
              value={recipe.recipeName}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Cuisine"
              name="cuisine"
              value={recipe.cuisine}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              rows={4}
              label="Ingredients"
              name="ingredients"
              value={recipe.ingredients}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              rows={4}
              label="Instructions"
              name="instructions"
              value={recipe.instructions}
              onChange={handleChange}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                required
                label="Prep Time"
                name="prepTime"
                value={recipe.prepTime}
                onChange={handleChange}
              />
              <TextField
                required
                label="Cook Time"
                name="cookTime"
                value={recipe.cookTime}
                onChange={handleChange}
              />
              <TextField
                required
                label="Total Time"
                name="totalTime"
                value={recipe.totalTime}
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                required
                label="Servings"
                name="servings"
                type="number"
                value={recipe.servings}
                onChange={handleChange}
              />
              <TextField
                required
                label="Difficulty"
                name="difficulty"
                value={recipe.difficulty}
                onChange={handleChange}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography component="legend">Rating</Typography>
              <Rating
                name="averageRating"
                value={recipe.averageRating}
                onChange={(event, newValue) => {
                  setRecipe(prev => ({
                    ...prev,
                    averageRating: newValue
                  }));
                }}
              />
            </Box>
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                {id ? 'Update Recipe' : 'Add Recipe'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/recipes')}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AddEditRecipe;
