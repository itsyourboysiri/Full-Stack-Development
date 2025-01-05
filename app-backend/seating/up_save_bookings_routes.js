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
const models_1 = __importDefault(require("./models"));
const router = express_1.default.Router();
// Save or update bookings
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, movieName, showTime, seats } = req.body;
    try {
        let booking = yield models_1.default.findOne({ date, movieName, showTime });
        if (booking) {
            booking.seats = seats;
        }
        else {
            booking = new models_1.default({ date, movieName, showTime, seats });
        }
        yield booking.save();
        res.status(200).json({ message: 'Booking saved successfully!' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error saving booking', error: error.message });
    }
}));
// 404 handler for undefined routes
router.use((req, res) => {
    res.status(404).json({ message: 'API route not found' });
});
exports.default = router;
