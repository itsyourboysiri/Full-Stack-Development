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
const Movie = require('./movieschema');
const router = express_1.default.Router();
// Get all movies
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield Movie.find();
        res.status(200).json(movies);
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(500).json({ message: 'Error fetching movies', error: errorMessage });
    }
}));
// Add a new movie
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieName, picture, showTimes } = req.body;
        const newMovie = new Movie({ movieName, picture, showTimes });
        const savedMovie = yield newMovie.save();
        res.status(201).json(savedMovie);
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(500).json({ message: 'Error saving movie', error: errorMessage });
    }
}));
exports.default = router;
