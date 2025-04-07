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

  // Add new function to handle key press in text areas
  const handleKeyDown = (e, fieldName) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const cursorPosition = e.target.selectionStart;
      const currentValue = e.target.value;

      // Get text before and after the cursor
      const textBeforeCursor = currentValue.substring(0, cursorPosition);
      const textAfterCursor = currentValue.substring(cursorPosition);

      let newText;
      let numberMatch = null;

      // Handle both instructions and ingredients with numbering
      const lines = textBeforeCursor.split("\n");
      const lastLine = lines[lines.length - 1];

      // Extract the number from the last line if it exists (works for both formats: "1." or "1 ")
      numberMatch = lastLine.match(/^(\d+)[\.\s]/);

      if (numberMatch) {
        // If last line has a number, increment it for the new line
        const lastNumber = parseInt(numberMatch[1]);
        const nextNumber = lastNumber + 1;
        // Use different formatting based on field type
        if (fieldName === "instructions") {
          newText =
            textBeforeCursor + "\n" + nextNumber + ". " + textAfterCursor;
        } else {
          // For ingredients, use a space instead of a period
          newText =
            textBeforeCursor + "\n" + nextNumber + " " + textAfterCursor;
        }
      } else {
        // If no numbered lines yet, start with 1
        if (fieldName === "instructions") {
          newText = textBeforeCursor + "\n1. " + textAfterCursor;
        } else {
          newText = textBeforeCursor + "\n1 " + textAfterCursor;
        }
      }

      // Update the field value
      const event = {
        target: {
          name: fieldName,
          value: newText,
        },
      };

      handleChange(event);

      // Set cursor position after the auto-added text
      setTimeout(() => {
        const newPosition =
          cursorPosition +
          (numberMatch
            ? fieldName === "instructions"
              ? 4
              : 3 // "X. " vs "X "
            : fieldName === "instructions"
            ? 3
            : 2); // "1. " vs "1 "

        const textarea = document.querySelector(
          `textarea[name="${fieldName}"]`
        );
        if (textarea) {
          textarea.setSelectionRange(newPosition, newPosition);
          textarea.focus();
        }
      }, 0);
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
        background: `linear-gradient(165deg, #f5f7fa 0%, #e4e7eb 100%)`,
        pt: { xs: 2, md: 3 },
        pb: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 3,
            backgroundColor: "white",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            position: "relative",
            mb: 4,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
            }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 4,
              flexWrap: { xs: "wrap", sm: "nowrap" },
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                mr: { xs: 1, sm: 2 },
                width: 64,
                height: 64,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                border: "4px solid white",
              }}
            >
              <RestaurantIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                component="h1"
                fontWeight="800"
                sx={{
                  fontSize: { xs: "1.8rem", sm: "2.2rem" },
                  letterSpacing: "-0.01em",
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block",
                  lineHeight: 1.2,
                }}
              >
                {id ? "Edit Recipe" : "Create New Recipe"}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  fontWeight: 500,
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
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(211, 47, 47, 0.15)",
              }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 700,
                fontSize: "1.25rem",
                color: theme.palette.text.primary,
                display: "flex",
                alignItems: "center",
              }}
            >
              <FastfoodIcon
                sx={{
                  mr: 1.5,
                  color: theme.palette.primary.main,
                  fontSize: 26,
                }}
              />
              Basic Information
            </Typography>

            <Grid container spacing={3} alignItems="flex-start">
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
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                      transition: "all 0.2s ease",
                      height: 56,
                      "&:hover": {
                        boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.15)",
                      },
                    },
                    "& .MuiInputBase-input": {
                      height: "1.4375em",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  required
                  error={!!formErrors.cuisine}
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                      transition: "all 0.2s ease",
                      height: 56,
                      "&:hover": {
                        boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.15)",
                      },
                    },
                  }}
                >
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
                  size="medium"
                  sx={{
                    mt: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.15)",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Box
              component={Divider}
              sx={{
                my: 4,
                borderColor: "rgba(0,0,0,0.09)",
                opacity: 0.8,
              }}
            />

            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 700,
                fontSize: "1.25rem",
                color: theme.palette.text.primary,
                display: "flex",
                alignItems: "center",
              }}
            >
              <ListAltIcon
                sx={{
                  mr: 1.5,
                  color: theme.palette.primary.main,
                  fontSize: 26,
                }}
              />
              Ingredients & Instructions
            </Typography>

            <Grid container spacing={3} alignItems="stretch">
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={10}
                  label="Ingredients (one per line)"
                  name="ingredients"
                  value={recipe.ingredients.join("\n")}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, "ingredients")}
                  error={!!formErrors.ingredients}
                  helperText={
                    formErrors.ingredients ||
                    "Press Enter to add a new numbered ingredient automatically"
                  }
                  placeholder="1 cup all-purpose flour
2 large eggs
3 tbsp white sugar
4 tsp vanilla extract
5 tbsp butter, melted
6 tsp salt"
                  variant="outlined"
                  size="medium"
                  sx={{
                    height: "100%",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      height: "100%",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.15)",
                      },
                    },
                    "& .MuiInputBase-input": {
                      fontFamily: "monospace",
                      fontSize: "0.95rem",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ alignSelf: "flex-start", mt: 1.5 }}
                      >
                        <ListAltIcon color="primary" />
                      </InputAdornment>
                    ),
                    sx: { height: "100%" },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={10}
                  label="Instructions (numbered steps)"
                  name="instructions"
                  value={recipe.instructions.join("\n")}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, "instructions")}
                  error={!!formErrors.instructions}
                  helperText={
                    formErrors.instructions ||
                    "Press Enter to add a new numbered step automatically"
                  }
                  placeholder="1. Preheat oven to 350°F (175°C)
2. Mix flour, sugar, and salt in a large bowl
3. Add eggs and vanilla, stir until combined
4. Fold in melted butter until smooth
5. Pour batter into prepared pan
6. Bake for 25-30 minutes or until golden"
                  variant="outlined"
                  size="medium"
                  sx={{
                    height: "100%",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      height: "100%",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.15)",
                      },
                    },
                    "& .MuiInputBase-input": {
                      fontFamily: "monospace",
                      fontSize: "0.95rem",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ alignSelf: "flex-start", mt: 1.5 }}
                      >
                        <ListAltIcon color="primary" />
                      </InputAdornment>
                    ),
                    sx: { height: "100%" },
                  }}
                />
              </Grid>
            </Grid>

            <Box
              component={Divider}
              sx={{
                my: 4,
                borderColor: "rgba(0,0,0,0.09)",
                opacity: 0.8,
              }}
            />

            <Typography
              variant="h6"
              sx={{
                mb: 3,
                fontWeight: 700,
                fontSize: "1.25rem",
                color: theme.palette.text.primary,
                display: "flex",
                alignItems: "center",
              }}
            >
              <TimeIcon
                sx={{
                  mr: 1.5,
                  color: theme.palette.primary.main,
                  fontSize: 26,
                }}
              />
              Additional Details
            </Typography>

            <Grid container spacing={3} alignItems="flex-start">
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
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                      transition: "all 0.2s ease",
                      height: 56,
                      "&:hover": {
                        boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.15)",
                      },
                    },
                  }}
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
                <FormControl
                  fullWidth
                  required
                  error={!!formErrors.difficulty}
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                      transition: "all 0.2s ease",
                      height: 56,
                      "&:hover": {
                        boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.15)",
                      },
                    },
                  }}
                >
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
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    height: 56,
                    display: "flex",
                    alignItems: "center",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <Typography
                    sx={{ mr: 2, fontWeight: 600, whiteSpace: "nowrap" }}
                  >
                    Recipe Rating:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
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
                      size="medium"
                      sx={{
                        "& .MuiRating-iconFilled": {
                          color: theme.palette.warning.main,
                        },
                        "& .MuiRating-iconHover": {
                          color: theme.palette.warning.light,
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      ({recipe.averageRating || 0})
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
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
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                      transition: "all 0.2s ease",
                      height: 56,
                      "&:hover": {
                        boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.15)",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ImageIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 5,
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleCancel}
                startIcon={<ArrowBack />}
                sx={{
                  borderRadius: 2,
                  px: { xs: 2, sm: 3 },
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                  minWidth: 120,
                  height: 48,
                  borderWidth: "1.5px",
                  "&:hover": {
                    borderWidth: "1.5px",
                    backgroundColor: "rgba(0,0,0,0.04)",
                  },
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
                  px: { xs: 3, sm: 4 },
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                  height: 48,
                  minWidth: 160,
                  background: theme.palette.primary.main,
                  "&:hover": {
                    boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                    background: theme.palette.primary.dark,
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
            boxShadow: "0 8px 16px rgba(0, 150, 0, 0.2)",
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddEditRecipe;
