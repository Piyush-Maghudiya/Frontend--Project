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
    error.message = message
    return Promise.reject(error)
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

// Videos  (backend mounts at /api/v1/video — singular)
export const getVideos = (params) => api.get('/api/v1/video', { params })

export const getVideoById = (videoId) => api.get(`/api/v1/video/${videoId}`)

export const uploadVideo = (formData) =>
  api.post('/api/v1/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const deleteVideo = (videoId) => api.delete(`/api/v1/video/${videoId}`)

// Channels
export const getChannelProfile = (username) =>
  api.get(`/api/v1/users/c/${username}`)

// Subscriptions  (backend mounts at /api/v1/subcriptions — with typo)
// Backend uses a single POST toggle — no separate DELETE route
export const toggleSubscription = (channelId) =>
  api.post(`/api/v1/subcriptions/c/${channelId}`)

// Likes
export const toggleVideoLike = (videoId) =>
  api.post(`/api/v1/likes/toggle/v/${videoId}`)

// Playlists  (backend mounts at /api/v1/playlist — singular)
export const getPlaylists = (userId) =>
  api.get(`/api/v1/playlist/user/${userId}`)

export const createPlaylist = (data) => api.post('/api/v1/playlist', data)

export const addVideoToPlaylist = (playlistId, videoId) =>
  api.patch(`/api/v1/playlist/add/${videoId}/${playlistId}`)
