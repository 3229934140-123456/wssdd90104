import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Globe, Shield, Copy, Check, ChevronRight, Pencil, User,
  ClipboardCheck, History, CheckCircle, RotateCcw, RefreshCw, CalendarClock, AlertTriangle
} from 'lucide-react'
import { useAppStore } from '@/store/useStore'
import TagBadge from '@/components/TagBadge'
import { STRATEGY_CONFIG, RISK_CONFIG } from '@/data/mock'
import type { FixStatus } from '@/types'

export default function Replies() {
  const navigate = useNavigate()
  const { reminders, posts, copyDraft, updateDraft, updateInternalFix, markReminderCompleted, resetReminders } = useAppStore()
  const [activeTab, setActiveTab] = useState<'public' | 'internal'>('public')
  const [statusFilter, setStatusFilter] = useState<'pending' | 'done'>('pending')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null)
  const [editDraftText, setEditDraftText] = useState('')
  const [editingFixId, setEditingFixId] = useState<string | null>(null)
  const [showHistoryId, setShowHistoryId] = useState<string | null>(null)

  const publicReminders = reminders.filter((r) => r.type === 'public')
  const internalReminders = reminders.filter((r) => r.type === 'internal')
  const currentReminders = (activeTab === 'public' ? publicReminders : internalReminders)
  const filtered = currentReminders.filter((r) => {
    if (statusFilter === 'done') return r.completed
    if (r.type === 'internal') {
      return !r.completed && r.internalFix?.status !== 'done'
    }
    return !r.completed
  })

  const doneCount = currentReminders.filter((r) => r.completed).length
  const pendingCount = currentReminders.length - doneCount

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

  const isDone = (reminder: typeof reminders[number]) => {
    if (reminder.completed) return true
    if (reminder.type === 'internal' && reminder.internalFix?.status === 'done') return true
    return false
  }

  return (
    <div className="pb-4">
      <div className="px-4 mb-3">
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

      <div className="px-4 mb-3 flex items-center justify-between">
        <div className="flex bg-warm-100 rounded-xl p-0.5">
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'pending'
                ? 'bg-white text-warm-900 shadow-sm'
                : 'text-warm-500'
            }`}
          >
            待处理 {pendingCount > 0 && <span className="text-amber-primary">({pendingCount})</span>}
          </button>
          <button
            onClick={() => setStatusFilter('done')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'done'
                ? 'bg-white text-warm-900 shadow-sm'
                : 'text-warm-500'
            }`}
          >
            已完成 {doneCount > 0 && <span className="text-tag-good">({doneCount})</span>}
          </button>
        </div>
        <button
          onClick={() => {
            if (confirm('确定要重置所有回复记录吗？草稿和整改信息将被清除。')) {
              resetReminders()
            }
          }}
          className="flex items-center gap-1 text-[10px] text-warm-400 hover:text-warm-600 transition-colors"
        >
          <RefreshCw size={10} />
          重置
        </button>
      </div>

      <div className="px-4 space-y-3">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-14 h-14 rounded-full bg-warm-100 flex items-center justify-center mb-3">
              <CheckCircle size={28} className="text-tag-good" />
            </div>
            <p className="text-warm-600 text-sm font-medium">
              {statusFilter === 'done' ? '暂无已完成的记录' : '目前没有待处理的提醒'}
            </p>
            <p className="text-warm-400 text-xs mt-1">
              {statusFilter === 'done' ? '完成的任务会显示在这里' : '有新提醒时会第一时间通知你'}
            </p>
          </div>
        )}

        {filtered.map((reminder, i) => {
          const post = posts.find((p) => p.id === reminder.postId)
          if (!post) return null

          const strategyConfig = STRATEGY_CONFIG[reminder.strategy] || STRATEGY_CONFIG['观察']
          const riskConfig = RISK_CONFIG[reminder.riskLevel] || RISK_CONFIG['medium']
          const done = isDone(reminder)

          return (
            <div
              key={reminder.id}
              className={`opacity-0 animate-fade-in-up stagger-${Math.min(i + 1, 6)} bg-white rounded-2xl overflow-hidden shadow-sm border border-warm-200/50 ${
                done ? 'opacity-70' : ''
              }`}
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
                        <span className="text-amber-700 text-xs font-medium">
                          {reminder.draftHistory && reminder.draftHistory.length > 1
                            ? `回复草稿 (v${reminder.draftHistory.length})`
                            : '推荐回复草稿'}
                        </span>
                        <div className="flex items-center gap-2">
                          {reminder.draftHistory && reminder.draftHistory.length > 1 && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setShowHistoryId(showHistoryId === reminder.id ? null : reminder.id) }}
                              className="flex items-center gap-0.5 text-xs text-amber-primary font-medium active:scale-95 transition-transform"
                            >
                              <History size={10} />
                              历史
                            </button>
                          )}
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

                      {showHistoryId === reminder.id && reminder.draftHistory && (
                        <div className="mt-3 pt-3 border-t border-amber-100/60 space-y-2 max-h-36 overflow-y-auto scrollbar-hide">
                          {[...reminder.draftHistory].reverse().map((v) => (
                            <div key={v.version} className="bg-white/60 rounded-lg p-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[9px] text-amber-600 font-medium">版本 v{v.version}</span>
                                <span className="text-[9px] text-warm-400">
                                  {new Date(v.savedAt).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-[10px] text-amber-700 leading-relaxed line-clamp-3">{v.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
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
                      <div className="grid grid-cols-2 gap-2">
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
                          <label className="text-[10px] text-warm-500 block mb-0.5">截止时间</label>
                          <input
                            type="date"
                            value={reminder.internalFix.deadline}
                            onChange={(e) => updateInternalFix(reminder.id, { deadline: e.target.value })}
                            className="w-full h-8 px-2 rounded-lg bg-white border border-warm-200 text-xs text-warm-800 focus:outline-none focus:border-amber-primary/50"
                          />
                        </div>
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
                      <div className="grid grid-cols-2 gap-2 mb-1">
                        {reminder.internalFix.assignee ? (
                          <div className="flex items-center gap-1 text-xs text-warm-600">
                            <User size={10} />
                            负责人：{reminder.internalFix.assignee}
                          </div>
                        ) : (
                          <div className="text-[10px] text-warm-300">未指定负责人</div>
                        )}
                        {reminder.internalFix.deadline ? (() => {
                          const today = new Date().toISOString().slice(0, 10)
                          const isOverdue = reminder.internalFix.deadline < today && reminder.internalFix.status !== 'done'
                          return (
                            <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-tag-wait' : 'text-warm-600'}`}>
                              {isOverdue && <AlertTriangle size={10} />}
                              <CalendarClock size={10} />
                              {isOverdue ? '已逾期：' : '截止：'}{reminder.internalFix.deadline}
                            </div>
                          )
                        })() : (
                          <div className="text-[10px] text-warm-300">未设置截止</div>
                        )}
                      </div>
                      {reminder.internalFix.result && (
                        <p className="text-warm-600 text-xs mb-1 line-clamp-2">结果：{reminder.internalFix.result}</p>
                      )}
                      {!reminder.internalFix.assignee && !reminder.internalFix.result && (
                        <p className="text-warm-400 text-xs">点击记录整改信息</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="px-4 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      markReminderCompleted(reminder.id, !done)
                      if (!done && reminder.type === 'internal' && reminder.internalFix) {
                        updateInternalFix(reminder.id, { status: 'done' })
                      }
                    }}
                    className={`flex-1 h-9 rounded-xl flex items-center justify-center gap-1 text-xs font-medium transition-all active:scale-[0.97] ${
                      done
                        ? 'bg-warm-100 text-warm-500'
                        : 'bg-tag-good/10 text-tag-good border border-tag-good/20'
                    }`}
                  >
                    {done ? (
                      <><RotateCcw size={12} />恢复待办</>
                    ) : (
                      <><CheckCircle size={12} />标记已完成</>
                    )}
                  </button>
                </div>
                {reminder.completedAt && done && (
                  <p className="text-[9px] text-warm-400 text-center mt-2">
                    完成于 {new Date(reminder.completedAt).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
