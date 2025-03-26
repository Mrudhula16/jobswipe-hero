
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Link as LinkIcon, CheckCircle2, ExternalLink } from "lucide-react";
import { getAvailableJobSources, connectToJobPlatform, importPreferencesFromPlatform, JobSource } from "@/services/jobSourcesService";
import { toast } from "@/hooks/use-toast";

interface JobSourceConnectorProps {
  onImportPreferences?: (preferences: any) => void;
}

const JobSourceConnector = ({ onImportPreferences }: JobSourceConnectorProps) => {
  const [jobSources, setJobSources] = useState<JobSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [importing, setImporting] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchJobSources = async () => {
      try {
        const sources = await getAvailableJobSources();
        setJobSources(sources);
      } catch (error) {
        console.error("Error fetching job sources:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobSources();
  }, []);
  
  const handleConnect = async (source: JobSource) => {
    try {
      setConnecting(source.id);
      // In a real implementation, this would redirect to OAuth flow
      const success = await connectToJobPlatform(source.id);
      
      if (success) {
        toast({
          title: "Connected successfully",
          description: `Your ${source.name} account has been connected`,
        });
        
        // Update the connected status
        setJobSources(prev => 
          prev.map(s => s.id === source.id ? { ...s, isConnected: true } : s)
        );
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: `Could not connect to ${source.name}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setConnecting(null);
    }
  };
  
  const handleImport = async (source: JobSource) => {
    try {
      setImporting(source.id);
      const preferences = await importPreferencesFromPlatform(source.id);
      
      toast({
        title: "Preferences imported",
        description: `Successfully imported preferences from ${source.name}`,
      });
      
      if (onImportPreferences) {
        onImportPreferences(preferences);
      }
    } catch (error) {
      toast({
        title: "Import failed",
        description: `Could not import preferences from ${source.name}`,
        variant: "destructive"
      });
    } finally {
      setImporting(null);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5 text-primary" />
          Connect Job Platforms
        </CardTitle>
        <CardDescription>
          Connect your accounts to import preferences and discover more opportunities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          jobSources.map((source) => (
            <div 
              key={source.id} 
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-secondary/30 flex items-center justify-center overflow-hidden">
                  {source.logo ? (
                    <img src={source.logo} alt={source.name} className="h-6 w-6 object-contain" />
                  ) : (
                    <LinkIcon className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{source.name}</h3>
                    {source.isConnected && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{source.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {source.isConnected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={importing === source.id}
                    onClick={() => handleImport(source)}
                  >
                    {importing === source.id ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      "Import Preferences"
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={connecting === source.id}
                    onClick={() => handleConnect(source)}
                  >
                    {connecting === source.id ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      "Connect"
                    )}
                  </Button>
                )}
                
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
        
        <div className="text-xs text-muted-foreground mt-2">
          Note: This is a preview feature. Connect your accounts to LinkedIn and Glassdoor to access more job opportunities.
        </div>
      </CardContent>
    </Card>
  );
};

export default JobSourceConnector;
