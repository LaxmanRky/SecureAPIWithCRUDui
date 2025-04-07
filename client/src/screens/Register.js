/**
 * File: Register.js
 * Student's Name: Manoj Bishwakarma, Laxman Rokaya
 * StudentID: 200544391, 200544400
 * Date: April 6, 2024
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Snackbar,
  Avatar,
  InputAdornment,
  IconButton,
  Zoom,
  Card,
  CardContent,
} from "@mui/material";
import {
  LockOutlined,
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  PersonAdd,
} from "@mui/icons-material";
import { register } from "../services/api";
import { useTheme } from "@mui/material/styles";

const Register = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  /**
   * Toggle password visibility
   */
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Toggle confirm password visibility
   */
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  /**
   * Handle input change and clear errors
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  /**
   * Handle input blur and clear general errors
   */
  const handleBlur = (e) => {
    const { name } = e.target;
    if (formErrors.general) {
      setFormErrors({ ...formErrors, general: "" });
    }
  };

  /**
   * Handle form submission with validation
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRedirecting(true);
    setFormErrors({});
    setError("");

    if (!formData.username) {
      setFormErrors((prev) => ({ ...prev, username: "Username is required" }));
      setIsRedirecting(false);
      return;
    }

    if (!formData.email) {
      setFormErrors((prev) => ({ ...prev, email: "Email is required" }));
      setIsRedirecting(false);
      return;
    }

    if (!formData.password) {
      setFormErrors((prev) => ({ ...prev, password: "Password is required" }));
      setIsRedirecting(false);
      return;
    }

    if (formData.password.length < 6) {
      setFormErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
      setIsRedirecting(false);
      return;
    }

    if (!formData.confirmPassword) {
      setFormErrors((prev) => ({
        ...prev,
        confirmPassword: "Please confirm your password",
      }));
      setIsRedirecting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      setIsRedirecting(false);
      return;
    }

    try {
      await register(formData.username, formData.email, formData.password);
      setSuccessMessage("Registration successful! Redirecting to login...");

      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      setError(message);
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Zoom in={true} timeout={500}>
        <Card
          elevation={8}
          sx={{
            width: "100%",
            borderRadius: 4,
            overflow: "hidden",
            background: "white",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "8px",
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          />
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Avatar
                sx={{
                  m: 1,
                  bgcolor: theme.palette.primary.main,
                  width: 60,
                  height: 60,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                }}
              >
                <LockOutlined sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  mt: 2,
                  fontWeight: 600,
                  color: "text.primary",
                }}
              >
                Create Account
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: "text.secondary",
                  textAlign: "center",
                }}
              >
                Join our community to have amazing recipes
              </Typography>
            </Box>

            {error && (
              <Alert
                severity="error"
                variant="filled"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  mb: 3,
                }}
              >
                <TextField
                  required
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  error={!!formErrors.username}
                  helperText={formErrors.username}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                      borderRadius: 2,
                      backgroundColor: "#f9fafb",
                      "& fieldset": {
                        borderColor: "rgba(0,0,0,0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(0,0,0,0.2)",
                      },
                    },
                  }}
                />

                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                      borderRadius: 2,
                      backgroundColor: "#f9fafb",
                      "& fieldset": {
                        borderColor: "rgba(0,0,0,0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(0,0,0,0.2)",
                      },
                    },
                  }}
                />

                <TextField
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                      borderRadius: 2,
                      backgroundColor: "#f9fafb",
                      "& fieldset": {
                        borderColor: "rgba(0,0,0,0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(0,0,0,0.2)",
                      },
                    },
                  }}
                />

                <TextField
                  required
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={!!formErrors.confirmPassword}
                  helperText={formErrors.confirmPassword}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                      borderRadius: 2,
                      backgroundColor: "#f9fafb",
                      "& fieldset": {
                        borderColor: "rgba(0,0,0,0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(0,0,0,0.2)",
                      },
                    },
                  }}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={<PersonAdd />}
                sx={{
                  borderRadius: 2,
                  py: 1.8,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  boxShadow: "0 4px 12px rgba(33, 150, 243, 0.35)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: "0 6px 18px rgba(33, 150, 243, 0.45)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Create Account
              </Button>

              <Box
                sx={{
                  mt: 3,
                  textAlign: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    style={{
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Sign in here
                  </Link>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Zoom>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={2000}
        onClose={() => setSuccessMessage("")}
        TransitionComponent={Zoom}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: 3,
            display: "flex",
            alignItems: "center",
          }}
        >
          {successMessage}
          {isRedirecting && (
            <Box
              component="span"
              sx={{
                display: "inline-block",
                ml: 1,
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: "2px solid currentColor",
                borderTopColor: "transparent",
                animation: "spin 1s linear infinite",
                "@keyframes spin": {
                  "0%": {
                    transform: "rotate(0deg)",
                  },
                  "100%": {
                    transform: "rotate(360deg)",
                  },
                },
              }}
            />
          )}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
