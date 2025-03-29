
import React, { useState } from 'react';
import JobAgentConfig from './JobAgentConfig';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bot } from 'lucide-react';

export const JobAgentConfigDialog = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Bot className="h-4 w-4" />
          Configure Job Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Job Agent Configuration</DialogTitle>
          <DialogDescription>
            Configure your AI-powered job agent to automatically find and apply to matching jobs.
          </DialogDescription>
        </DialogHeader>
        <JobAgentConfig onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default JobAgentConfigDialog;
