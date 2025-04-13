/**
 * Utility functions for date handling
 */

/**
 * Type definition for backend date array format
 * [year, month, day, hour, minute, second, nanosecond]
 */
export type DateArray = [
  number,
  number,
  number,
  number?,
  number?,
  number?,
  number?
];

/**
 * Converts a date array from the backend format to a JavaScript Date object
 * Backend date format: [year, month, day, hour, minute, second, nanosecond]
 *
 * @param dateArray The date array from backend
 * @returns A JavaScript Date object or null if invalid
 */
export const convertDateArrayToDate = (
  dateArray: DateArray | unknown
): Date | null => {
  if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) {
    return null;
  }

  // Extract values with defaults
  const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;

  // Note: JavaScript months are 0-indexed, backend months are 1-indexed
  return new Date(year, month - 1, day, hour, minute, second);
};

/**
 * Converts a date array to an ISO string format
 *
 * @param dateArray The date array from backend
 * @returns ISO string date format or null if invalid
 */
export const convertDateArrayToString = (
  dateArray: DateArray | unknown
): string | null => {
  const date = convertDateArrayToDate(dateArray);
  return date ? date.toISOString() : null;
};

/**
 * Formats a date (string, Date object, or array) for display
 *
 * @param date The date to format (can be string, Date object, or backend date array)
 * @param format Optional format specification
 * @returns Formatted date string or 'N/A' if invalid
 */
export const formatDate = (
  date: string | Date | DateArray | unknown | null | undefined,
  format: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }
): string => {
  if (!date) return "N/A";

  try {
    let dateObj: Date | null = null;

    if (Array.isArray(date)) {
      // Handle backend date array format
      dateObj = convertDateArrayToDate(date);
    } else if (typeof date === "string") {
      // Handle string date
      dateObj = new Date(date);
    } else if (date instanceof Date) {
      // Already a Date object
      dateObj = date;
    }

    if (!dateObj || isNaN(dateObj.getTime())) {
      return "N/A";
    }

    return dateObj.toLocaleDateString("en-US", format);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "N/A";
  }
};
