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

const difficultyLevels = ['Easy', 'Medium', 'Hard'];

const cuisineTypes = [
  'African',
  'American',
  'Brazilian',
  'British',
  'Caribbean',
  'Chinese',
  'French',
  'Greek',
  'Indian',
  'Italian',
  'Japanese',
  'Korean',
  'Mediterranean',
  'Mexican',
  'Middle Eastern',
  'Spanish',
  'Thai',
  'Vietnamese'
];

const AddEditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [recipe, setRecipe] = useState({
    recipeName: '',
    description: '',
    ingredients: [],
    instructions: [],
    cookingTime: '',
    difficulty: '',
    cuisine: '',
    photoLink: '',
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
    if (!recipe.description) errors.description = 'Description is required';
    if (!recipe.ingredients || recipe.ingredients.length === 0) errors.ingredients = 'At least one ingredient is required';
    if (!recipe.cookingTime) errors.cookingTime = 'Cooking time is required';
    if (!recipe.difficulty) errors.difficulty = 'Difficulty level is required';
    if (!recipe.cuisine) errors.cuisine = 'Cuisine is required';
    if (!recipe.photoLink) errors.photoLink = 'Photo link is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'ingredients' || name === 'instructions') {
      // Split text by new lines and filter out empty lines
      const items = value.split('\n').filter(item => item.trim() !== '');
      setRecipe(prev => ({
        ...prev,
        [name]: items
      }));
    } else {
      setRecipe(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };



  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      navigate('/recipes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

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
              multiline
              rows={2}
              label="Description"
              name="description"
              value={recipe.description}
              onChange={handleChange}
              error={!!formErrors.description}
              helperText={formErrors.description}
            />
            <TextField
              margin="normal"
              required
              select
              fullWidth
              label="Cuisine"
              name="cuisine"
              value={recipe.cuisine}
              onChange={handleChange}
              error={!!formErrors.cuisine}
              helperText={formErrors.cuisine}
            >
              {cuisineTypes.map((cuisine) => (
                <MenuItem key={cuisine} value={cuisine}>
                  {cuisine}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              rows={4}
              label="Ingredients (one per line)"
              name="ingredients"
              value={recipe.ingredients.join('\n')}
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
              value={recipe.instructions.join('\n')}
              onChange={handleChange}
              error={!!formErrors.instructions}
              helperText={formErrors.instructions}
              placeholder="1. Preheat oven to 350°F\n2. Mix ingredients\n3. Bake for 30 minutes"
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                required
                label="Cooking Time (minutes)"
                name="cookingTime"
                type="number"
                value={recipe.cookingTime}
                onChange={handleChange}
                error={!!formErrors.cookingTime}
                helperText={formErrors.cookingTime}
                inputProps={{ min: 0 }}
                fullWidth
              />
              <TextField
                required
                fullWidth
                label="Photo Link"
                name="photoLink"
                value={recipe.photoLink}
                onChange={handleChange}
                error={!!formErrors.photoLink}
                helperText={formErrors.photoLink}
                placeholder="https://example.com/photo.jpg"
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
