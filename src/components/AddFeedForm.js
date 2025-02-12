'use client';

import { useState } from 'react';
import { fetchAPI } from '@/lib/api';

export default function AddFeedForm({ userId }) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error: apiError } = await fetchAPI('/api/feeds/subscribe', {
      body: { feedUrl: url, userId }
    });

    if (apiError) {
      setError(apiError);
    } else {
      setUrl('');
      window.location.reload();
    }
    
    setIsLoading(false);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Add New Feed</h2>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter RSS feed URL"
          className="flex-1 p-2 border rounded"
          required
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Feed'}
        </button>
      </form>
      {error && (
        <p className="mt-2 text-red-600 text-sm">{error}</p>
      )}
    </div>
  );
} 