
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink, Linkedin, Mail, Globe, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountConnectorProps {
  className?: string;
}

type Platform = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  connected: boolean;
  lastSync?: string;
};

const AccountConnector = ({ className }: AccountConnectorProps) => {
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
    }
  ]);

  const toggleConnection = (platformId: string) => {
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
                  platform.id === "glassdoor" && "text-green-600 bg-green-50"
                )} />
                <div>
                  <p className="font-medium">{platform.name}</p>
                  {platform.connected && platform.lastSync && (
                    <p className="text-xs text-muted-foreground">
                      Last synced: {platform.lastSync}
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
              >
                {platform.connected ? (
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
