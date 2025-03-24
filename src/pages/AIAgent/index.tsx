
import Navbar from "@/components/Navbar";
import JobDetailsPanel from "./components/JobDetailsPanel";
import DocumentEditorPanel from "./components/DocumentEditorPanel";
import { useState } from "react";

// Type for improvement history items
export type ImprovementItem = {
  id: number;
  date: string;
  score: number;
  description: string;
};

const AIAgent = () => {
  const [activeTab, setActiveTab] = useState("resume");
  const [activeDocType, setActiveDocType] = useState("resume");
  const [optimizing, setOptimizing] = useState(false);
  const [matchScore, setMatchScore] = useState(62);
  const [improvements, setImprovements] = useState<ImprovementItem[]>([
    {
      id: 1,
      date: "2 days ago",
      score: 62,
      description: "Added relevant keywords for UX Designer role"
    },
    {
      id: 2, 
      date: "1 week ago",
      score: 48,
      description: "Restructured work experience to highlight design achievements"
    }
  ]);

  const handleOptimize = () => {
    setOptimizing(true);
    
    // Simulate optimization process
    setTimeout(() => {
      setOptimizing(false);
      setMatchScore(prevScore => {
        const newScore = Math.min(100, prevScore + Math.floor(Math.random() * 15) + 5);
        
        // Add new improvement to history
        const newImprovement = {
          id: improvements.length + 1,
          date: "Just now",
          score: newScore,
          description: newScore > 80 
            ? `Tailored ${activeDocType} achievements to match job requirements` 
            : `Enhanced ${activeDocType} with job-specific keywords`
        };
        
        setImprovements([newImprovement, ...improvements]);
        
        return newScore;
      });
    }, 2500);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-8 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Career Assistant</h1>
          <p className="text-muted-foreground">Optimize your resume and cover letters with AI to match your dream jobs</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details and Controls */}
          <JobDetailsPanel 
            matchScore={matchScore} 
            optimizing={optimizing} 
            improvements={improvements}
            onOptimize={handleOptimize}
          />
          
          {/* Right Column - Content Editor */}
          <DocumentEditorPanel
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeDocType={activeDocType}
            setActiveDocType={setActiveDocType}
            matchScore={matchScore}
            optimizing={optimizing}
            onOptimize={handleOptimize}
          />
        </div>
      </main>
    </div>
  );
};

export default AIAgent;
