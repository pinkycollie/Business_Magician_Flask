import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { HandCoins, Check, ArrowRight } from 'lucide-react';

export interface SignToEarnProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  text?: string;
  earnings?: number;
  referralCode?: string;
  onSuccess?: (email: string) => void;
}

/**
 * SignToEarnButton Component
 * 
 * A button that allows users to sign up to earn rewards through referrals.
 * When clicked, it opens a dialog for the user to sign up with their email.
 * After signing up, they receive a referral code to share with others.
 */
export function SignToEarnButton({
  variant = 'default',
  size = 'default',
  text = 'Sign to Earn',
  earnings = 25,
  referralCode,
  onSuccess
}: SignToEarnProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedReferralCode, setGeneratedReferralCode] = useState('');
  const { toast } = useToast();

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    setSuccess(false);
    setEmail('');
    setAgreed(false);
  };

  const handleSubmit = async () => {
    if (!email || !agreed) {
      toast({
        title: 'Please fill out all fields',
        description: 'Email and agreement are required.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call to signup for referral program
      // This would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a random referral code if one wasn't provided
      const code = referralCode || `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setGeneratedReferralCode(code);
      setSuccess(true);
      
      if (onSuccess) {
        onSuccess(email);
      }
      
      toast({
        title: 'Success!',
        description: 'You\'ve been enrolled in our Sign to Earn program.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign up. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(generatedReferralCode);
    toast({
      title: 'Copied!',
      description: 'Referral code copied to clipboard',
    });
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleOpenDialog}
        className="gap-2"
      >
        <HandCoins className="h-4 w-4" />
        {text}
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {!success ? (
            <>
              <DialogHeader>
                <DialogTitle>Sign to Earn Program</DialogTitle>
                <DialogDescription>
                  Join our referral program and earn ${earnings} for each friend who signs up using your code.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="col-span-3"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="flex items-center space-x-2 ml-auto mr-0">
                  <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the terms and conditions
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !email || !agreed}
                >
                  {isSubmitting ? 'Signing up...' : 'Join & Earn'}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  You're In!
                </DialogTitle>
                <DialogDescription>
                  Share your referral code with friends and earn rewards.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm font-medium mb-2">Your Referral Code</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-background px-2 py-1 rounded text-lg font-mono flex-1 text-center">
                      {generatedReferralCode}
                    </code>
                    <Button size="sm" variant="outline" onClick={copyReferralCode}>
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    Share this code with friends. When they sign up using your code, 
                    you'll earn ${earnings} for each referral.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}