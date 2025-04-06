# Secure API with CRUD UI

A full-stack application featuring an Express.js API with JWT authentication and a mobile-friendly UI for recipe management.

## Features

- JWT Authentication (Register/Login)
- Full CRUD operations for recipes
- Mobile-friendly UI with multiple screens:
  - Recipe List Screen
  - Add/Edit Recipe Screen
  - Register Screen
  - Login Screen
- MongoDB integration
- Secure session management

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- CORS for cross-origin requests

### Frontend (Mobile UI)
- React Native
- AsyncStorage for local session management
- Axios for API requests

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with required environment variables
4. Run the development server: `npm run dev`

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login

### Recipes (Protected Routes)
- GET /api/recipes - Get all recipes
- GET /api/recipes/:id - Get single recipe
- POST /api/recipes - Create new recipe
- PUT /api/recipes/:id - Update recipe
- DELETE /api/recipes/:id - Delete recipe
