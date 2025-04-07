/**
 * File: RecipeList.js
 * Student's Name: Manoj Bishwakarma, Laxman Rokaya
 * StudentID: 200544391, 200544400
 * Date: April 6, 2024
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRecipes, deleteRecipe } from "../services/api";
import {
  Container,
  Paper,
  Grid,
  IconButton,
  Button,
  Typography,
  Box,
  Rating,
  Card,
  CardContent,
  Avatar,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Alert,
  Fab,
  Zoom,
  Slide,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
  Restaurant as RestaurantIcon,
  AccessTime as TimeIcon,
  Create as CreateIcon,
} from "@mui/icons-material";

// Custom Recipe Card Component
const RecipeCard = ({ recipe, onEdit, onDelete }) => {
  const theme = useTheme();

  // Define difficulty color based on level
  const getDifficultyColor = (difficulty) => {
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

  return (
    <Zoom in={true} style={{ transitionDelay: "50ms" }}>
      <Card
        elevation={3}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          },
          position: "relative",
          overflow: "hidden",
          borderRadius: 2,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          },
        }}
      >
        <Box
          sx={{
            height: 140,
            backgroundImage: `url(${recipe.photoLink})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "flex-end",
              padding: 1,
            }}
          >
            <Chip
              label={recipe.difficulty}
              size="small"
              sx={{
                backgroundColor: getDifficultyColor(recipe.difficulty),
                color: "white",
                fontWeight: "bold",
              }}
            />
          </Box>
        </Box>

        <CardContent
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              mb: 1,
              fontWeight: 600,
              lineHeight: 1.2,
              height: "2.4em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {recipe.recipeName}
          </Typography>

          <Box sx={{ mb: 1, display: "flex", alignItems: "center" }}>
            <RestaurantIcon color="action" fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {recipe.cuisine}
            </Typography>
          </Box>

          <Box sx={{ mb: 1.5, display: "flex", alignItems: "center" }}>
            <TimeIcon color="action" fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {recipe.cookingTime} mins
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1.5,
              height: "3em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {recipe.description}
          </Typography>

          <Box sx={{ mt: "auto" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Rating
                value={recipe.averageRating || 0}
                precision={0.5}
                readOnly
                size="small"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {recipe.averageRating
                  ? recipe.averageRating.toFixed(1)
                  : "No ratings"}
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Tooltip title="Edit Recipe">
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => onEdit(recipe._id)}
                  sx={{
                    backgroundColor: "rgba(33, 150, 243, 0.08)",
                    "&:hover": {
                      backgroundColor: "rgba(33, 150, 243, 0.15)",
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Recipe">
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => onDelete(recipe._id)}
                  sx={{
                    backgroundColor: "rgba(244, 67, 54, 0.08)",
                    "&:hover": {
                      backgroundColor: "rgba(244, 67, 54, 0.15)",
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );
};

const RecipeList = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await getAllRecipes();
      setRecipes(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError(err.response?.data?.message || "Failed to fetch recipes");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    navigate("/add");
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const openDeleteDialog = (id) => {
    setRecipeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRecipeToDelete(null);
  };

  const confirmDelete = async () => {
    if (!recipeToDelete) return;

    try {
      await deleteRecipe(recipeToDelete);
      setDeleteDialogOpen(false);
      setRecipeToDelete(null);
      // Refresh recipes list
      fetchRecipes();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete recipe");
      setDeleteDialogOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(to bottom, ${theme.palette.grey[50]}, ${theme.palette.grey[100]})`,
        pt: 4,
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Page Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            backgroundColor: "white",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            position: "relative",
            overflow: "hidden",
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

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  mr: 2,
                  width: 50,
                  height: 50,
                }}
              >
                <RestaurantIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" fontWeight="700">
                  My Recipes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your collection of delicious recipes
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: { xs: 2, sm: 0 } }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAdd}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 2,
                  py: 1,
                  fontWeight: 600,
                }}
              >
                Add New Recipe
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 2,
                  py: 1,
                  fontWeight: 600,
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {!loading && error && (
          <Alert
            severity="error"
            variant="filled"
            sx={{ mb: 4, borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {!loading && !error && recipes.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <RestaurantIcon
              sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No recipes found
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, textAlign: "center" }}
            >
              Start your culinary journey by adding your first recipe
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                py: 1,
                fontWeight: 600,
              }}
            >
              Add Your First Recipe
            </Button>
          </Paper>
        )}

        {/* Recipe Grid */}
        {!loading && !error && recipes.length > 0 && (
          <Grid container spacing={3}>
            {recipes.map((recipe) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={recipe._id}>
                <RecipeCard
                  recipe={recipe}
                  onEdit={handleEdit}
                  onDelete={openDeleteDialog}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Floating Action Button for Add Recipe */}
        <Zoom in={true}>
          <Fab
            color="primary"
            aria-label="add recipe"
            sx={{
              position: "fixed",
              bottom: 32,
              right: 32,
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            }}
            onClick={handleAdd}
          >
            <AddIcon />
          </Fab>
        </Zoom>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={closeDeleteDialog}
          PaperProps={{
            sx: {
              borderRadius: 2,
              p: 1,
            },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Are you sure you want to delete this recipe? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={closeDeleteDialog}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              variant="contained"
              color="error"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default RecipeList;
