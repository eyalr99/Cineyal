import { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  Divider,
  Alert,
  Backdrop,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { adminService } from "../services/adminService";
import { MovieDto } from "../models/Movie";
import { useNavigate } from "react-router-dom";
import MovieForm from "../components/MovieForm";

const AddMovie = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitMovie = async (movieData: MovieDto) => {
    setLoading(true);
    setError(null);

    try {
      await adminService.addMovie(movieData);
      setSuccess(true);
      // Reset form by forcing a component reload
      setTimeout(() => {
        navigate("/admin/movies");
      }, 2000);
    } catch (err) {
      console.error("Error adding movie:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to add movie. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Button
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/movies")}
            sx={{ mr: 2 }}
          >
            Back to Movies
          </Button>
          <Typography variant="h4" component="h1">
            Add New Movie
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <MovieForm onSubmit={handleSubmitMovie} />
      </Paper>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Movie added successfully"
      />
    </Container>
  );
};

export default AddMovie;
