import express, { Request, Response } from 'express';
import adminUserModel from '../adminModel'; 

const router = express.Router();

// Login Endpoint
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { adminUsername, adminPassword } = req.body;

    // Input Validation
    if (!adminUsername || !adminPassword) {
       res.status(400).json({ message: 'Username and password are required.' });
       return;
    }

    // Find the admin user by username
    const adminUser = await adminUserModel.findOne({ adminUsername });

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
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;