import express, { Request, Response } from 'express';
import { Movie } from '../../movies/movie_model';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Route to delete a movie by ID
router.delete('/deletemovie/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Find and delete the movie by ID
    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      res.status(404).json({ message: 'Movie not found' });
      return;
    }

    // Extract the image path from the movie
    const imagePath = deletedMovie?.picture;

    // Remove the image file if it exists
    if (imagePath) {
      // Extract the relative file path from the full URL
      const filePath = path.resolve(__dirname, '../../uploads', path.basename(imagePath));

      // Delete the file using fs
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
        } else {
          console.log('Image file deleted successfully:', filePath);
        }
      });
    }

    console.log(`Movie with ID ${id} deleted successfully.`);
    res.status(200).json({ message: 'Movie deleted successfully', deletedMovie });
    return;
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
});

export default router;
