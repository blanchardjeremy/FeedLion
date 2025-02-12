import FeedItem from './FeedItem'

const Feed = ({ items }) => {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <FeedItem
          key={item.id}
          title={item.title}
          source={item.source}
          description={item.description}
          imageUrl={item.imageUrl}
        />
      ))}
    </div>
  )
}

export default Feed
