'use client';

import { useState } from 'react';
import Feed from "@/components/Feed";
import Link from "next/link";

export default function Home() {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/users/create', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      setUserId(data.userId);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const feedItems = [
    {
      id: 1,
      title: "The Future of AI: How Machine Learning is Transforming Industries",
      source: "Tech Daily",
      description: "An in-depth look at how artificial intelligence is shaping our future and transforming industries across the globe, from healthcare to finance.",
      imageUrl: "https://picsum.photos/seed/ai/800/600",
      url: "https://techdaily.com/ai-future"
    },
    {
      id: 2,
      title: "Climate Change: New Study Shows Accelerated Impact on Ocean Levels",
      source: "Environmental Report",
      description: "Scientists reveal alarming new data about the rate of sea level rise and its implications for coastal cities worldwide.",
      imageUrl: "https://picsum.photos/seed/climate/800/600",
      url: "https://environmental-report.com/climate-study"
    },
    {
      id: 3,
      title: "Space Tourism: First Commercial Flight to ISS Sets New Milestone",
      source: "Space News",
      description: "Private space company achieves historic breakthrough with successful civilian mission to the International Space Station.",
      imageUrl: "https://picsum.photos/seed/space/800/600",
      url: "https://spacenews.com/space-tourism"
    },
    {
      id: 4,
      title: "Global Economy Faces New Challenges Amid Tech Revolution",
      source: "Financial Times",
      description: "Economic experts analyze the impact of rapid technological advancement on traditional industries and employment.",
      imageUrl: "https://picsum.photos/seed/economy/800/600",
      url: "https://financialtimes.com/global-economy"
    },
    {
      id: 5,
      title: "Revolutionary Battery Technology Could Transform Electric Vehicles",
      source: "Auto Insider",
      description: "New solid-state battery development promises to double EV range and cut charging time in half.",
      imageUrl: "https://picsum.photos/seed/battery/800/600",
      url: "https://autoinsider.com/battery-technology"
    },
    {
      id: 6,
      title: "Breakthrough in Quantum Computing Reaches New Milestone",
      source: "Science Weekly",
      description: "Researchers achieve quantum supremacy in new experiment, opening doors for revolutionary computing applications.",
      imageUrl: "https://picsum.photos/seed/quantum/800/600",
      url: "https://scienceweekly.com/quantum-breakthrough"
    },
    {
      id: 7,
      title: "Remote Work Trends Reshape Urban Development",
      source: "Urban Planning Today",
      description: "Cities adapt to changing work patterns as remote work becomes permanent for many companies.",
      imageUrl: "https://picsum.photos/seed/city/800/600",
      url: "https://urbanplanningtoday.com/remote-work-trends"
    },
    {
      id: 8,
      title: "New Health Study Reveals Benefits of Mediterranean Diet",
      source: "Health & Wellness",
      description: "Long-term research confirms significant health improvements linked to Mediterranean eating patterns.",
      imageUrl: "https://picsum.photos/seed/health/800/600",
      url: "https://healthandwellness.com/mediterranean-diet"
    },
    {
      id: 9,
      title: "Cybersecurity Threats Evolve: What You Need to Know",
      source: "Tech Security",
      description: "Expert analysis of emerging digital threats and essential protection strategies for individuals and businesses.",
      imageUrl: "https://picsum.photos/seed/cyber/800/600",
      url: "https://techsecurity.com/cybersecurity-threats"
    },
    {
      id: 10,
      title: "Renewable Energy Surpasses Coal in Global Power Generation",
      source: "Energy Report",
      description: "Milestone achievement as renewable sources become the primary electricity generator worldwide.",
      imageUrl: "https://picsum.photos/seed/energy/800/600",
      url: "https://energyreport.com/renewable-energy"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Simple Header */}
      <header className="border-b">
        <div className="container-tight flex h-14 items-center justify-between">
          <span className="font-semibold">FeedLion</span>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-8">
          {!userId ? (
            <button
              onClick={createUser}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create New User'}
            </button>
          ) : (
            <div className="p-4 bg-green-100 border border-green-300 rounded">
              <p className="font-medium text-green-800">Your User ID has been created!</p>
              <p className="mt-2 font-mono bg-white p-2 rounded border border-green-200">
                {userId}
              </p>
              <p className="mt-2 text-sm text-green-700">
                ⚠️ Please save this ID - you will need it to access your feeds.
                You won't be able to recover it if lost.
              </p>
            </div>
          )}

          {error && (
            <p className="mt-4 text-red-500">
              Error: {error}
            </p>
          )}

          <Feed items={feedItems} />
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t">
        <div className="container-tight flex h-14 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            <Link href="https://github.com/blanchardjeremy/feedlion">Open Source on GitHub</Link>.
          </p>{' '}
          <p className="text-sm text-muted-foreground">
            Created by <Link href="https://blanchardjeremy.com">Jeremy Blanchard</Link>.
          </p>
        </div>
      </footer>
    </div>
  );
}
