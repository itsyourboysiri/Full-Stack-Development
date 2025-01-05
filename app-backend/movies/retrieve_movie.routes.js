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
const movie_model_1 = require("./movie_model");
const router = express_1.default.Router();
const app = (0, express_1.default)();
const path = require('path');
app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
});
// Route to retrieve all movies from the database
router.get('/getmovies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Fetching movies...');
    try {
        // Retrieve movies from the database
        const movies = yield movie_model_1.Movie.find();
        // Map through the movies to include the full URL for the picture
        const retrievedMovies = movies.map(movie => (Object.assign(Object.assign({}, movie.toObject()), { picture: `http://localhost:5000/uploads/${path.basename(movie.picture)}` })));
        console.log('Movies retrieved:', retrievedMovies);
        // Send the retrieved movies as JSON response
        res.status(200).json(retrievedMovies);
    }
    catch (err) {
        console.error('Error fetching movies:', err);
        res.status(500).json({ message: 'Error fetching movies from database' });
    }
}));
exports.default = router;
