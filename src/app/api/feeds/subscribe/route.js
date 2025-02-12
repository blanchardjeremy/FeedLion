import { connectDB } from '@/lib/db';
import { Feed, User } from '@/models';

export async function POST(request) {
  try {
    await connectDB();
    
    const { userId, feedUrl, feedTitle } = await request.json();

    if (!userId || !feedUrl) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find or create the feed
    let feed = await Feed.findOne({ url: feedUrl });
    
    if (!feed) {
      feed = await Feed.create({
        url: feedUrl,
        title: feedTitle || feedUrl, // Use URL as fallback if no title provided
      });
    }

    // Add feed to user's subscriptions if not already subscribed
    const user = await User.findOneAndUpdate(
      { 
        userId,
        subscribedFeeds: { $ne: feed._id } // Only if not already subscribed
      },
      {
        $addToSet: { subscribedFeeds: feed._id }
      },
      { new: true }
    );

    if (!user) {
      return Response.json(
        { error: 'User not found or already subscribed to this feed' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      feed: {
        id: feed._id,
        title: feed.title,
        url: feed.url
      }
    });

  } catch (error) {
    console.error('Error subscribing to feed:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 