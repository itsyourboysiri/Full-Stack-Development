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
const movie_model_1 = require("../../movies/movie_model"); // Import your movie collection model
const router = express_1.default.Router();
const path = require('path');
// Search movies by name
router.get('/getmoviebyid/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Search for movies with names matching the query (case-insensitive)
        const movies = yield movie_model_1.Movie.findById(id);
        if (!movies) {
            res.status(404).json({ message: 'Movie not found' });
            return;
        }
        // Map through the movies to include the full URL for the picture
        const retrievedMovies = Object.assign(Object.assign({}, movies.toObject()), { picture: `http://localhost:5000/uploads/${path.basename(movies.picture)}` });
        // Send the retrieved movies as JSON response
        res.status(200).json(retrievedMovies);
    }
    catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = router;
