
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Upload, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumeAnalyzerProps {
  className?: string;
}

const ResumeAnalyzer = ({ className }: ResumeAnalyzerProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    strengths: string[];
    improvements: string[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleAnalyze = () => {
    if (!file) return;
    
    setAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      setResult({
        score: 78,
        strengths: [
          "Strong technical skills section",
          "Clear work experience formatting",
          "Good keyword optimization"
        ],
        improvements: [
          "Add more quantifiable achievements",
          "Improve job title alignment with target positions",
          "Consider adding a summary section"
        ]
      });
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <Card className={cn("neo-card", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Resume Analyzer
        </CardTitle>
        <CardDescription>
          Get your resume analyzed by AI for ATS compatibility
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!file && !result && (
          <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="font-medium text-foreground">Upload your resume</h3>
              <p className="text-sm text-muted-foreground">
                PDF, DOCX or TXT up to 5MB
              </p>
              <label className="mt-4">
                <Button className="gap-2">
                  <Upload className="h-4 w-4" />
                  Select File
                </Button>
                <input
                  type="file"
                  className="sr-only"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        )}

        {file && !analyzing && !result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFile(null)}
                className="text-muted-foreground"
              >
                Remove
              </Button>
            </div>
            <Button className="w-full" onClick={handleAnalyze}>
              Analyze Resume
            </Button>
          </div>
        )}

        {analyzing && (
          <div className="space-y-4 py-4">
            <p className="text-center font-medium">Analyzing your resume...</p>
            <Progress value={45} className="w-full" />
            <p className="text-sm text-center text-muted-foreground">
              Checking for ATS compatibility and optimization opportunities
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative h-32 w-32">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={result.score > 80 ? "#10b981" : result.score > 60 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="10"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * result.score) / 100}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{result.score}</span>
                </div>
              </div>
              <p className="mt-2 font-medium text-lg">ATS Score</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                Strengths
              </h4>
              <ul className="space-y-1">
                {result.strengths.map((strength, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-1 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                Improvement Areas
              </h4>
              <ul className="space-y-1">
                {result.improvements.map((improvement, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      {result && (
        <CardFooter className="flex justify-between border-t p-4">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              setFile(null);
              setResult(null);
            }}
          >
            <Upload className="h-4 w-4" />
            New Resume
          </Button>
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Optimize Resume
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ResumeAnalyzer;
