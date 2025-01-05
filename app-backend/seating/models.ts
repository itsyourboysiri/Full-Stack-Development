import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the interface for a seat
interface Seat {
  row: number;
  seat: number;
}

// Define the interface for a booking document
export interface BookingDocument extends Document {
  date: string;
  movieName: string;
  showTime: string;
  seats: Seat[];
}

// Booking schema
const bookingSchema: Schema<BookingDocument> = new mongoose.Schema({
  date: { type: String, required: true },
  movieName: { type: String, required: true },
  showTime: { type: String, required: true },
  seats: [
    {
      row: { type: Number, required: true },
      seat: { type: Number, required: true },
    },
  ],
});

// Booking model
const Booking: Model<BookingDocument> = mongoose.model<BookingDocument>('Booking', bookingSchema);

export default Booking;
