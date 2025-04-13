import { User } from "../models/User";
import { API_CONFIG } from "../config/apiConfig";
import { RentalDto } from "../models/Rental";
import { transformRentalResponse } from "../utils/apiUtils";

export const userService = {
  /**
   * Get user details by ID
   * @param userId The user ID
   * @returns The user details
   */
  async getUserDetails(userId: number): Promise<User> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session handling
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user details");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  },

  /**
   * Update user details
   * @param userId The user ID
   * @param userData The updated user data
   * @returns The updated user
   */
  async updateUserDetails(
    userId: number,
    userData: Pick<User, "fullName" | "phoneNumber" | "address">
  ): Promise<User> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: userData.fullName,
          phoneNumber: userData.phoneNumber,
          address: userData.address,
        }),
        credentials: "include", // Include cookies for session handling
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user details");
      }

      const updatedUser = await response.json();

      // Update the stored user in localStorage if it's the current user
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );
      if (currentUser && currentUser.id === userId) {
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      }

      return updatedUser;
    } catch (error) {
      console.error("Error updating user details:", error);
      throw error;
    }
  },

  /**
   * Get user rental history
   * @param userId The user ID
   * @returns List of rentals
   */
  async getUserRentalHistory(userId: number): Promise<RentalDto[]> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/users/${userId}/rentals`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for session handling
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch rental history");
      }

      const data = await response.json();
      return transformRentalResponse(data) as RentalDto[];
    } catch (error) {
      console.error("Error fetching rental history:", error);
      throw error;
    }
  },
};
