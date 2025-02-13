'use client';

import { useState } from 'react';
import { refreshFeeds } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function RefreshButton({ userId }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const { error } = await refreshFeeds(userId);
      
      if (error) {
        throw new Error(error);
      }
      
      // Refresh the page data
      router.refresh();
    } catch (err) {
      console.error('Failed to refresh feeds:', err);
      alert('Failed to refresh feeds. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button
      onClick={handleRefresh}
      disabled={isRefreshing}
      variant="outline"
      size="sm"
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
    </Button>
  );
} 