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
const movie_model_1 = require("../../movies/movie_model"); // Movie model
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const multer = require('multer');
// Define storage configuration for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Uploads folder
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname); // Get the file extension
        cb(null, `${Date.now()}-${file.fieldname}${ext}`); // Create a unique filename
    },
});
// Define file filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed!'), false);
    }
};
// Initialize Multer
const upload = multer({ storage: storage, fileFilter: fileFilter });
// Route to update a movie by ID
router.put('/updatemovie/:id', upload.single('picture'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { movieName, category, releaseYear, additionalInfo, cast, trailerLink, watchTime, director, nowScreening, timeSlots } = req.body;
    let updateData = { movieName, category, releaseYear, additionalInfo, cast, trailerLink, watchTime, director, nowScreening };
    // Handle timeSlots
    if (timeSlots) {
        // Ensure timeSlots is an array
        updateData.timeSlots = Array.isArray(timeSlots) ? timeSlots : JSON.parse(timeSlots);
    }
    try {
        // Find the existing movie
        const existingMovie = yield movie_model_1.Movie.findById(id);
        if (!existingMovie) {
            res.status(404).json({ message: 'Movie not found' });
            return;
        }
        // If a new picture is uploaded
        if (req.file) {
            const oldPicturePath = path_1.default.join(process.cwd(), 'uploads', path_1.default.basename(existingMovie.picture));
            // Check if the old picture exists and delete it
            if (fs_1.default.existsSync(oldPicturePath)) {
                console.log('Deleting old picture:', oldPicturePath);
                fs_1.default.unlinkSync(oldPicturePath); // Delete the old image
            }
            else {
                console.log('Old picture not found or already deleted:', oldPicturePath);
            }
            // Update the new picture path
            updateData.picture = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }
        // Update the movie in the database
        const updatedMovie = yield movie_model_1.Movie.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({ message: 'Movie updated successfully', updatedMovie });
    }
    catch (err) {
        console.error('Error updating movie:', err);
        res.status(500).json({ message: 'Error updating movie', error: err });
    }
}));
exports.default = router;
