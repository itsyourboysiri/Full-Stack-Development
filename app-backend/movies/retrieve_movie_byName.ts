import express, { Request, Response } from 'express';
import {Movie} from './movie_model'; // Import your movie collection model

const router = express.Router();
const path = require('path');

// Search movies by name
router.get('/searchmovies', async (req: Request, res: Response) :Promise<void> => {
  const { name } = req.query;

  if (!name || typeof name !== 'string') {
     res.status(400).json({ message: 'Invalid search query' });
     return;
  }

  try {
     // Search for movies with names matching the query (case-insensitive)
     const movies = await Movie.find({ movieName: { $regex: name, $options: 'i' } }).sort({
      movieName: 1 // Sort alphabetically
    });;

     // Map through the movies to include the full URL for the picture
     const retrievedMovies = movies.map(movie => ({
       ...movie.toObject(), // Convert movie document to a plain object
       picture: `http://localhost:5000/uploads/${path.basename(movie.picture)}`, // Full URL for the picture
     }));
 
     console.log('Searched Movie List:', retrievedMovies);
 
     // Send the retrieved movies as JSON response
     res.status(200).json(retrievedMovies);
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
