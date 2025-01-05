import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import adminUserModel from '../adminModel'; // Adjust the path if necessary

const router = express.Router();

// Signup Endpoint
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
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
    const existingUser = await adminUserModel.findOne({
      $or: [{ adminUsername }, { adminEmail }],
    });

    if (existingUser) {
       res.status(400).json({ message: 'Username or email already in use.' });
       return;
    }

    // Save admin user to database without hashing password
    const newAdminUser = new adminUserModel({
      adminUsername,
      adminPassword, // Storing the plain text password
      adminEmail,
    });

    await newAdminUser.save();

    res.status(201).json({ message: 'Admin user created successfully.' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
