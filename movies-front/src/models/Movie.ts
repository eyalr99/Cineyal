export interface MovieDto {
  id?: number;
  title: string;
  description: string;
  categories: string[];
  releaseYear: number;
  duration: number;
  available: boolean;
  rating?: number;
  director: string;
  actors: string[];
  averageRating: number;
  stockQuantity: number;
  imageId?: string;
}

export interface RatingDto {
  id?: number;
  movieId?: number;
  userId?: number;
  rating: number;
  timestamp?: string;
}

export interface CategoryDto {
  id: number;
  name: string;
}
