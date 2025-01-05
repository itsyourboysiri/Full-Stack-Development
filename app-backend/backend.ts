import express, { Application } from 'express';
import * as dotenv from 'dotenv';
import connectDB from './database'; // MongoDB connection
import userSignUpRoutes from './user/user_signup_backend/user_signup_backend.routes'; // Routes for user signup
import userLoginRoutes from './user/userloginbackend/userloginbackend.routes';
import insertMovieRoutes from './admin/admin_movie/admin_insert_movie.routes';
import retrieveMovieRoutes from './movies/retrieve_movie.routes';
import retrieveMovieByNameRoutes from './movies/retrieve_movie_byName';
import adminSignUpRoutes from './admin/admin_user/admin_user_signup';
import AdminSignInRoutes from './admin/admin_user/admin_user_signin';
import deleteMovieRoutes from './admin/admin_movie/admin_delete_movie.routes';
import updateMovieRoutes from './admin/admin_movie/admin_update_movie.routes';
import retrieveMovieById from './admin/admin_movie/admin_retrieve_movieById';

import MongoStore from 'connect-mongo';
import session from 'express-session';
import path from 'path'

dotenv.config(); // Load environment variables from .env

const app: Application = express();
const PORT = process.env.PORT || 5000;

const cors = require('cors');

// Allow requests from localhost:4200 (frontend)
app.use(
  cors({
    origin: 'http://localhost:4200', // Allow only your frontend's domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Configure Sessions
app.use(
  session({
    secret: 'ahk', // Replace with a secure random string
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb://localhost:27017/sample', // MongoDB connection string
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use the signup route
app.use('/api/users', userSignUpRoutes);

// Use the login route
app.use('/api/users', userLoginRoutes);

// Use the insert movie route
app.use('/api/users', insertMovieRoutes);

// Use the retrieve movie route
app.use('/api/users', retrieveMovieRoutes);

// Use the retrieve movie by name route
app.use('/api/users', retrieveMovieByNameRoutes);

// Use the admin signup route
app.use('/api/admin', adminSignUpRoutes);

// Use the admin signin route
app.use('/api/admin', AdminSignInRoutes);

// Use the delete movie route
app.use('/api/users', deleteMovieRoutes);

// Use the update movie route
app.use('/api/users', updateMovieRoutes);

// Use the retrieve movieById route
app.use('/api/users', retrieveMovieById);

// Default route
app.get('/', (req, res) => {
  res.send('Backend server for signup functionality');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
