import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { ConfirmationNumber as ConfirmationNumberIcon } from "@mui/icons-material";
import { format } from "date-fns";
import { RentalDto } from "../models/Rental";
import { adminService } from "../services/adminService";
import StatusChip from "./StatusChip";
import RentalActionButton from "./RentalActionButton";

// Action type for rental operations
export type RentalAction = "return" | "take";

export interface RentalsTableProps {
  rentals: RentalDto[];
  loading: boolean;
  emptyMessage?: string;
  showActions?: boolean;
  isAdmin?: boolean;
  onRefreshRentals?: () => void;
  showUserColumn?: boolean;
  showMovieColumn?: boolean;
}

const RentalsTable = ({
  rentals,
  loading,
  emptyMessage = "No rentals found",
  showActions = false,
  isAdmin = false,
  onRefreshRentals,
  showUserColumn = true,
  showMovieColumn = true,
}: RentalsTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRental, setSelectedRental] = useState<RentalDto | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState<RentalAction | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Combined function to open action dialog
  const handleActionDialog = (rental: RentalDto, action: RentalAction) => {
    setSelectedRental(rental);
    setCurrentAction(action);
    setActionDialogOpen(true);
    setActionError(null);
  };

  // Combined function to close action dialog
  const handleCloseActionDialog = () => {
    setActionDialogOpen(false);
    setCurrentAction(null);
    setActionError(null);
  };

  // Combined function to confirm action
  const handleConfirmAction = async () => {
    if (!selectedRental || !selectedRental.id || !currentAction) return;

    setActionLoading(true);
    setActionError(null);

    try {
      if (currentAction === "return") {
        await adminService.returnRental(selectedRental.id);
      } else if (currentAction === "take") {
        await adminService.takeRental(selectedRental.id);
      }

      // Refresh rental data
      if (onRefreshRentals) {
        onRefreshRentals();
      }

      setActionDialogOpen(false);
      setSelectedRental(null);
      setCurrentAction(null);
    } catch (err) {
      console.error(`Error processing ${currentAction}:`, err);
      setActionError(`Failed to process ${currentAction}. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

  // Get dialog title based on current action
  const getDialogTitle = () => {
    return currentAction === "return" ? "Confirm Return" : "Confirm Take";
  };

  // Get dialog message based on current action
  const getDialogMessage = () => {
    return currentAction === "return"
      ? "Are you sure you want to mark this rental as returned?"
      : "Are you sure you want to mark this rental as taken?";
  };

  // Get button text based on current action and loading state
  const getActionButtonText = () => {
    if (actionLoading) return "Processing...";
    return currentAction === "return" ? "Confirm Return" : "Confirm Take";
  };

  // Calculate how many columns we're showing
  const calculateColSpan = () => {
    let count = 4; // ID, Rental Code, Rental Date, Return By, Status are always shown
    if (showUserColumn) count++;
    if (showMovieColumn) count++;
    if (showActions) count++;
    return count;
  };

  return (
    <>
      <TableContainer component={Paper} elevation={2}>
        <Table size="medium">
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell>ID</TableCell>
              {showUserColumn && <TableCell>User</TableCell>}
              {showMovieColumn && <TableCell>Movie</TableCell>}
              <TableCell>Rental Code</TableCell>
              <TableCell>Rental Date</TableCell>
              <TableCell>Return By</TableCell>
              <TableCell>Status</TableCell>
              {showActions && <TableCell align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={calculateColSpan()}
                  align="center"
                  sx={{ py: 3 }}
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : rentals.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={calculateColSpan()}
                  align="center"
                  sx={{ py: 3 }}
                >
                  <Typography variant="body1" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rentals
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((rental) => (
                  <TableRow key={rental.id} hover>
                    <TableCell>{rental.id}</TableCell>
                    {showUserColumn && (
                      <TableCell>
                        {rental.userFullName || `User #${rental.userId}`}
                      </TableCell>
                    )}
                    {showMovieColumn && (
                      <TableCell>
                        {rental.movieTitle || `Movie #${rental.movieId}`}
                      </TableCell>
                    )}
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ConfirmationNumberIcon
                          fontSize="small"
                          color="action"
                          sx={{ mr: 1 }}
                        />
                        {rental.rentalCode}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {rental.rentalDate
                        ? format(new Date(rental.rentalDate), "MMM dd, yyyy")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {rental.returnDate
                        ? format(new Date(rental.returnDate), "MMM dd, yyyy")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={rental.status} />
                    </TableCell>
                    {showActions && isAdmin && (
                      <TableCell align="center">
                        {rental.status?.toUpperCase() === "TAKEN" && (
                          <RentalActionButton
                            action="return"
                            variant="chip"
                            onClick={() => handleActionDialog(rental, "return")}
                          />
                        )}
                        {rental.status?.toUpperCase() === "ORDERED" && (
                          <RentalActionButton
                            action="take"
                            variant="chip"
                            onClick={() => handleActionDialog(rental, "take")}
                          />
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rentals.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Combined Action Confirmation Dialog */}
      <Dialog
        open={actionDialogOpen}
        onClose={handleCloseActionDialog}
        aria-labelledby="action-dialog-title"
      >
        <DialogTitle id="action-dialog-title">{getDialogTitle()}</DialogTitle>
        <DialogContent>
          {actionError && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {actionError}
            </Typography>
          )}
          <DialogContentText>
            {getDialogMessage()}
            <br />
            <br />
            <strong>User:</strong>{" "}
            {selectedRental?.userFullName || `User #${selectedRental?.userId}`}
            <br />
            <strong>Rental Code:</strong> {selectedRental?.rentalCode}
            <br />
            <strong>Movie:</strong>{" "}
            {selectedRental?.movieTitle || `Movie #${selectedRental?.movieId}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseActionDialog} disabled={actionLoading}>
            Cancel
          </Button>
          <RentalActionButton
            action={currentAction || "return"}
            onClick={handleConfirmAction}
            disabled={actionLoading}
          >
            {getActionButtonText()}
          </RentalActionButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RentalsTable;
