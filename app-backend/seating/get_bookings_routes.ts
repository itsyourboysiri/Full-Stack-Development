import express, { Request, Response, Router } from 'express';
import Booking from './models';

const router: Router = express.Router();

// Define the type for the Booking request body
interface BookingRequest {
  date: string;
  movieName: string;
  showTime: string;
  seats: [];
}

// Get bookings for a specific date, movie, and time
router.get('/:date/:movie/:time', async (req: Request, res: Response) => {
  const { date, movie, time } = req.params;
  try {
    const booking = await Booking.findOne({ date, movieName: movie, showTime: time });
    if (booking) {
      res.status(200).json(booking);
    } else {
      res.status(404).json({ message: 'No bookings found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: (error as Error).message });
  }
});



// 404 handler for undefined routes
router.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'API route not found' });
});

export default router;
