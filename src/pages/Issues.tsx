import { useNavigate } from 'react-router-dom'
import { ChevronRight, Lightbulb, AlertTriangle, TrendingUp, TrendingDown, Minus, BarChart3, ArrowRight } from 'lucide-react'
import { useAppStore } from '@/store/useStore'
import TagBadge from '@/components/TagBadge'
import { DIMENSION_CONFIG } from '@/data/mock'

export default function Issues() {
  const navigate = useNavigate()
  const { issues } = useAppStore()

  const totalProblems = issues.reduce((sum, i) => sum + i.count, 0)
  const highUrgency = issues.filter((i) => i.urgency >= 4)
  const risingCount = issues.filter((i) => i.trend.direction === 'up').length

  const dimensionCount = new Map<string, number>()
  issues.forEach((i) => dimensionCount.set(i.dimension, (dimensionCount.get(i.dimension) || 0) + i.count))

  return (
    <div className="px-4 pb-4">
      <div className="mb-4 bg-gradient-to-r from-amber-50 to-warm-50 rounded-2xl p-4 border border-amber-100/60">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={16} className="text-amber-primary" />
          <span className="text-sm font-medium text-warm-900">近7天问题汇总</span>
        </div>
        <p className="text-warm-500 text-xs">
          共 <span className="text-amber-primary font-semibold">{totalProblems}</span> 个可改进问题
          {highUrgency.length > 0 && (
            <span className="text-tag-wait">，紧急 <span className="font-semibold">{highUrgency.length}</span> 项</span>
          )}
          {risingCount > 0 && (
            <span className="text-tag-wait">，上升 <span className="font-semibold">{risingCount}</span> 项</span>
          )}
        </p>

        {dimensionCount.size > 0 && (
          <div className="mt-3 pt-3 border-t border-amber-100/60">
            <div className="flex items-center gap-1 text-[10px] text-warm-500 mb-2">
              <BarChart3 size={10} />
              问题维度分布
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from(dimensionCount.entries()).map(([dim, cnt]) => {
                const config = DIMENSION_CONFIG[dim]
                return (
                  <span
                    key={dim}
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      color: config?.color || '#718096',
                      backgroundColor: `${config?.color || '#718096'}15`,
                    }}
                  >
                    {config?.label || dim} · {cnt}
                  </span>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {issues.map((issue, i) => {
          const dimConfig = DIMENSION_CONFIG[issue.dimension]
          return (
            <div
              key={issue.id}
              className={`opacity-0 animate-fade-in-up stagger-${Math.min(i + 1, 6)} bg-white rounded-2xl overflow-hidden shadow-sm border border-warm-200/50`}
            >
              <button
                onClick={() => navigate(`/issues/${issue.id}`)}
                className="w-full px-4 py-3.5 flex items-center gap-3 active:bg-warm-50 transition-colors"
              >
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <TagBadge tag={issue.tag} size="md" />
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{ color: dimConfig?.color, backgroundColor: `${dimConfig?.color}15` }}
                  >
                    {dimConfig?.label}
                  </span>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-medium text-warm-900 text-sm">{issue.category}</h3>
                    {issue.urgency >= 4 && (
                      <span className="text-[9px] px-1 py-0.5 rounded-full bg-tag-wait/10 text-tag-wait font-medium shrink-0">
                        紧急
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-warm-400 text-xs">
                      本周 <span className="text-amber-primary font-semibold">{issue.trend.thisWeek}</span> 次
                    </span>
                    <span className="text-warm-300 text-xs">·</span>
                    <span className={`flex items-center gap-0.5 text-[10px] font-medium ${
                      issue.trend.direction === 'up' ? 'text-tag-wait' : issue.trend.direction === 'down' ? 'text-tag-good' : 'text-warm-400'
                    }`}>
                      {issue.trend.direction === 'up' && <><TrendingUp size={10} />上升</>}
                      {issue.trend.direction === 'down' && <><TrendingDown size={10} />下降</>}
                      {issue.trend.direction === 'stable' && <><Minus size={10} />持平</>}
                    </span>
                  </div>
                </div>
                <ArrowRight size={16} className="text-warm-300 shrink-0" />
              </button>

              <div className="px-4 pb-3 pt-0.5">
                <div className="flex items-start gap-2 bg-amber-50/60 rounded-xl p-2.5 border border-amber-100/40">
                  <Lightbulb size={12} className="text-amber-primary mt-0.5 shrink-0" />
                  <p className="text-amber-800 text-[11px] leading-relaxed line-clamp-2">{issue.priorityReason}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {issues.length > 0 && (
        <div className="mt-4 bg-warm-50 rounded-2xl p-4 border border-warm-200/50">
          <h4 className="text-warm-700 text-xs font-medium mb-3 flex items-center gap-1">
            <BarChart3 size={12} />
            改进优先级建议（先紧后松）
          </h4>
          <div className="space-y-2">
            {issues.map((issue, idx) => (
              <div
                key={issue.id}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate(`/issues/${issue.id}`)}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${
                  idx === 0 ? 'bg-tag-wait' : idx === 1 ? 'bg-amber-primary' : idx === 2 ? 'bg-amber-500' : 'bg-warm-400'
                }`}>
                  {idx + 1}
                </span>
                <span className="text-warm-700 text-xs flex-1">{issue.category}</span>
                <span className="text-amber-primary text-xs font-semibold">{issue.count}次</span>
                <ChevronRight size={12} className="text-warm-300" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
