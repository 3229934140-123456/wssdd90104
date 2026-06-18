import { useNavigate } from 'react-router-dom'
import { MessageSquare, Building2, BookOpen, Star, Image, ChevronRight, Crosshair } from 'lucide-react'
import type { Post } from '@/types'
import TagBadge from '@/components/TagBadge'
import { SOURCE_MAP } from '@/data/mock'

const sourceIcons: Record<string, React.ReactNode> = {
  tieba: <MessageSquare size={12} />,
  cityforum: <Building2 size={12} />,
  xiaohongshu: <BookOpen size={12} />,
  dianping: <Star size={12} />,
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return '刚刚'
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}天前`
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

interface PostCardProps {
  post: Post
  index: number
}

export default function PostCard({ post, index }: PostCardProps) {
  const navigate = useNavigate()

  return (
    <div
      className={`opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 6)} bg-white rounded-2xl p-4 shadow-sm border border-warm-200/50 cursor-pointer active:scale-[0.98] transition-transform duration-150`}
      onClick={() => navigate(`/mentions/${post.id}`)}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="flex items-center gap-1 text-warm-500 text-xs">
          {sourceIcons[post.source]}
          {SOURCE_MAP[post.source]?.label}
        </span>
        <span className="text-warm-400 text-xs">·</span>
        <span className="text-warm-400 text-xs">{formatTime(post.publishedAt)}</span>
        {post.hasImage && (
          <span className="ml-auto flex items-center gap-0.5 text-warm-400 text-xs">
            <Image size={12} />
            {post.imageCount}
          </span>
        )}
      </div>

      <h3 className="font-medium text-warm-900 text-sm leading-snug mb-2 line-clamp-2">
        {post.title}
      </h3>

      <p className="text-warm-600 text-xs leading-relaxed mb-3 line-clamp-2">
        {post.content}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
        <ChevronRight size={16} className="text-warm-300 shrink-0" />
      </div>

      {post.matchedKeywords.length > 0 && (
        <div className="mt-2.5 pt-2.5 border-t border-warm-100 flex items-center gap-1.5 flex-wrap">
          <Crosshair size={10} className="text-amber-primary shrink-0" />
          {post.matchedKeywords.map((kw) => (
            <span
              key={kw}
              className="text-[10px] px-1.5 py-0.5 rounded bg-amber-primary/8 text-amber-primary/80 font-medium"
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
