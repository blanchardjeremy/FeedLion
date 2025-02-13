import { connectDB } from '@/lib/db';
import { User } from '@/models';
import AddFeedForm from '@/components/AddFeedForm';
import Feed from '@/components/Feed';
import RefreshButton from '@/components/RefreshButton';

export default async function UserFeedPage({ params }) {
  try {
    const { userId } = await params;
    await connectDB();
    
    const user = await User.findOne({ userId })
      .populate({
        path: 'subscribedFeeds',
        select: 'title url'
      });

    if (!user) {
      return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold text-red-600">User not found</h1>
          <p>The requested user ID does not exist.</p>
        </div>
      );
    }

    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Your RSS Feeds</h1>
          <RefreshButton userId={userId} />
        </div>
        
        {user.subscribedFeeds.length === 0 ? (
          <p className="text-gray-600">
            You haven't subscribed to any feeds yet. Add your first RSS feed to get started!
          </p>
        ) : (
          <div className="grid gap-4">
            {user.subscribedFeeds.map((feed) => (
              <div 
                key={feed._id} 
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-semibold">{feed.title}</h2>
                <p className="text-gray-600 text-sm mt-1">{feed.url}</p>
              </div>
            ))}
          </div>
        )}
        
        <AddFeedForm userId={userId} />

        <Feed userId={userId} />
      </div>
    );
  } catch (error) {
    console.error('Error loading user feed:', error);
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p>Failed to load user feed. Please try again later.</p>
      </div>
    );
  }
} 