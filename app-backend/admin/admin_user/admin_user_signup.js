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
const adminModel_1 = __importDefault(require("../adminModel")); // Adjust the path if necessary
const router = express_1.default.Router();
// Signup Endpoint
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminUsername, adminPassword, adminEmail } = req.body;
        // Validation
        if (!adminUsername || !adminPassword || !adminEmail) {
            res.status(400).json({ message: 'All fields are required.' });
            return;
        }
        const usernamePattern = /^[a-zA-Z0-9_]+$/;
        if (!usernamePattern.test(adminUsername)) {
            res.status(400).json({ message: 'Invalid username format.' });
            return;
        }
        if (adminPassword.length < 5 || /\s/.test(adminPassword)) {
            res
                .status(400)
                .json({ message: 'Password must be at least 5 characters long and contain no spaces.' });
            return;
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(adminEmail)) {
            res.status(400).json({ message: 'Invalid email address.' });
            return;
        }
        // Check if username or email already exists
        const existingUser = yield adminModel_1.default.findOne({
            $or: [{ adminUsername }, { adminEmail }],
        });
        if (existingUser) {
            res.status(400).json({ message: 'Username or email already in use.' });
            return;
        }
        // Save admin user to database without hashing password
        const newAdminUser = new adminModel_1.default({
            adminUsername,
            adminPassword, // Storing the plain text password
            adminEmail,
        });
        yield newAdminUser.save();
        res.status(201).json({ message: 'Admin user created successfully.' });
    }
    catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}));
exports.default = router;
