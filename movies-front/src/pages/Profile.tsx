import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Snackbar,
  Box,
} from "@mui/material";
import { ConfirmationNumber as ConfirmationNumberIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { RentalDto } from "../models/Rental";
import { rentalService } from "../services/rentalService";
import { formatDate } from "../utils/dateUtils";
import StatusChip from "../components/StatusChip";
import RentalActionButton from "../components/RentalActionButton";

const Profile = () => {
  const currentUser = authService.getCurrentUser();
  const [rentals, setRentals] = useState<RentalDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    email: currentUser?.email || "",
    fullName: currentUser?.fullName || "",
    phoneNumber: currentUser?.phoneNumber || "",
    address: currentUser?.address || "",
  });

  // Load user data and rental history
  useEffect(() => {
    if (currentUser?.id) {
      const fetchUserData = async () => {
        try {
          setLoading(true);

          // Get rental history
          const rentalHistory = await userService.getUserRentalHistory(
            currentUser?.id
          );
          setRentals(rentalHistory);

          // Get latest user data
          const userData = await userService.getUserDetails(currentUser?.id);

          setFormData({
            email: userData.email,
            fullName: userData.fullName,
            phoneNumber: userData.phoneNumber || "",
            address: userData.address || "",
          });

          setLoading(false);
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to load user data. Please try again later.");
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [currentUser?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      if (!currentUser) return;

      setLoading(true);

      // Prepare update data with only the fields supported by the API
      const updateData = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      };

      await userService.updateUserDetails(currentUser.id, updateData);

      setSuccess("Profile updated successfully!");
      setLoading(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setError("");
    setSuccess("");
  };

  const handleCancelRental = async (rentalId: number) => {
    try {
      setLoading(true);
      await rentalService.cancelRental(rentalId);

      // Update the rentals list after cancellation
      if (currentUser?.id) {
        const updatedRentals = await userService.getUserRentalHistory(
          currentUser.id
        );
        setRentals(updatedRentals);
      }

      setSuccess("Rental cancelled successfully!");
      setLoading(false);
    } catch (err) {
      console.error("Error cancelling rental:", err);
      setError("Failed to cancel rental. Please try again.");
      setLoading(false);
    }
  };

  const canBeCancelled = (status: string | undefined) => {
    return status === "ORDERED";
  };

  if (!currentUser) {
    return (
      <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="body1">
            Please log in to view your profile.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>

      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Profile
        </Typography>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email (Username)"
              variant="outlined"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled // Email should typically not be changeable
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Full Name"
              variant="outlined"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              variant="outlined"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Address"
              variant="outlined"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Rental History
        </Typography>

        {rentals.length > 0 ? (
          <TableContainer
            component={Paper}
            sx={{ mt: 2, borderRadius: 2, overflow: "hidden" }}
          >
            <Table aria-label="rental history table">
              <TableHead sx={{ backgroundColor: "primary.main" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Order Code
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Movie Title
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Rental Date
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Return Date
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rentals.map((rental) => (
                  <TableRow
                    key={rental.id}
                    hover
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ConfirmationNumberIcon
                          fontSize="small"
                          color="action"
                          sx={{ mr: 1 }}
                        />
                        {rental.rentalCode || "-"}
                      </Box>
                    </TableCell>
                    <TableCell>{rental.movieTitle}</TableCell>
                    <TableCell>{formatDate(rental.rentalDate)}</TableCell>
                    <TableCell>
                      {rental.status === "RETURNED"
                        ? formatDate(rental.returnDate)
                        : rental.status === "CANCELLED"
                        ? "Cancelled"
                        : formatDate(rental.returnDate) + " (Expected)"}
                    </TableCell>
                    <TableCell>
                      <StatusChip status={rental.status} />
                    </TableCell>
                    <TableCell>
                      {canBeCancelled(rental.status) ? (
                        <RentalActionButton
                          action="cancel"
                          onClick={() =>
                            rental.id && handleCancelRental(rental.id)
                          }
                          disabled={loading}
                        >
                          Cancel
                        </RentalActionButton>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Not cancellable
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {loading
              ? "Loading rental history..."
              : "You have no rental history yet."}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;
