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
// Route to delete a movie by ID
router.delete('/deletemovie/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Find and delete the movie by ID
        const deletedMovie = yield movie_model_1.Movie.findByIdAndDelete(id);
        if (!deletedMovie) {
            res.status(404).json({ message: 'Movie not found' });
            return;
        }
        console.log(`Movie with ID ${id} deleted successfully.`);
        res.status(200).json({ message: 'Movie deleted successfully', deletedMovie });
        return;
    }
    catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
}));
exports.default = router;
