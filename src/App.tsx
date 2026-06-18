import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from '@/store/useStore'
import Layout from '@/components/Layout'
import Onboarding from '@/pages/Onboarding'
import Mentions from '@/pages/Mentions'
import PostDetail from '@/pages/PostDetail'
import Issues from '@/pages/Issues'
import IssuesDetail from '@/pages/IssuesDetail'
import Replies from '@/pages/Replies'
import Keywords from '@/pages/Keywords'

function RootRedirect() {
  const onboardingCompleted = useAppStore((s) => s.storeInfo.onboardingCompleted)
  return onboardingCompleted ? <Navigate to="/mentions" replace /> : <Navigate to="/onboarding" replace />
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route element={<Layout />}>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/mentions" element={<Mentions />} />
          <Route path="/mentions/:id" element={<PostDetail />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/issues/:id" element={<IssuesDetail />} />
          <Route path="/replies" element={<Replies />} />
          <Route path="/keywords" element={<Keywords />} />
        </Route>
      </Routes>
    </Router>
  )
}
