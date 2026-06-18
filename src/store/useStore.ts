import { create } from 'zustand'
import type { StoreInfo, Post, IssueCluster, ReplyReminder } from '@/types'
import { MOCK_POSTS, MOCK_ISSUES, MOCK_REMINDERS } from '@/data/mock'

interface AppState {
  storeInfo: StoreInfo
  posts: Post[]
  issues: IssueCluster[]
  reminders: ReplyReminder[]
  activeTab: 'mentions' | 'issues' | 'replies'
  expandedIssues: Set<string>

  setStoreInfo: (info: Partial<StoreInfo>) => void
  completeOnboarding: () => void
  setActiveTab: (tab: 'mentions' | 'issues' | 'replies') => void
  toggleIssue: (id: string) => void
  getPostById: (id: string) => Post | undefined
  getReminderByPostId: (postId: string) => ReplyReminder | undefined
  copyDraft: (reminderId: string) => void
}

const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

const saveToStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

const defaultStoreInfo: StoreInfo = {
  storeName: '',
  districtName: '',
  ownerAlias: '',
  services: [],
  onboardingCompleted: false,
}

export const useAppStore = create<AppState>((set, get) => ({
  storeInfo: loadFromStorage('store_info', defaultStoreInfo),
  posts: MOCK_POSTS,
  issues: MOCK_ISSUES,
  reminders: MOCK_REMINDERS,
  activeTab: 'mentions',
  expandedIssues: new Set<string>(),

  setStoreInfo: (info) => {
    const newInfo = { ...get().storeInfo, ...info }
    saveToStorage('store_info', newInfo)
    set({ storeInfo: newInfo })
  },

  completeOnboarding: () => {
    const newInfo = { ...get().storeInfo, onboardingCompleted: true }
    saveToStorage('store_info', newInfo)
    set({ storeInfo: newInfo })
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  toggleIssue: (id) => {
    const current = get().expandedIssues
    const next = new Set(current)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    set({ expandedIssues: next })
  },

  getPostById: (id) => get().posts.find((p) => p.id === id),

  getReminderByPostId: (postId) => get().reminders.find((r) => r.postId === postId),

  copyDraft: (reminderId) => {
    const reminder = get().reminders.find((r) => r.id === reminderId)
    if (reminder?.draft) {
      navigator.clipboard.writeText(reminder.draft).catch(() => {})
    }
  },
}))
