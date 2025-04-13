import { Button, Chip } from "@mui/material";
import { ACTION_COLORS } from "../utils/statusConstants";
import { RentalAction } from "./RentalsTable";

// Props for the RentalActionButton component
export interface RentalActionButtonProps {
  action: RentalAction | "cancel";
  variant?: "button" | "chip";
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * A consistent action button component for rental actions
 * Can render as either a Button or a Chip based on the variant prop
 */
const RentalActionButton = ({
  action,
  variant = "button",
  onClick,
  disabled,
  children,
}: RentalActionButtonProps) => {
  // Determine label and colors based on action type
  let actionConfig;
  let label;

  switch (action) {
    case "return":
      actionConfig = ACTION_COLORS.RETURN;
      label = "Mark as Returned";
      break;
    case "take":
      actionConfig = ACTION_COLORS.TAKE;
      label = "Mark as Taken";
      break;
    case "cancel":
      actionConfig = ACTION_COLORS.CANCEL;
      label = "Cancel";
      break;
    default:
      actionConfig = ACTION_COLORS.RETURN;
      label = "Action";
  }

  if (variant === "chip") {
    return (
      <Chip
        label={children || label}
        clickable
        size="small"
        disabled={disabled}
        onClick={onClick as React.MouseEventHandler<HTMLDivElement>}
        sx={{
          backgroundColor: actionConfig.color,
          color: actionConfig.textColor,
          "&:hover": {
            backgroundColor: actionConfig.hover,
          },
          fontWeight: "bold",
        }}
      />
    );
  }

  return (
    <Button
      variant="contained"
      size="small"
      disabled={disabled}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      sx={{
        backgroundColor: actionConfig.color,
        color: actionConfig.textColor,
        "&:hover": {
          backgroundColor: actionConfig.hover,
        },
        fontWeight: "medium",
      }}
    >
      {children || label}
    </Button>
  );
};

export default RentalActionButton;
