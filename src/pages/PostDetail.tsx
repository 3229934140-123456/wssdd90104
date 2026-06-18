import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MessageSquare, Building2, BookOpen, Star, Image, ThumbsUp, ThumbsDown, Crosshair } from 'lucide-react'
import { useAppStore } from '@/store/useStore'
import TagBadge from '@/components/TagBadge'
import { SOURCE_MAP } from '@/data/mock'

const sourceIcons: Record<string, React.ReactNode> = {
  tieba: <MessageSquare size={14} />,
  cityforum: <Building2 size={14} />,
  xiaohongshu: <BookOpen size={14} />,
  dianping: <Star size={14} />,
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const getPostById = useAppStore((s) => s.getPostById)

  const post = getPostById(id || '')

  if (!post) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-warm-500">帖子不存在</p>
      </div>
    )
  }

  const agreeReplies = post.replies.filter((r) => r.isAgree)
  const disagreeReplies = post.replies.filter((r) => !r.isAgree)

  return (
    <div className="animate-slide-in-right">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-warm-200/50 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-warm-100 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} className="text-warm-700" />
        </button>
        <div className="flex items-center gap-1.5 text-warm-500 text-sm">
          {sourceIcons[post.source]}
          {SOURCE_MAP[post.source]?.label}
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        <div className="opacity-0 animate-fade-in-up stagger-1">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {post.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} size="md" />
            ))}
            <span className="ml-auto text-warm-400 text-xs">
              {new Date(post.publishedAt).toLocaleDateString('zh-CN', {
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <h2 className="font-medium text-warm-900 text-base leading-snug mb-3">
            {post.title}
          </h2>
        </div>

        {post.matchedKeywords.length > 0 && (
          <div className="opacity-0 animate-fade-in-up stagger-1 flex items-center gap-1.5 flex-wrap bg-amber-50/50 rounded-xl px-3 py-2 border border-amber-100/40">
            <Crosshair size={12} className="text-amber-primary shrink-0" />
            <span className="text-amber-700 text-xs font-medium shrink-0">匹配词：</span>
            {post.matchedKeywords.map((kw) => (
              <span
                key={kw}
                className="text-xs px-2 py-0.5 rounded-full bg-amber-primary/10 text-amber-primary font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        )}

        <div className="opacity-0 animate-fade-in-up stagger-2 bg-warm-50 rounded-2xl p-4 border border-warm-200/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-warm-200 flex items-center justify-center">
              <span className="text-[10px] font-medium text-warm-600">
                {post.author[0]}
              </span>
            </div>
            <span className="text-warm-600 text-sm font-medium">{post.author}</span>
          </div>
          <p className="text-warm-800 text-sm leading-relaxed">{post.content}</p>

          {post.hasImage && (
            <div className="mt-3 flex items-center gap-1.5 text-warm-400 text-xs">
              <Image size={12} />
              <span>附图 {post.imageCount} 张</span>
            </div>
          )}
        </div>

        {post.replies.length > 0 && (
          <div className="opacity-0 animate-fade-in-up stagger-3 space-y-3">
            <h3 className="font-medium text-warm-800 text-sm flex items-center gap-2">
              <MessageSquare size={14} className="text-amber-primary" />
              回复观点
              <span className="text-warm-400 font-normal">({post.replyCount}条)</span>
            </h3>

            {agreeReplies.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <ThumbsUp size={12} className="text-tag-good" />
                  <span className="text-xs text-tag-good font-medium">赞同观点</span>
                </div>
                <div className="space-y-2">
                  {agreeReplies.map((reply) => (
                    <div key={reply.id} className="bg-green-50/60 rounded-xl p-3 border border-green-100/60">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-[9px] font-medium text-green-700">
                            {reply.author[0]}
                          </span>
                        </div>
                        <span className="text-green-700 text-xs font-medium">{reply.author}</span>
                        {reply.hasImage && (
                          <Image size={10} className="text-green-500 ml-auto" />
                        )}
                      </div>
                      <p className="text-green-800 text-xs leading-relaxed">{reply.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {disagreeReplies.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <ThumbsDown size={12} className="text-warm-500" />
                  <span className="text-xs text-warm-500 font-medium">不同观点</span>
                </div>
                <div className="space-y-2">
                  {disagreeReplies.map((reply) => (
                    <div key={reply.id} className="bg-warm-50 rounded-xl p-3 border border-warm-200/50">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-full bg-warm-200 flex items-center justify-center">
                          <span className="text-[9px] font-medium text-warm-600">
                            {reply.author[0]}
                          </span>
                        </div>
                        <span className="text-warm-600 text-xs font-medium">{reply.author}</span>
                        {reply.hasImage && (
                          <Image size={10} className="text-warm-400 ml-auto" />
                        )}
                      </div>
                      <p className="text-warm-700 text-xs leading-relaxed">{reply.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  )
}
