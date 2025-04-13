import { convertDateArrayToString } from "./dateUtils";
import { RentalDto } from "../models/Rental";
import { API_CONFIG } from "../config/apiConfig";

/**
 * Transforms rental data by converting date arrays to ISO strings
 *
 * @param rental The rental data from API
 * @returns Rental with dates as strings
 */
export const transformRentalData = (rental: Partial<RentalDto>): RentalDto => {
  if (!rental) return rental as RentalDto;

  const transformed = { ...rental } as RentalDto;

  // Transform date fields if they are arrays
  if (Array.isArray(transformed.rentalDate)) {
    const convertedDate = convertDateArrayToString(transformed.rentalDate);
    transformed.rentalDate = convertedDate || undefined;
  }

  if (Array.isArray(transformed.returnDate)) {
    const convertedDate = convertDateArrayToString(transformed.returnDate);
    transformed.returnDate = convertedDate || undefined;
  }

  return transformed;
};

/**
 * Transforms a rental or an array of rentals from API response
 *
 * @param data API response with rental data
 * @returns Transformed data with string dates
 */
export const transformRentalResponse = (
  data: RentalDto | RentalDto[]
): RentalDto | RentalDto[] => {
  if (Array.isArray(data)) {
    return data.map((rental) => transformRentalData(rental));
  }

  return transformRentalData(data);
};

/**
 * Get the URL for an image by its ID
 * @param imageId The unique ID of the image
 * @returns The full URL to access the image
 */
export const getImageUrl = (imageId: string | undefined): string => {
  if (!imageId) {
    return "/placeholder-movie.jpg"; // Return a placeholder image if no imageId
  }

  return `${API_CONFIG.BASE_URL}/movies/images/${imageId}`;
};
