import express, { Request, Response } from 'express';
import { Movie } from '../../movies/movie_model';
import multer from 'multer';
import path from 'path';


const app = express();


const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: (arg0: null, arg1: string) => void) => {
    cb(null, 'uploads/');
  },
  filename: (req: any, file: { originalname: any; }, cb: (arg0: null, arg1: string) => void) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Define Route to Insert a Movie
app.post('/movies',upload.single('picture'), async (req: Request, res: Response):Promise<void> => {
  try {
    const { movieName, category, releaseYear, picture, additionalInfo,cast,trailerLink,watchTime,director,nowScreening,timeSlots } = req.body;

   


    console.log("movieName ",movieName)
    console.log("category ",category)
    console.log("releaseYear ",releaseYear)
    console.log("picture ",req.file)
    console.log("additionalInfo ",additionalInfo)
    console.log("cast ",cast)
    console.log("trailerlink ",trailerLink)
    console.log("watchtime ",watchTime)
    console.log("director ",director)
    console.log("nowscreening ",nowScreening)

   
    if (!movieName || !category || !releaseYear || !req.file?.path ||!cast ||!trailerLink||!watchTime||!director ||!nowScreening ||!timeSlots ) {
       res.status(400).json({ message: 'All fields are required!' });
       return;
    }

     // Check if the file was uploaded
     if (!req.file) {
      res.status(400).json({ message: 'Picture is required!' });
      return;
    }

     // Validate timeSlots
     const parsedTimeSlots = Array.isArray(timeSlots)
     ? timeSlots
     : JSON.parse(timeSlots);

   if (!parsedTimeSlots || parsedTimeSlots.length === 0) {
     res.status(400).json({ message: 'At least one time slot is required!' });
     return;
   }

    // Create a new movie document
    const newMovie = new Movie({
      movieName,
      category,
      releaseYear,
      picture: path.posix.join('uploads', path.basename(req.file.path)),
      cast,
      trailerLink,
      watchTime,
      director,
      nowScreening,
      additionalInfo,
      timeSlots: parsedTimeSlots,
    });

    // Save to the database
    await newMovie.save();
    

    res.status(201).json({ message: 'Movie inserted successfully', movie: newMovie });
  } catch ( err) {
    if (err instanceof Error) {
      console.error(err.message); 
      res.status(500).json({ message: 'Server error', error: err.message });
    } else {
      
      console.error('An unexpected error occurred:', err);
      res.status(500).json({ message: 'An unexpected error occurred' });
  }
}});

export default app;

