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
const movie_model_1 = require("../../movies/movie_model");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
// Define Route to Insert a Movie
app.post('/movies', upload.single('picture'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { movieName, category, releaseYear, picture, additionalInfo, cast, trailerLink, watchTime, director, nowScreening, timeSlots } = req.body;
        console.log("movieName ", movieName);
        console.log("category ", category);
        console.log("releaseYear ", releaseYear);
        console.log("picture ", req.file);
        console.log("additionalInfo ", additionalInfo);
        console.log("cast ", cast);
        console.log("trailerlink ", trailerLink);
        console.log("watchtime ", watchTime);
        console.log("director ", director);
        console.log("nowscreening ", nowScreening);
        if (!movieName || !category || !releaseYear || !((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || !cast || !trailerLink || !watchTime || !director || !nowScreening || !timeSlots) {
            res.status(400).json({ message: 'All fields are required!' });
            return;
        }
        // Check if the file was uploaded
        if (!req.file) {
            res.status(400).json({ message: 'Picture is required!' });
            return;
        }
        // Validate timeSlots
        const parsedTimeSlots = Array.isArray(timeSlots)
            ? timeSlots
            : JSON.parse(timeSlots);
        if (!parsedTimeSlots || parsedTimeSlots.length === 0) {
            res.status(400).json({ message: 'At least one time slot is required!' });
            return;
        }
        // Create a new movie document
        const newMovie = new movie_model_1.Movie({
            movieName,
            category,
            releaseYear,
            picture: path_1.default.posix.join('uploads', path_1.default.basename(req.file.path)),
            cast,
            trailerLink,
            watchTime,
            director,
            nowScreening,
            additionalInfo,
            timeSlots: parsedTimeSlots,
        });
        // Save to the database
        yield newMovie.save();
        res.status(201).json({ message: 'Movie inserted successfully', movie: newMovie });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
        else {
            console.error('An unexpected error occurred:', err);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
}));
exports.default = app;
