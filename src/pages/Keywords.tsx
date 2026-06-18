import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, X, RefreshCw } from 'lucide-react'
import { useAppStore } from '@/store/useStore'
import type { StoreKeywords } from '@/types'

export default function Keywords() {
  const navigate = useNavigate()
  const { storeInfo, updateKeywords, regenerateData } = useAppStore()
  const [keywords, setKeywords] = useState<StoreKeywords>({
    storeAliases: [...(storeInfo.keywords?.storeAliases || [])],
    bossNames: [...(storeInfo.keywords?.bossNames || [])],
    signatureDishes: [...(storeInfo.keywords?.signatureDishes || [])],
  })
  const [newItem, setNewItem] = useState<Record<string, string>>({
    storeAliases: '',
    bossNames: '',
    signatureDishes: '',
  })

  const sections: { key: keyof StoreKeywords; label: string; placeholder: string }[] = [
    { key: 'storeAliases', label: '门店别名', placeholder: '例如：那家火锅、老王那店' },
    { key: 'bossNames', label: '老板/店长称呼', placeholder: '例如：王哥、王老板、老王' },
    { key: 'signatureDishes', label: '招牌菜/服务词', placeholder: '例如：毛肚、鸳鸯锅、涮羊肉' },
  ]

  const addItem = (key: keyof StoreKeywords) => {
    const val = newItem[key].trim()
    if (!val || keywords[key].includes(val)) return
    setKeywords({ ...keywords, [key]: [...keywords[key], val] })
    setNewItem({ ...newItem, [key]: '' })
  }

  const removeItem = (key: keyof StoreKeywords, idx: number) => {
    setKeywords({ ...keywords, [key]: keywords[key].filter((_, i) => i !== idx) })
  }

  const handleSave = () => {
    updateKeywords(keywords)
    navigate(-1)
  }

  const handleReset = () => {
    regenerateData()
  }

  return (
    <div className="animate-slide-in-right">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-warm-200/50 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-warm-100 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} className="text-warm-700" />
        </button>
        <h1 className="font-medium text-warm-900">关键词配置</h1>
      </header>

      <div className="px-4 py-4 space-y-5">
        <p className="text-warm-500 text-xs leading-relaxed">
          配置关键词后，首页会用这些词标出每条帖子的匹配原因，帮助你快速判断是否误匹配。
        </p>

        {sections.map((section) => (
          <div key={section.key}>
            <h3 className="text-sm font-medium text-warm-800 mb-2">{section.label}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {keywords[section.key].map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-primary/10 text-amber-primary text-xs font-medium"
                >
                  {item}
                  <button
                    onClick={() => removeItem(section.key, idx)}
                    className="hover:text-amber-dark transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newItem[section.key]}
                onChange={(e) => setNewItem({ ...newItem, [section.key]: e.target.value })}
                placeholder={section.placeholder}
                className="flex-1 h-10 px-3 rounded-xl bg-warm-50 border border-warm-200 text-warm-900 text-sm placeholder:text-warm-300 focus:outline-none focus:border-amber-primary/50 focus:ring-2 focus:ring-amber-primary/10 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && addItem(section.key)}
              />
              <button
                onClick={() => addItem(section.key)}
                disabled={!newItem[section.key].trim()}
                className="w-10 h-10 rounded-xl bg-amber-primary text-white flex items-center justify-center disabled:opacity-40 active:scale-95 transition-all"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        ))}

        <div className="pt-2 space-y-3">
          <button
            onClick={handleSave}
            className="w-full h-12 rounded-2xl bg-amber-primary text-white font-medium shadow-lg shadow-amber-primary/25 active:scale-[0.97] transition-all"
          >
            保存并刷新数据
          </button>

          <button
            onClick={handleReset}
            className="w-full h-10 rounded-xl border border-warm-200 text-warm-600 text-sm flex items-center justify-center gap-1.5 active:bg-warm-50 transition-all"
          >
            <RefreshCw size={14} />
            重新生成模拟数据
          </button>
        </div>
      </div>
    </div>
  )
}
