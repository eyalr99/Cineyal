import { MovieDto, RatingDto, CategoryDto } from "../models/Movie";
import { API_CONFIG } from "../config/apiConfig";

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

export const movieService = {
  /**
   * Get all movies with optional filtering
   * @param filters Optional filters for category, year, rating, and search
   * @returns List of movies matching the filters
   */
  async getAllMovies(filters?: {
    category?: string;
    year?: number;
    rating?: number;
    search?: string;
  }): Promise<MovieDto[]> {
    try {
      const queryString = filters ? buildQueryString(filters) : "";
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/movies${queryString}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch movies");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw error;
    }
  },

  /**
   * Get movie details by ID
   * @param movieId The ID of the movie to retrieve
   * @returns The movie details
   */
  async getMovieById(movieId: number): Promise<MovieDto> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/movies/${movieId}`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch movie details");
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching movie ${movieId}:`, error);
      throw error;
    }
  },

  /**
   * Get all available movie categories
   * @returns List of movie categories
   */
  async getCategories(): Promise<CategoryDto[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/categories`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch categories");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  /**
   * Rate a movie
   * @param movieId The ID of the movie to rate
   * @param ratingData Rating information
   * @returns The saved rating
   */
  async rateMovie(
    movieId: number,
    ratingData: Pick<RatingDto, "userId" | "rating">
  ): Promise<RatingDto> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/movies/${movieId}/ratings`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(ratingData),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit rating");
      }

      return await response.json();
    } catch (error) {
      console.error("Error rating movie:", error);
      throw error;
    }
  },
};
