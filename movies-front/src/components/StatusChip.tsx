import { Chip, ChipProps } from "@mui/material";
import { getStatusConfig } from "../utils/statusConstants";

// Props for the StatusChip component
export interface StatusChipProps extends Omit<ChipProps, "color"> {
  status: string | undefined;
  size?: "small" | "medium";
}

/**
 * A consistent status chip component for displaying rental statuses
 * throughout the application
 */
const StatusChip = ({
  status,
  size = "small",
  ...chipProps
}: StatusChipProps) => {
  const statusConfig = getStatusConfig(status);

  return (
    <Chip
      label={statusConfig.label}
      size={size}
      sx={{
        fontWeight: "bold",
        backgroundColor: statusConfig.color,
        color: statusConfig.textColor,
        ...chipProps.sx,
      }}
      {...chipProps}
    />
  );
};

export default StatusChip;
