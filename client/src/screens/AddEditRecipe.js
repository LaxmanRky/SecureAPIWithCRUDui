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
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import axios from 'axios';

const difficultyLevels = ['Easy', 'Medium', 'Hard', 'Expert'];

const AddEditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
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

  const validateForm = () => {
    const errors = {};
    if (!recipe.recipeName) errors.recipeName = 'Recipe name is required';
    if (!recipe.cuisine) errors.cuisine = 'Cuisine is required';
    if (!recipe.ingredients) errors.ingredients = 'Ingredients are required';
    if (!recipe.instructions) errors.instructions = 'Instructions are required';
    if (!recipe.prepTime) errors.prepTime = 'Prep time is required';
    if (!recipe.cookTime) errors.cookTime = 'Cook time is required';
    if (!recipe.totalTime) errors.totalTime = 'Total time is required';
    if (!recipe.servings) errors.servings = 'Number of servings is required';
    if (!recipe.difficulty) errors.difficulty = 'Difficulty level is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotalTime = () => {
    const prepTime = parseInt(recipe.prepTime) || 0;
    const cookTime = parseInt(recipe.cookTime) || 0;
    setRecipe(prev => ({
      ...prev,
      totalTime: `${prepTime + cookTime}`
    }));
  };

  useEffect(() => {
    calculateTotalTime();
  }, [recipe.prepTime, recipe.cookTime]);

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
      setSuccessMessage(id ? 'Recipe updated successfully!' : 'Recipe added successfully!');
      setTimeout(() => {
        navigate('/recipes');
      }, 1500);
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
              error={!!formErrors.recipeName}
              helperText={formErrors.recipeName}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Cuisine"
              name="cuisine"
              value={recipe.cuisine}
              onChange={handleChange}
              error={!!formErrors.cuisine}
              helperText={formErrors.cuisine}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              rows={4}
              label="Ingredients (one per line)"
              name="ingredients"
              value={recipe.ingredients}
              onChange={handleChange}
              error={!!formErrors.ingredients}
              helperText={formErrors.ingredients}
              placeholder="1 cup flour\n2 eggs\n1/2 cup sugar"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              rows={4}
              label="Instructions (numbered steps)"
              name="instructions"
              value={recipe.instructions}
              onChange={handleChange}
              error={!!formErrors.instructions}
              helperText={formErrors.instructions}
              placeholder="1. Preheat oven to 350°F\n2. Mix ingredients\n3. Bake for 30 minutes"
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                required
                label="Prep Time (minutes)"
                name="prepTime"
                type="number"
                value={recipe.prepTime}
                onChange={handleChange}
                error={!!formErrors.prepTime}
                helperText={formErrors.prepTime}
                inputProps={{ min: 0 }}
              />
              <TextField
                required
                label="Cook Time (minutes)"
                name="cookTime"
                type="number"
                value={recipe.cookTime}
                onChange={handleChange}
                error={!!formErrors.cookTime}
                helperText={formErrors.cookTime}
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Total Time (minutes)"
                name="totalTime"
                value={recipe.totalTime}
                disabled
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
                error={!!formErrors.servings}
                helperText={formErrors.servings}
                inputProps={{ min: 1 }}
              />
              <TextField
                required
                select
                label="Difficulty"
                name="difficulty"
                value={recipe.difficulty}
                onChange={handleChange}
                error={!!formErrors.difficulty}
                helperText={formErrors.difficulty}
                sx={{ minWidth: 120 }}
              >
                {difficultyLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </TextField>
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
                variant="outlined"
                onClick={handleCancel}
                startIcon={<ArrowBack />}
                sx={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<Save />}
                sx={{ flex: 1 }}
              >
                {id ? 'Save Changes' : 'Add Recipe'}
              </Button>

            </Box>
          </form>
        </Paper>
      </Box>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={2000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddEditRecipe;
