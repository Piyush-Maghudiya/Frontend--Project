import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { timeAgo } from '@/lib/utils'
import useAuthStore from '@/store/authStore'
import { toast } from 'sonner'

export default function CommentSection({ comments = [] }) {
  const [newComment, setNewComment] = useState('')
  const [localComments, setLocalComments] = useState(comments)
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    setLocalComments(comments)
  }, [comments])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please log in to comment')
      return
    }
    if (!newComment.trim()) return

    const comment = {
      _id: Date.now().toString(),
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
      owner: {
        fullName: user.fullName,
        username: user.username,
        avatar: user.avatar,
      },
    }
    setLocalComments([comment, ...localComments])
    setNewComment('')
    toast.success('Comment added')
  }

  return (
    <div className="mt-6">
      <h3 className="mb-4 text-lg font-semibold text-white">
        {localComments.length} Comments
      </h3>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-3">
        <Avatar className="h-9 w-9 shrink-0">
          {user?.avatar ? (
            <AvatarImage src={user.avatar} />
          ) : (
            <AvatarFallback>?</AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-1 gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newComment.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {localComments.map((comment, i) => (
          <motion.div
            key={comment._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex gap-3"
          >
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={comment.owner?.avatar} />
              <AvatarFallback>{comment.owner?.fullName?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-white">
                {comment.owner?.fullName}{' '}
                <span className="font-normal text-text-secondary">
                  • {timeAgo(comment.createdAt)}
                </span>
              </p>
              <p className="mt-1 text-sm text-text-secondary">{comment.content}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
