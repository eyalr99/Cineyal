import { RentalDto } from "../models/Rental";
import { API_CONFIG } from "../config/apiConfig";
import { transformRentalResponse } from "../utils/apiUtils";

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

export const rentalService = {
  /**
   * Create a new rental
   * @param rentalData Rental information including userId, movieId and optional returnDate
   * @returns The created rental
   */
  async createRental(rentalData: {
    userId: number;
    movieId: number;
    returnDate?: string;
  }): Promise<RentalDto> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/rentals`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(rentalData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create rental");
      }

      const data = await response.json();
      return transformRentalResponse(data) as RentalDto;
    } catch (error) {
      console.error("Error creating rental:", error);
      throw error;
    }
  },

  /**
   * Get rental details by ID
   * @param rentalId The ID of the rental to retrieve
   * @returns The rental details
   */
  async getRentalById(rentalId: number): Promise<RentalDto> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/rentals/${rentalId}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch rental details");
      }

      const data = await response.json();
      return transformRentalResponse(data) as RentalDto;
    } catch (error) {
      console.error(`Error fetching rental ${rentalId}:`, error);
      throw error;
    }
  },

  /**
   * Get rental details by rental code
   * @param rentalCode The unique code of the rental
   * @returns The rental details
   */
  async getRentalByCode(rentalCode: string): Promise<RentalDto> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/rentals/code/${rentalCode}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch rental details");
      }

      const data = await response.json();
      return transformRentalResponse(data) as RentalDto;
    } catch (error) {
      console.error(`Error fetching rental with code ${rentalCode}:`, error);
      throw error;
    }
  },

  /**
   * Cancel a rental by ID
   * @param rentalId The ID of the rental to cancel
   * @returns The updated rental with status CANCELLED
   */
  async cancelRental(rentalId: number): Promise<RentalDto> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/rentals/${rentalId}/cancel`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to cancel rental");
      }

      const data = await response.json();
      return transformRentalResponse(data) as RentalDto;
    } catch (error) {
      console.error(`Error cancelling rental ${rentalId}:`, error);
      throw error;
    }
  },
};
