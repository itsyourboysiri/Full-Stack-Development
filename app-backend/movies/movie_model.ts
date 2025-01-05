import mongoose from "mongoose";

// Define Mongoose Schema
const movieSchema = new mongoose.Schema({
    movieName: { type: String, required: true },
    category: { type: String, required: true },
    releaseYear: { type: Number, required: true },
    picture: { type: String, required: true }, 
    cast: { type: [String], required: true }, 
    trailerLink: { type: String, required: true }, 
    watchTime: { type: Number, required: true }, 
    director: { type: String, required: true },
    nowScreening: { type: Boolean, required: true }, 
    additionalInfo: { type: String }, 
    timeSlots: { type: [String], required: true },
  });
  
  // Create Mongoose Model
 export const Movie = mongoose.model('Movie', movieSchema, 'movie_collection');