import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { ErrorBoundary } from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import AgentsPage from './pages/AgentsPage';
import AgentEditorPage from './pages/AgentEditorPage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignEditorPage from './pages/CampaignEditorPage';

function App() {
  const location = useLocation();
  const hideSidebar = /^\/agents\/[^/]+$/.test(location.pathname);

  return (
    <div className="min-h-screen bg-background text-neutral-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.08),_transparent_35%)]">
        {!hideSidebar ? <Sidebar /> : null}
        <main className="flex-1 overflow-auto p-6 xl:p-10">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/agents/:id" element={<AgentEditorPage />} />
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/campaigns/:id" element={<CampaignEditorPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default App;
