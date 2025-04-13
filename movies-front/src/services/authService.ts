import { LoginRequest, RegistrationRequest, User } from "../models/User";
import { API_CONFIG } from "../config/apiConfig";

export const authService = {
  /**
   * Register a new user
   * @param registrationData User registration data
   * @returns The created user
   */
  async register(registrationData: RegistrationRequest): Promise<User> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
        credentials: "include", // Include cookies for session handling
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  /**
   * Log in a user
   * @param loginData User login credentials
   * @returns The authenticated user
   */
  async login(loginData: LoginRequest): Promise<User> {
    try {
      console.log(
        "Sending login request to:",
        `${API_CONFIG.BASE_URL}/auth/login`
      );
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: "include", // Include cookies for session handling
      });

      console.log("Login response status:", response.status);

      if (!response.ok) {
        // Try to extract error message from response
        try {
          const errorData = await response.json();
          console.error("Login error details:", errorData);
          throw new Error(
            errorData.message || `Login failed with status: ${response.status}`
          );
        } catch {
          // If the error response is not valid JSON
          throw new Error(`Login failed with status: ${response.status}`);
        }
      }

      // Successful response
      const userData = await response.json();
      console.log("Login response data:", userData);

      // Store the user in localStorage for persistence
      localStorage.setItem("currentUser", JSON.stringify(userData));

      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  /**
   * Log out the current user
   */
  logout(): void {
    localStorage.removeItem("currentUser");
    // Optionally, call a logout endpoint if your API has one
  },

  /**
   * Get the current logged-in user
   * @returns The current user or null if not logged in
   */
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem("currentUser");
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  },

  /**
   * Check if a user is currently logged in
   * @returns True if a user is logged in, false otherwise
   */
  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  },
};
