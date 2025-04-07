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
  InputAdornment,
  IconButton,
  Zoom,
  Card,
  CardContent,
} from "@mui/material";
import {
  Login as LoginIcon,
  LockOutlined,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { login } from "../services/api";
import { useTheme } from "@mui/material/styles";

const Login = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) errors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      errors.email = "Invalid email format";
    if (!formData.password) errors.password = "Password is required";

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
    // Clear general error message
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await login(formData.email, formData.password);
      setSuccessMessage("Login successful! Redirecting...");
      setIsRedirecting(true);
      localStorage.setItem("token", response.token);
      setTimeout(() => {
        navigate("/recipes");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
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
                Sign In
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: "text.secondary",
                  textAlign: "center",
                }}
              >
                Enter your credentials to access your account
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
                    },
                  }}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={<LoginIcon />}
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
                Sign In
              </Button>

              <Box
                sx={{
                  mt: 3,
                  textAlign: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    style={{
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Sign up here
                  </Link>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Zoom>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={1500}
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

export default Login;
