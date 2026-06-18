import { useAppStore } from '@/store/useStore'
import PostCard from '@/components/PostCard'
import { Calendar, TrendingDown, TrendingUp } from 'lucide-react'

export default function Mentions() {
  const posts = useAppStore((s) => s.posts)

  const todayPosts = posts.filter((p) => {
    const d = new Date(p.publishedAt)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  })

  const positiveCount = todayPosts.filter((p) => p.sentiment === 'positive').length
  const negativeCount = todayPosts.filter((p) => p.sentiment === 'negative').length

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5 bg-white rounded-xl px-3 py-2 shadow-sm border border-warm-200/50">
          <Calendar size={14} className="text-warm-500" />
          <span className="text-xs text-warm-600 font-medium">今日</span>
        </div>
        {negativeCount > 0 && (
          <div className="flex items-center gap-1 bg-red-50 rounded-xl px-3 py-2">
            <TrendingDown size={14} className="text-tag-wait" />
            <span className="text-xs text-tag-wait font-medium">{negativeCount}条吐槽</span>
          </div>
        )}
        {positiveCount > 0 && (
          <div className="flex items-center gap-1 bg-green-50 rounded-xl px-3 py-2">
            <TrendingUp size={14} className="text-tag-good" />
            <span className="text-xs text-tag-good font-medium">{positiveCount}条好评</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {posts.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-warm-200/50 flex items-center justify-center mb-4">
            <Calendar size={28} className="text-warm-400" />
          </div>
          <p className="text-warm-500 text-sm">今天还没有新的提及</p>
          <p className="text-warm-400 text-xs mt-1">有新帖子时会第一时间通知你</p>
        </div>
      )}
    </div>
  )
}
