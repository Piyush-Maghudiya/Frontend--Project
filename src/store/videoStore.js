import { create } from 'zustand'
import {
  getVideos,
  getVideoById,
  getChannelProfile,
  toggleVideoLike,
  toggleSubscription,
  uploadVideo as uploadVideoApi,
} from '../services/api'
import useAuthStore from './authStore'
import { MOCK_VIDEOS, MOCK_CHANNEL, MOCK_COMMENTS } from '../data/mockData'
import { normalizeVideo, normalizeChannel } from '../lib/utils'

const useVideoStore = create((set, get) => ({
  videos: [],
  currentVideo: null,
  channel: null,
  comments: MOCK_COMMENTS,
  page: 1,
  hasMore: true,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  useMock: false,

  fetchVideos: async (reset = true) => {
    const page = reset ? 1 : get().page
    set({
      isLoading: reset,
      isLoadingMore: !reset,
      error: null,
      ...(reset && { videos: [], page: 1, hasMore: true }),
    })
    try {
      const { data } = await getVideos({ page, limit: 8 })
      const rawVideos = data.data?.docs || data.data || []
      const newVideos = rawVideos.map(normalizeVideo)
      set((state) => ({
        videos: reset ? newVideos : [...state.videos, ...newVideos],
        page: page + 1,
        hasMore: newVideos.length >= 8,
        isLoading: false,
        isLoadingMore: false,
        useMock: false,
      }))
    } catch {
      const mockSlice = MOCK_VIDEOS.slice(0, page * 8)
      set({
        videos: mockSlice,
        hasMore: mockSlice.length < MOCK_VIDEOS.length,
        page: page + 1,
        isLoading: false,
        isLoadingMore: false,
        useMock: true,
      })
    }
  },

  loadMoreVideos: async () => {
    const { hasMore, isLoadingMore, useMock } = get()
    if (!hasMore || isLoadingMore) return

    if (useMock) {
      const { page, videos } = get()
      const next = MOCK_VIDEOS.slice(0, page * 8)
      set({
        videos: next,
        page: page + 1,
        hasMore: next.length < MOCK_VIDEOS.length,
      })
      return
    }

    await get().fetchVideos(false)
  },

  fetchVideoById: async (videoId) => {
    set({ isLoading: true, error: null, currentVideo: null })
    try {
      const { data } = await getVideoById(videoId)
      set({ currentVideo: normalizeVideo(data.data), isLoading: false, useMock: false })
    } catch {
      const video = MOCK_VIDEOS.find((v) => v._id === videoId) || MOCK_VIDEOS[0]
      set({ currentVideo: video, isLoading: false, useMock: true })
    }
  },

  fetchChannel: async (username) => {
    set({ isLoading: true, error: null, channel: null })
    try {
      const { data } = await getChannelProfile(username)
      set({ channel: normalizeChannel(data.data), isLoading: false, useMock: false })
    } catch {
      set({
        channel: { ...MOCK_CHANNEL, username: username || MOCK_CHANNEL.username },
        isLoading: false,
        useMock: true,
      })
    }
  },

  toggleLike: async (videoId) => {
    try {
      await toggleVideoLike(videoId)
      set((state) => {
        if (!state.currentVideo || state.currentVideo._id !== videoId) return state
        const isLiked = !state.currentVideo.isLiked
        return {
          currentVideo: {
            ...state.currentVideo,
            isLiked,
            likesCount: (state.currentVideo.likesCount || 0) + (isLiked ? 1 : -1),
          },
        }
      })
      return { success: true }
    } catch {
      set((state) => {
        if (!state.currentVideo) return state
        const isLiked = !state.currentVideo.isLiked
        return {
          currentVideo: {
            ...state.currentVideo,
            isLiked,
            likesCount: (state.currentVideo.likesCount || 0) + (isLiked ? 1 : -1),
          },
        }
      })
      return { success: true, mock: true }
    }
  },

  toggleSubscribe: async (channelId, options = {}) => {
    const { channel, currentVideo } = get()
    const isSubscribed = options.isSubscribed ?? channel?.isSubscribed ?? false

    try {
      await toggleSubscription(channelId)
    } catch {
      // update local state when API unavailable
    }

    if (channel?._id === channelId) {
      set({
        channel: {
          ...channel,
          isSubscribed: !isSubscribed,
          subscribersCount: (channel.subscribersCount || 0) + (isSubscribed ? -1 : 1),
        },
      })
    }

    if (currentVideo?.owner?._id === channelId) {
      set({
        currentVideo: {
          ...currentVideo,
          owner: { ...currentVideo.owner, isSubscribed: !isSubscribed },
        },
      })
    }

    return { success: true }
  },

  uploadVideo: async (formData) => {
    try {
      const { data } = await uploadVideoApi(formData)
      const newVideo = data.data
      set((state) => ({ videos: [newVideo, ...state.videos] }))
      return { success: true, video: newVideo }
    } catch {
      const user = useAuthStore.getState().user
      const title = formData.get('title') || 'Untitled Video'
      const thumbnailFile = formData.get('thumbnail')
      const thumbnail =
        thumbnailFile instanceof File
          ? URL.createObjectURL(thumbnailFile)
          : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640&h=360&fit=crop'

      const mockVideo = {
        _id: `mock-${Date.now()}`,
        title,
        description: formData.get('description') || '',
        thumbnail,
        videoFile:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        views: 0,
        createdAt: new Date().toISOString(),
        owner: {
          _id: user?._id || 'demo',
          fullName: user?.fullName || 'You',
          username: user?.username || 'you',
          avatar: user?.avatar,
        },
        duration: 0,
        likesCount: 0,
      }
      set((state) => ({ videos: [mockVideo, ...state.videos], useMock: true }))
      return { success: true, video: mockVideo, mock: true }
    }
  },
}))

export default useVideoStore
