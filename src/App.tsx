
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import JobSwiper from './components/JobSwiper';
import JobAgentDashboard from './pages/JobAgentDashboard';
import AIAgent from './pages/AIAgent';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JobSwiper />} />
        <Route path="/profile" element={<JobAgentDashboard />} />
        <Route path="/ai-assistant" element={<AIAgent />} />
      </Routes>
    </Router>
  );
}

export default App;
