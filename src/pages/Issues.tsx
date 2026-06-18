import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, Lightbulb, AlertTriangle, TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react'
import { useAppStore } from '@/store/useStore'
import TagBadge from '@/components/TagBadge'

export default function Issues() {
  const navigate = useNavigate()
  const { issues, posts, expandedIssues, toggleIssue } = useAppStore()

  const totalProblems = issues.reduce((sum, i) => sum + i.count, 0)
  const highUrgency = issues.filter((i) => i.urgency >= 4)

  return (
    <div className="px-4 pb-4">
      <div className="mb-4 bg-gradient-to-r from-amber-50 to-warm-50 rounded-2xl p-4 border border-amber-100/60">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={16} className="text-amber-primary" />
          <span className="text-sm font-medium text-warm-900">近7天问题汇总</span>
        </div>
        <p className="text-warm-500 text-xs">
          共发现 <span className="text-amber-primary font-semibold">{totalProblems}</span> 个可改进问题
          {highUrgency.length > 0 && (
            <span className="text-tag-wait">，其中 <span className="font-semibold">{highUrgency.length}</span> 项紧急</span>
          )}
        </p>
      </div>

      <div className="space-y-3">
        {issues.map((issue, i) => {
          const isExpanded = expandedIssues.has(issue.id)
          const issuePosts = posts.filter((p) => issue.postIds.includes(p.id))

          return (
            <div
              key={issue.id}
              className={`opacity-0 animate-fade-in-up stagger-${Math.min(i + 1, 6)} bg-white rounded-2xl overflow-hidden shadow-sm border border-warm-200/50 transition-all duration-300`}
            >
              <button
                onClick={() => toggleIssue(issue.id)}
                className="w-full px-4 py-3.5 flex items-center gap-3 active:bg-warm-50 transition-colors"
              >
                <TagBadge tag={issue.tag} size="md" />
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-warm-900 text-sm">{issue.category}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-warm-400 text-xs">
                      本周 <span className="text-amber-primary font-semibold">{issue.trend.thisWeek}</span> 次
                    </span>
                    <span className="text-warm-300 text-xs">·</span>
                    <span className="text-warm-400 text-xs">
                      上周 {issue.trend.lastWeek} 次
                    </span>
                    <span className={`flex items-center gap-0.5 text-xs font-medium ${
                      issue.trend.direction === 'up' ? 'text-tag-wait' : issue.trend.direction === 'down' ? 'text-tag-good' : 'text-warm-400'
                    }`}>
                      {issue.trend.direction === 'up' && <><TrendingUp size={10} />上升</>}
                      {issue.trend.direction === 'down' && <><TrendingDown size={10} />下降</>}
                      {issue.trend.direction === 'stable' && <><Minus size={10} />持平</>}
                    </span>
                  </div>
                </div>
                {issue.urgency >= 4 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-tag-wait/10 text-tag-wait font-medium">
                    紧急
                  </span>
                )}
                {isExpanded ? (
                  <ChevronUp size={18} className="text-warm-400" />
                ) : (
                  <ChevronDown size={18} className="text-warm-400" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-warm-100">
                  <div className="pt-3">
                    <h4 className="text-warm-600 text-xs font-medium mb-2 flex items-center gap-1">
                      <Clock size={12} />
                      近7天相关原帖
                    </h4>
                    <div className="space-y-2">
                      {issuePosts.map((post) => (
                        <div
                          key={post.id}
                          onClick={() => navigate(`/mentions/${post.id}`)}
                          className="bg-warm-50 rounded-xl p-3 cursor-pointer active:scale-[0.98] transition-transform"
                        >
                          <p className="text-warm-800 text-xs font-medium line-clamp-1 mb-1">{post.title}</p>
                          <p className="text-warm-600 text-xs leading-relaxed line-clamp-2">
                            {post.content}
                          </p>
                          <div className="flex items-center gap-1.5 mt-2">
                            {post.tags.map((tag) => (
                              <TagBadge key={tag} tag={tag} />
                            ))}
                            {post.matchedKeywords.slice(0, 3).map((kw) => (
                              <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded bg-amber-primary/8 text-amber-primary/70 font-medium">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-amber-50 rounded-xl p-3 border border-amber-100/50">
                    <Lightbulb size={14} className="text-amber-primary mt-0.5 shrink-0" />
                    <p className="text-amber-800 text-xs leading-relaxed">{issue.suggestion}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {issues.length > 0 && (
        <div className="mt-4 bg-warm-50 rounded-2xl p-4 border border-warm-200/50">
          <h4 className="text-warm-700 text-xs font-medium mb-2">改进优先级建议</h4>
          <div className="space-y-1.5">
            {issues.map((issue, idx) => (
              <div key={issue.id} className="flex items-center gap-2 text-xs">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                  idx === 0 ? 'bg-tag-wait' : idx === 1 ? 'bg-amber-primary' : 'bg-warm-400'
                }`}>
                  {idx + 1}
                </span>
                <span className="text-warm-700">{issue.category}</span>
                <span className="ml-auto text-warm-400">{issue.count}次</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
