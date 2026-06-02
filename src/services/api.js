import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong'
    return Promise.reject({ ...error, message })
  }
)

export default api

// Auth
export const registerUser = (formData) =>
  api.post('/api/v1/users/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const loginUser = (credentials) =>
  api.post('/api/v1/users/login', credentials)

export const logoutUser = () => api.post('/api/v1/users/logout')

export const getCurrentUser = () => api.get('/api/v1/users/current-user')

// Videos
export const getVideos = (params) => api.get('/api/v1/videos', { params })

export const getVideoById = (videoId) => api.get(`/api/v1/videos/${videoId}`)

export const uploadVideo = (formData) =>
  api.post('/api/v1/videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const deleteVideo = (videoId) => api.delete(`/api/v1/videos/${videoId}`)

// Channels
export const getChannelProfile = (username) =>
  api.get(`/api/v1/users/c/${username}`)

// Subscriptions
export const subscribeToChannel = (channelId) =>
  api.post(`/api/v1/subscriptions/c/${channelId}`)

export const unsubscribeFromChannel = (channelId) =>
  api.delete(`/api/v1/subscriptions/c/${channelId}`)

// Likes
export const toggleVideoLike = (videoId) =>
  api.post(`/api/v1/likes/toggle/v/${videoId}`)

// Playlists
export const getPlaylists = () => api.get('/api/v1/playlists')

export const createPlaylist = (data) => api.post('/api/v1/playlists', data)

export const addVideoToPlaylist = (playlistId, videoId) =>
  api.post(`/api/v1/playlists/${playlistId}/videos/${videoId}`)
