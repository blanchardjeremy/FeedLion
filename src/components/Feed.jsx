import FeedItem from './FeedItem'

const Feed = ({ items }) => {
  return (
    <div className="space-y-8">
      {/* Featured Article */}
      <div className="col-span-full">
        <FeedItem
          {...items[0]}
          variant="featured"
        />
      </div>

      {/* Regular Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.slice(1, 4).map((item) => (
          <FeedItem
            key={item.id}
            {...item}
            variant="default"
          />
        ))}
      </div>

      {/* Compact Layout */}
      <div className="space-y-3">
        {items.slice(4).map((item) => (
          <FeedItem
            key={item.id}
            {...item}
            variant="compact"
          />
        ))}
      </div>
    </div>
  )
}

export default Feed
