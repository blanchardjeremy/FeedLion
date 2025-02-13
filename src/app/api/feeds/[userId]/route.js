import { connectDB } from '@/lib/db';
import { User, Feed, FeedItem } from '@/models';

export async function GET(request, context) {
  console.log('🔍 [GET] /api/feeds/[userId] - Starting request');
  try {
    console.log('📡 Connecting to database...');
    await connectDB();
    
    const params = await context.params;
    const { userId } = params;
    console.log('👤 User ID:', userId);

    // Find user and their subscribed feeds
    console.log('🔍 Finding user...');
    const user = await User.findOne({ userId });
    
    if (!user) {
      console.log('❌ User not found:', userId);
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    console.log('✅ Found user:', user._id);
    console.log('📚 Subscribed feeds:', user.subscribedFeeds.length);

    // Get user preferences with defaults
    const maxItems = user.preferences?.maxItems || 30;
    const maxDays = user.preferences?.maxDays || 2;
    
    // Calculate the date threshold based on maxDays
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - maxDays);
    
    console.log('⚙️ Using preferences - maxItems:', maxItems, 'maxDays:', maxDays);
    console.log('📅 Date threshold:', dateThreshold);

    // Get feed items for all user's subscribed feeds with filters
    console.log('🔍 Fetching feed items from database...');
    const feedItems = await FeedItem.find({
      feed: { $in: user.subscribedFeeds },
      pubDate: { $gte: dateThreshold }
    })
    .sort({ pubDate: -1 })
    .limit(maxItems)
    .populate('feed', 'title url');

    console.log('📊 Feed items found:', feedItems.length);
    console.log('📅 Latest item date:', feedItems[0]?.pubDate || 'No items');
    console.log('📅 Oldest item date:', feedItems[feedItems.length - 1]?.pubDate || 'No items');

    return Response.json({
      success: true,
      data: {
        items: feedItems,
        preferences: {
          maxItems,
          maxDays
        }
      }
    });

  } catch (error) {
    console.error('❌ Error getting feeds:', error);
    console.error('Stack trace:', error.stack);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 