import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { MessageSquare, Layers, Reply, Settings } from 'lucide-react'
import { useAppStore } from '@/store/useStore'

const tabs = [
  { path: '/mentions', label: '今日提到我', icon: MessageSquare },
  { path: '/issues', label: '问题归类', icon: Layers },
  { path: '/replies', label: '回复提醒', icon: Reply },
]

export default function Layout() {
  const location = useLocation()
  const storeInfo = useAppStore((s) => s.storeInfo)

  const isDetailPage =
    location.pathname.includes('/mentions/') ||
    location.pathname.includes('/issues/') ||
    location.pathname === '/keywords'

  return (
    <div className="flex flex-col h-screen max-w-app mx-auto bg-warm-100 relative overflow-hidden">
      {!isDetailPage && (
        <header className="shrink-0 px-5 pb-3 bg-gradient-to-b from-amber-50 to-warm-100">
          <div className="flex items-center justify-between pt-3">
            <div>
              <h1 className="font-serif text-xl font-bold text-warm-900">
                店声通
              </h1>
              <p className="text-warm-500 text-xs mt-0.5">
                {storeInfo.storeName || '门店口碑速览'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <NavLink
                to="/keywords"
                className="w-9 h-9 rounded-full bg-warm-200/60 flex items-center justify-center active:scale-95 transition-transform"
              >
                <Settings size={16} className="text-warm-600" />
              </NavLink>
              <div className="w-9 h-9 rounded-full bg-amber-primary/10 flex items-center justify-center">
                <span className="text-amber-primary text-sm font-medium">
                  {storeInfo.ownerAlias ? storeInfo.ownerAlias[0] : '店'}
                </span>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <Outlet />
      </main>

      {!isDetailPage && (
        <nav className="shrink-0 bg-white border-t border-warm-200/60 pb-safe-bottom">
          <div className="flex items-center justify-around h-14">
            {tabs.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 transition-colors duration-200 ${
                    isActive ? 'text-amber-primary' : 'text-warm-400'
                  }`
                }
              >
                <Icon size={20} strokeWidth={1.8} />
                <span className="text-[10px] font-medium">{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
