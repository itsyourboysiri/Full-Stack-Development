import express, { Request, Response } from 'express';
import { Movie } from './movie_model';  

const router = express.Router();
const app = express();
const path = require('path');

app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
  });

// Route to retrieve all movies from the database
router.get('/getmovies', async (req: Request, res: Response): Promise<void> => {

    console.log('Fetching movies...');
  try {
    // Retrieve movies from the database
    const movies = await Movie.find();

    // Map through the movies to include the full URL for the picture
    const retrievedMovies = movies.map(movie => ({
      ...movie.toObject(), // Convert movie document to a plain object
      picture: `http://localhost:5000/uploads/${path.basename(movie.picture)}`, // Full URL for the picture
    }));

    console.log('Movies retrieved:', retrievedMovies);

    // Send the retrieved movies as JSON response
    res.status(200).json(retrievedMovies);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ message: 'Error fetching movies from database' });
  }
});

export default router;
