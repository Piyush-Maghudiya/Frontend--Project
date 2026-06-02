import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatViews(count) {
  if (!count && count !== 0) return '0 views'
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M views`
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K views`
  return `${count} views`
}

export function formatSubscribers(count) {
  if (!count && count !== 0) return '0'
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`
  return String(count)
}

export function timeAgo(date) {
  if (!date) return 'Recently'
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ]
  for (const { label, seconds: s } of intervals) {
    const count = Math.floor(seconds / s)
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`
  }
  return 'Just now'
}
