/**
 * File: AddEditRecipe.js
 * Student's Name: Manoj Bishwakarma, Laxman Rokaya
 * StudentID: 200544391, 200544400
 * Date: April 6, 2024
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Grid,
  Divider,
  IconButton,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  Chip,
  useTheme,
  Avatar,
  useMediaQuery,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack,
  Save,
  Restaurant as RestaurantIcon,
  AccessTime as TimeIcon,
  Image as ImageIcon,
  Check as CheckIcon,
  Fastfood as FastfoodIcon,
  ListAlt as ListAltIcon,
  Description as DescriptionIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import axios from "axios";

const difficultyLevels = ["Easy", "Medium", "Hard"];

const cuisineTypes = [
  "African",
  "American",
  "Brazilian",
  "British",
  "Caribbean",
  "Chinese",
  "French",
  "Greek",
  "Indian",
  "Italian",
  "Japanese",
  "Korean",
  "Mediterranean",
  "Mexican",
  "Middle Eastern",
  "Nepali",
  "Spanish",
  "Thai",
  "Vietnamese",
];

// Color mapping for difficulty levels
const getDifficultyColor = (difficulty, theme) => {
  switch (difficulty) {
    case "Easy":
      return theme.palette.success.main;
    case "Medium":
      return theme.palette.warning.main;
    case "Hard":
      return theme.palette.error.main;
    default:
      return theme.palette.info.main;
  }
};

const AddEditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [recipe, setRecipe] = useState({
    recipeName: "",
    description: "",
    ingredients: [],
    instructions: [],
    cookingTime: "",
    difficulty: "",
    cuisine: "",
    photoLink: "",
    averageRating: 0,
  });

  // Preview state
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (id) {
      fetchRecipe();
    }
  }, [id]);

  useEffect(() => {
    if (recipe.photoLink) {
      setPreviewUrl(recipe.photoLink);
    }
  }, [recipe.photoLink]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/recipes/getAllRecipes/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecipe(response.data);
      setPreviewUrl(response.data.photoLink);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch recipe");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!recipe.recipeName) errors.recipeName = "Recipe name is required";
    if (!recipe.description) errors.description = "Description is required";
    if (!recipe.ingredients || recipe.ingredients.length === 0)
      errors.ingredients = "At least one ingredient is required";
    if (!recipe.instructions || recipe.instructions.length === 0)
      errors.instructions = "At least one instruction step is required";
    if (!recipe.cookingTime) errors.cookingTime = "Cooking time is required";
    if (!recipe.difficulty) errors.difficulty = "Difficulty level is required";
    if (!recipe.cuisine) errors.cuisine = "Cuisine is required";
    if (!recipe.photoLink) errors.photoLink = "Photo link is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "ingredients" || name === "instructions") {
      // Split text by new lines and filter out empty lines
      const items = value.split("\n").filter((item) => item.trim() !== "");
      setRecipe((prev) => ({
        ...prev,
        [name]: items,
      }));
    } else {
      setRecipe((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      )
    ) {
      navigate("/recipes");
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (id) {
        await axios.put(
          `http://localhost:5000/api/recipes/updateRecipe/${id}`,
          recipe,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/recipes/createRecipe",
          recipe,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      setSuccessMessage(
        id ? "Recipe updated successfully!" : "Recipe added successfully!"
      );
      setTimeout(() => {
        navigate("/recipes");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save recipe");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
          {id ? "Loading recipe..." : "Preparing form..."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${theme.palette.grey[50]}, ${theme.palette.grey[100]})`,
        pt: { xs: 3, md: 4 },
        pb: 8,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            backgroundColor: "white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            position: "relative",
            overflow: "hidden",
            mb: 4,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                mr: 2,
                width: 50,
                height: 50,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <RestaurantIcon fontSize="medium" />
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                component="h1"
                fontWeight="800"
                sx={{
                  fontSize: { xs: "1.5rem", sm: "1.75rem" },
                  letterSpacing: "-0.01em",
                }}
              >
                {id ? "Edit Recipe" : "Create New Recipe"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                }}
              >
                {id
                  ? "Update your recipe with new information"
                  : "Share your culinary masterpiece with the world"}
              </Typography>
            </Box>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Basic Information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Recipe Name"
                  name="recipeName"
                  value={recipe.recipeName}
                  onChange={handleChange}
                  error={!!formErrors.recipeName}
                  helperText={formErrors.recipeName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FastfoodIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="E.g., Creamy Garlic Pasta"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required error={!!formErrors.cuisine}>
                  <InputLabel id="cuisine-label">Cuisine</InputLabel>
                  <Select
                    labelId="cuisine-label"
                    name="cuisine"
                    value={recipe.cuisine}
                    onChange={handleChange}
                    label="Cuisine"
                    startAdornment={
                      <InputAdornment position="start">
                        <RestaurantIcon color="primary" />
                      </InputAdornment>
                    }
                  >
                    {cuisineTypes.map((cuisine) => (
                      <MenuItem key={cuisine} value={cuisine}>
                        {cuisine}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.cuisine && (
                    <Typography variant="caption" color="error">
                      {formErrors.cuisine}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  name="description"
                  value={recipe.description}
                  onChange={handleChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ alignSelf: "flex-start", mt: 1.5 }}
                      >
                        <DescriptionIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Briefly describe your recipe and what makes it special..."
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Ingredients & Instructions
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={8}
                  label="Ingredients (one per line)"
                  name="ingredients"
                  value={recipe.ingredients.join("\n")}
                  onChange={handleChange}
                  error={!!formErrors.ingredients}
                  helperText={
                    formErrors.ingredients ||
                    "Enter each ingredient on a new line"
                  }
                  placeholder="1 cup flour&#10;2 eggs&#10;1/2 cup sugar&#10;1 tsp vanilla extract"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ alignSelf: "flex-start", mt: 1.5 }}
                      >
                        <ListAltIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={8}
                  label="Instructions (numbered steps)"
                  name="instructions"
                  value={recipe.instructions.join("\n")}
                  onChange={handleChange}
                  error={!!formErrors.instructions}
                  helperText={
                    formErrors.instructions || "Enter each step on a new line"
                  }
                  placeholder="1. Preheat oven to 350°F&#10;2. Mix flour, sugar, and eggs&#10;3. Pour into pan&#10;4. Bake for 30 minutes"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ alignSelf: "flex-start", mt: 1.5 }}
                      >
                        <ListAltIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Additional Details
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  required
                  fullWidth
                  label="Cooking Time"
                  name="cookingTime"
                  type="number"
                  value={recipe.cookingTime}
                  onChange={handleChange}
                  error={!!formErrors.cookingTime}
                  helperText={formErrors.cookingTime}
                  inputProps={{ min: 0 }}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TimeIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">minutes</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth required error={!!formErrors.difficulty}>
                  <InputLabel id="difficulty-label">Difficulty</InputLabel>
                  <Select
                    labelId="difficulty-label"
                    name="difficulty"
                    value={recipe.difficulty}
                    onChange={handleChange}
                    label="Difficulty"
                  >
                    {difficultyLevels.map((level) => (
                      <MenuItem key={level} value={level}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Chip
                            size="small"
                            label={level}
                            sx={{
                              backgroundColor: getDifficultyColor(level, theme),
                              color: "white",
                              mr: 1,
                              fontWeight: "bold",
                            }}
                          />
                          {level}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.difficulty && (
                    <Typography variant="caption" color="error">
                      {formErrors.difficulty}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Typography component="legend" sx={{ mb: 1 }}>
                    Recipe Rating
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Rating
                      name="averageRating"
                      value={recipe.averageRating}
                      precision={0.5}
                      onChange={(event, newValue) => {
                        setRecipe((prev) => ({
                          ...prev,
                          averageRating: newValue,
                        }));
                      }}
                      emptyIcon={<StarBorderIcon fontSize="inherit" />}
                      size="large"
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      ({recipe.averageRating || 0})
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Photo URL"
                  name="photoLink"
                  value={recipe.photoLink}
                  onChange={handleChange}
                  error={!!formErrors.photoLink}
                  helperText={
                    formErrors.photoLink || "Enter a URL for your recipe image"
                  }
                  placeholder="https://example.com/photo.jpg"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ImageIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {previewUrl && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Image Preview:
                  </Typography>
                  <Box
                    sx={{
                      height: 200,
                      borderRadius: 2,
                      overflow: "hidden",
                      position: "relative",
                      backgroundImage: `url(${previewUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  />
                </Grid>
              )}
            </Grid>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 4,
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleCancel}
                startIcon={<ArrowBack />}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<Save />}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.2,
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                  },
                }}
              >
                {id ? "Update Recipe" : "Save Recipe"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={2000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0, 150, 0, 0.15)",
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddEditRecipe;
