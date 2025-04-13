import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Box,
  Chip,
  Divider,
  CircularProgress,
  Rating,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Alert,
  Snackbar,
  AlertTitle,
} from "@mui/material";
import {
  LocalMovies,
  AccessTime,
  CalendarToday,
  Person,
  CategoryRounded,
  Star,
  EditOutlined,
  DeleteOutline,
  People as PeopleIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { movieService } from "../services/movieService";
import { rentalService } from "../services/rentalService";
import { adminService } from "../services/adminService";
import { MovieDto } from "../models/Movie";
import { RentalDto } from "../models/Rental";
import { addDays } from "date-fns";
import { authService } from "../services/authService";
import { getImageUrl } from "../utils/apiUtils";
import RentalsTable from "../components/RentalsTable";
import MovieForm from "../components/MovieForm";

const MovieDetail = () => {
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.admin || false;

  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rentalDialogOpen, setRentalDialogOpen] = useState(false);
  const [returnDate, setReturnDate] = useState<Date | null>(
    addDays(new Date(), 7)
  );
  const [rentalLoading, setRentalLoading] = useState(false);
  const [rentalError, setRentalError] = useState<string | null>(null);
  const [rental, setRental] = useState<RentalDto | null>(null);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    "Operation completed successfully"
  );

  // User rating state
  const [userRating, setUserRating] = useState<number | null>(null);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [ratingSuccessOpen, setRatingSuccessOpen] = useState(false);

  // Admin features
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [rentersDialogOpen, setRentersDialogOpen] = useState(false);
  const [movieRentals, setMovieRentals] = useState<RentalDto[]>([]);
  const [rentalsLoading, setRentalsLoading] = useState(false);
  const [rentalsError, setRentalsError] = useState<string | null>(null);

  // Add clearable state for errors to enable dismissing them
  const [showMainError, setShowMainError] = useState(true);
  const [showRentalError, setShowRentalError] = useState(true);
  const [showRatingError, setShowRatingError] = useState(true);
  const [showRentalsError, setShowRentalsError] = useState(true);

  // Reset error visibility when errors change
  useEffect(() => {
    if (error) setShowMainError(true);
    else setShowMainError(false);
  }, [error]);

  useEffect(() => {
    if (rentalError) setShowRentalError(true);
    else setShowRentalError(false);
  }, [rentalError]);

  useEffect(() => {
    if (ratingError) setShowRatingError(true);
    else setShowRatingError(false);
  }, [ratingError]);

  useEffect(() => {
    if (rentalsError) setShowRentalsError(true);
    else setShowRentalsError(false);
  }, [rentalsError]);

  const today = new Date();
  const maxDate = addDays(today, 30); // Maximum 30 days rental period

  useEffect(() => {
    const fetchMovie = async () => {
      if (!movieId) return;

      setLoading(true);
      // Clear any existing errors
      setError(null);
      setRentalError(null);
      setRatingError(null);
      setRentalsError(null);

      try {
        const movieData = await movieService.getMovieById(Number(movieId));
        setMovie(movieData);
        // Initialize userRating with the movie's average rating
        setUserRating(movieData.averageRating);
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
        setError("Failed to load movie details. Please try again later.");
        setShowMainError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  const handleBackToMovies = () => {
    navigate("/movies");
  };

  const handleRentMovie = () => {
    setRentalDialogOpen(true);
  };

  const handleCloseRentalDialog = () => {
    setRentalDialogOpen(false);
    setRentalError(null);
    // Don't reset the rental when closing dialog to keep showing the code
  };

  const calculateRentalDuration = (): number => {
    if (!returnDate) return 7; // Default to 7 days

    const today = new Date();
    const diffTime = returnDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays); // Ensure at least 1 day
  };

  const handleSubmitRental = async () => {
    if (!movieId || !returnDate) return;

    setRentalLoading(true);
    setRentalError(null);

    try {
      if (!currentUser) {
        setRentalError("User must be logged in to rent a movie");
        setShowRentalError(true);
        setRentalLoading(false);
        return;
      }
      const createdRental = await rentalService.createRental({
        userId: currentUser.id,
        movieId: Number(movieId),
        returnDate: returnDate.toISOString(),
      });
      setRental(createdRental);
      setSuccessSnackbarOpen(true);
    } catch (err: unknown) {
      console.error("Failed to create rental:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to create rental. Please try again.";
      setRentalError(errorMessage);
      setShowRentalError(true);
    } finally {
      setRentalLoading(false);
    }
  };

  const handleCloseSuccessSnackbar = () => {
    setSuccessSnackbarOpen(false);
  };

  // Admin Functions
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!movieId) return;

    setDeleteLoading(true);
    try {
      await adminService.deleteMovie(Number(movieId));
      setDeleteDialogOpen(false);
      navigate("/admin/movies");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setShowMainError(true);
      } else {
        setError("Failed to delete movie. Please try again.");
        setShowMainError(true);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleSaveEdit = async (editedMovie: MovieDto) => {
    if (!movieId) return;

    setLoading(true);
    try {
      const updatedMovie = await adminService.updateMovie(
        Number(movieId),
        editedMovie
      );
      setMovie(updatedMovie);
      setEditDialogOpen(false);
      setSuccessSnackbarOpen(true);
    } catch (err) {
      console.error("Failed to update movie:", err);
      setError("Failed to update movie. Please try again.");
      setShowMainError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRentersClick = async () => {
    if (!movieId) return;

    setRentersDialogOpen(true);
    setRentalsLoading(true);
    setRentalsError(null);

    try {
      const rentals = await adminService.getMovieRentals(Number(movieId));
      setMovieRentals(rentals);
    } catch (err) {
      console.error("Failed to fetch movie rentals:", err);
      setRentalsError("Failed to load rental information. Please try again.");
      setShowRentalsError(true);
    } finally {
      setRentalsLoading(false);
    }
  };

  const handleCloseRentersDialog = () => {
    setRentersDialogOpen(false);
  };

  // Handle user rating change
  const handleRatingChange = (
    event: React.SyntheticEvent,
    value: number | null
  ) => {
    setUserRating(value);
  };

  // Submit user rating
  const handleSubmitRating = async () => {
    if (!movieId || !currentUser || userRating === null || !movie) return;

    // No need to submit if the user hasn't changed the rating
    if (userRating === movie.averageRating) {
      return;
    }

    setRatingSubmitting(true);
    setRatingError(null);

    try {
      await movieService.rateMovie(Number(movieId), {
        userId: currentUser.id,
        rating: userRating,
      });

      // Update the movie to show the new average rating
      const updatedMovie = await movieService.getMovieById(Number(movieId));
      setMovie(updatedMovie);

      // Show success message
      setSuccessMessage("Your rating has been submitted successfully!");
      setSuccessSnackbarOpen(true);
      setRatingSuccessOpen(true);

      // Clear user rating state after successful submission
      // This will make the component show the movie's new average rating
      setTimeout(() => {
        setRatingSuccessOpen(false);
      }, 3000);
    } catch (err: unknown) {
      console.error("Failed to submit rating:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to submit rating. Please try again.";
      setRatingError(errorMessage);
      setShowRatingError(true);

      // Clear error after a few seconds
      setTimeout(() => {
        setRatingError(null);
      }, 3000);
    } finally {
      setRatingSubmitting(false);
    }
  };

  const handleCloseRatingSuccess = () => {
    setRatingSuccessOpen(false);
  };

  if (loading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!movie) {
    return (
      <Container>
        <Paper elevation={3} sx={{ p: 3, my: 3 }}>
          <Typography variant="h6">Movie not found</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBackToMovies}
            sx={{ mt: 2 }}
          >
            Back to Movies
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Error Alerts at the top of the page */}
      <Box sx={{ mb: 3 }}>
        {error && showMainError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            variant="filled"
            onClose={() => setShowMainError(false)}
          >
            <AlertTitle>Error</AlertTitle>
            {error}
            <Button
              color="inherit"
              size="small"
              onClick={handleBackToMovies}
              sx={{ ml: 2 }}
            >
              Back to Movies
            </Button>
          </Alert>
        )}

        {rentalError && showRentalError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            variant="filled"
            onClose={() => setShowRentalError(false)}
          >
            <AlertTitle>Rental Error</AlertTitle>
            {rentalError}
          </Alert>
        )}

        {ratingError && showRatingError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            variant="filled"
            onClose={() => setShowRatingError(false)}
          >
            <AlertTitle>Rating Error</AlertTitle>
            {ratingError}
          </Alert>
        )}

        {rentalsError && showRentalsError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            variant="filled"
            onClose={() => setShowRentalsError(false)}
          >
            <AlertTitle>Rentals Error</AlertTitle>
            {rentalsError}
          </Alert>
        )}
      </Box>

      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={handleBackToMovies}
          >
            Back to Movies
          </Button>

          {/* Admin Actions */}
          {isAdmin && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<PeopleIcon />}
                onClick={handleRentersClick}
              >
                View Renters
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<EditOutlined />}
                onClick={handleEditClick}
              >
                Edit Movie
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteOutline />}
                onClick={handleDeleteClick}
              >
                Delete Movie
              </Button>
            </Box>
          )}
        </Box>

        <Grid container spacing={4}>
          {/* Left Side - Movie Details */}
          <Grid item xs={12} md={7}>
            <Typography variant="h4" component="h1" gutterBottom>
              {movie.title}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              {currentUser ? (
                <>
                  <Rating
                    name="user-rating"
                    value={userRating}
                    onChange={handleRatingChange}
                    precision={0.5}
                    emptyIcon={
                      <Star style={{ opacity: 0.55 }} fontSize="inherit" />
                    }
                  />
                  {ratingSubmitting ? (
                    <CircularProgress size={20} sx={{ ml: 1 }} />
                  ) : (
                    <Button
                      variant="text"
                      color="primary"
                      size="small"
                      onClick={handleSubmitRating}
                      disabled={
                        ratingSubmitting ||
                        userRating === null ||
                        userRating === movie.averageRating
                      }
                      sx={{ ml: 1 }}
                    >
                      Submit
                    </Button>
                  )}
                </>
              ) : (
                <Rating
                  value={movie.averageRating}
                  readOnly
                  precision={0.5}
                  emptyIcon={
                    <Star style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                />
              )}
              <Typography variant="body2" sx={{ ml: 1 }}>
                {movie.averageRating.toFixed(1)}/5
              </Typography>
              {ratingError && (
                <Alert
                  severity="error"
                  sx={{ ml: 2, py: 0, fontSize: "0.75rem" }}
                  variant="outlined"
                >
                  {ratingError}
                </Alert>
              )}
              {ratingSuccessOpen && (
                <Alert
                  severity="success"
                  sx={{ ml: 2, py: 0, fontSize: "0.75rem" }}
                  onClose={handleCloseRatingSuccess}
                  variant="outlined"
                >
                  Rating submitted!
                </Alert>
              )}
            </Box>

            {!currentUser && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: -1, mb: 2 }}
              >
                <Button
                  color="primary"
                  size="small"
                  onClick={() => navigate("/login")}
                  sx={{ ml: -1 }}
                >
                  Log in
                </Button>
                to rate this movie
              </Typography>
            )}

            <Typography variant="body1" paragraph>
              {movie.description}
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Person sx={{ mr: 1, color: "primary.main" }} />
                  <Typography
                    variant="body1"
                    component="span"
                    fontWeight="bold"
                  >
                    Director:
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph sx={{ ml: 4 }}>
                  {movie.director}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CalendarToday sx={{ mr: 1, color: "primary.main" }} />
                  <Typography
                    variant="body1"
                    component="span"
                    fontWeight="bold"
                  >
                    Release Year:
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph sx={{ ml: 4 }}>
                  {movie.releaseYear}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AccessTime sx={{ mr: 1, color: "primary.main" }} />
                  <Typography
                    variant="body1"
                    component="span"
                    fontWeight="bold"
                  >
                    Duration:
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph sx={{ ml: 4 }}>
                  {movie.duration} minutes
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocalMovies sx={{ mr: 1, color: "primary.main" }} />
                  <Typography
                    variant="body1"
                    component="span"
                    fontWeight="bold"
                  >
                    Stock:
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph sx={{ ml: 4 }}>
                  {movie.stockQuantity} copies available
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <CategoryRounded sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="body1" component="span" fontWeight="bold">
                  Categories:
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", ml: 4 }}>
                {movie.categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Cast:
              </Typography>
              <Typography variant="body2" paragraph>
                {movie.actors.join(", ")}
              </Typography>
            </Box>

            {!isAdmin && (
              <>
                <Divider sx={{ my: 2 }} />

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleRentMovie}
                    disabled={!movie.available || movie.stockQuantity <= 0}
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    {movie.available && movie.stockQuantity > 0
                      ? "Rent Movie"
                      : "Currently Unavailable"}
                  </Button>
                  {(!movie.available || movie.stockQuantity <= 0) && (
                    <Typography
                      color="error"
                      variant="body2"
                      sx={{ mt: 1, textAlign: "center" }}
                    >
                      This movie is currently out of stock
                    </Typography>
                  )}
                </Box>
              </>
            )}
          </Grid>

          {/* Right Side - Movie Image */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                height: { xs: "300px", md: "500px" },
                width: "100%",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 3,
              }}
            >
              <img
                src={getImageUrl(movie.imageId)}
                alt={movie.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Rental Dialog */}
      <Dialog
        open={rentalDialogOpen}
        onClose={handleCloseRentalDialog}
        aria-labelledby="rental-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="rental-dialog-title">Rent "{movie.title}"</DialogTitle>
        <DialogContent>
          {rentalError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {rentalError}
            </Alert>
          )}

          {rental ? (
            <Box sx={{ mt: 2 }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Rental successfully created!
              </Alert>
              <Typography variant="body1" gutterBottom>
                Your rental code is:
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  py: 2,
                  px: 3,
                  backgroundColor: "action.hover",
                  borderRadius: 1,
                  fontFamily: "monospace",
                  letterSpacing: 1,
                  textAlign: "center",
                  mb: 3,
                }}
              >
                {rental.rentalCode}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please save this code. You'll need it to pick up the movie.
              </Typography>
            </Box>
          ) : (
            <>
              <DialogContentText sx={{ mb: 3 }}>
                Please select when you'd like to return the movie:
              </DialogContentText>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Return Date"
                  value={returnDate}
                  onChange={(newDate) => setReturnDate(newDate)}
                  minDate={addDays(today, 1)}
                  maxDate={maxDate}
                  disabled={rentalLoading}
                  slotProps={{
                    textField: { fullWidth: true, variant: "outlined" },
                  }}
                />
              </LocalizationProvider>

              <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                Rental duration:{" "}
                <Box component="span" fontWeight="bold">
                  {calculateRentalDuration()} days
                </Box>
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRentalDialog} color="primary">
            {rental ? "Close" : "Cancel"}
          </Button>
          {!rental && (
            <Button
              onClick={handleSubmitRental}
              color="primary"
              variant="contained"
              disabled={rentalLoading || !returnDate}
            >
              {rentalLoading ? "Processing..." : "Confirm Rental"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Admin Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Movie</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{movie.title}"? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Admin Edit Movie Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        aria-labelledby="edit-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="edit-dialog-title">Edit Movie</DialogTitle>
        <DialogContent>
          {movie && (
            <MovieForm
              initialMovie={movie}
              onSubmit={handleSaveEdit}
              submitButtonText="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Admin Movie Renters Dialog */}
      <Dialog
        open={rentersDialogOpen}
        onClose={handleCloseRentersDialog}
        aria-labelledby="renters-dialog-title"
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle id="renters-dialog-title">
          Renters for "{movie.title}"
        </DialogTitle>
        <DialogContent>
          {rentalsError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {rentalsError}
            </Alert>
          )}

          <RentalsTable
            rentals={movieRentals}
            loading={rentalsLoading}
            emptyMessage="No rentals found for this movie"
            showActions={isAdmin}
            isAdmin={isAdmin}
            onRefreshRentals={() => handleRentersClick()}
            showMovieColumn={false}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRentersDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSuccessSnackbar}
        message={successMessage}
      />
    </Container>
  );
};

export default MovieDetail;
