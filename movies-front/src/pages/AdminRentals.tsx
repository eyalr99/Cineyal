import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { adminService } from "../services/adminService";
import { rentalService } from "../services/rentalService";
import { RentalDto } from "../models/Rental";
import RentalsTable from "../components/RentalsTable";

const AdminRentals = () => {
  const [rentals, setRentals] = useState<RentalDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [rentalCode, setRentalCode] = useState<string>("");

  // Fetch all rentals on component mount
  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async (filters?: {
    email?: string;
    rentalCode?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      let fetchedRentals: RentalDto[] = [];

      // If filtering by rental code
      if (filters?.rentalCode) {
        try {
          const rental = await rentalService.getRentalByCode(
            filters.rentalCode
          );
          fetchedRentals = rental ? [rental] : [];
        } catch (err) {
          console.error("Error fetching rental by code:", err);
          setError("No rental found with that code");
          setRentals([]);
          setLoading(false);
          return;
        }
      }
      // If filtering by user email
      else if (filters?.email) {
        fetchedRentals = await adminService.getAllRentals({
          email: filters.email,
        });
      }
      // No filters, get all rentals
      else {
        fetchedRentals = await adminService.getAllRentals();
      }

      setRentals(fetchedRentals);
    } catch (err) {
      console.error("Error fetching rentals:", err);
      setError("Failed to fetch rentals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const filters: { email?: string; rentalCode?: string } = {};

    // Check which filter to apply
    if (rentalCode) {
      filters.rentalCode = rentalCode;
    } else if (userEmail) {
      filters.email = userEmail;
    }

    fetchRentals(filters);
  };

  const handleClearFilters = () => {
    setUserEmail("");
    setRentalCode("");
    fetchRentals();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Rental Management
        </Typography>

        {/* Filters */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            label="User Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            disabled={!!rentalCode}
            size="small"
            placeholder="example@email.com"
          />
          <Typography variant="body1" color="text.secondary">
            OR
          </Typography>
          <TextField
            label="Rental Code"
            value={rentalCode}
            onChange={(e) => setRentalCode(e.target.value)}
            disabled={!!userEmail}
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={loading || (!userEmail && !rentalCode)}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            disabled={loading}
          >
            Clear Filters
          </Button>
        </Box>

        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Results table */}
        <RentalsTable
          rentals={rentals}
          loading={loading}
          emptyMessage="No rentals found"
          showActions={true}
          isAdmin={true}
          onRefreshRentals={() =>
            fetchRentals({ email: userEmail, rentalCode })
          }
        />
      </Paper>
    </Container>
  );
};

export default AdminRentals;
