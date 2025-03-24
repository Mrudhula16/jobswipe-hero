
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DocumentTabs from "./DocumentTabs";
import AnalysisTabs from "./AnalysisTabs";

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
  return (
    <div className="lg:col-span-2">
      <Card className="neo-card">
        <CardHeader className="pb-2">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Documents Tab Content */}
          <TabsContent value="documents" className="mt-0">
            <DocumentTabs 
              activeDocType={activeDocType} 
              setActiveDocType={setActiveDocType} 
            />
          </TabsContent>
          
          {/* Analysis Tab Content */}
          <TabsContent value="analysis" className="mt-0">
            <AnalysisTabs 
              activeDocType={activeDocType} 
              setActiveDocType={setActiveDocType}
              matchScore={matchScore}
              optimizing={optimizing}
              onOptimize={onOptimize}
            />
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentEditorPanel;
