import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import VideoCard from '@/components/VideoCard'
import VideoCardSkeleton from '@/components/VideoCardSkeleton'
import useVideoStore from '@/store/videoStore'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
export default function Home() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.toLowerCase()

  const { videos, isLoading, isLoadingMore, hasMore, fetchVideos, loadMoreVideos } =
    useVideoStore()

  useEffect(() => {
    fetchVideos(true)
  }, [fetchVideos])

  const lastRef = useInfiniteScroll({
    onLoadMore: loadMoreVideos,
    hasMore,
    isLoading: isLoadingMore,
  })

  const displayVideos = query
    ? videos.filter(
        (v) =>
          v.title?.toLowerCase().includes(query) ||
          v.owner?.fullName?.toLowerCase().includes(query) ||
          v.owner?.username?.toLowerCase().includes(query)
      )
    : videos

  return (
    <div>
      {query && (
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-xl font-semibold text-white"
        >
          Search results for &quot;{searchParams.get('q')}&quot;
        </motion.h2>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <VideoCardSkeleton key={i} />)
          : displayVideos.map((video, i) => (
              <VideoCard key={video._id} video={video} index={i} />
            ))}
      </div>

      {!isLoading && displayVideos.length === 0 && (
        <p className="py-16 text-center text-text-secondary">No videos found.</p>
      )}

      {!isLoading && hasMore && !query && (
        <div ref={lastRef} className="flex justify-center py-8">
          {isLoadingMore && (
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <VideoCardSkeleton key={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
