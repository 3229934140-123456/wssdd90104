import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Globe, Shield, Copy, Check, ChevronRight } from 'lucide-react'
import { useAppStore } from '@/store/useStore'
import TagBadge from '@/components/TagBadge'
import { STRATEGY_CONFIG } from '@/data/mock'

export default function Replies() {
  const navigate = useNavigate()
  const { reminders, posts, copyDraft } = useAppStore()
  const [activeTab, setActiveTab] = useState<'public' | 'internal'>('public')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const publicReminders = reminders.filter((r) => r.type === 'public')
  const internalReminders = reminders.filter((r) => r.type === 'internal')

  const currentReminders = activeTab === 'public' ? publicReminders : internalReminders

  const handleCopy = (id: string) => {
    copyDraft(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="pb-4">
      <div className="px-4 mb-4">
        <div className="flex bg-warm-200/50 rounded-2xl p-1">
          <button
            onClick={() => setActiveTab('public')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'public'
                ? 'bg-white text-warm-900 shadow-sm'
                : 'text-warm-500'
            }`}
          >
            <Globe size={14} />
            公开解释
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === 'public' ? 'bg-amber-primary/10 text-amber-primary' : 'bg-warm-200 text-warm-500'
            }`}>
              {publicReminders.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('internal')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'internal'
                ? 'bg-white text-warm-900 shadow-sm'
                : 'text-warm-500'
            }`}
          >
            <Shield size={14} />
            内部整改
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === 'internal' ? 'bg-amber-primary/10 text-amber-primary' : 'bg-warm-200 text-warm-500'
            }`}>
              {internalReminders.length}
            </span>
          </button>
        </div>
      </div>

      <div className="px-4 space-y-3">
        {currentReminders.map((reminder, i) => {
          const post = posts.find((p) => p.id === reminder.postId)
          if (!post) return null

          const strategyConfig = STRATEGY_CONFIG[reminder.strategy] || STRATEGY_CONFIG['观察']

          return (
            <div
              key={reminder.id}
              className={`opacity-0 animate-fade-in-up stagger-${Math.min(i + 1, 6)} bg-white rounded-2xl overflow-hidden shadow-sm border border-warm-200/50`}
            >
              <div
                className="px-4 py-3 cursor-pointer active:bg-warm-50 transition-colors"
                onClick={() => navigate(`/mentions/${post.id}`)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ color: strategyConfig.color, backgroundColor: strategyConfig.bg }}
                  >
                    {reminder.strategy}
                  </span>
                  {post.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                  <ChevronRight size={14} className="text-warm-300 ml-auto" />
                </div>
                <h4 className="text-warm-800 text-sm font-medium line-clamp-1 mb-1">
                  {post.title}
                </h4>
                <p className="text-warm-500 text-xs line-clamp-2">{post.content}</p>
              </div>

              {reminder.type === 'public' && reminder.draft && (
                <div className="mx-4 mb-3 bg-amber-50/50 rounded-xl p-3 border border-amber-100/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-amber-700 text-xs font-medium">推荐回复草稿</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopy(reminder.id)
                      }}
                      className="flex items-center gap-1 text-xs text-amber-primary font-medium active:scale-95 transition-transform"
                    >
                      {copiedId === reminder.id ? (
                        <>
                          <Check size={12} />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          复制
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-amber-800 text-xs leading-relaxed">{reminder.draft}</p>
                </div>
              )}

              {reminder.type === 'internal' && reminder.fixDirection && (
                <div className="mx-4 mb-3 bg-warm-50 rounded-xl p-3 border border-warm-200/50">
                  <span className="text-warm-600 text-xs font-medium block mb-1.5">整改方向</span>
                  <p className="text-warm-700 text-xs leading-relaxed">{reminder.fixDirection}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
