import { create } from 'zustand'
import type { StoreInfo, Post, IssueCluster, ReplyReminder, StoreKeywords, FixStatus } from '@/types'
import { generateMockData } from '@/data/mock'

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
  updateKeywords: (keywords: StoreKeywords) => void
  updateDraft: (reminderId: string, draft: string) => void
  updateInternalFix: (reminderId: string, fix: { status?: FixStatus; assignee?: string; result?: string }) => void
  regenerateData: () => void
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
    saved.keywords = { storeAliases: [], bossNames: [], signatureDishes: [] }
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
        newInfo.keywords = { storeAliases: [], bossNames: [], signatureDishes: [] }
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
      set({
        reminders: get().reminders.map((r) =>
          r.id === reminderId ? { ...r, draft } : r
        ),
      })
    },

    updateInternalFix: (reminderId, fix) => {
      set({
        reminders: get().reminders.map((r) => {
          if (r.id !== reminderId || !r.internalFix) return r
          return {
            ...r,
            internalFix: {
              ...r.internalFix,
              ...fix,
              updatedAt: new Date().toISOString(),
            },
          }
        }),
      })
    },

    regenerateData: () => {
      const data = buildMockData(get().storeInfo)
      set({ ...data, expandedIssues: new Set() })
    },
  }
})
