
import { useState } from "react";
import { Upload, Download, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { documentContent, getDocumentTitle } from "../data/documentContent";

interface DocumentTabsProps {
  activeDocType: string;
  setActiveDocType: (docType: string) => void;
}

const DocumentTabs = ({ activeDocType, setActiveDocType }: DocumentTabsProps) => {
  return (
    <Tabs 
      defaultValue="resume" 
      value={activeDocType} 
      onValueChange={setActiveDocType}
      className="w-full"
    >
      <TabsList className="inline-flex h-9 w-full items-center justify-start rounded-md bg-muted p-1 text-muted-foreground overflow-x-auto">
        <TabsTrigger value="resume" className="h-8 whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium">
          Resume
        </TabsTrigger>
        <TabsTrigger value="coverLetter" className="h-8 whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium">
          Cover Letter
        </TabsTrigger>
        <TabsTrigger value="sop" className="h-8 whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium">
          Statement of Purpose
        </TabsTrigger>
        <TabsTrigger value="linkedInProfile" className="h-8 whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium">
          LinkedIn Profile
        </TabsTrigger>
        <TabsTrigger value="portfolioDescription" className="h-8 whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium">
          Portfolio
        </TabsTrigger>
      </TabsList>
      
      {/* Document Content Tabs */}
      {Object.keys(documentContent).map((docType) => (
        <TabsContent key={docType} value={docType} className="mt-4">
          <DocumentContent docType={docType} />
        </TabsContent>
      ))}
    </Tabs>
  );
};

interface DocumentContentProps {
  docType: string;
}

const DocumentContent = ({ docType }: DocumentContentProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">My {getDocumentTitle(docType)}</h3>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload {getDocumentTitle(docType)}</DialogTitle>
                <DialogDescription>
                  Upload your {getDocumentTitle(docType).toLowerCase()} in PDF or DOCX format.
                </DialogDescription>
              </DialogHeader>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm mb-2">Drag and drop your file here</p>
                <p className="text-xs text-muted-foreground mb-4">Supports PDF, DOCX (max 5MB)</p>
                <Button size="sm">Select File</Button>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Upload</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
      
      <div className="relative border border-border rounded-lg overflow-hidden">
        <div className="absolute right-2 top-2">
          <Button size="icon" variant="ghost">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <pre className="p-4 whitespace-pre-wrap text-sm font-mono overflow-y-auto max-h-[60vh]">
          {documentContent[docType as keyof typeof documentContent]}
        </pre>
      </div>
    </>
  );
};

export default DocumentTabs;
