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

export default function ManageFeedsModal({ userId, subscribedFeeds: initialFeeds, preferences: initialPreferences }) {
  const [open, setOpen] = useState(false)
  const [subscribedFeeds, setSubscribedFeeds] = useState(initialFeeds)
  const [isUnsubscribing, setIsUnsubscribing] = useState(false)
  const [isSavingPreferences, setIsSavingPreferences] = useState(false)
  const [preferences, setPreferences] = useState(initialPreferences || { maxItems: 30, maxDays: 2 })
  const [error, setError] = useState('')

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

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target
    
    // If the input is empty, use the default values
    if (value === '') {
      setError('')
      setPreferences(prev => ({
        ...prev,
        [name]: name === 'maxItems' ? 30 : 2 // Default values
      }))
      return
    }

    const numValue = parseInt(value, 10)
    
    // Check if the value is not a number
    if (isNaN(numValue)) {
      setError(`Please enter a valid number`)
      return
    }
    
    // Validate input based on model constraints
    if (name === 'maxItems' && (numValue < 1 || numValue > 1000)) {
      setError('Max items must be between 1 and 1000')
      return
    }
    if (name === 'maxDays' && (numValue < 1 || numValue > 365)) {
      setError('Max days must be between 1 and 365')
      return
    }

    setError('')
    setPreferences(prev => ({
      ...prev,
      [name]: numValue
    }))
  }

  const handleSavePreferences = async () => {
    try {
      setIsSavingPreferences(true)
      setError('')
      
      const { error } = await fetchAPI(`/api/users/${userId}/preferences`, {
        method: 'POST',
        body: preferences
      })

      if (error) {
        throw new Error(error)
      }

      // Could add a success message here
    } catch (err) {
      console.error('Error saving preferences:', err)
      setError('Failed to save preferences')
    } finally {
      setIsSavingPreferences(false)
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

        {/* Feed Display Preferences */}
        <div className="space-y-4 border-b pb-4">
          <h3 className="text-base font-medium">Feed Display Preferences</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="maxItems" className="text-sm font-medium">
                Maximum Items
              </label>
              <input
                type="number"
                id="maxItems"
                name="maxItems"
                value={preferences.maxItems}
                onChange={handlePreferenceChange}
                min="1"
                max="1000"
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Show up to this many items (1-1000)
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="maxDays" className="text-sm font-medium">
                Days to Show
              </label>
              <input
                type="number"
                id="maxDays"
                name="maxDays"
                value={preferences.maxDays}
                onChange={handlePreferenceChange}
                min="1"
                max="365"
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Show items from the last X days (1-365)
              </p>
            </div>
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button 
            onClick={handleSavePreferences}
            disabled={isSavingPreferences || !!error}
          >
            {isSavingPreferences ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>

        {/* Add Feed Form */}
        <div className="space-y-2 mt-4">
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
            <div className="space-y-2">
              <h3 className="text-base font-medium">Your Subscribed Feeds</h3>
              <div className="grid gap-1">
                {subscribedFeeds.map((feed) => (
                  <div 
                    key={feed._id} 
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="min-w-0 flex-1 mr-4">
                      <p className="text-sm">{feed.url}</p>
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