import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Snackbar,
  Avatar,
  Grid,
  Divider,
  useTheme,
  InputAdornment,
  IconButton,
  Zoom,
} from "@mui/material";
import {
  ArrowBack,
  PersonAdd,
  LockOutlined,
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
} from "@mui/icons-material";
import { register } from "../services/api";

const Register = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username) errors.username = "Username is required";
    if (!formData.email) errors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      errors.email = "Invalid email format";
    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      console.log("Form data being submitted:", {
        username: formData.username,
        email: formData.email,
        password: formData.password.length + " characters",
      });

      const response = await register(
        formData.username,
        formData.email,
        formData.password
      );

      setSuccessMessage("Registration successful! Redirecting...");
      localStorage.setItem("token", response.token);
      setTimeout(() => {
        navigate("/recipes");
      }, 1500);
    } catch (err) {
      console.error("Registration error details:", err.response?.data);

      // Handle specific validation errors
      if (err.response?.data?.errors) {
        const validationErrors = {};
        Object.entries(err.response.data.errors).forEach(([field, message]) => {
          validationErrors[field] = message;
        });
        setFormErrors(validationErrors);
        setError("Please fix the validation errors");
      } else if (err.response?.data?.field) {
        // Handle duplicate field errors
        setFormErrors({
          [err.response.data
            .field]: `This ${err.response.data.field} is already taken`,
        });
        setError(`This ${err.response.data.field} is already in use`);
      } else {
        setError(
          err.response?.data?.message || "An error occurred during registration"
        );
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container
      component="main"
      maxWidth="md"
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
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              width: "100%",
              maxWidth: 800,
              borderRadius: 4,
              overflow: "hidden",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              background: "white",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            }}
          >
            {/* Left side - decorative */}
            <Box
              sx={{
                width: { xs: "100%", md: "40%" },
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
                color: "white",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage:
                    "url('https://source.unsplash.com/random/800x1200/?pattern')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.2,
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "white",
                  width: 80,
                  height: 80,
                  mb: 2,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <LockOutlined
                  sx={{ fontSize: 40, color: theme.palette.primary.main }}
                />
              </Avatar>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  position: "relative",
                  zIndex: 1,
                  textAlign: "center",
                }}
              >
                Welcome!
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  mb: 3,
                  maxWidth: "90%",
                  textAlign: "center",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Join our community to access amazing recipes, share your own,
                and connect with food lovers.
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{
                    color: "white",
                    fontWeight: 700,
                    textDecoration: "underline",
                  }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>

            {/* Right side - form */}
            <Box
              sx={{
                width: { xs: "100%", md: "60%" },
                p: { xs: 3, sm: 4, md: 5 },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: "text.primary",
                }}
              >
                Create an Account
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mb: 4,
                  color: "text.secondary",
                }}
              >
                Fill in the details to get started
              </Typography>

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
                    gap: 3,
                    mb: 4,
                  }}
                >
                  <TextField
                    required
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
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
                        "&.Mui-focused fieldset": {
                          borderColor: theme.palette.primary.main,
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
                    onChange={handleChange}
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
                        "&.Mui-focused fieldset": {
                          borderColor: theme.palette.primary.main,
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
                    onChange={handleChange}
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
                        "&.Mui-focused fieldset": {
                          borderColor: theme.palette.primary.main,
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
                    onChange={handleChange}
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
                        "&.Mui-focused fieldset": {
                          borderColor: theme.palette.primary.main,
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
              </form>
            </Box>
          </Paper>
        </Box>
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
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
