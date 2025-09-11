
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/lib/auth-utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ShoppingBag, Users } from "lucide-react";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Google</title>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-5.02 1.9-4.5 0-8.19-3.67-8.19-8.19s3.69-8.19 8.19-8.19c2.52 0 4.29 1.02 5.28 2.02l2.59-2.59C19.34 1.87 16.36 0 12.48 0 5.88 0 0 5.88 0 12.48s5.88 12.48 12.48 12.48c6.96 0 11.7-4.82 11.7-11.96 0-.78-.07-1.52-.2-2.24H12.48z" />
    </svg>
);


export function AuthForm() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get role from URL parameters
  const userRole = searchParams.get('role') || 'customer'; // Default to customer
  const isArtisan = userRole === 'artisan';

  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const toggleForm = () => setIsLogin(!isLogin);

  const onAuthSuccess = () => {
    // Store user role in localStorage for future reference
    localStorage.setItem('userRole', userRole);
    
    // For new signups (not login), redirect artisans to onboarding
    const redirectPath = (!isLogin && isArtisan) ? '/onboarding' : 
                         (isArtisan ? '/dashboard' : '/marketplace');
    const roleLabel = (!isLogin && isArtisan) ? 'Artisan Onboarding' : 
                     (isArtisan ? 'Artisan Dashboard' : 'Marketplace');
    
    toast({
      title: "Authentication Successful",
      description: `Welcome! Redirecting you to the ${roleLabel}.`,
    });
    
    // Use replace instead of push to prevent back button issues
    router.replace(redirectPath);
  };
  
  const onAuthFailure = (error: string) => {
    // Check if it's a role conflict error
    const isRoleConflict = error.toLowerCase().includes('artisan') || error.toLowerCase().includes('customer');
    
    toast({
      variant: "destructive",
      title: isRoleConflict ? "Role Mismatch" : "Authentication Failed",
      description: error,
    });
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      onAuthFailure("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    let result;
    if (isLogin) {
      result = await signInWithEmail(email, password, userRole as 'artisan' | 'customer');
    } else {
      const name = nameRef.current?.value;
      if (!name) {
        onAuthFailure("Please enter your name.");
        setIsLoading(false);
        return;
      }
      result = await signUpWithEmail(email, password, name, userRole as 'artisan' | 'customer');
    }

    if (result.error) {
      onAuthFailure(result.error);
    } else {
      onAuthSuccess();
    }

    setIsLoading(false);
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    
    const result = await signInWithGoogle(userRole as 'artisan' | 'customer');
    
    if (result.error) {
      onAuthFailure(result.error);
    } else {
      onAuthSuccess();
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col space-y-6">
       <div className="flex flex-col space-y-3 text-center">
            {/* Role Badge */}
            <div className="flex justify-center">
              <Badge 
                variant="secondary" 
                className={cn(
                  "px-4 py-2",
                  isArtisan 
                    ? "bg-[#FF9933]/10 text-[#4B0082] border-[#FF9933]/20" 
                    : "bg-[#4B0082]/10 text-[#4B0082] border-[#4B0082]/20"
                )}
              >
                {isArtisan ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Joining as Artisan
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Joining as Customer
                  </>
                )}
              </Badge>
            </div>
            
            <h1 className="text-2xl font-semibold tracking-tight">
              {isLogin ? 'Welcome Back' : `Create ${isArtisan ? 'Artisan' : 'Customer'} Account`}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin ? (
                `Enter your credentials to access your ${isArtisan ? 'artisan dashboard' : 'marketplace'}.`
              ) : (
                isArtisan 
                  ? 'Join thousands of artisans using AI to grow their craft business.'
                  : 'Discover authentic handcrafted products from talented artisans.'
              )}
            </p>
        </div>
      <div
        className={cn(
          "relative grid gap-6 overflow-hidden transition-all duration-500",
        )}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                ref={nameRef}
                placeholder="Your Name"
                type="text"
                disabled={isLoading}
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              ref={emailRef}
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              ref={passwordRef}
              placeholder="••••••••"
              type="password"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading} className="w-full">
            {isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                </span>
            </div>
        </div>
        
        <Button variant="outline" type="button" disabled={isLoading} onClick={handleGoogleAuth}>
            {isLoading ? (
                <div className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-primary" />
            ) : (
                <GoogleIcon className="mr-2 h-4 w-4" />
            )}
            Continue with Google
        </Button>
      </div>
       <div className="space-y-2">
         <p className="px-8 text-center text-sm text-muted-foreground">
            <button
              onClick={toggleForm}
              className="underline underline-offset-4 hover:text-primary"
              disabled={isLoading}
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </p>
          <p className="px-8 text-center text-xs text-muted-foreground">
            {isArtisan ? "Looking to shop? " : "Want to sell your crafts? "}
            <button
              onClick={() => {
                const newRole = isArtisan ? 'customer' : 'artisan';
                router.push(`/auth?role=${newRole}`);
              }}
              className="underline underline-offset-4 hover:text-primary"
              disabled={isLoading}
            >
              {isArtisan ? "Join as Customer" : "Join as Artisan"}
            </button>
          </p>
        </div>
    </div>
  );
}
