import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Lightbulb, Clock, AlertCircle, ClipboardCheck, CheckCircle } from 'lucide-react'
import { useAppStore } from '@/store/useStore'
import TagBadge from '@/components/TagBadge'
import { DIMENSION_CONFIG } from '@/data/mock'

export default function IssuesDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const getIssueById = useAppStore((s) => s.getIssueById)
  const posts = useAppStore((s) => s.posts)
  const allIssues = useAppStore((s) => s.issues)
  const createReminderFromIssue = useAppStore((s) => s.createReminderFromIssue)
  const reminders = useAppStore((s) => s.reminders)
  const [created, setCreated] = useState(false)

  const issue = getIssueById(id || '')
  if (!issue) {
    return (
      <div>
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-warm-200/50 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-warm-100 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft size={18} className="text-warm-700" />
          </button>
          <span className="text-warm-900 font-medium">问题详情</span>
        </header>
        <div className="flex items-center justify-center py-20">
          <p className="text-warm-500 text-sm">问题不存在或已被移除</p>
        </div>
      </div>
    )
  }

  const issuePosts = posts.filter((p) => issue.postIds.includes(p.id))
  const dimConfig = DIMENSION_CONFIG[issue.dimension]
  const maxCount = Math.max(...issue.dailyTrend.map((d) => d.count), 1)
  const otherSameDim = allIssues.filter((i) => i.id !== issue.id && i.dimension === issue.dimension)
  const hasReminder = reminders.some((r) => issue.postIds.includes(r.postId) && r.type === 'internal')
  return (
    <div className="animate-slide-in-right pb-4">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-warm-200/50 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-warm-100 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} className="text-warm-700" />
        </button>
        <div>
          <span className="text-warm-900 font-medium text-sm">问题详情</span>
        </div>
        {issue.urgency >= 4 && (
          <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-tag-wait/10 text-tag-wait font-medium flex items-center gap-0.5">
            <AlertCircle size={10} />
            紧急项
          </span>
        )}
      </header>

      <div className="px-4 py-4 space-y-4">
        <div className="opacity-0 animate-fade-in-up stagger-1 bg-gradient-to-br from-white to-warm-50 rounded-2xl p-4 border border-warm-200/50 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TagBadge tag={issue.tag} size="md" />
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ color: dimConfig?.color || '#718096', backgroundColor: `${dimConfig?.color || '#718096'}15` }}
            >
              {dimConfig?.label || '综合'}维度
            </span>
          </div>
          <h2 className="font-medium text-warm-900 text-base mb-3">{issue.category}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-amber-primary/10 px-2.5 py-1 rounded-full">
              <span className="text-amber-primary text-xs font-semibold">本周 {issue.trend.thisWeek}</span>
            </div>
            <span className="text-warm-300 text-xs">vs</span>
            <span className="text-warm-500 text-xs">上周 {issue.trend.lastWeek}</span>
            <span className={`ml-auto flex items-center gap-0.5 text-xs font-medium px-2.5 py-1 rounded-full ${
              issue.trend.direction === 'up'
                ? 'bg-red-50 text-tag-wait'
                : issue.trend.direction === 'down'
                ? 'bg-green-50 text-tag-good'
                : 'bg-warm-100 text-warm-500'
            }`}>
              {issue.trend.direction === 'up' && <><TrendingUp size={10} />上升</>}
              {issue.trend.direction === 'down' && <><TrendingDown size={10} />下降</>}
              {issue.trend.direction === 'stable' && <><Minus size={10} />持平</>}
            </span>
          </div>
        </div>

        <div className="opacity-0 animate-fade-in-up stagger-2 bg-white rounded-2xl p-4 border border-warm-200/50 shadow-sm">
          <h3 className="text-sm font-medium text-warm-900 mb-3">近7天每日趋势</h3>
          <div className="flex items-end justify-between gap-1 h-32 mb-2">
            {issue.dailyTrend.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                <span className="text-[9px] font-medium text-warm-600">{day.count}</span>
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    i === issue.dailyTrend.length - 1 ? 'bg-amber-primary' : 'bg-amber-primary/40'
                  }`}
                  style={{
                    height: `${Math.max(8, (day.count / maxCount) * 80)}%`,
                    animationDelay: `${i * 50}ms`,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between gap-1">
            {issue.dailyTrend.map((day, i) => (
              <div key={i} className="flex-1 text-center">
                <p className="text-[9px] text-warm-500">周{day.day}</p>
                <p className="text-[8px] text-warm-400">{day.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="opacity-0 animate-fade-in-up stagger-3 bg-amber-50/50 rounded-2xl p-4 border border-amber-100/50">
          <h3 className="text-sm font-medium text-amber-800 mb-2 flex items-center gap-1.5">
            <AlertCircle size={14} />
            优先级理由
          </h3>
          <p className="text-amber-700 text-xs leading-relaxed">{issue.priorityReason}</p>
        </div>

        <div className="opacity-0 animate-fade-in-up stagger-4 bg-white rounded-2xl p-4 border border-warm-200/50 shadow-sm">
          <h3 className="text-sm font-medium text-warm-900 mb-3 flex items-center gap-1.5">
            <Clock size={14} />
            代表原帖（{issuePosts.length}）
          </h3>
          <div className="space-y-2">
            {issuePosts.map((post) => (
              <Link
                key={post.id}
                to={`/mentions/${post.id}`}
                className="block bg-warm-50 rounded-xl p-3 active:scale-[0.98] transition-transform"
              >
                <p className="text-warm-800 text-xs font-medium line-clamp-1 mb-1">{post.title}</p>
                <p className="text-warm-600 text-xs leading-relaxed line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {post.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                  {post.matchedKeywords.slice(0, 2).map((m) => (
                    <span
                      key={m.word}
                      className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                        m.type === 'service'
                          ? 'bg-warm-200/50 text-warm-500'
                          : 'bg-amber-primary/8 text-amber-primary/80'
                      }`}
                    >
                      {m.word}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="opacity-0 animate-fade-in-up stagger-5 bg-warm-50 rounded-2xl p-4 border border-warm-200/50">
          <h3 className="text-sm font-medium text-warm-800 mb-2 flex items-center gap-1.5">
            <Lightbulb size={14} className="text-amber-primary" />
            可执行建议
          </h3>
          <p className="text-warm-600 text-xs leading-relaxed mb-3">{issue.suggestion}</p>
          <button
            onClick={() => {
              if (!hasReminder && !created) {
                createReminderFromIssue(issue.id)
                setCreated(true)
              }
              navigate('/replies')
            }}
            className={`w-full h-10 rounded-xl flex items-center justify-center gap-1.5 text-sm font-medium transition-all active:scale-[0.97] ${
              hasReminder || created
                ? 'bg-tag-good/10 text-tag-good border border-tag-good/20'
                : 'bg-amber-primary text-white shadow-sm shadow-amber-primary/30'
            }`}
          >
            {hasReminder || created ? (
              <><CheckCircle size={14} />已生成整改工单，去处理</>
            ) : (
              <><ClipboardCheck size={14} />生成内部整改工单</>
            )}
          </button>
          <p className="text-[10px] text-warm-400 text-center mt-1.5">
            将自动带入代表原帖、整改建议，并分配默认截止时间
          </p>
        </div>

        {otherSameDim.length > 0 && (
          <div className="opacity-0 animate-fade-in-up stagger-6 bg-white rounded-2xl p-4 border border-warm-200/50 shadow-sm">
            <h3 className="text-sm font-medium text-warm-900 mb-3">同维度其他问题</h3>
            <div className="space-y-2">
              {otherSameDim.map((o) => (
                <Link
                  key={o.id}
                  to={`/issues/${o.id}`}
                  className="flex items-center justify-between bg-warm-50 rounded-xl p-3 active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-2">
                    <TagBadge tag={o.tag} />
                    <span className="text-warm-700 text-xs font-medium">{o.category}</span>
                  </div>
                  <span className="text-amber-primary text-xs font-semibold">{o.count}次</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
