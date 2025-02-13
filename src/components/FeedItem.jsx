import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Domains that need image proxying
const PROXY_DOMAINS = new Set([
  'media.wired.com',
])

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
    card: "group overflow-hidden transition-all hover:shadow-lg border-0",
    imageContainer: "relative h-[250px] w-full overflow-hidden",
    content: "p-6 space-y-4 bg-secondary transition-colors group-hover:bg-secondary/70",
  },
  featured: {
    card: "group overflow-hidden transition-all hover:shadow-lg border-0 relative h-[400px]",
    imageContainer: "absolute inset-0",
    image: "brightness-[0.7] transition-all group-hover:scale-105 group-hover:brightness-[0.6]",
    content: "absolute bottom-0 left-0 right-0 p-6 space-y-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white",
  },
  horizontal: {
    card: "group overflow-hidden transition-all hover:shadow-lg border-0 grid grid-cols-[2fr,3fr] h-[200px]",
    imageContainer: "relative h-full w-full overflow-hidden",
    content: "p-6 space-y-4 bg-secondary",
  },
  compact: {
    card: "group overflow-hidden transition-all hover:shadow-lg border-0 grid grid-cols-[2.5fr,1fr] h-[140px] md:h-[160px]",
    imageContainer: "relative h-full w-full overflow-hidden order-last",
    content: "p-3 md:p-4 space-y-2 bg-secondary transition-colors group-hover:bg-secondary/70 flex flex-col justify-center",
    title: "text-base md:text-lg line-clamp-1",
    description: "line-clamp-2 !mt-1"
  }
}

const FeedItem = ({ title, source, description, imageUrl, link, variant = "default", className, feed }) => {
  const styles = variants[variant] || variants.default

  return (
    <Link href={link} className="block">
      <Card className={cn(styles.card, className)}>
        {/* Image Container */}
        <div className={styles.imageContainer}>
          <img
            src={getProxiedImageUrl(imageUrl)}
            alt={title}
            className={cn(
              "h-full w-full absolute inset-0 object-cover duration-300 ease-in-out transition-transform group-hover:scale-105",
              styles.image
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content Section */}
        <div className={styles.content}>
          <div className={cn(
            "flex items-center space-x-2 text-sm",
            variant === 'featured' ? 'text-gray-200' : 'text-muted-foreground'
          )}>
            <span className="font-medium">{feed?.title || 'Unknown Source'}</span>
            <span>•</span>
            <span>1 hour ago</span>
          </div>
          
          <div className="space-y-2">
            <h3 className={cn(
              "text-xl font-bold leading-tight tracking-tight",
              variant === 'featured' ? 'text-white' : 'text-secondary-foreground',
              variant === 'compact' && styles.title
            )}>
              {title}
            </h3>
            <p className={cn(
              "line-clamp-2 text-sm",
              variant === 'featured' ? 'text-gray-200' : 'text-muted-foreground',
              variant === 'compact' && styles.description
            )}>
              {description}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default FeedItem
