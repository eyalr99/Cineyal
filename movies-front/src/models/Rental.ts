export interface RentalDto {
  id?: number;
  userId?: number;
  userFullName?: string;
  movieId: number;
  movieTitle?: string;
  rentalCode?: string;
  rentalDate?: string;
  returnDate?: string;
  status?: string;
}
