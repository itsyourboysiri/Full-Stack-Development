import express, { Request, Response } from 'express';
import userModel,{ IUser } from '../userModel';

const router = express.Router();

// Async route handler for signup
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || !email || !password) {
       res.status(400).json({ message: 'All fields are required' });
    }

   
    // Check if the user already exists by email (since email is unique in the model)
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Save the new user to the database using the imported userModel
    const newUser = new userModel({ username, email, password });
    const savedUser = await newUser.save() as unknown as IUser & { _id: string };
    await newUser.save();

     // Create a session for the user
     req.session.user = { id: savedUser._id.toString(), username: savedUser.username };

      // Log session details for debugging
    console.log(`User signed up. Session ID: ${req.session.id}, User ID: ${newUser._id} Username:${newUser.username}`);

    res.status(201).json({ message: 'User signed up successfully',
       user: { username, email },
       sessionId: req.session.id 
     });
  } catch (error) {
    console.error('Error during user signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
