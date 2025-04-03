
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import JobSwipe from './pages/JobSwipe';
import JobAgentDashboard from './pages/JobAgentDashboard';
import AIAgent from './pages/AIAgent';
import Settings from './pages/Settings';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import './App.css';

// Simplified routes without authentication
function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/job-swipe" element={<JobSwipe />} />
        <Route path="/" element={<Navigate to="/job-swipe" />} />
        <Route path="/profile" element={<JobAgentDashboard />} />
        <Route path="/ai-assistant" element={<AIAgent />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/job-swipe" />} />
      </Routes>
      <Toaster />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
