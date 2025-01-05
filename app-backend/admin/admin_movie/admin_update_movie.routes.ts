import express, { Request, Response } from 'express';
import { Movie } from '../../movies/movie_model'; // Movie model
import fs from 'fs';
import path from 'path';

const router = express.Router();
const multer = require('multer');

// Define storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: (arg0: null, arg1: string) => void) => {
    cb(null, 'uploads/'); // Uploads folder
  },
  filename: (req: any, file: { originalname: string; fieldname: any; }, cb: (arg0: null, arg1: string) => void) => {
    const ext = path.extname(file.originalname); // Get the file extension
    cb(null, `${Date.now()}-${file.fieldname}${ext}`); // Create a unique filename
  },
});

// Define file filter to accept only images
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Initialize Multer
const upload = multer({ storage: storage, fileFilter: fileFilter });


// Route to update a movie by ID
router.put('/updatemovie/:id', upload.single('picture'), async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { movieName, category, releaseYear, additionalInfo, cast, trailerLink, watchTime, director, nowScreening,timeSlots } = req.body;
  let updateData: any = { movieName, category, releaseYear, additionalInfo, cast, trailerLink, watchTime, director, nowScreening };

  // Handle timeSlots
  if (timeSlots) {
    // Ensure timeSlots is an array
    updateData.timeSlots = Array.isArray(timeSlots) ? timeSlots : JSON.parse(timeSlots);
  }
  
  try {
    // Find the existing movie
    const existingMovie = await Movie.findById(id);
    if (!existingMovie) {
      res.status(404).json({ message: 'Movie not found' });
      return;
    }

    // If a new picture is uploaded
    if (req.file) {
      const oldPicturePath = path.join(process.cwd(), 'uploads', path.basename(existingMovie.picture));

      // Check if the old picture exists and delete it
      if (fs.existsSync(oldPicturePath)) {
        console.log('Deleting old picture:', oldPicturePath);
        fs.unlinkSync(oldPicturePath); // Delete the old image
      } else {
        console.log('Old picture not found or already deleted:', oldPicturePath);
      }

      // Update the new picture path
      updateData.picture = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Update the movie in the database
    const updatedMovie = await Movie.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ message: 'Movie updated successfully', updatedMovie });
  } catch (err) {
    console.error('Error updating movie:', err);
    res.status(500).json({ message: 'Error updating movie', error: err });
  }
});

export default router;
