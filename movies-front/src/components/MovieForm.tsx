import { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
  FormHelperText,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  Save as SaveIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { movieService } from "../services/movieService";
import { adminService } from "../services/adminService";
import { MovieDto, CategoryDto } from "../models/Movie";
import { getImageUrl } from "../utils/apiUtils";

interface MovieFormProps {
  initialMovie?: MovieDto;
  onSubmit: (movie: MovieDto) => Promise<void>;
  submitButtonText?: string;
}

const MovieForm = ({
  initialMovie,
  onSubmit,
  submitButtonText = "Add Movie",
}: MovieFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movie, setMovie] = useState<Partial<MovieDto>>(
    initialMovie || {
      title: "",
      description: "",
      categories: [],
      releaseYear: new Date().getFullYear(),
      duration: 90,
      director: "",
      actors: [],
      averageRating: 0,
      stockQuantity: 1,
    }
  );

  // Categories from backend
  const [availableCategories, setAvailableCategories] = useState<CategoryDto[]>(
    []
  );
  const [loadingCategories, setLoadingCategories] = useState(true);

  // For adding new categories
  const [newCategory, setNewCategory] = useState("");
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  // Field validation state
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // For handling the actor input
  const [actorInput, setActorInput] = useState("");

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialMovie?.imageId ? getImageUrl(initialMovie.imageId) : null
  );
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const categories = await movieService.getCategories();
        setAvailableCategories(categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMovie((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);

    if (!isNaN(numValue)) {
      setMovie((prev) => ({ ...prev, [name]: numValue }));

      // Clear validation error when field is edited
      if (validationErrors[name]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleCategoriesChange = (event: SelectChangeEvent<string[]>) => {
    // Check if the value includes an empty string and filter it out
    const value = (event.target.value as string[]).filter(
      (category) => category.trim() !== ""
    );

    setMovie((prev) => ({ ...prev, categories: value }));

    // Clear validation error when field is edited
    if (validationErrors.categories) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.categories;
        return newErrors;
      });
    }
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      // Add to selected categories
      const updatedCategories = [
        ...(movie.categories || []),
        newCategory.trim(),
      ];
      setMovie((prev) => ({
        ...prev,
        categories: updatedCategories,
      }));

      // Add to available categories for UI
      const newCategoryObj: CategoryDto = {
        id: -Math.floor(Math.random() * 1000), // Temporary negative ID
        name: newCategory.trim(),
      };
      setAvailableCategories((prev) => [...prev, newCategoryObj]);

      // Reset the input
      setNewCategory("");
      setCategoryDialogOpen(false);

      // Clear validation error when categories are added
      if (validationErrors.categories) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.categories;
          return newErrors;
        });
      }
    }
  };

  const handleAddActor = () => {
    if (actorInput.trim()) {
      setMovie((prev) => ({
        ...prev,
        actors: [...(prev.actors || []), actorInput.trim()],
      }));
      setActorInput("");

      // Clear validation error when actors are added
      if (validationErrors.actors) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.actors;
          return newErrors;
        });
      }
    }
  };

  const handleRemoveActor = (actorToRemove: string) => {
    setMovie((prev) => ({
      ...prev,
      actors: (prev.actors || []).filter((actor) => actor !== actorToRemove),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.includes("image/")) {
        setError("Please select an image file");
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));

      // Clear validation error
      if (validationErrors.imageId) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.imageId;
          return newErrors;
        });
      }
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    try {
      setUploadingImage(true);
      setError(null);

      const imageId = await adminService.uploadImage(imageFile);

      // Update movie with new imageId
      setMovie((prev) => ({
        ...prev,
        imageId,
      }));

      // Reset file state but keep preview
      setImageFile(null);
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);

    // Remove imageId if it exists
    if (movie.imageId) {
      setMovie((prev) => {
        const newMovie = { ...prev };
        delete newMovie.imageId;
        return newMovie;
      });
    }

    // Reset file input
    const fileInput = document.getElementById(
      "movie-image-input"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!movie.title) {
      errors.title = "Title is required";
    }

    if (!movie.description) {
      errors.description = "Description is required";
    }

    if (!movie.categories || movie.categories.length === 0) {
      errors.categories = "At least one category is required";
    }

    if (!movie.director) {
      errors.director = "Director is required";
    }

    if (!movie.actors || movie.actors.length === 0) {
      errors.actors = "At least one actor is required";
    }

    if (!movie.releaseYear) {
      errors.releaseYear = "Release year is required";
    } else if (
      movie.releaseYear < 1900 ||
      movie.releaseYear > new Date().getFullYear() + 5
    ) {
      errors.releaseYear = "Please enter a valid release year";
    }

    if (!movie.duration) {
      errors.duration = "Duration is required";
    } else if (movie.duration < 1) {
      errors.duration = "Duration must be a positive number";
    }

    if (movie.stockQuantity === undefined) {
      errors.stockQuantity = "Stock quantity is required";
    } else if (movie.stockQuantity < 0) {
      errors.stockQuantity = "Stock quantity cannot be negative";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fix the validation errors before submitting.");
      return;
    }
    let currentImageId = movie.imageId;

    // Upload image first if there's a new image file
    if (imageFile) {
      try {
        setLoading(true);
        currentImageId = await adminService.uploadImage(imageFile);

        // Update movie with new imageId
        setMovie((prev) => ({
          ...prev,
          imageId: currentImageId,
        }));

        // Reset file state but keep preview
        setImageFile(null);
      } catch (err) {
        console.error("Error uploading image:", err);
        setError(err instanceof Error ? err.message : "Failed to upload image");
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      // Set default value for available since we're removing the field from UI
      // but the backend still expects it
      const movieData: MovieDto = {
        ...(movie as MovieDto),
        available: true, // Default to available
      };

      await onSubmit({ ...movieData, imageId: currentImageId });
    } catch (err) {
      console.error("Error submitting movie:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save movie. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          {/* Image Upload */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Movie Image
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 1,
                p: 2,
                mb: 2,
              }}
            >
              {imagePreview ? (
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 300,
                    mb: 2,
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Movie preview"
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: 200,
                      objectFit: "contain",
                      borderRadius: 4,
                    }}
                  />
                  <IconButton
                    aria-label="delete image"
                    onClick={handleRemoveImage}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.7)",
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 2 }}
                >
                  No image selected
                </Typography>
              )}

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  disabled={uploadingImage}
                >
                  {imageFile ? "Change Image" : "Select Image"}
                  <input
                    id="movie-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </Button>

                {imageFile && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleImageUpload}
                    disabled={uploadingImage}
                    startIcon={
                      uploadingImage ? <CircularProgress size={20} /> : null
                    }
                  >
                    {uploadingImage ? "Uploading..." : "Upload Now"}
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Title */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Movie Title"
              name="title"
              value={movie.title}
              onChange={handleInputChange}
              error={!!validationErrors.title}
              helperText={validationErrors.title}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Description"
              name="description"
              value={movie.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              error={!!validationErrors.description}
              helperText={validationErrors.description}
            />
          </Grid>

          {/* Categories */}
          <Grid item xs={12}>
            <FormControl
              fullWidth
              required
              error={!!validationErrors.categories}
            >
              <InputLabel id="categories-label">Categories</InputLabel>
              <Select
                labelId="categories-label"
                multiple
                value={movie.categories || []}
                onChange={handleCategoriesChange}
                input={<OutlinedInput label="Categories" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                disabled={loadingCategories}
              >
                {loadingCategories ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Loading categories...
                  </MenuItem>
                ) : (
                  availableCategories.map((category) => (
                    <MenuItem key={category.id} value={category.name}>
                      <Checkbox
                        checked={
                          (movie.categories || []).indexOf(category.name) > -1
                        }
                      />
                      <ListItemText primary={category.name} />
                    </MenuItem>
                  ))
                )}
                <MenuItem
                  divider
                  sx={{
                    color: "primary.main",
                    borderTop: "1px solid",
                    borderTopColor: "divider",
                  }}
                >
                  <Button
                    fullWidth
                    startIcon={<AddIcon />}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCategoryDialogOpen(true);
                    }}
                    sx={{ justifyContent: "flex-start", textTransform: "none" }}
                  >
                    Add New Category
                  </Button>
                </MenuItem>
              </Select>
              {validationErrors.categories && (
                <FormHelperText>{validationErrors.categories}</FormHelperText>
              )}
            </FormControl>

            {/* Category Dialog */}
            <Dialog
              open={categoryDialogOpen}
              onClose={() => setCategoryDialogOpen(false)}
            >
              <DialogTitle>Add New Category</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Category Name"
                  fullWidth
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setCategoryDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddNewCategory}
                  variant="contained"
                  disabled={!newCategory.trim()}
                >
                  Add
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>

          {/* Director */}
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Director"
              name="director"
              value={movie.director}
              onChange={handleInputChange}
              error={!!validationErrors.director}
              helperText={validationErrors.director}
            />
          </Grid>

          {/* Release Year */}
          <Grid item xs={12} md={4}>
            <TextField
              required
              fullWidth
              label="Release Year"
              name="releaseYear"
              type="number"
              value={movie.releaseYear}
              onChange={handleNumberInputChange}
              error={!!validationErrors.releaseYear}
              helperText={validationErrors.releaseYear}
              inputProps={{ min: 1900, max: new Date().getFullYear() + 5 }}
            />
          </Grid>

          {/* Duration */}
          <Grid item xs={12} md={4}>
            <TextField
              required
              fullWidth
              label="Duration (minutes)"
              name="duration"
              type="number"
              value={movie.duration}
              onChange={handleNumberInputChange}
              error={!!validationErrors.duration}
              helperText={validationErrors.duration}
              inputProps={{ min: 1 }}
            />
          </Grid>

          {/* Stock Quantity */}
          <Grid item xs={12} md={4}>
            <TextField
              required
              fullWidth
              label="Stock Quantity"
              name="stockQuantity"
              type="number"
              value={movie.stockQuantity}
              onChange={handleNumberInputChange}
              error={!!validationErrors.stockQuantity}
              helperText={validationErrors.stockQuantity}
              inputProps={{ min: 0 }}
            />
          </Grid>

          {/* Actor Input */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Actors
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <TextField
                fullWidth
                label="Add Actor"
                value={actorInput}
                onChange={(e) => setActorInput(e.target.value)}
                error={!!validationErrors.actors}
                helperText={validationErrors.actors}
                sx={{ mr: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleAddActor}
                disabled={!actorInput.trim()}
              >
                Add
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {movie.actors?.map((actor) => (
                <Chip
                  key={actor}
                  label={actor}
                  onDelete={() => handleRemoveActor(actor)}
                />
              ))}
              {movie.actors?.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No actors added yet
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SaveIcon />}
              disabled={loading}
              sx={{ py: 1.5, px: 4 }}
            >
              {loading ? "Saving..." : submitButtonText}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default MovieForm;
