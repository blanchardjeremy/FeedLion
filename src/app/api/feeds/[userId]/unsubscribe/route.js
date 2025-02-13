import { connectDB } from '@/lib/db';
import { User } from '@/models';

export async function POST(request, context) {
  try {
    await connectDB();
    
    const params = await context.params;
    const { userId } = params;
    const { feedId } = await request.json();

    if (!feedId) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Remove feed from user's subscriptions
    const user = await User.findOneAndUpdate(
      { userId },
      {
        $pull: { subscribedFeeds: feedId }
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
      message: 'Successfully unsubscribed from feed'
    });

  } catch (error) {
    console.error('Error unsubscribing from feed:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 