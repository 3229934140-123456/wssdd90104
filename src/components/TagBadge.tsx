import type { PostTag } from '@/types'
import { TAG_CONFIG } from '@/data/mock'

interface TagBadgeProps {
  tag: PostTag
  size?: 'sm' | 'md'
}

export default function TagBadge({ tag, size = 'sm' }: TagBadgeProps) {
  const config = TAG_CONFIG[tag] || { color: '#718096', bg: '#F7FAFC' }
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClass}`}
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      {tag}
    </span>
  )
}
