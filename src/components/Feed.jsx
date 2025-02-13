import FeedItem from './FeedItem'
import { fetchAPI } from '@/lib/api'

const Feed = async ({ userId }) => {
  console.log('🎯 Feed component rendering for user:', userId);
  
  try {
    console.log('📡 Fetching feed data...');
    const { data, error } = await fetchAPI(`/api/feeds/${userId}`, {
      method: 'GET',
    });
    console.log('📦 User feed items API Response:', { data, error });

    if (error) {
      console.error('❌ Feed error:', error);
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="text-lg font-semibold text-red-800">Unable to load feeds</h3>
          <p className="mt-1 text-sm text-red-600">{error}</p>
          <p className="mt-1 text-xs text-red-500">User ID: {userId}</p>
        </div>
      );
    }

    const items = data?.data.items || [];
    console.log('📊 Feed items count:', items.length);

    if (items.length === 0) {
      console.log('ℹ️ No feed items found');
      return (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-800">No feed items yet</h3>
          <p className="mt-1 text-sm text-gray-600">
            Try subscribing to some RSS feeds to get started.
          </p>
        </div>
      );
    }

    console.log('✅ Rendering feed items');
    return (
      <div className="space-y-8">
        {/* Featured Article */}
        {items[0] && (
          <div className="col-span-full">
            <FeedItem
              {...items[0]}
              variant="featured"
            />
          </div>
        )}

        {/* Regular Grid */}
        {items.length > 1 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.slice(1, 4).map((item) => (
              <FeedItem
                key={item._id}
                {...item}
                variant="default"
              />
            ))}
          </div>
        )}

        {/* Compact Layout */}
        {items.length > 4 && (
          <div className="space-y-3">
            {items.slice(4).map((item) => (
              <FeedItem
                key={item._id}
                {...item}
                variant="compact"
              />
            ))}
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('❌ Unexpected error in Feed component:', error);
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <h3 className="text-lg font-semibold text-red-800">Unable to load feeds</h3>
        <p className="mt-1 text-sm text-red-600">An unexpected error occurred</p>
        <p className="mt-1 text-xs text-red-500">User ID: {userId}</p>
      </div>
    );
  }
}

export default Feed
