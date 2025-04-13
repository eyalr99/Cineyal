// Constants for rental status colors, labels and related actions
export const RENTAL_STATUS = {
  ORDERED: {
    key: "ORDERED",
    label: "Ordered",
    color: "#2196f3", // Blue - primary color
    textColor: "white",
  },
  TAKEN: {
    key: "TAKEN",
    label: "Taken",
    color: "#ff9800", // Orange/Amber - warning color
    textColor: "white",
  },
  RETURNED: {
    key: "RETURNED",
    label: "Returned",
    color: "#4caf50", // Green - success color
    textColor: "white",
  },
  CANCELLED: {
    key: "CANCELLED",
    label: "Cancelled",
    color: "#9e9e9e", // Grey - neutral color
    textColor: "white",
  },
};

// Action colors - matching with the corresponding statuses
export const ACTION_COLORS = {
  RETURN: {
    color: "#4caf50", // Green - matches RETURNED status
    textColor: "white",
    hover: "#3c8e40", // Darker green for hover
  },
  TAKE: {
    color: "#ff9800", // Orange - matches TAKEN status
    textColor: "white",
    hover: "#e68a00", // Darker orange for hover
  },
  CANCEL: {
    color: "#f44336", // Red - error color for cancellations
    textColor: "white",
    hover: "#d32f2f", // Darker red for hover
  },
};

// Utility function to get status configuration by key
export const getStatusConfig = (status: string | undefined) => {
  if (!status) return RENTAL_STATUS.ORDERED; // Default fallback

  const upperStatus = status.toUpperCase();
  return (
    RENTAL_STATUS[upperStatus as keyof typeof RENTAL_STATUS] ||
    RENTAL_STATUS.ORDERED
  );
};
