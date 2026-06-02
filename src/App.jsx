import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import Home from './pages/Home'
import Channel from './pages/Channel'
import Watch from './pages/Watch'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PlaceholderPage from './pages/PlaceholderPage'
import Collections from './pages/Collections'
import useAuthStore from './store/authStore'

export default function App() {
  const fetchCurrentUser = useAuthStore((s) => s.fetchCurrentUser)

  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="watch/:videoId" element={<Watch />} />
            <Route path="channel/:username" element={<Channel />} />
            <Route
              path="liked"
              element={
                <PlaceholderPage
                  title="Liked Videos"
                  description="Videos you've liked will appear here."
                />
              }
            />
            <Route
              path="history"
              element={
                <PlaceholderPage
                  title="History"
                  description="Your watch history will appear here."
                />
              }
            />
            <Route
              path="my-content"
              element={
                <PlaceholderPage
                  title="My Content"
                  description="Manage your uploaded videos here."
                />
              }
            />
            <Route path="collections" element={<Collections />} />
            <Route
              path="subscribers"
              element={
                <PlaceholderPage
                  title="Subscribers"
                  description="View and manage your subscribers."
                />
              }
            />
            <Route
              path="support"
              element={
                <PlaceholderPage
                  title="Support"
                  description="Get help with Vidtube."
                />
              }
            />
            <Route
              path="settings"
              element={
                <PlaceholderPage
                  title="Settings"
                  description="Customize your Vidtube experience."
                />
              }
            />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
        </Routes>
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#121212',
              border: '1px solid #222222',
              color: '#fff',
            },
          }}
        />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
