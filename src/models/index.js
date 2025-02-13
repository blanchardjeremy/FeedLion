import mongoose from 'mongoose';

const FeedSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  lastFetched: {
    type: Date,
    default: null
  }
}, { timestamps: true });

const FeedItemSchema = new mongoose.Schema({
  feed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feed',
    required: true
  },
  guid: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  description: String,
  pubDate: Date,
  content: String,
  imageUrl: {
    type: String,
    default: null
  },
  categories: [String]
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9a-f]{24}$/, // Ensures 24-character hex string
  },
  subscribedFeeds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feed'
  }],
  clickedItems: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FeedItem'
    },
    clickedAt: {
      type: Date,
      default: Date.now
    }
  }],
  preferences: {
    maxItems: {
      type: Number,
      default: 30,
      min: 1,
      max: 1000
    },
    maxDays: {
      type: Number,
      default: 2,
      min: 1,
      max: 365
    }
  }
}, { timestamps: true });

// Create indexes for better query performance
FeedItemSchema.index({ feed: 1, pubDate: -1 });

// Only create the model if it hasn't been created already
// This prevents errors when the app hot-reloads in development
export const Feed = mongoose.models.Feed || mongoose.model('Feed', FeedSchema);
export const FeedItem = mongoose.models.FeedItem || mongoose.model('FeedItem', FeedItemSchema);
export const User = mongoose.models.User || mongoose.model('User', UserSchema); 