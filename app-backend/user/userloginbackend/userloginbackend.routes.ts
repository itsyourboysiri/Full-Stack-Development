import express, { Request, Response } from 'express';
import userModel from '../userModel';


const router = express.Router();

// User Login Route
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  console.log('Received login request:', { username, password });

  // Validate input
  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }

  try {
    // Find user by username
    const user = await userModel.findOne({ username }) as unknown as { _id: string; username: string; password: string } | null;

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
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
