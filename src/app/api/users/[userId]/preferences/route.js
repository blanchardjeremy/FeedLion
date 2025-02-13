import { connectDB } from '@/lib/db';
import { User } from '@/models';

export async function POST(request, context) {
  try {
    await connectDB();
    
    const params = await context.params;
    const { userId } = params;
    const preferences = await request.json();

    // Validate preferences
    if (!preferences || typeof preferences !== 'object') {
      return Response.json(
        { error: 'Invalid preferences data' },
        { status: 400 }
      );
    }

    // Update user preferences
    const user = await User.findOneAndUpdate(
      { userId },
      { 
        $set: { 
          preferences: {
            maxItems: Math.min(Math.max(1, preferences.maxItems), 1000),
            maxDays: Math.min(Math.max(1, preferences.maxDays), 365)
          }
        } 
      },
      { new: true }
    );

    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      preferences: user.preferences
    });

  } catch (error) {
    console.error('Error updating preferences:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 