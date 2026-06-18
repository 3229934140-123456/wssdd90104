export type PostTag = '排队久' | '价格贵' | '态度好' | '环境差' | '味道好' | '推荐' | '差评' | '卫生问题'

export type PostSource = 'tieba' | 'cityforum' | 'xiaohongshu' | 'dianping'

export type Sentiment = 'positive' | 'neutral' | 'negative'

export type ReplyStrategy = '道歉' | '解释' | '邀请体验' | '整改' | '观察'

export type ReminderType = 'public' | 'internal'

export interface StoreInfo {
  storeName: string
  districtName: string
  ownerAlias: string
  services: string[]
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
}

export interface IssueCluster {
  id: string
  category: string
  tag: PostTag
  count: number
  postIds: string[]
  suggestion: string
}

export interface ReplyReminder {
  id: string
  postId: string
  type: ReminderType
  strategy: ReplyStrategy
  draft?: string
  fixDirection?: string
}
