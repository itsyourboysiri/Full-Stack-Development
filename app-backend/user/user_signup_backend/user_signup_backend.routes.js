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
// Async route handler for signup
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        // Validate input fields
        if (!username || !email || !password) {
            res.status(400).json({ message: 'All fields are required' });
        }
        // Check if the user already exists by email (since email is unique in the model)
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists with this email' });
            return;
        }
        // Save the new user to the database using the imported userModel
        const newUser = new userModel_1.default({ username, email, password });
        const savedUser = yield newUser.save();
        yield newUser.save();
        // Create a session for the user
        req.session.user = { id: savedUser._id.toString(), username: savedUser.username };
        // Log session details for debugging
        console.log(`User signed up. Session ID: ${req.session.id}, User ID: ${newUser._id} Username:${newUser.username}`);
        res.status(201).json({ message: 'User signed up successfully',
            user: { username, email },
            sessionId: req.session.id
        });
    }
    catch (error) {
        console.error('Error during user signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = router;
