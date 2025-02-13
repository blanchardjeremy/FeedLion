'use client'

import { useState } from 'react'
import { Settings, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fetchAPI } from '@/lib/api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import AddFeedForm from '@/components/AddFeedForm'

export default function ManageFeedsModal({ userId, subscribedFeeds: initialFeeds }) {
  const [open, setOpen] = useState(false)
  const [subscribedFeeds, setSubscribedFeeds] = useState(initialFeeds)
  const [isUnsubscribing, setIsUnsubscribing] = useState(false)

  const handleUnsubscribe = async (feedId) => {
    try {
      setIsUnsubscribing(true)
      const { error } = await fetchAPI(`/api/feeds/${userId}/unsubscribe`, {
        method: 'POST',
        body: { feedId }
      })

      if (error) {
        throw new Error(error)
      }

      // Update local state by removing the unsubscribed feed
      setSubscribedFeeds(feeds => feeds.filter(feed => feed._id !== feedId))
    } catch (error) {
      console.error('Error unsubscribing:', error)
      // You might want to show an error toast here
    } finally {
      setIsUnsubscribing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="ml-2">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Manage Feeds</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage RSS Feeds</DialogTitle>
          <DialogDescription>
            Add new RSS feeds or manage your existing subscriptions.
          </DialogDescription>
        </DialogHeader>

        {/* Add Feed Form */}
        <div className="space-y-2">
          <h3 className="text-base font-medium">Add New Feed</h3>
          <AddFeedForm 
            userId={userId} 
            onSuccess={() => {
              // Close the modal after successful addition
              setOpen(false)
            }}
          />
        </div>

        <div className="mt-6 space-y-4">
          {/* Existing Feeds */}
          {subscribedFeeds?.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-base font-medium">Your Subscribed Feeds</h3>
              <div className="grid gap-3">
                {subscribedFeeds.map((feed) => (
                  <div 
                    key={feed._id} 
                    className="flex items-center justify-between p-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="min-w-0 flex-1 mr-4">
                      <h4 className="font-medium truncate">{feed.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">{feed.url}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleUnsubscribe(feed._id)}
                      disabled={isUnsubscribing}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Unsubscribe from feed</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              You haven't subscribed to any feeds yet. Add your first RSS feed below!
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 