import { useNavigate } from 'react-router-dom'
import { MessageSquare, Building2, BookOpen, Star, Image, ChevronRight, Crosshair, ShieldAlert, EyeOff, Check } from 'lucide-react'
import type { Post } from '@/types'
import TagBadge from '@/components/TagBadge'
import { SOURCE_MAP, CONFIDENCE_CONFIG } from '@/data/mock'
import { useAppStore } from '@/store/useStore'
import { useState } from 'react'

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

const MATCH_TYPE_LABEL: Record<string, string> = {
  storeName: '门店名',
  alias: '别名',
  boss: '老板称呼',
  signature: '招牌',
  service: '服务词',
}

interface PostCardProps {
  post: Post
  index: number
}

export default function PostCard({ post, index }: PostCardProps) {
  const navigate = useNavigate()
  const dismissPost = useAppStore((s) => s.dismissPost)
  const confConfig = CONFIDENCE_CONFIG[post.confidence]
  const [dismissed, setDismissed] = useState(post.dismissed)

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    const pattern = post.matchedKeywords[0]?.word || post.title.slice(0, 6)
    dismissPost(post.id, pattern)
    setDismissed(true)
  }

  if (dismissed) {
    return (
      <div
        className={`opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 6)} bg-white/40 rounded-2xl p-3 border border-dashed border-warm-200 flex items-center gap-2`}
      >
        <EyeOff size={14} className="text-warm-400" />
        <span className="text-warm-400 text-xs flex-1">已标记误伤，后续类似内容将减少</span>
        <span className="text-[10px] text-warm-400 line-through line-clamp-1">{post.title}</span>
      </div>
    )
  }

  return (
    <div
      className={`opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 6)} bg-white rounded-2xl p-4 shadow-sm border border-warm-200/50 cursor-pointer active:scale-[0.98] transition-transform duration-150 ${
        post.confidence === 'low' ? 'opacity-80 border-dashed' : ''
      }`}
      onClick={() => navigate(`/mentions/${post.id}`)}
    >
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="flex items-center gap-1 text-warm-500 text-xs">
          {sourceIcons[post.source]}
          {SOURCE_MAP[post.source]?.label}
        </span>
        <span className="text-warm-400 text-xs">·</span>
        <span className="text-warm-400 text-xs">{formatTime(post.publishedAt)}</span>
        <span
          className="text-[9px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5 ml-auto"
          style={{ color: confConfig.color, backgroundColor: confConfig.bg }}
          title={post.confidenceReason}
        >
          {post.confidence === 'low' && <ShieldAlert size={9} />}
          {confConfig.label}
        </span>
        {post.hasImage && (
          <span className="flex items-center gap-0.5 text-warm-400 text-xs">
            <Image size={12} />
            {post.imageCount}
          </span>
        )}
      </div>

      {post.confidenceReason && (
        <div className="mb-2 text-[10px] text-warm-500 leading-relaxed bg-warm-50/60 rounded-lg px-2 py-1.5 border border-warm-100/50">
          {post.confidenceReason}
        </div>
      )}

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
        <div className="flex items-center gap-1">
          {post.confidence === 'low' && (
            <button
              onClick={handleDismiss}
              className="flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full border border-warm-200 text-warm-500 hover:bg-warm-50 active:scale-95 transition-all"
            >
              <EyeOff size={10} />
              误伤
            </button>
          )}
          <ChevronRight size={16} className="text-warm-300 shrink-0" />
        </div>
      </div>

      {post.matchedKeywords.length > 0 && (
        <div className="mt-2.5 pt-2.5 border-t border-warm-100 flex items-center gap-1.5 flex-wrap">
          <Crosshair size={10} className="text-amber-primary shrink-0" />
          {post.matchedKeywords.map((m) => (
            <span
              key={m.word}
              title={`匹配到：${MATCH_TYPE_LABEL[m.type]}`}
              className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                m.type === 'service'
                  ? 'bg-warm-200/40 text-warm-500'
                  : m.type === 'storeName' || m.type === 'alias'
                  ? 'bg-amber-primary/12 text-amber-primary'
                  : m.type === 'boss'
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-green-50 text-green-600'
              }`}
            >
              {m.word}
              <span className="ml-0.5 opacity-60">·{MATCH_TYPE_LABEL[m.type]}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
