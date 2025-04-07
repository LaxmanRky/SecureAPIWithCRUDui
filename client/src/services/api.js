/**
 * File: api.js
 * Student's Name: Manoj Bishwakarma, Laxman Rokaya
 * StudentID: 200544391, 200544400
 * Date: April 6, 2024
 */

import axios from "axios";

const API_URL = "http://localhost:5000/api";

/**
 * Axios instance with base configuration for API requests
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor to add auth token to requests
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Login a user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} Response data containing auth token
 */
export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

/**
 * Register a new user
 * @param {string} username - User's username
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} Response data containing auth token
 * @throws {Error} If registration fails
 */
export const register = async (username, email, password) => {
  try {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all recipes
 * @returns {Promise<Array>} Array of recipe objects
 */
export const getAllRecipes = async () => {
  const response = await api.get("/recipes/getAllRecipes");
  return response.data;
};

/**
 * Get a recipe by ID
 * @param {string} id - Recipe ID to retrieve
 * @returns {Promise<Object>} Recipe object
 */
export const getRecipeById = async (id) => {
  const response = await api.get(`/recipes/getAllRecipes/${id}`);
  return response.data;
};

/**
 * Create a new recipe
 * @param {Object} recipeData - Recipe data to create
 * @returns {Promise<Object>} Created recipe object
 */
export const createRecipe = async (recipeData) => {
  const response = await api.post("/recipes/createRecipe", recipeData);
  return response.data;
};

/**
 * Update an existing recipe
 * @param {string} id - ID of recipe to update
 * @param {Object} recipeData - Updated recipe data
 * @returns {Promise<Object>} Updated recipe object
 */
export const updateRecipe = async (id, recipeData) => {
  const response = await api.put(`/recipes/updateRecipe/${id}`, recipeData);
  return response.data;
};

/**
 * Delete a recipe
 * @param {string} id - ID of recipe to delete
 * @returns {Promise<Object>} Response data with success message
 */
export const deleteRecipe = async (id) => {
  const response = await api.delete(`/recipes/deleteRecipe/${id}`);
  return response.data;
};

export default api;
