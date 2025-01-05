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
const adminModel_1 = __importDefault(require("../adminModel"));
const router = express_1.default.Router();
// Login Endpoint
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminUsername, adminPassword } = req.body;
        // Input Validation
        if (!adminUsername || !adminPassword) {
            res.status(400).json({ message: 'Username and password are required.' });
            return;
        }
        // Find the admin user by username
        const adminUser = yield adminModel_1.default.findOne({ adminUsername });
        if (!adminUser) {
            // User not found
            res.status(401).json({ message: 'Invalid username or password.' });
            return;
        }
        // Compare the provided password with the stored password
        // Since passwords are stored in plain text, we can directly compare them
        if (adminUser.adminPassword !== adminPassword) {
            // Passwords do not match
            res.status(401).json({ message: 'Invalid username or password.' });
            return;
        }
        // Authentication successful
        res.status(200).json({ message: 'Admin Login successful.' });
    }
    catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}));
exports.default = router;
