import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Divider,
  CardActionArea,
} from "@mui/material";
import { Star, Check, Clear } from "@mui/icons-material";
import { MovieDto } from "../models/Movie";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/apiUtils";

interface MovieCardProps {
  movie: MovieDto;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movies/${movie.id}`);
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxWidth: 345,
      }}
    >
      <CardActionArea onClick={handleCardClick}>
        <CardMedia
          component="img"
          height="200"
          image={getImageUrl(movie.imageId)}
          alt={movie.title}
          sx={{ objectFit: "cover" }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              {movie.title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Star sx={{ color: "gold", mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                {movie.averageRating.toFixed(1)}/5
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="body2"
            color="text.primary"
            paragraph
            sx={{ mb: 1 }}
          >
            {movie.description}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            paragraph
            sx={{ mb: 1 }}
          >
            Directed by: {movie.director}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            paragraph
            sx={{ mb: 1 }}
          >
            Starring: {movie.actors.join(", ")}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              flexWrap: "wrap",
            }}
            gap={1}
          >
            {movie.categories.map((category) => (
              <Chip
                key={category}
                label={category}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
            <Chip
              label={movie.releaseYear.toString()}
              size="small"
              color="secondary"
              variant="outlined"
            />
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {movie.available ? (
              <>
                <Check
                  fontSize="small"
                  sx={{ mr: 0.5, color: "success.main" }}
                />
                <Typography variant="body2" color="success.main">
                  Available
                </Typography>
              </>
            ) : (
              <>
                <Clear fontSize="small" sx={{ mr: 0.5, color: "error.main" }} />
                <Typography variant="body2" color="error.main">
                  Not Available
                </Typography>
              </>
            )}
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            paragraph
            sx={{ mt: 1 }}
          >
            Stock: {movie.stockQuantity}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MovieCard;
