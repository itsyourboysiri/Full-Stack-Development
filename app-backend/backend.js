"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const database_1 = __importDefault(require("./database")); // MongoDB connection
const user_signup_backend_routes_1 = __importDefault(require("./user/user_signup_backend/user_signup_backend.routes")); // Routes for user signup
const userloginbackend_routes_1 = __importDefault(require("./user/userloginbackend/userloginbackend.routes"));
const admin_insert_movie_routes_1 = __importDefault(require("./admin/admin_movie/admin_insert_movie.routes"));
const retrieve_movie_routes_1 = __importDefault(require("./movies/retrieve_movie.routes"));
const retrieve_movie_byName_1 = __importDefault(require("./movies/retrieve_movie_byName"));
const admin_user_signup_1 = __importDefault(require("./admin/admin_user/admin_user_signup"));
const admin_user_signin_1 = __importDefault(require("./admin/admin_user/admin_user_signin"));
const admin_delete_movie_routes_1 = __importDefault(require("./admin/admin_movie/admin_delete_movie.routes"));
const admin_update_movie_routes_1 = __importDefault(require("./admin/admin_movie/admin_update_movie.routes"));
const admin_retrieve_movieById_1 = __importDefault(require("./admin/admin_movie/admin_retrieve_movieById"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
dotenv.config(); // Load environment variables from .env
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
const cors = require('cors');
// Allow requests from localhost:4200 (frontend)
app.use(cors({
    origin: 'http://localhost:4200', // Allow only your frontend's domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Middleware
app.use(express_1.default.json());
// Connect to MongoDB
(0, database_1.default)();
// Configure Sessions
app.use((0, express_session_1.default)({
    secret: 'ahk', // Replace with a secure random string
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({
        mongoUrl: 'mongodb://localhost:27017/sample', // MongoDB connection string
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
}));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
// Use the signup route
app.use('/api/users', user_signup_backend_routes_1.default);
// Use the login route
app.use('/api/users', userloginbackend_routes_1.default);
// Use the insert movie route
app.use('/api/users', admin_insert_movie_routes_1.default);
// Use the retrieve movie route
app.use('/api/users', retrieve_movie_routes_1.default);
// Use the retrieve movie by name route
app.use('/api/users', retrieve_movie_byName_1.default);
// Use the admin signup route
app.use('/api/admin', admin_user_signup_1.default);
// Use the admin signin route
app.use('/api/admin', admin_user_signin_1.default);
// Use the delete movie route
app.use('/api/users', admin_delete_movie_routes_1.default);
// Use the update movie route
app.use('/api/users', admin_update_movie_routes_1.default);
// Use the retrieve movieById route
app.use('/api/users', admin_retrieve_movieById_1.default);
// Default route
app.get('/', (req, res) => {
    res.send('Backend server for signup functionality');
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
