import express, { Request, Response, Router } from 'express';

const Movie = require('./movieschema');


const router: Router = express.Router();

// Define types for requests and responses if needed
interface MovieRequest extends Request {
  body: {
    movieName: string;
    picture: string;
    showTimes: string[];
  };
}

// Get all movies
router.get('/', async (req: Request, res: Response) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: 'Error fetching movies', error: errorMessage });
  }
});

// Add a new movie
router.post('/', async (req: MovieRequest, res: Response) => {
  try {
    const { movieName, picture, showTimes } = req.body;
    const newMovie = new Movie({ movieName, picture, showTimes });
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: 'Error saving movie', error: errorMessage });
  }
});

export default router;
