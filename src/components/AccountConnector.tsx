
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink, Linkedin, Mail, Globe, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface AccountConnectorProps {
  className?: string;
}

type Platform = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  connected: boolean;
  lastSync?: string;
  profile?: any;
};

const AccountConnector = ({ className }: AccountConnectorProps) => {
  const { isAuthenticated, user } = useAuth();
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      connected: false
    },
    {
      id: "gmail",
      name: "Gmail",
      icon: Mail,
      connected: true,
      lastSync: "2 hours ago"
    },
    {
      id: "indeed",
      name: "Indeed",
      icon: Globe,
      connected: false
    },
    {
      id: "glassdoor",
      name: "Glassdoor",
      icon: Globe,
      connected: false
    },
    {
      id: "naukri",
      name: "Naukri",
      icon: Globe,
      connected: false
    },
    {
      id: "internshala",
      name: "Internshala",
      icon: Globe,
      connected: false
    }
  ]);
  const [loading, setLoading] = useState<string | null>(null);

  // Check LinkedIn connection on load
  useEffect(() => {
    if (isAuthenticated) {
      checkLinkedInConnection();
    }
  }, [isAuthenticated]);

  const checkLinkedInConnection = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect your accounts",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('linkedin-integration', {
        body: { action: 'check_connection' }
      });

      if (error) throw error;

      // Update LinkedIn platform status
      setPlatforms(prev => prev.map(platform => 
        platform.id === "linkedin" 
          ? { 
              ...platform, 
              connected: data.isConnected,
              lastSync: data.isConnected ? 'Active connection' : undefined,
              profile: data.profile
            } 
          : platform
      ));
    } catch (error) {
      console.error("Error checking LinkedIn connection:", error);
    }
  };

  const connectLinkedIn = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect your accounts",
        variant: "destructive"
      });
      return;
    }

    setLoading("linkedin");

    try {
      // State parameter for security
      const state = Math.random().toString(36).substring(2, 15);
      // Store state in localStorage to verify callback
      localStorage.setItem('linkedin_oauth_state', state);
      
      // Redirect URI - for development/production compatibility
      const redirectUri = `${window.location.origin}/settings`;
      
      // Get authorization URL from our function
      const { data, error } = await supabase.functions.invoke('linkedin-integration', {
        body: { 
          action: 'authorize',
          redirectUri,
          state
        }
      });

      if (error) throw error;
      
      // Redirect user to LinkedIn authorization page
      window.location.href = data.authUrl;
    } catch (error) {
      console.error("Error starting LinkedIn connection:", error);
      toast({
        title: "Connection failed",
        description: "Could not connect to LinkedIn. Please try again.",
        variant: "destructive"
      });
      setLoading(null);
    }
  };

  const disconnectLinkedIn = async () => {
    if (!isAuthenticated) return;

    setLoading("linkedin");
    
    try {
      const { data, error } = await supabase.functions.invoke('linkedin-integration', {
        body: { action: 'disconnect' }
      });

      if (error) throw error;

      // Update platform status
      setPlatforms(prev => prev.map(platform => 
        platform.id === "linkedin" 
          ? { ...platform, connected: false, lastSync: undefined, profile: undefined } 
          : platform
      ));

      toast({
        title: "Account disconnected",
        description: "Your LinkedIn account has been disconnected"
      });
    } catch (error) {
      console.error("Error disconnecting LinkedIn:", error);
      toast({
        title: "Disconnection failed",
        description: "Could not disconnect LinkedIn. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  // Handle OAuth callback from LinkedIn
  useEffect(() => {
    const handleLinkedInCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const storedState = localStorage.getItem('linkedin_oauth_state');
      
      // Clean URL by removing OAuth params
      if (code || state) {
        const url = new URL(window.location.href);
        url.searchParams.delete('code');
        url.searchParams.delete('state');
        window.history.replaceState({}, document.title, url.toString());
      }
      
      // Process only if we have a code and state matches
      if (code && state && state === storedState) {
        setLoading("linkedin");
        localStorage.removeItem('linkedin_oauth_state');
        
        try {
          const redirectUri = `${window.location.origin}/settings`;
          
          const { data, error } = await supabase.functions.invoke('linkedin-integration', {
            body: { 
              action: 'exchange_token',
              authCode: code,
              redirectUri
            }
          });
          
          if (error) throw error;
          
          // Update platform status
          setPlatforms(prev => prev.map(platform => 
            platform.id === "linkedin" 
              ? { 
                  ...platform, 
                  connected: true,
                  lastSync: 'Just connected',
                  profile: data.profile
                } 
              : platform
          ));
          
          toast({
            title: "Account connected",
            description: `Your LinkedIn account has been connected successfully`
          });
        } catch (error) {
          console.error("Error completing LinkedIn connection:", error);
          toast({
            title: "Connection failed",
            description: "Could not connect to LinkedIn. Please try again.",
            variant: "destructive"
          });
        } finally {
          setLoading(null);
        }
      }
    };
    
    handleLinkedInCallback();
  }, []);

  const toggleConnection = (platformId: string) => {
    if (platformId === "linkedin") {
      const linkedInPlatform = platforms.find(p => p.id === "linkedin");
      
      if (linkedInPlatform?.connected) {
        disconnectLinkedIn();
      } else {
        connectLinkedIn();
      }
      return;
    }
    
    // Handle other platforms (simulated for now)
    setPlatforms(platforms.map(platform => 
      platform.id === platformId 
        ? { 
            ...platform, 
            connected: !platform.connected,
            lastSync: !platform.connected ? "Just now" : undefined
          } 
        : platform
    ));
  };

  return (
    <Card className={cn("neo-card", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Connected Accounts
        </CardTitle>
        <CardDescription>
          Connect your accounts to auto-apply for jobs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border border-border rounded-lg overflow-hidden">
          {platforms.map((platform, index) => (
            <div 
              key={platform.id}
              className={cn(
                "flex items-center justify-between p-4",
                index !== platforms.length - 1 && "border-b border-border"
              )}
            >
              <div className="flex items-center gap-3">
                <platform.icon className={cn(
                  "h-8 w-8 p-1.5 rounded-full",
                  platform.id === "linkedin" && "text-blue-600 bg-blue-50",
                  platform.id === "gmail" && "text-red-500 bg-red-50",
                  platform.id === "indeed" && "text-blue-500 bg-blue-50",
                  platform.id === "glassdoor" && "text-green-600 bg-green-50",
                  platform.id === "naukri" && "text-blue-700 bg-blue-50",
                  platform.id === "internshala" && "text-orange-500 bg-orange-50"
                )} />
                <div>
                  <p className="font-medium">{platform.name}</p>
                  {platform.connected && platform.lastSync && (
                    <p className="text-xs text-muted-foreground">
                      {platform.lastSync}
                    </p>
                  )}
                  {platform.connected && platform.profile && platform.id === "linkedin" && (
                    <p className="text-xs text-muted-foreground">
                      {platform.profile.name || 'LinkedIn User'}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant={platform.connected ? "ghost" : "outline"}
                size="sm"
                onClick={() => toggleConnection(platform.id)}
                className={cn(
                  "transition-all",
                  platform.connected && "text-green-600"
                )}
                disabled={loading === platform.id}
              >
                {loading === platform.id ? (
                  <div className="flex items-center gap-1">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </div>
                ) : platform.connected ? (
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4" />
                    Connected
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <ExternalLink className="h-4 w-4" />
                    Connect
                  </div>
                )}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="bg-muted p-3 rounded-lg flex items-start gap-2 text-sm">
          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-muted-foreground">
            Connect your accounts to enable auto-apply features. We'll only use these connections when you approve an application.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountConnector;
