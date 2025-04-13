export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  admin?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistrationRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
}

export interface Rental {
  id: number;
  movieId: number;
  movieTitle: string;
  rentalDate: string;
  returnDate: string | null;
}
