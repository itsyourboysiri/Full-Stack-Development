// seating/movieschema.js
const mongoose = require('mongoose');

// Define the schema
const MovieSchema = new mongoose.Schema({
  movieName: { type: String, required: true },
  picture: { type: String, required: true },
  showTimes: { type: [String], required: true },
});

// Use existing model if it exists, otherwise define a new one
const Movie = mongoose.models.Movie || mongoose.model('Movie', MovieSchema);

module.exports = Movie;
