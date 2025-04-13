import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Box,
  CircularProgress,
  SelectChangeEvent,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { movieService } from "../services/movieService";
import { MovieDto, CategoryDto } from "../models/Movie";
import MovieCard from "../components/MovieCard";
import { debounce } from "lodash";
import ClearIcon from "@mui/icons-material/Clear";

const Movies = () => {
  const [movies, setMovies] = useState<MovieDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unified filters state
  const [filters, setFilters] = useState({
    searchQuery: "",
    category: "",
    year: "",
    rating: 0,
  });

  // Flag to control when to actually fetch data
  const [shouldFetch, setShouldFetch] = useState(true);

  // Categories from API
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Years range (adjust as needed)
  const years = Array.from(
    { length: 50 },
    (_, i) => new Date().getFullYear() - i
  );

  // Create a function to build filter object for API
  const buildApiFilters = useMemo(() => {
    const apiFilters: {
      search?: string;
      category?: string;
      year?: number;
      rating?: number;
    } = {};

    if (filters.searchQuery) apiFilters.search = filters.searchQuery;
    if (filters.category) apiFilters.category = filters.category;
    if (filters.year !== "") apiFilters.year = Number(filters.year);
    if (filters.rating > 0) apiFilters.rating = filters.rating;

    return apiFilters;
  }, [filters]);

  // Fetch movies with current filters
  const fetchMovies = useCallback(async () => {
    if (!shouldFetch) return;

    setLoading(true);
    setError(null);
    try {
      const fetchedMovies = await movieService.getAllMovies(buildApiFilters);
      setMovies(fetchedMovies);
    } catch (err) {
      setError("Failed to fetch movies. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
      setShouldFetch(false); // Reset fetch flag
    }
  }, [buildApiFilters, shouldFetch]);

  // Debounced search function
  const debouncedFetchMovies = useMemo(
    () =>
      debounce(() => {
        setShouldFetch(true);
      }, 500),
    []
  );

  // Fetch categories
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const fetchedCategories = await movieService.getCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      setError("Failed to fetch categories. Please try again later.");
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchCategories();
    // Initial fetch happens through the main effect below
  }, []);

  // The single effect to fetch movies
  useEffect(() => {
    fetchMovies();
  }, [shouldFetch, fetchMovies]);

  // Handle input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
    debouncedFetchMovies();
  };

  const handleCategoryChange = (e: SelectChangeEvent) => {
    setFilters((prev) => ({ ...prev, category: e.target.value }));
    setShouldFetch(true);
  };

  const handleYearChange = (e: SelectChangeEvent) => {
    setFilters((prev) => ({ ...prev, year: e.target.value }));
    setShouldFetch(true);
  };

  const handleRatingChange = (_event: Event, newValue: number | number[]) => {
    setFilters((prev) => ({ ...prev, rating: newValue as number }));
    setShouldFetch(true);
  };

  // Clear filter functions
  const clearSearchQuery = () => {
    setFilters((prev) => ({ ...prev, searchQuery: "" }));
    setShouldFetch(true);
  };

  const clearCategory = () => {
    setFilters((prev) => ({ ...prev, category: "" }));
    setShouldFetch(true);
  };

  const clearYear = () => {
    setFilters((prev) => ({ ...prev, year: "" }));
    setShouldFetch(true);
  };

  const clearRating = () => {
    setFilters((prev) => ({ ...prev, rating: 0 }));
    setShouldFetch(true);
  };

  // Clean up debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedFetchMovies.cancel();
    };
  }, [debouncedFetchMovies]);

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Movies
        </Typography>

        {/* Search and Filter Section */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Search movies"
              variant="outlined"
              value={filters.searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {filters.searchQuery && (
                      <IconButton
                        aria-label="clear search"
                        onClick={clearSearchQuery}
                        edge="end"
                      >
                        <ClearIcon />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={filters.category}
                label="Category"
                onChange={handleCategoryChange}
                disabled={loadingCategories}
                endAdornment={
                  filters.category ? (
                    <IconButton
                      size="small"
                      sx={{ mr: 2 }}
                      onClick={clearCategory}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  ) : null
                }
              >
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel id="year-label">Year</InputLabel>
              <Select
                labelId="year-label"
                value={filters.year}
                label="Year"
                onChange={handleYearChange}
                endAdornment={
                  filters.year ? (
                    <IconButton size="small" sx={{ mr: 2 }} onClick={clearYear}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  ) : null
                }
              >
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                {years.map((y) => (
                  <MenuItem key={y} value={y.toString()}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography id="rating-slider" gutterBottom>
                Minimum Rating
              </Typography>
              {filters.rating > 0 && (
                <IconButton
                  size="small"
                  onClick={clearRating}
                  sx={{ ml: 1, mb: 1 }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            <Slider
              value={filters.rating}
              onChange={handleRatingChange}
              aria-labelledby="rating-slider"
              valueLabelDisplay="auto"
              step={0.5}
              marks
              min={0}
              max={5}
            />
          </Grid>
        </Grid>

        {/* Movie List Section with Loading Indicator */}
        <Box sx={{ position: "relative", minHeight: "300px" }}>
          {/* Simple loading indicator */}
          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {error ? (
            <Typography color="error" align="center">
              {error}
            </Typography>
          ) : movies.length === 0 && !loading ? (
            <Typography align="center">
              No movies found matching your criteria.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {movies.map((movie) => (
                <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Movies;
