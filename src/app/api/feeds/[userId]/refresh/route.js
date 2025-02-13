import { connectDB } from '@/lib/db';
import { User, Feed, FeedItem } from '@/models';
import Parser from 'rss-parser';

const parser = new Parser();

export async function GET(request, context) {
  console.log('🔄 [GET] /api/feeds/[userId]/refresh - Starting refresh');
  try {
    console.log('📡 Connecting to database...');
    await connectDB();
    const params = await context.params;
    const { userId } = params;
    console.log('👤 User ID:', userId);

    // Find user and their subscribed feeds
    console.log('🔍 Finding user and populating feeds...');
    const user = await User.findOne({ userId }).populate('subscribedFeeds');
    
    if (!user) {
      console.log('❌ User not found:', userId);
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    console.log('✅ Found user:', user._id);
    console.log('📚 Number of subscribed feeds:', user.subscribedFeeds.length);

    if (!user.subscribedFeeds.length) {
      console.log('ℹ️ User has no subscribed feeds');
      return Response.json({
        success: true,
        data: {
          items: []
        }
      });
    }

    const feedItems = [];
    console.log('🔄 Starting to refresh feeds...');
    
    const refreshPromises = user.subscribedFeeds.map(async (feed) => {
      console.log(`\n📰 Processing feed: ${feed.title} (${feed.url})`);
      try {
        // Fetch and parse the RSS feed
        console.log(`🌐 Fetching RSS from: ${feed.url}`);
        const parsedFeed = await parser.parseURL(feed.url);
        console.log(`✅ Successfully parsed feed. Items found: ${parsedFeed.items.length}`);
        
        // Process each item in the feed
        console.log('📝 Processing feed items...');
        const itemPromises = parsedFeed.items.map(async (item) => {
          // Create a standardized item object
          const feedItem = {
            feed: feed._id,
            guid: item.guid || item.id || item.link,
            title: item.title,
            link: item.link,
            description: item.description || item.contentSnippet,
            pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
            content: item.content || item['content:encoded']
          };

          // Update or create the feed item
          const updatedItem = await FeedItem.findOneAndUpdate(
            { guid: feedItem.guid },
            feedItem,
            { upsert: true, new: true }
          );

          feedItems.push(updatedItem);
        });

        await Promise.all(itemPromises);
        console.log(`✅ Processed ${parsedFeed.items.length} items for feed: ${feed.title}`);

        // Update the feed's lastFetched timestamp
        await Feed.findByIdAndUpdate(feed._id, {
          lastFetched: new Date()
        });
        console.log(`📅 Updated lastFetched timestamp for feed: ${feed.title}`);
      } catch (error) {
        console.error(`❌ Error processing feed ${feed.url}:`, error);
        console.error('Stack trace:', error.stack);
        // Continue with other feeds even if one fails
      }
    });

    // Wait for all feeds to be processed
    console.log('\n⏳ Waiting for all feeds to complete processing...');
    await Promise.all(refreshPromises);
    console.log('✅ All feeds processed');

    // Sort all items by publication date
    console.log('📊 Sorting items by publication date...');
    feedItems.sort((a, b) => b.pubDate - a.pubDate);

    console.log(`📈 Final stats:
    - Total feeds processed: ${user.subscribedFeeds.length}
    - Total items found: ${feedItems.length}
    - Latest item date: ${feedItems[0]?.pubDate || 'No items'}
    - Oldest item date: ${feedItems[feedItems.length - 1]?.pubDate || 'No items'}`);

    return Response.json({
      success: true,
      data: {
        items: feedItems
      }
    });

  } catch (error) {
    console.error('❌ Error refreshing feeds:', error);
    console.error('Stack trace:', error.stack);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 