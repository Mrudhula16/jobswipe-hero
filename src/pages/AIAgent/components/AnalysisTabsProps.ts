
export interface AnalysisTabsProps {
  activeDocType: string;
  setActiveDocType: (docType: string) => void;
  matchScore: number;
  optimizing: boolean;
  onOptimize: () => void;
  llmModel: string;
  useLinkedIn?: boolean;
}
