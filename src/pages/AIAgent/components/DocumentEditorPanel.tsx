
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DocumentTabs from "./DocumentTabs";
import AnalysisTabs from "./AnalysisTabs";
import JobFilters from "@/components/JobFilters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface DocumentEditorPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeDocType: string;
  setActiveDocType: (docType: string) => void;
  matchScore: number;
  optimizing: boolean;
  onOptimize: () => void;
}

const DocumentEditorPanel = ({
  activeTab,
  setActiveTab,
  activeDocType,
  setActiveDocType,
  matchScore,
  optimizing,
  onOptimize
}: DocumentEditorPanelProps) => {
  const [llmModel, setLlmModel] = useState("gpt4");

  return (
    <div className="lg:col-span-2">
      <Card className="neo-card mb-6">
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <JobFilters onFilterChange={(filters) => console.log("Filters changed:", filters)} />
            
            <div className="flex items-center gap-3">
              <Label htmlFor="llm-model" className="text-sm whitespace-nowrap">AI Model:</Label>
              <Select value={llmModel} onValueChange={setLlmModel}>
                <SelectTrigger id="llm-model" className="w-[180px]">
                  <SelectValue placeholder="Select AI model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt4">GPT-4o</SelectItem>
                  <SelectItem value="gpt3">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude">Claude 3</SelectItem>
                  <SelectItem value="llama3">Llama 3</SelectItem>
                  <SelectItem value="grok">Grok</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="neo-card">
        <CardHeader className="pb-2">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
          
            {/* TabsContent must be INSIDE the Tabs component */}
            <TabsContent value="documents" className="mt-0">
              <DocumentTabs 
                activeDocType={activeDocType} 
                setActiveDocType={setActiveDocType} 
              />
            </TabsContent>
            
            <TabsContent value="analysis" className="mt-0">
              <AnalysisTabs 
                activeDocType={activeDocType} 
                setActiveDocType={setActiveDocType}
                matchScore={matchScore}
                optimizing={optimizing}
                onOptimize={onOptimize}
                llmModel={llmModel}
              />
            </TabsContent>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Remove TabsContent from here as they've been moved inside the Tabs component above */}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentEditorPanel;
