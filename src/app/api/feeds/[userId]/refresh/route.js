import { connectDB } from '@/lib/db';
import { User, Feed, FeedItem } from '@/models';
import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content', { keepArray: true }],
      ['media:thumbnail', 'media:thumbnail', { keepArray: true }],
      ['media:group', 'media:group'],
      ['content:encoded', 'content:encoded']
    ],
  },
  xml2js: {
    arrays: ['media:content', 'media:thumbnail']
  }
});

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
          console.log('Raw item data:', JSON.stringify(item, null, 2));
          
          const feedItem = {
            feed: feed._id,
            guid: item.guid || item.id || item.link,
            title: item.title,
            link: item.link,
            description: item.description || item.contentSnippet,
            pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
            content: item.content || item['content:encoded'],
            imageUrl: null,
            categories: []
          };

          // Extract categories
          if (item.categories) {
            feedItem.categories = Array.isArray(item.categories)
              ? item.categories.map(cat => 
                  // If category is an object with $ property (RSS format), get the text content
                  typeof cat === 'object' && cat._ ? cat._ : cat
                )
              : [item.categories];
          }

          // Extract the largest image from media:content or media:thumbnail
          const mediaContent = item['media:content'] || item.media?.content || item['media:group']?.['media:content'];
          const mediaThumbnail = item['media:thumbnail'];
          
          let mediaItems = [];
          
          // Add media:content items
          if (mediaContent) {
            console.log(`🖼️ Found media:content for item: ${item.title}`);
            console.log('Raw media:content:', JSON.stringify(mediaContent, null, 2));
            
            const contentItems = Array.isArray(mediaContent) ? mediaContent : [mediaContent];
            // Filter out empty media:content items
            mediaItems.push(...contentItems.filter(item => item && (item.$ || item.url)));
          }
          
          // Add media:thumbnail items
          if (mediaThumbnail) {
            console.log(`🖼️ Found media:thumbnail for item: ${item.title}`);
            console.log('Raw media:thumbnail:', JSON.stringify(mediaThumbnail, null, 2));
            
            const thumbnailItems = Array.isArray(mediaThumbnail) ? mediaThumbnail : [mediaThumbnail];
            mediaItems.push(...thumbnailItems);
          }
          
          if (mediaItems.length > 0) {
            console.log(`📊 Number of media items: ${mediaItems.length}`);
            console.log('Media items array:', JSON.stringify(mediaItems, null, 2));

            // Find the image with the largest width
            const largestImage = mediaItems.reduce((largest, current) => {
              console.log('\nProcessing media item:', JSON.stringify(current, null, 2));
              // Handle both formats: direct attributes or nested $ object
              const currentAttrs = current.$ || current;
              const largestAttrs = largest?.$ || largest;
              
              const currentWidth = parseInt(currentAttrs?.width || 0);
              const largestWidth = parseInt(largestAttrs?.width || 0);
              
              console.log(`Current width: ${currentWidth}, Largest width so far: ${largestWidth}`);
              return currentWidth > largestWidth ? current : largest;
            }, null);

            if (largestImage) {
              // Handle both formats: direct url or nested $ object
              const imageAttrs = largestImage.$ || largestImage;
              feedItem.imageUrl = imageAttrs.url;
              console.log(`✅ Selected image URL: ${feedItem.imageUrl}`);
            } else {
              console.log('❌ No valid image found in media items');
            }
          } else {
            console.log(`ℹ️ No media items found for item: ${item.title}`);
            
            // Try to find image in content as fallback
            if (item.content) {
              console.log('🔍 Attempting to find image in content...');
              const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
              if (imgMatch) {
                feedItem.imageUrl = imgMatch[1];
                console.log(`✅ Found fallback image in content: ${feedItem.imageUrl}`);
              } else {
                console.log('❌ No image found in content');
              }
            }
          }

          console.log(`📝 Final feed item before save:`, {
            title: feedItem.title,
            guid: feedItem.guid,
            imageUrl: feedItem.imageUrl
          });

          // Update or create the feed item
          console.log('💾 Attempting to save feed item to database:', JSON.stringify(feedItem, null, 2));
          
          // First try to find the existing item
          let existingItem = await FeedItem.findOne({ guid: feedItem.guid });
          
          let updatedItem;
          if (existingItem) {
            // If item exists, update it explicitly
            existingItem.set({
              ...feedItem,
              imageUrl: feedItem.imageUrl // Explicitly set imageUrl
            });
            updatedItem = await existingItem.save();
          } else {
            // If item doesn't exist, create new one
            updatedItem = await FeedItem.create({
              ...feedItem,
              imageUrl: feedItem.imageUrl // Explicitly set imageUrl
            });
          }
          
          // Convert to plain object for logging
          const savedItem = updatedItem.toObject();
          console.log('✅ Item saved to database. Updated item:', JSON.stringify(savedItem, null, 2));

          // Verify the image URL was saved
          if (savedItem.imageUrl !== feedItem.imageUrl) {
            console.warn('⚠️ Warning: Saved imageUrl differs from original:', {
              original: feedItem.imageUrl,
              saved: savedItem.imageUrl
            });
          }

          feedItems.push(savedItem);
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
    console.error('❌ Error processing refresh request', error);
    return Response.json(
      { error: 'An error occurred while processing the refresh request' },
      { status: 500 }
    );
  }
}