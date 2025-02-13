import { Suspense } from 'react'
import { connectDB } from '@/lib/db';
import { User } from '@/models';
import Feed from '@/components/Feed';
import RefreshButton from '@/components/RefreshButton';
import ManageFeedsModal from '@/components/ManageFeedsModal';
import { Spinner } from '@/components/ui/spinner';
import Header from '@/components/Header';

async function getUserFeeds(userId) {
  await connectDB();
  const user = await User.findOne({ userId })
    .populate({
      path: 'subscribedFeeds',
      select: 'title url'
    });
  
  if (!user) {
    return null;
  }

  return {
    subscribedFeeds: user.subscribedFeeds,
    preferences: user.preferences
  };
}

export default async function UserFeedPage({ params }) {
  try {
    const { userId } = await params;
    const userData = await getUserFeeds(userId);

    if (!userData) {
      return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold text-red-600">User not found</h1>
          <p>The requested user ID does not exist.</p>
        </div>
      );
    }

    return (
      <>
        <Header>
          <RefreshButton userId={userId} />
          <ManageFeedsModal 
            userId={userId} 
            subscribedFeeds={JSON.parse(JSON.stringify(userData.subscribedFeeds))}
            preferences={JSON.parse(JSON.stringify(userData.preferences))}
          />
        </Header>

        <div className="container mx-auto p-4">
          <Suspense fallback={<Spinner />}>
            <Feed userId={userId} />
          </Suspense>
        </div>
      </>
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