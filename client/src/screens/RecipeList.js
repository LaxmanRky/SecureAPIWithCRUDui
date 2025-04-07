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
  useMediaQuery,
  Skeleton,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
  Restaurant as RestaurantIcon,
  AccessTime as TimeIcon,
  Create as CreateIcon,
  Star as StarIcon,
} from "@mui/icons-material";

// Custom Recipe Card Component
const RecipeCard = ({ recipe, onEdit, onDelete }) => {
  const theme = useTheme();
  const [elevation, setElevation] = useState(2);

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
        elevation={elevation}
        onMouseOver={() => setElevation(6)}
        onMouseOut={() => setElevation(2)}
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-8px)",
          },
          position: "relative",
          overflow: "hidden",
          borderRadius: 3,
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
            height: 180,
            backgroundImage: `url(${
              recipe.photoLink ||
              "https://via.placeholder.com/300x180?text=Recipe"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.15)",
              transition: "background 0.3s ease",
            },
            "&:hover::after": {
              background: "rgba(0,0,0,0.1)",
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              padding: 1.5,
              zIndex: 1,
            }}
          >
            <Chip
              label={recipe.difficulty}
              size="small"
              sx={{
                backgroundColor: getDifficultyColor(recipe.difficulty),
                color: "white",
                fontWeight: "bold",
                letterSpacing: "0.5px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            />
            <Chip
              icon={
                <StarIcon sx={{ color: "white !important", fontSize: 16 }} />
              }
              label={
                recipe.averageRating ? recipe.averageRating.toFixed(1) : "New"
              }
              size="small"
              sx={{
                backgroundColor: "rgba(0,0,0,0.6)",
                color: "white",
                fontWeight: "bold",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            />
          </Box>
        </Box>

        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            px: 2.5,
            py: 2.5,
            height: { xs: "auto", sm: 220 },
            "&:last-child": { pb: 2.5 },
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              mb: 1.5,
              fontWeight: 700,
              lineHeight: 1.2,
              height: "2.4em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              color: theme.palette.text.primary,
            }}
          >
            {recipe.recipeName}
          </Typography>

          <Box sx={{ mb: 1.5, display: "flex", alignItems: "center" }}>
            <RestaurantIcon
              color="action"
              fontSize="small"
              sx={{ mr: 0.75, color: theme.palette.grey[600] }}
            />
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
                noWrap: true,
                maxWidth: "100%",
              }}
            >
              {recipe.cuisine}
            </Typography>
          </Box>

          <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
            <TimeIcon
              color="action"
              fontSize="small"
              sx={{ mr: 0.75, color: theme.palette.grey[600] }}
            />
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              {recipe.cookingTime} mins
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              mb: 2,
              height: "3em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              color: theme.palette.text.secondary,
              lineHeight: 1.5,
            }}
          >
            {recipe.description}
          </Typography>

          <Box sx={{ mt: "auto" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
              }}
            >
              <Tooltip title="Edit Recipe">
                <IconButton
                  color="primary"
                  size="medium"
                  onClick={() => onEdit(recipe._id)}
                  sx={{
                    backgroundColor:
                      theme.palette.primary.lighter ||
                      "rgba(33, 150, 243, 0.08)",
                    "&:hover": {
                      backgroundColor: theme.palette.primary.light,
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Recipe">
                <IconButton
                  color="error"
                  size="medium"
                  onClick={() => onDelete(recipe._id)}
                  sx={{
                    backgroundColor:
                      theme.palette.error.lighter || "rgba(244, 67, 54, 0.08)",
                    "&:hover": {
                      backgroundColor: theme.palette.error.light,
                    },
                    transition: "all 0.2s ease",
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

// Loading placeholder for recipe cards
const RecipeCardSkeleton = () => (
  <Card
    sx={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      borderRadius: 3,
      overflow: "hidden",
    }}
  >
    <Skeleton variant="rectangular" height={180} />
    <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
      <Skeleton variant="text" height={32} width="80%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={24} width="60%" sx={{ mb: 1 }} />
      <Skeleton variant="text" height={24} width="40%" sx={{ mb: 1.5 }} />
      <Skeleton variant="text" height={24} width="100%" />
      <Skeleton variant="text" height={24} width="100%" sx={{ mb: 1.5 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Skeleton variant="circular" width={36} height={36} />
        <Skeleton variant="circular" width={36} height={36} />
      </Box>
    </CardContent>
  </Card>
);

const RecipeList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
      // Show success message
      setSnackbar({
        open: true,
        message: "Recipe deleted successfully",
        severity: "success",
      });
      // Refresh recipes list
      fetchRecipes();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete recipe");
      setDeleteDialogOpen(false);
      setSnackbar({
        open: true,
        message: "Failed to delete recipe",
        severity: "error",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${theme.palette.grey[50]}, ${theme.palette.grey[100]})`,
        pt: { xs: 3, md: 4 },
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Page Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: { xs: 3, md: 4 },
            borderRadius: 3,
            backgroundColor: "white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
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
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  mr: 2,
                  width: 56,
                  height: 56,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                <RestaurantIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="800"
                  sx={{
                    fontSize: { xs: "1.75rem", sm: "2.25rem" },
                    letterSpacing: "-0.01em",
                  }}
                >
                  My Recipes
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Manage your collection of delicious recipes
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: { xs: 2, sm: 0 },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAdd}
                fullWidth={isMobile}
                size={isMobile ? "large" : "medium"}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: { xs: 1.5, sm: 2 },
                  py: 1,
                  fontWeight: 600,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                  },
                }}
              >
                Add New Recipe
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                fullWidth={isMobile}
                size={isMobile ? "large" : "medium"}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: { xs: 1.5, sm: 2 },
                  py: 1,
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Loading State - Skeleton */}
        {loading && (
          <Box sx={{ pb: 4 }}>
            <Grid
              container
              spacing={3}
              alignItems="stretch"
              justifyContent="flex-start"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={item}
                  sx={{
                    display: "flex",
                    height: "100%",
                    width: { md: "25%" },
                    flexBasis: { md: "25%" },
                    maxWidth: { md: "25%" },
                    flexGrow: 0,
                  }}
                >
                  <RecipeCardSkeleton />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Error State */}
        {!loading && error && (
          <Alert
            severity="error"
            variant="filled"
            sx={{
              mb: 4,
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(211, 47, 47, 0.2)",
            }}
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
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              backgroundColor: "white",
            }}
          >
            <RestaurantIcon
              sx={{
                fontSize: 70,
                color: theme.palette.grey[400],
                mb: 2,
                opacity: 0.8,
              }}
            />
            <Typography
              variant="h5"
              sx={{
                mb: 1,
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              No recipes found
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, textAlign: "center", maxWidth: 450 }}
            >
              Start your culinary journey by adding your first recipe. It's easy
              to get started!
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                py: 1.2,
                fontWeight: 600,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                },
              }}
            >
              Add Your First Recipe
            </Button>
          </Paper>
        )}

        {/* Recipe Grid */}
        {!loading && !error && recipes.length > 0 && (
          <Box sx={{ pb: 4 }}>
            <Grid
              container
              spacing={3}
              alignItems="stretch"
              justifyContent="flex-start"
              sx={{ mb: 2 }}
            >
              {recipes.map((recipe) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={recipe._id}
                  sx={{
                    display: "flex",
                    height: "100%",
                    width: { md: "25%" },
                    flexBasis: { md: "25%" },
                    maxWidth: { md: "25%" },
                    flexGrow: 0,
                  }}
                >
                  <RecipeCard
                    recipe={recipe}
                    onEdit={handleEdit}
                    onDelete={openDeleteDialog}
                  />
                </Grid>
              ))}
            </Grid>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
                pt: 3,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  backgroundColor: "rgba(255,255,255,0.8)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Displaying all {recipes.length}{" "}
                  {recipes.length === 1 ? "recipe" : "recipes"}
                </Typography>
              </Paper>
            </Box>
          </Box>
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
              boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "translateY(-4px) scale(1.05)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
              },
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
              borderRadius: 3,
              p: 1,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            },
          }}
        >
          <DialogTitle
            sx={{
              pb: 1,
              pt: 2,
              px: 3,
            }}
          >
            <Typography variant="h6" component="div" fontWeight={600}>
              Confirm Delete
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ px: 3 }}>
            <Typography variant="body1">
              Are you sure you want to delete this recipe? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
            <Button
              onClick={closeDeleteDialog}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
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
                px: 3,
                boxShadow: "0 4px 10px rgba(244, 67, 54, 0.2)",
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={closeSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              width: "100%",
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default RecipeList;
