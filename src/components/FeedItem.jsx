import Image from 'next/image'
import { Card } from '@/components/ui/card'

const FeedItem = ({ title, source, description, imageUrl }) => {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg border-0">
      {/* Image Container */}
      <div className="relative h-[250px] w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover duration-300 ease-in-out transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4 bg-secondary">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span className="font-medium">{source}</span>
          <span>•</span>
          <span>1 hour ago</span>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold leading-tight tracking-tight text-secondary-foreground">
            {title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </Card>
  )
}

export default FeedItem
