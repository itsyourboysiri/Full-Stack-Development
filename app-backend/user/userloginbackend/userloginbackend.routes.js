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
const userModel_1 = __importDefault(require("../userModel"));
const router = express_1.default.Router();
// User Login Route
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    console.log('Received login request:', { username, password });
    // Validate input
    if (!username || !password) {
        res.status(400).json({ message: 'Username and password are required' });
        return;
    }
    try {
        // Find user by username
        const user = yield userModel_1.default.findOne({ username });
        if (!user) {
            res.status(401).json({ message: 'User does not exist' });
            return;
        }
        if (user.password !== password) {
            res.status(401).json({ message: 'Invalid password' });
            return;
        }
        // Store username in session
        req.session.user = { id: user._id.toString(), username: user.username };
        // Log session ID and username
        console.log(`User logged in. Session ID: ${req.session.id}, Username: ${user.username}`);
        res.status(200).json({ message: 'Login successful' });
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
}));
exports.default = router;
