
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface OTPVerificationProps {
  email: string;
  onVerify: (email: string, token: string) => Promise<void>;
  onResend: (email: string) => Promise<void>;
  isLoading: boolean;
}

const OTPVerification = ({ email, onVerify, onResend, isLoading }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;
    
    try {
      await onVerify(email, otp);
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await onResend(email);
    } catch (error) {
      console.error("Error resending OTP:", error);
    } finally {
      setResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Verify Email</CardTitle>
        <CardDescription>
          Enter the verification code sent to {email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading || otp.length < 6}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
          
          <div className="text-center">
            <Button 
              variant="link" 
              type="button" 
              onClick={handleResend} 
              disabled={resending}
              className="text-sm"
            >
              {resending ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Resending...
                </>
              ) : (
                "Didn't receive the code? Resend"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OTPVerification;
