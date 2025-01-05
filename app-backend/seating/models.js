"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Booking schema
const bookingSchema = new mongoose_1.default.Schema({
    date: { type: String, required: true },
    movieName: { type: String, required: true },
    showTime: { type: String, required: true },
    seats: [
        {
            row: { type: Number, required: true },
            seat: { type: Number, required: true },
        },
    ],
});
// Booking model
const Booking = mongoose_1.default.model('Booking', bookingSchema);
exports.default = Booking;
