import React from 'react';
import { Card, CardContent, Typography, Rating, IconButton, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const RecipeCard = ({ recipe, onEdit, onDelete }) => {
  return (
    <Card sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6">{recipe.recipeName}</Typography>
        <Typography variant="body2" color="text.secondary">
          {recipe.cuisine}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Rating value={recipe.averageRating} readOnly precision={0.5} />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({recipe.averageRating})
          </Typography>
        </Box>
      </CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
        <IconButton onClick={() => onEdit(recipe)} color="primary">
          <Edit />
        </IconButton>
        <IconButton onClick={() => onDelete(recipe._id)} color="error">
          <Delete />
        </IconButton>
      </Box>
    </Card>
  );
};

export default RecipeCard;
