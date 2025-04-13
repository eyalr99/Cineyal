import { API_CONFIG } from "../config/apiConfig";
import { MovieDto } from "../models/Movie";
import { RentalDto } from "../models/Rental";
import { transformRentalResponse } from "../utils/apiUtils";

// Helper function to build query parameters
const buildQueryString = (
  params: Record<string, string | number | undefined>
): string => {
  const queryParams = Object.entries(params)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");

  return queryParams ? `?${queryParams}` : "";
};

// Helper function to get authorization headers
const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add any authentication headers if needed
  // For example, if using JWT:
  // const token = localStorage.getItem('authToken');
  // if (token) {
  //   headers['Authorization'] = `Bearer ${token}`;
  // }

  return headers;
};

export const adminService = {
  /**
   * Upload an image for a movie
   * @param imageFile The image file to upload
   * @returns The uploaded image ID
   */
  async uploadImage(imageFile: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/images`, {
        method: "POST",
        body: formData,
        credentials: "include",
        // Note: Don't set Content-Type header when using FormData,
        // browser will set it with the correct boundary
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload image");
      }

      const data = await response.json();
      return data.imageId;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },

  /**
   * Add a new movie
   * @param movieData Movie information
   * @returns The created movie
   */
  async addMovie(movieData: MovieDto): Promise<MovieDto> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/admin/movies`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(movieData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add movie");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding movie:", error);
      throw error;
    }
  },

  /**
   * Update an existing movie
   * @param movieId The ID of the movie to update
   * @param movieData Updated movie information
   * @returns The updated movie
   */
  async updateMovie(movieId: number, movieData: MovieDto): Promise<MovieDto> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/admin/movies/${movieId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(movieData),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update movie");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating movie:", error);
      throw error;
    }
  },

  /**
   * Delete a movie
   * @param movieId The ID of the movie to delete
   */
  async deleteMovie(movieId: number): Promise<void> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/admin/movies/${movieId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete movie");
      }
    } catch (error) {
      console.error(`Error deleting movie ${movieId}:`, error);
      throw error;
    }
  },

  /**
   * Get all rentals for a specific movie
   * @param movieId The ID of the movie
   * @returns List of rental records for the movie
   */
  async getMovieRentals(movieId: number): Promise<RentalDto[]> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/admin/movies/${movieId}/rentals`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch movie rentals");
      }

      const data = await response.json();
      return transformRentalResponse(data) as RentalDto[];
    } catch (error) {
      console.error(`Error fetching rentals for movie ${movieId}:`, error);
      throw error;
    }
  },

  /**
   * Get all rentals with optional filtering
   * @param filters Optional filters for email and status
   * @returns List of rental records matching the filters
   */
  async getAllRentals(filters?: {
    email?: string;
    status?: string;
  }): Promise<RentalDto[]> {
    try {
      const queryString = filters ? buildQueryString(filters) : "";
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/admin/rentals${queryString}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch rentals");
      }

      const data = await response.json();
      return transformRentalResponse(data) as RentalDto[];
    } catch (error) {
      console.error("Error fetching rentals:", error);
      throw error;
    }
  },

  /**
   * Process a movie return
   * @param rentalId The ID of the rental to mark as returned
   * @returns The updated rental record
   */
  async returnRental(rentalId: number): Promise<RentalDto> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/admin/rentals/${rentalId}/return`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process rental return");
      }

      const data = await response.json();
      return transformRentalResponse(data) as RentalDto;
    } catch (error) {
      console.error(`Error returning rental ${rentalId}:`, error);
      throw error;
    }
  },

  /**
   * Process a movie take (checkout)
   * @param rentalId The ID of the rental to mark as taken
   * @returns The updated rental record
   */
  async takeRental(rentalId: number): Promise<RentalDto> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/admin/rentals/${rentalId}/take`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process rental take");
      }

      const data = await response.json();
      return transformRentalResponse(data) as RentalDto;
    } catch (error) {
      console.error(`Error taking rental ${rentalId}:`, error);
      throw error;
    }
  },
};
