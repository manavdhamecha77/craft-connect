
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { handleSignIn, handleSignUp } from "../actions";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Google</title>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-5.02 1.9-4.5 0-8.19-3.67-8.19-8.19s3.69-8.19 8.19-8.19c2.52 0 4.29 1.02 5.28 2.02l2.59-2.59C19.34 1.87 16.36 0 12.48 0 5.88 0 0 5.88 0 12.48s5.88 12.48 12.48 12.48c6.96 0 11.7-4.82 11.7-11.96 0-.78-.07-1.52-.2-2.24H12.48z" />
    </svg>
);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export function AuthForm() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const toggleForm = () => setIsLogin(!isLogin);

  const onAuthSuccess = () => {
    toast({
      title: "Authentication Successful",
      description: "Welcome! Redirecting you to the dashboard.",
    });
    router.push("/");
  };
  
  const onAuthFailure = (error: string) => {
     toast({
        variant: "destructive",
        title: "Authentication Failed",
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
      result = await handleSignIn(email, password);
    } else {
      const name = nameRef.current?.value;
      if (!name) {
        onAuthFailure("Please enter your name.");
        setIsLoading(false);
        return;
      }
      result = await handleSignUp(email, password, name);
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
    try {
        await signInWithPopup(auth, googleProvider);
        // The onAuthStateChanged listener in AuthProvider will handle the redirect.
        onAuthSuccess();
    } catch (error: any) {
        onAuthFailure(error.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
       <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin ? 'Enter your credentials to access your dashboard.' : 'Enter your email below to create your account.'}
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
       <p className="px-8 text-center text-sm text-muted-foreground">
          <button
            onClick={toggleForm}
            className="underline underline-offset-4 hover:text-primary"
            disabled={isLoading}
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </p>
    </div>
  );
}
