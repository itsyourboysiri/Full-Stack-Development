import express, { Request, Response } from 'express';
import {Movie} from '../../movies/movie_model'; // Import your movie collection model

const router = express.Router();
const path = require('path');

// Search movies by name
router.get('/getmoviebyid/:id', async (req: Request, res: Response) :Promise<void> => {
  const { id } = req.params;

  try {
     // Search for movies with names matching the query (case-insensitive)
     const movies = await Movie.findById(id);

     if (!movies) {
       res.status(404).json({ message: 'Movie not found' });
       return;
    }

     // Map through the movies to include the full URL for the picture
     const retrievedMovies = {
      ...movies.toObject(),
      picture: `http://localhost:5000/uploads/${path.basename(movies.picture)}`, // Full URL for the picture
    };
 
     
 
     // Send the retrieved movies as JSON response
     res.status(200).json(retrievedMovies);
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
