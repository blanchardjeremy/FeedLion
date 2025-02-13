import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { format } from 'timeago.js'

// Domains that need image proxying
const PROXY_DOMAINS = new Set([
  'media.wired.com',
])

const getDomainFromUrl = (url) => {
  try {
    const urlObj = new URL(url)
    // Extract domain without subdomain
    const parts = urlObj.hostname.split('.')
    const domain = parts.length > 2 ? parts.slice(-2).join('.') : urlObj.hostname
    return domain
  } catch (e) {
    return url
  }
}

const getProxiedImageUrl = (url) => {
  try {
    const urlObj = new URL(url)
    if (PROXY_DOMAINS.has(urlObj.hostname)) {
      return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`
    }
    return url
  } catch (e) {
    return url
  }
}

const variants = {
  default: {
    card: "feed-item-default group overflow-hidden transition-all hover:shadow-lg border-0 h-full",
    imageContainer: "relative h-[250px] w-full overflow-hidden",
    title: "line-clamp-3",
    content: "flex flex-col flex-1 p-6 bg-secondary transition-colors group-hover:bg-secondary/70 h-full space-y-4",
  },
  featured: {
    card: "feed-item-featured group overflow-hidden transition-all hover:shadow-lg border-0 relative h-[400px]",
    imageContainer: "absolute inset-0",
    image: "brightness-[0.7] transition-all group-hover:scale-105 group-hover:brightness-[0.6]",
    content: "absolute bottom-0 left-0 right-0 p-6 space-y-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white",
  },
  horizontal: {
    card: "feed-item-horizontal group overflow-hidden transition-all hover:shadow-lg border-0 grid grid-cols-[2fr,3fr] h-[200px]",
    imageContainer: "relative h-full w-full overflow-hidden",
    content: "p-6 space-y-4 bg-secondary h-full",
  },
  compact: {
    card: "feed-item-compact group overflow-hidden transition-all hover:shadow-lg border-0 grid grid-cols-[2.5fr,1fr] h-2xl md:h-3xl",
    imageContainer: "relative h-full w-full overflow-hidden order-last",
    content: "p-3 md:p-4 space-y-4 bg-secondary transition-colors group-hover:bg-secondary/70 flex flex-col justify-center",
    title: "text-base md:text-lg line-clamp-3",
    description: "line-clamp-2"
  }
}

const FeedItem = ({ item, variant = "default", className }) => {
  const styles = variants[variant] || variants.default
  const firstCategory = item.categories?.[0]

  return (
    <Link href={item.link} className="block">
      <Card className={cn(styles.card, className)}>
        {/* Image Container */}
        <div className={styles.imageContainer}>
          <img
            src={getProxiedImageUrl(item.imageUrl)}
            alt={item.title}
            className={cn(
              "h-full w-full absolute inset-0 object-cover duration-300 ease-in-out transition-transform group-hover:scale-105",
              styles.image
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content Section */}
        <div className={styles.content}>
          
          <div className="space-y-2">
            <h3 className={cn(
              "text-xl font-bold leading-tight tracking-tight",
              variant === 'featured' ? 'text-white' : 'text-secondary-foreground',
              variant === 'compact' && styles.title
            )}>
              {item.title}
            </h3>
            <p className={cn(
              "line-clamp-2 text-sm",
              variant === 'featured' ? 'text-gray-200' : 'text-muted-foreground',
              variant === 'compact' && styles.description
            )}>
              {item.description}
            </p>
          </div>

          <div className={cn(
            "flex items-center space-x-2 text-xs",
            variant === 'featured' ? 'text-gray-200/70' : 'text-muted-foreground/70'
          )}>
            <span>{item.feed?.url ? getDomainFromUrl(item.feed.url) : 'Unknown Source'}</span>
            <span>•</span>
            <span>{item.pubDate ? format(new Date(item.pubDate)) : 'Unknown date'}</span>
            {firstCategory && variant !== 'default' && (
              <>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline first-letter:uppercase">{firstCategory}</span>
              </>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default FeedItem
