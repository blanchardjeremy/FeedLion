import { connectDB } from '@/lib/db';
import { User } from '@/models';
import crypto from 'crypto';

export async function POST() {
  try {
    await connectDB();
    
    // Generate a 24-character hex ID
    let userId = crypto.randomBytes(12).toString('hex');
    
    // Create the user with retry logic
    let retries = 3;
    let user = null;
    
    while (retries > 0 && !user) {
      try {
        user = await User.create({
          userId,
          subscribedFeeds: [],
          clickedItems: []
        });
        break;
      } catch (err) {
        if (err.code === 11000) { // Duplicate key error
          // Generate a new ID and retry
          userId = crypto.randomBytes(12).toString('hex');
          retries--;
        } else {
          throw err;
        }
      }
    }

    if (!user) {
      return Response.json(
        { error: 'Failed to create user after multiple attempts' },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      userId: user.userId,
      message: 'Please save this ID - you will need it to access your feeds'
    });

  } catch (error) {
    console.error('Error creating user:', error);
    
    // More specific error messages based on the error type
    if (error.name === 'MongooseServerSelectionError') {
      return Response.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }
    
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 