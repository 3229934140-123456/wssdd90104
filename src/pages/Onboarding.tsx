import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, MapPin, User, Sparkles, ChevronRight } from 'lucide-react'
import { useAppStore } from '@/store/useStore'
import { SERVICE_OPTIONS } from '@/data/mock'

export default function Onboarding() {
  const navigate = useNavigate()
  const { storeInfo, setStoreInfo, completeOnboarding } = useAppStore()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    storeName: storeInfo.storeName,
    districtName: storeInfo.districtName,
    ownerAlias: storeInfo.ownerAlias,
    services: storeInfo.services,
  })

  const steps = [
    { label: '门店', field: 'storeName' as const, placeholder: '例如：老王火锅', icon: Store },
    { label: '商圈', field: 'districtName' as const, placeholder: '例如：望京SOHO', icon: MapPin },
    { label: '称呼', field: 'ownerAlias' as const, placeholder: '例如：王哥', icon: User },
  ]

  const canProceed = () => {
    if (step < 3) return form[steps[step].field].trim().length > 0
    return form.services.length > 0
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      setStoreInfo(form)
      completeOnboarding()
      navigate('/mentions', { replace: true })
    }
  }

  const toggleService = (s: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(s)
        ? prev.services.filter((x) => x !== s)
        : [...prev.services, s],
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-warm-100 to-amber-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        {step < 3 ? (
          <div className="opacity-0 animate-fade-in-up">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-amber-primary/15 flex items-center justify-center">
                {(() => {
                  const Icon = steps[step].icon
                  return <Icon size={32} className="text-amber-primary" />
                })()}
              </div>
            </div>

            <p className="text-center text-warm-500 text-sm mb-2">
              第 {step + 1} 步，共 4 步
            </p>
            <h2 className="text-center font-serif text-2xl font-bold text-warm-900 mb-2">
              {step === 0 && '你的门店叫什么？'}
              {step === 1 && '门店在哪个商圈？'}
              {step === 2 && '顾客怎么称呼你？'}
            </h2>
            <p className="text-center text-warm-500 text-sm mb-8">
              {step === 0 && '我们会帮你搜索这个名字相关的讨论'}
              {step === 1 && '缩小范围，只看同城的口碑'}
              {step === 2 && '方便识别帖子中是否提到了老板'}
            </p>

            <input
              type="text"
              value={form[steps[step].field]}
              onChange={(e) => setForm({ ...form, [steps[step].field]: e.target.value })}
              placeholder={steps[step].placeholder}
              className="w-full h-14 px-5 rounded-2xl bg-white border-2 border-warm-200 text-warm-900 placeholder:text-warm-300 focus:outline-none focus:border-amber-primary/50 focus:ring-4 focus:ring-amber-primary/10 transition-all text-base"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleNext()}
            />
          </div>
        ) : (
          <div className="opacity-0 animate-fade-in-up">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-amber-primary/15 flex items-center justify-center">
                <Sparkles size={32} className="text-amber-primary" />
              </div>
            </div>

            <p className="text-center text-warm-500 text-sm mb-2">第 4 步，共 4 步</p>
            <h2 className="text-center font-serif text-2xl font-bold text-warm-900 mb-2">
              提供哪些服务？
            </h2>
            <p className="text-center text-warm-500 text-sm mb-8">
              选择你门店的经营项目，帮助我们精准匹配
            </p>

            <div className="flex flex-wrap gap-2">
              {SERVICE_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleService(s)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    form.services.includes(s)
                      ? 'bg-amber-primary text-white shadow-md shadow-amber-primary/25'
                      : 'bg-white text-warm-600 border border-warm-200 hover:border-amber-primary/30'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full mt-8 h-14 rounded-2xl font-medium text-base flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-amber-primary text-white shadow-lg shadow-amber-primary/25 active:scale-[0.97]"
        >
          {step < 3 ? '下一步' : '开始使用'}
          <ChevronRight size={18} />
        </button>

        <div className="flex items-center justify-center gap-2 mt-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-amber-primary' : i < step ? 'w-4 bg-amber-primary/40' : 'w-4 bg-warm-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
