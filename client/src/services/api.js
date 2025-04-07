/**
 * File: api.js
 * Student's Name: Manoj Bishwakarma, Laxman Rokaya
 * StudentID: 200544391, 200544400
 * Date: April 6, 2024
 */

import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (username, email, password) => {
  try {
    console.log("Sending registration request with:", {
      username,
      email,
      password: "***",
    });
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });
    console.log("Registration response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Registration error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const getAllRecipes = async () => {
  const response = await api.get("/recipes/getAllRecipes");
  return response.data;
};

export const getRecipeById = async (id) => {
  const response = await api.get(`/recipes/getAllRecipes/${id}`);
  return response.data;
};

export const createRecipe = async (recipeData) => {
  const response = await api.post("/recipes/createRecipe", recipeData);
  return response.data;
};

export const updateRecipe = async (id, recipeData) => {
  const response = await api.put(`/recipes/updateRecipe/${id}`, recipeData);
  return response.data;
};

export const deleteRecipe = async (id) => {
  const response = await api.delete(`/recipes/deleteRecipe/${id}`);
  return response.data;
};

export default api;
