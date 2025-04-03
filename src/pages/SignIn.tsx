
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import OTPVerification from "@/components/OTPVerification";

const SignIn = () => {
  const navigate = useNavigate();
  const { loginWithEmail, verifyOTP, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("signin");
  
  // Form states
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await loginWithEmail(email);
      setOtpSent(true);
    } catch (error) {
      console.error("Sign in error:", error);
      // Error is handled by the useAuth hook
    }
  };
  
  const handleVerifyOTP = async (email: string, token: string) => {
    try {
      await verifyOTP(email, token);
      // Navigation is handled in the useAuth hook after successful verification
    } catch (error) {
      console.error("OTP verification error:", error);
    }
  };
  
  const handleResendOTP = async (email: string) => {
    try {
      await loginWithEmail(email);
    } catch (error) {
      console.error("Resend OTP error:", error);
    }
  };
  
  if (otpSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
        <OTPVerification 
          email={email}
          onVerify={handleVerifyOTP}
          onResend={handleResendOTP}
          isLoading={isLoading}
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-lg neo-card">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">JobHub</CardTitle>
          <CardDescription>
            Sign in to access your job search dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-1 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Continue with Email"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <Button variant="outline" className="h-10">
              <Mail className="h-4 w-4 mr-2" />
              Magic Email Link
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="#" className="underline underline-offset-2 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-2 hover:text-primary">
              Privacy Policy
            </a>
            .
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
