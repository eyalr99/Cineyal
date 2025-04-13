import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  Tabs,
  Tab,
  Chip,
} from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Movies from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import { authService } from "./services/authService";
import AdminRentals from "./pages/AdminRentals";
import AddMovie from "./pages/AddMovie";

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#3F72AF", // A sophisticated navy blue
      light: "#7FA7D4",
      dark: "#2B4F7A",
    },
    secondary: {
      main: "#E07A5F", // A muted terracotta
      light: "#EBA08B", 
      dark: "#B45C44",
    },
    background: {
      default: "#F9F7F7",
      paper: "#ffffff",
    },
    text: {
      primary: "#2D3142", // Deep charcoal
      secondary: "#666B7D", // Muted slate
    },
  },
});

// Navigation tabs component for authenticated users
const NavigationTabs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.admin || false;

  // Update the tab value based on current path
  useEffect(() => {
    if (isAdmin) {
      if (location.pathname === "/admin/rentals") {
        setValue(0);
      } else if (
        location.pathname === "/admin/movies"
      ) {
        setValue(1);
      } else if (location.pathname === "/admin/movies/add") {
        setValue(2);
      }
    } else {
      if (location.pathname === "/profile") {
        setValue(0);
      } else if (
        location.pathname === "/movies" ||
        location.pathname.startsWith("/movies/")
      ) {
        setValue(1);
      }
    }
  }, [location.pathname, isAdmin]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      textColor="inherit"
      indicatorColor="secondary"
      aria-label="navigation tabs"
    >
      {isAdmin ? (
        // Admin navigation tabs
        [
          <Tab key="rentals" label="Rentals" onClick={() => navigate("/admin/rentals")} />,
          <Tab key="movies" label="Movies" onClick={() => navigate("/admin/movies")} />,
          <Tab
            key="add-movie"
            label="Add Movie"
            onClick={() => navigate("/admin/movies/add")}
          />
        ]
      ) : (
        // Regular user navigation tabs
        [
          <Tab key="profile" label="Profile" onClick={() => navigate("/profile")} />,
          <Tab key="movies" label="Movies" onClick={() => navigate("/movies")} />
        ]
      )}
    </Tabs>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isLoggedIn());
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.admin || false;

  // Check authentication status on component mount and when localStorage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = authService.isLoggedIn();
      console.log("Auth status check:", authStatus);
      setIsLoggedIn(authStatus);
    };

    // Check initially
    checkAuthStatus();

    // Listen for localStorage changes
    window.addEventListener("storage", checkAuthStatus);

    // Custom event for auth changes within the app
    window.addEventListener("auth-change", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
      window.removeEventListener("auth-change", checkAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            width: "100%",
          }}
        >
          <AppBar position="static">
            <Toolbar>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <img 
                  src="/CINEYALOGO.svg" 
                  alt="CineEyal Logo" 
                  style={{ 
                    height: '40px', 
                    marginRight: '10px',
                    objectFit: 'contain' 
                  }} 
                />
                {isLoggedIn && isAdmin && (
                  <Chip
                    label="Admin"
                    color="secondary"
                    size="small"
                    sx={{
                      ml: 1,
                      fontWeight: 'bold',
                      borderRadius: '4px',
                    }}
                  />
                )}
              </Box>
              {isLoggedIn ? (
                <>
                  <NavigationTabs />
                  <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={RouterLink} to="/login">
                    Login
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/signup">
                    Sign Up
                  </Button>
                </>
              )}
            </Toolbar>
          </AppBar>

          <Box sx={{ flexGrow: 1 }}>
            <Routes>
              <Route
                path="/login"
                element={
                  isLoggedIn ? (
                    <Navigate to={isAdmin ? "/admin/rentals" : "/profile"} />
                  ) : (
                    <Login />
                  )
                }
              />
              <Route
                path="/signup"
                element={
                  isLoggedIn ? (
                    <Navigate to={isAdmin ? "/admin/rentals" : "/profile"} />
                  ) : (
                    <Signup />
                  )
                }
              />

              {/* Regular user routes */}
              <Route
                path="/profile"
                element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
              />
              <Route
                path="/movies"
                element={isLoggedIn ? <Movies /> : <Navigate to="/login" />}
              />
              <Route
                path="/movies/:movieId"
                element={
                  isLoggedIn ? <MovieDetail /> : <Navigate to="/login" />
                }
              />

              {/* Admin routes */}
              <Route
                path="/admin/rentals"
                element={
                  isLoggedIn && isAdmin ? (
                    <AdminRentals />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/admin/movies"
                element={
                  isLoggedIn && isAdmin ? <Movies /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/admin/movies/add"
                element={
                  isLoggedIn && isAdmin ? (
                    <AddMovie />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />

              <Route
                path="/"
                element={
                  <Navigate
                    to={
                      isLoggedIn
                        ? isAdmin
                          ? "/admin/rentals"
                          : "/profile"
                        : "/login"
                    }
                  />
                }
              />

              {/* Catch-all route */}
              <Route
                path="*"
                element={
                  <Navigate
                    to={
                      isLoggedIn
                        ? isAdmin
                          ? "/admin/rentals"
                          : "/profile"
                        : "/login"
                    }
                  />
                }
              />
            </Routes>
          </Box>

          <Box
            component="footer"
            sx={{
              py: 3,
              px: 2,
              mt: "auto",
              backgroundColor: (theme) => theme.palette.grey[200],
            }}
          >
            <Container maxWidth="sm">
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                <img 
                  src="/SMALLOGO.svg" 
                  alt="CineEyal Logo" 
                  style={{ height: '24px' }} 
                />
                <Typography variant="body2" color="text.secondary">
                  © {new Date().getFullYear()} CineEyal
                </Typography>
              </Box>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
