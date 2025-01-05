"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movie = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Define Mongoose Schema
const movieSchema = new mongoose_1.default.Schema({
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
exports.Movie = mongoose_1.default.model('Movie', movieSchema, 'movie_collection');
