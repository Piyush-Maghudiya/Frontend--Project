import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ChannelHeader from '@/components/ChannelHeader'
import VideoCard from '@/components/VideoCard'
import VideoCardSkeleton from '@/components/VideoCardSkeleton'
import { Skeleton } from '@/components/ui/skeleton'
import useVideoStore from '@/store/videoStore'
import usePlaylistStore from '@/store/playlistStore'
import useAuthStore from '@/store/authStore'
import { ListMusic } from 'lucide-react'

export default function Channel() {
  const { username } = useParams()
  const [activeTab, setActiveTab] = useState('videos')
  const { channel, isLoading, fetchChannel } = useVideoStore()
  const { playlists, fetchPlaylists } = usePlaylistStore()
  const { user } = useAuthStore()
  const isOwnChannel = user?.username === username

  useEffect(() => {
    if (username) fetchChannel(username)
  }, [username, fetchChannel])

  useEffect(() => {
    if (activeTab === 'playlists' && isOwnChannel) fetchPlaylists()
  }, [activeTab, isOwnChannel, fetchPlaylists])

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-[250px] w-full rounded-xl" />
        <div className="mt-8 flex gap-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  const channelVideos = channel?.videos || []

  return (
    <div>
      <ChannelHeader
        channel={channel}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'videos' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
        >
          {channelVideos.length > 0 ? (
            channelVideos.map((video, i) => (
              <VideoCard key={video._id} video={video} index={i} showChannel={false} />
            ))
          ) : (
            <p className="col-span-full py-12 text-center text-text-secondary">
              No videos uploaded yet.
            </p>
          )}
        </motion.div>
      )}

      {activeTab === 'playlists' && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {isOwnChannel && playlists.length > 0 ? (
            playlists.map((pl) => (
              <div
                key={pl._id}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-purple/20">
                  <ListMusic className="h-5 w-5 text-accent-purple" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{pl.name}</h3>
                  <p className="text-xs text-text-secondary">{pl.videoCount ?? 0} videos</p>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full py-12 text-center text-text-secondary">
              {isOwnChannel ? 'No playlists yet. Create one from your profile menu.' : 'No public playlists.'}
            </p>
          )}
        </div>
      )}

      {activeTab !== 'videos' && activeTab !== 'playlists' && (
        <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-border bg-card">
          <p className="text-text-secondary">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} coming soon
          </p>
        </div>
      )}
    </div>
  )
}
