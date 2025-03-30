
import React from 'react';
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import AccountConnector from "@/components/AccountConnector";

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Account ID</p>
                  <p className="text-sm text-muted-foreground">{user?.id}</p>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Coming Soon",
                      description: "This feature is not yet implemented.",
                    });
                  }}
                >
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <AccountConnector />
          
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  Notification settings will be available soon.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Coming Soon",
                      description: "This feature is not yet implemented.",
                    });
                  }}
                >
                  Configure Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>Manage your data and privacy preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  Privacy settings will be available soon.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Coming Soon",
                      description: "This feature is not yet implemented.",
                    });
                  }}
                >
                  Privacy Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
