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

    // Get clicked items within the same time range
    console.log('🔍 Fetching clicked items...');
    const clickedItems = await User.findOne(
      { userId },
      { 'clickedItems': 1 }
    );
    console.log('📦 Clicked items raw:', JSON.stringify(clickedItems?.clickedItems || [], null, 2));

    // Create a Set of clicked item IDs for easy lookup
    const clickedItemIds = new Set(
      clickedItems?.clickedItems?.map(click => click.item.toString()) || []
    );
    console.log('🎯 Clicked item IDs:', Array.from(clickedItemIds));

    // Add isRead flag to feed items
    const itemsWithReadStatus = feedItems.map(item => {
      const isRead = clickedItemIds.has(item._id.toString());
      console.log(`📖 Item ${item._id}: isRead=${isRead}`);
      return {
        ...item.toObject(),
        isRead
      };
    });

    console.log('📊 First few items with read status:', 
      itemsWithReadStatus.slice(0, 3).map(item => ({
        id: item._id,
        title: item.title,
        isRead: item.isRead
      }))
    );

    console.log('📊 Feed items found:', feedItems.length);
    console.log('📅 Latest item date:', feedItems[0]?.pubDate || 'No items');
    console.log('📅 Oldest item date:', feedItems[feedItems.length - 1]?.pubDate || 'No items');

    return Response.json({
      success: true,
      data: {
        items: itemsWithReadStatus,
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