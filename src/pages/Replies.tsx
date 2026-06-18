import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Globe, Shield, Copy, Check, ChevronRight, Pencil, User, ClipboardCheck } from 'lucide-react'
import { useAppStore } from '@/store/useStore'
import TagBadge from '@/components/TagBadge'
import { STRATEGY_CONFIG, RISK_CONFIG } from '@/data/mock'
import type { FixStatus } from '@/types'

export default function Replies() {
  const navigate = useNavigate()
  const { reminders, posts, copyDraft, updateDraft, updateInternalFix } = useAppStore()
  const [activeTab, setActiveTab] = useState<'public' | 'internal'>('public')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null)
  const [editDraftText, setEditDraftText] = useState('')
  const [editingFixId, setEditingFixId] = useState<string | null>(null)

  const publicReminders = reminders.filter((r) => r.type === 'public')
  const internalReminders = reminders.filter((r) => r.type === 'internal')
  const currentReminders = activeTab === 'public' ? publicReminders : internalReminders

  const handleCopy = (id: string) => {
    copyDraft(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const startEditDraft = (reminderId: string, currentDraft: string) => {
    setEditingDraftId(reminderId)
    setEditDraftText(currentDraft)
  }

  const saveDraft = (reminderId: string) => {
    updateDraft(reminderId, editDraftText)
    setEditingDraftId(null)
  }

  const statusLabels: Record<FixStatus, { label: string; color: string; bg: string }> = {
    pending: { label: '待处理', color: '#D69E2E', bg: '#FFFFF0' },
    in_progress: { label: '处理中', color: '#3182CE', bg: '#EBF8FF' },
    done: { label: '已完成', color: '#38A169', bg: '#F0FFF4' },
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
          const riskConfig = RISK_CONFIG[reminder.riskLevel] || RISK_CONFIG['medium']

          return (
            <div
              key={reminder.id}
              className={`opacity-0 animate-fade-in-up stagger-${Math.min(i + 1, 6)} bg-white rounded-2xl overflow-hidden shadow-sm border border-warm-200/50`}
            >
              <div
                className="px-4 py-3 cursor-pointer active:bg-warm-50 transition-colors"
                onClick={() => navigate(`/mentions/${post.id}`)}
              >
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ color: strategyConfig.color, backgroundColor: strategyConfig.bg }}
                  >
                    {reminder.strategy}
                  </span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ color: riskConfig.color, backgroundColor: riskConfig.bg }}
                  >
                    {riskConfig.label}
                  </span>
                  {post.tags.slice(0, 2).map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                  <ChevronRight size={14} className="text-warm-300 ml-auto" />
                </div>
                <h4 className="text-warm-800 text-sm font-medium line-clamp-1 mb-1">
                  {post.title}
                </h4>
                <p className="text-warm-500 text-xs line-clamp-2 mb-1.5">{post.content}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-primary/8 text-amber-primary font-medium">
                    {reminder.recommendedAction}
                  </span>
                </div>
              </div>

              {reminder.type === 'public' && reminder.draft && (
                <div className="mx-4 mb-3 bg-amber-50/50 rounded-xl border border-amber-100/40 overflow-hidden">
                  {editingDraftId === reminder.id ? (
                    <div className="p-3">
                      <textarea
                        value={editDraftText}
                        onChange={(e) => setEditDraftText(e.target.value)}
                        className="w-full h-28 text-amber-800 text-xs leading-relaxed bg-transparent resize-none focus:outline-none"
                        autoFocus
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); saveDraft(reminder.id) }}
                          className="px-3 py-1.5 rounded-lg bg-amber-primary text-white text-xs font-medium active:scale-95 transition-transform"
                        >
                          保存
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingDraftId(null) }}
                          className="px-3 py-1.5 rounded-lg bg-warm-200 text-warm-600 text-xs font-medium active:scale-95 transition-transform"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-amber-700 text-xs font-medium">推荐回复草稿</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); startEditDraft(reminder.id, reminder.draft || '') }}
                            className="flex items-center gap-0.5 text-xs text-amber-primary font-medium active:scale-95 transition-transform"
                          >
                            <Pencil size={10} />
                            编辑
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCopy(reminder.id) }}
                            className="flex items-center gap-0.5 text-xs text-amber-primary font-medium active:scale-95 transition-transform"
                          >
                            {copiedId === reminder.id ? (
                              <><Check size={10} />已复制</>
                            ) : (
                              <><Copy size={10} />复制</>
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-amber-800 text-xs leading-relaxed">{reminder.draft}</p>
                    </div>
                  )}
                </div>
              )}

              {reminder.type === 'internal' && reminder.fixDirection && (
                <div className="mx-4 mb-3 bg-warm-50 rounded-xl p-3 border border-warm-200/50">
                  <span className="text-warm-600 text-xs font-medium block mb-1.5">整改方向</span>
                  <p className="text-warm-700 text-xs leading-relaxed">{reminder.fixDirection}</p>
                </div>
              )}

              {reminder.type === 'internal' && reminder.internalFix && (
                <div className="mx-4 mb-3 bg-warm-50 rounded-xl p-3 border border-warm-200/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-warm-600 text-xs font-medium flex items-center gap-1">
                      <ClipboardCheck size={12} />
                      整改跟踪
                    </span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{
                        color: statusLabels[reminder.internalFix.status].color,
                        backgroundColor: statusLabels[reminder.internalFix.status].bg,
                      }}
                    >
                      {statusLabels[reminder.internalFix.status].label}
                    </span>
                  </div>

                  {editingFixId === reminder.id ? (
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] text-warm-500 block mb-0.5">处理状态</label>
                        <div className="flex gap-1.5">
                          {(['pending', 'in_progress', 'done'] as FixStatus[]).map((s) => (
                            <button
                              key={s}
                              onClick={(e) => {
                                e.stopPropagation()
                                updateInternalFix(reminder.id, { status: s })
                              }}
                              className="px-2 py-1 rounded-lg text-[10px] font-medium active:scale-95 transition-transform border"
                              style={{
                                color: reminder.internalFix!.status === s ? statusLabels[s].color : '#A89880',
                                backgroundColor: reminder.internalFix!.status === s ? statusLabels[s].bg : 'transparent',
                                borderColor: reminder.internalFix!.status === s ? statusLabels[s].color : '#EDE5DA',
                              }}
                            >
                              {statusLabels[s].label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-warm-500 block mb-0.5">负责人</label>
                        <input
                          type="text"
                          value={reminder.internalFix.assignee}
                          onChange={(e) => updateInternalFix(reminder.id, { assignee: e.target.value })}
                          placeholder="输入负责人姓名"
                          className="w-full h-8 px-2 rounded-lg bg-white border border-warm-200 text-xs text-warm-800 placeholder:text-warm-300 focus:outline-none focus:border-amber-primary/50"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-warm-500 block mb-0.5">处理结果</label>
                        <textarea
                          value={reminder.internalFix.result}
                          onChange={(e) => updateInternalFix(reminder.id, { result: e.target.value })}
                          placeholder="记录处理结果..."
                          className="w-full h-14 px-2 py-1.5 rounded-lg bg-white border border-warm-200 text-xs text-warm-800 placeholder:text-warm-300 resize-none focus:outline-none focus:border-amber-primary/50"
                        />
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingFixId(null) }}
                        className="px-3 py-1.5 rounded-lg bg-amber-primary text-white text-xs font-medium active:scale-95 transition-transform"
                      >
                        完成
                      </button>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer active:scale-[0.98] transition-transform"
                      onClick={(e) => { e.stopPropagation(); setEditingFixId(reminder.id) }}
                    >
                      {reminder.internalFix.assignee && (
                        <div className="flex items-center gap-1 text-xs text-warm-600 mb-1">
                          <User size={10} />
                          负责人：{reminder.internalFix.assignee}
                        </div>
                      )}
                      {reminder.internalFix.result && (
                        <p className="text-warm-600 text-xs mb-1">结果：{reminder.internalFix.result}</p>
                      )}
                      {!reminder.internalFix.assignee && !reminder.internalFix.result && (
                        <p className="text-warm-400 text-xs">点击记录整改信息</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
