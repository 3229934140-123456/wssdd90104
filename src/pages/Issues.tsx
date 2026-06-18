import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, Lightbulb, AlertTriangle } from 'lucide-react'
import { useAppStore } from '@/store/useStore'
import TagBadge from '@/components/TagBadge'

export default function Issues() {
  const navigate = useNavigate()
  const { issues, posts, expandedIssues, toggleIssue } = useAppStore()

  const totalProblems = issues.reduce((sum, i) => sum + i.count, 0)

  return (
    <div className="px-4 pb-4">
      <div className="mb-4 bg-gradient-to-r from-amber-50 to-warm-50 rounded-2xl p-4 border border-amber-100/60">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={16} className="text-amber-primary" />
          <span className="text-sm font-medium text-warm-900">近7天问题汇总</span>
        </div>
        <p className="text-warm-500 text-xs">
          共发现 <span className="text-amber-primary font-semibold">{totalProblems}</span> 个可改进问题，点击查看详情
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
                  <p className="text-warm-400 text-xs mt-0.5">
                    被提及 <span className="text-amber-primary font-semibold">{issue.count}</span> 次
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp size={18} className="text-warm-400" />
                ) : (
                  <ChevronDown size={18} className="text-warm-400" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-warm-100">
                  <div className="pt-3 space-y-2">
                    {issuePosts.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => navigate(`/mentions/${post.id}`)}
                        className="bg-warm-50 rounded-xl p-3 cursor-pointer active:scale-[0.98] transition-transform"
                      >
                        <p className="text-warm-700 text-xs leading-relaxed line-clamp-2">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2">
                          {post.tags.map((tag) => (
                            <TagBadge key={tag} tag={tag} />
                          ))}
                        </div>
                      </div>
                    ))}
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
    </div>
  )
}
