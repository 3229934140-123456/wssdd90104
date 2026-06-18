import { create } from 'zustand'
import type { StoreInfo, Post, IssueCluster, ReplyReminder, StoreKeywords, FixStatus } from '@/types'
import { generateMockData, saveGlobalReminders } from '@/data/mock'

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
  getIssueById: (id: string) => IssueCluster | undefined
  getReminderByPostId: (postId: string) => ReplyReminder | undefined
  copyDraft: (reminderId: string) => void
  updateKeywords: (keywords: StoreKeywords) => void
  updateDraft: (reminderId: string, draft: string) => void
  updateInternalFix: (reminderId: string, fix: { status?: FixStatus; assignee?: string; result?: string; deadline?: string }) => void
  markReminderCompleted: (reminderId: string, completed: boolean) => void
  regenerateData: () => void
  resetReminders: () => void
  dismissPost: (postId: string, pattern: string) => void
  undismissPost: (postId: string) => void
  createReminderFromIssue: (issueId: string) => ReplyReminder | null
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
  keywords: {
    storeAliases: [],
    bossNames: [],
    signatureDishes: [],
    bannedPatterns: [],
  },
  onboardingCompleted: false,
}

const buildMockData = (info: StoreInfo) => {
  if (!info.onboardingCompleted || !info.storeName) {
    return { posts: [], issues: [], reminders: [] }
  }
  return generateMockData(info)
}

const loadStoreInfo = (): StoreInfo => {
  const saved = loadFromStorage<StoreInfo>('store_info', defaultStoreInfo)
  if (!saved.keywords) {
    saved.keywords = { storeAliases: [], bossNames: [], signatureDishes: [], bannedPatterns: [] }
  }
  if (!saved.keywords.bannedPatterns) {
    saved.keywords.bannedPatterns = []
  }
  return saved
}

export const useAppStore = create<AppState>((set, get) => {
  const initialStoreInfo = loadStoreInfo()
  const initialData = buildMockData(initialStoreInfo)

  return {
    storeInfo: initialStoreInfo,
    posts: initialData.posts,
    issues: initialData.issues,
    reminders: initialData.reminders,
    activeTab: 'mentions',
    expandedIssues: new Set<string>(),

    setStoreInfo: (info) => {
      const newInfo = { ...get().storeInfo, ...info }
      if (!newInfo.keywords) {
        newInfo.keywords = { storeAliases: [], bossNames: [], signatureDishes: [], bannedPatterns: [] }
      }
      if (!newInfo.keywords.bannedPatterns) {
        newInfo.keywords.bannedPatterns = []
      }
      saveToStorage('store_info', newInfo)
      set({ storeInfo: newInfo })
    },

    completeOnboarding: () => {
      const newInfo = { ...get().storeInfo, onboardingCompleted: true }
      saveToStorage('store_info', newInfo)
      const data = buildMockData(newInfo)
      set({ storeInfo: newInfo, ...data })
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
    getIssueById: (id) => get().issues.find((i) => i.id === id),
    getReminderByPostId: (postId) => get().reminders.find((r) => r.postId === postId),

    copyDraft: (reminderId) => {
      const reminder = get().reminders.find((r) => r.id === reminderId)
      if (reminder?.draft) {
        navigator.clipboard.writeText(reminder.draft).catch(() => {})
      }
    },

    updateKeywords: (keywords) => {
      const newInfo = { ...get().storeInfo, keywords }
      saveToStorage('store_info', newInfo)
      const data = buildMockData(newInfo)
      set({ storeInfo: newInfo, ...data })
    },

    updateDraft: (reminderId, draft) => {
      const reminders = get().reminders.map((r) => {
        if (r.id !== reminderId) return r
        const history = r.draftHistory || []
        const newVersion = history.length + 1
        return {
          ...r,
          draft,
          draftHistory: [
            ...history,
            { version: newVersion, text: draft, savedAt: new Date().toISOString() },
          ].slice(-10),
        }
      })
      saveGlobalReminders(reminders)
      set({ reminders })
    },

    updateInternalFix: (reminderId, fix) => {
      const reminders = get().reminders.map((r) => {
        if (r.id !== reminderId || !r.internalFix) return r
        return {
          ...r,
          internalFix: {
            ...r.internalFix,
            ...fix,
            updatedAt: new Date().toISOString(),
          },
        }
      })
      saveGlobalReminders(reminders)
      set({ reminders })
    },

    markReminderCompleted: (reminderId, completed) => {
      const reminders = get().reminders.map((r) => {
        if (r.id !== reminderId) return r
        return {
          ...r,
          completed,
          completedAt: completed ? new Date().toISOString() : undefined,
        }
      })
      saveGlobalReminders(reminders)
      set({ reminders })
    },

    regenerateData: () => {
      localStorage.removeItem('reply_reminders_v2')
      const data = buildMockData(get().storeInfo)
      set({ ...data, expandedIssues: new Set() })
    },

    resetReminders: () => {
      localStorage.removeItem('reply_reminders_v2')
      const data = buildMockData(get().storeInfo)
      set({ reminders: data.reminders })
    },

    dismissPost: (postId, pattern) => {
      const posts = get().posts.map((p) =>
        p.id === postId ? { ...p, dismissed: true } : p
      )
      const storeInfo = { ...get().storeInfo }
      if (!storeInfo.keywords) storeInfo.keywords = { storeAliases: [], bossNames: [], signatureDishes: [], bannedPatterns: [] }
      if (!storeInfo.keywords.bannedPatterns) storeInfo.keywords.bannedPatterns = []
      if (pattern && !storeInfo.keywords.bannedPatterns.includes(pattern)) {
        storeInfo.keywords.bannedPatterns = [...storeInfo.keywords.bannedPatterns, pattern]
      }
      saveToStorage('store_info', storeInfo)
      set({ posts, storeInfo })
    },

    undismissPost: (postId) => {
      const posts = get().posts.map((p) =>
        p.id === postId ? { ...p, dismissed: false } : p
      )
      set({ posts })
    },

    createReminderFromIssue: (issueId) => {
      const issue = get().issues.find((i) => i.id === issueId)
      if (!issue) return null
      const firstPost = get().posts.find((p) => issue.postIds.includes(p.id))
      if (!firstPost) return null
      const existing = get().reminders.find((r) => r.postId === firstPost.id)
      if (existing) return existing

      const daysForDeadline = issue.urgency >= 4 ? 3 : 5
      const defaultDeadline = new Date(Date.now() + daysForDeadline * 86400000).toISOString().slice(0, 10)

      const newReminder: ReplyReminder = {
        id: `rm_issue_${issueId}_${Date.now()}`,
        postId: firstPost.id,
        type: 'internal',
        strategy: '整改',
        riskLevel: issue.urgency >= 4 ? 'high' : issue.urgency >= 3 ? 'medium' : 'low',
        recommendedAction: `${daysForDeadline}天内完成整改`,
        completed: false,
        fixDirection: issue.suggestion,
        internalFix: { status: 'pending', assignee: '', result: '', deadline: defaultDeadline, updatedAt: '' },
      }
      const reminders = [...get().reminders, newReminder]
      saveGlobalReminders(reminders)
      set({ reminders })
      return newReminder
    },
  }
})
