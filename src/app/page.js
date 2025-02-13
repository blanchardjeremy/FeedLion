'use client';

import { useState } from 'react';
import Feed from "@/components/Feed";
import Link from "next/link";
import { Rocket, Lock, Target, Flame } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';

const content = {
  features: [
    {
      icon: Rocket,
      title: 'Instant Setup',
      description: 'No registration or password needed. Get your personal feed in seconds.'
    },
    {
      icon: Lock,
      title: 'Private & Simple',
      description: 'Just bookmark your unique URL. No personal data stored.'
    },
    {
      icon: Target,
      title: 'No Infinite Scroll',
      description: 'No infinite scroll. Set a max number of articles to display.'
    }
  ],
};

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

  const fullUrl = userId ? `${window.location.origin}/${userId}` : '';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container max-w-4xl py-12">
          {!userId ? (
            <div className="space-y-8">
              {/* Hero Section */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-foreground">
                  FeedLion: Your Personal News Hub
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Ditch social media and make your own news hub.
                  No account required. No infinite scroll.
                </p>
              </div>


              {/* CTA Button */}
              <div className="text-center">
                <Button
                  onClick={createUser}
                  disabled={isLoading}
                  size="xl"
                  className="px-8 text-xl font-bold rounded-full"
                >
                  {isLoading ? 'Creating your feed...' : 'Create Your Feed'}
                </Button>
              </div>

              {/* Feature Highlights */}
              <div className="grid md:grid-cols-3 gap-6 py-8">
                {content.features.map((feature, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border bg-card">
                    <div className="text-2xl mb-2">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-secondary/50 border border-border rounded-lg space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-foreground">
                  Your Feed is Ready!
                </h2>
                <p className="text-muted-foreground">
                  Bookmark this unique URL to access your personalized feed anytime:
                </p>
              </div>
              
              <div className="font-mono bg-background p-4 rounded-lg border border-border break-all">
                <Link href={`/${userId}`} className="text-primary hover:text-primary/90">
                  {fullUrl}
                </Link>
              </div>

              <div className="flex items-start gap-2 p-4 bg-warning/10 rounded-lg">
                <div className="text-warning">⚠️</div>
                <div className="text-sm text-muted-foreground">
                  <strong>Important:</strong> Save or bookmark this URL - it's your only way to access your feeds.
                  You won't be able to recover it if lost.
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  asChild
                  variant="default"
                  size="default"
                >
                  <Link href={`/${userId}`}>
                    Go to My Feed →
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
              Error: {error}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container-tight flex h-14 items-center justify-center gap-4">
          <Link 
            href="https://github.com/blanchardjeremy/feedlion" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            Open Source
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link 
            href="https://blanchardjeremy.com" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Created by Jeremy Blanchard
          </Link>
        </div>
      </footer>
    </div>
  );
}
