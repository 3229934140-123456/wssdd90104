export type PostTag = '排队久' | '价格贵' | '态度好' | '环境差' | '味道好' | '推荐' | '差评' | '卫生问题' | '态度差'

export type PostSource = 'tieba' | 'cityforum' | 'xiaohongshu' | 'dianping'

export type Sentiment = 'positive' | 'neutral' | 'negative'

export type ReplyStrategy = '道歉' | '解释' | '邀请体验' | '整改' | '观察'

export type ReminderType = 'public' | 'internal'

export type RiskLevel = 'high' | 'medium' | 'low'

export type TrendDirection = 'up' | 'down' | 'stable'

export type FixStatus = 'pending' | 'in_progress' | 'done'

export type Confidence = 'high' | 'medium' | 'low'

export interface KeywordMatch {
  word: string
  type: 'storeName' | 'alias' | 'boss' | 'signature' | 'service'
}

export interface StoreKeywords {
  storeAliases: string[]
  bossNames: string[]
  signatureDishes: string[]
}

export interface StoreInfo {
  storeName: string
  districtName: string
  ownerAlias: string
  services: string[]
  keywords: StoreKeywords
  onboardingCompleted: boolean
}

export interface Reply {
  id: string
  author: string
  content: string
  isAgree: boolean
  hasImage: boolean
}

export interface Post {
  id: string
  source: PostSource
  title: string
  content: string
  author: string
  publishedAt: string
  tags: PostTag[]
  hasImage: boolean
  imageCount: number
  replyCount: number
  replies: Reply[]
  sentiment: Sentiment
  matchedKeywords: KeywordMatch[]
  confidence: Confidence
}

export interface IssueTrend {
  direction: TrendDirection
  thisWeek: number
  lastWeek: number
}

export interface DailyCount {
  day: string
  date: string
  count: number
}

export interface IssueCluster {
  id: string
  category: string
  tag: PostTag
  dimension: '排队' | '价格' | '服务' | '环境' | '产品'
  count: number
  postIds: string[]
  suggestion: string
  trend: IssueTrend
  dailyTrend: DailyCount[]
  urgency: number
  priorityReason: string
}

export interface InternalFix {
  status: FixStatus
  assignee: string
  result: string
  updatedAt: string
}

export interface ReplyReminder {
  id: string
  postId: string
  type: ReminderType
  strategy: ReplyStrategy
  riskLevel: RiskLevel
  recommendedAction: string
  completed: boolean
  completedAt?: string
  draft?: string
  draftHistory?: { version: number; text: string; savedAt: string }[]
  fixDirection?: string
  internalFix?: InternalFix
}
