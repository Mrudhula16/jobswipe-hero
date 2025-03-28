
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import JobSwiper from './components/JobSwiper';
import JobAgentDashboard from './pages/JobAgentDashboard';
import AIAgent from './pages/AIAgent';
import Auth from './pages/Auth';
import Settings from './pages/Settings';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<ProtectedRoute><JobSwiper /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><JobAgentDashboard /></ProtectedRoute>} />
        <Route path="/ai-assistant" element={<ProtectedRoute><AIAgent /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
