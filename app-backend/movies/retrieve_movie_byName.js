"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const movie_model_1 = require("./movie_model"); // Import your movie collection model
const router = express_1.default.Router();
const path = require('path');
// Search movies by name
router.get('/searchmovies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.query;
    if (!name || typeof name !== 'string') {
        res.status(400).json({ message: 'Invalid search query' });
        return;
    }
    try {
        // Search for movies with names matching the query (case-insensitive)
        const movies = yield movie_model_1.Movie.find({ movieName: { $regex: name, $options: 'i' } }).sort({
            movieName: 1 // Sort alphabetically
        });
        ;
        // Map through the movies to include the full URL for the picture
        const retrievedMovies = movies.map(movie => (Object.assign(Object.assign({}, movie.toObject()), { picture: `http://localhost:5000/uploads/${path.basename(movie.picture)}` })));
        console.log('Searched Movie List:', retrievedMovies);
        // Send the retrieved movies as JSON response
        res.status(200).json(retrievedMovies);
    }
    catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = router;
