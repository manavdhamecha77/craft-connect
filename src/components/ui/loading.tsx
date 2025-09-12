"use client";

import { cn } from "@/lib/utils";
import { Palette, Sparkles } from "lucide-react";
import { Logo } from "../logo";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  variant?: "spinner" | "dots" | "pulse" | "craft" | "logo";
}

interface PageLoadingProps {
  text?: string;
  subtext?: string;
  className?: string;
}

interface InlineLoadingProps {
  text?: string;
  size?: "sm" | "md";
  className?: string;
}

// Main Loading Component
export function Loading({ 
  className, 
  size = "md", 
  text, 
  variant = "craft" 
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg"
  };

  const renderSpinner = () => (
    <div className="flex flex-col items-center gap-3">
      <div className={cn(
        "animate-spin rounded-full border-2 border-transparent border-t-primary",
        sizeClasses[size],
        className
      )} />
      {text && <p className={cn("text-muted-foreground", textSizes[size])}>{text}</p>}
    </div>
  );

  const renderDots = () => (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "rounded-full bg-primary animate-pulse",
              size === "sm" ? "h-1.5 w-1.5" : size === "md" ? "h-2 w-2" : "h-3 w-3",
              className
            )}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: "1s"
            }}
          />
        ))}
      </div>
      {text && <p className={cn("text-muted-foreground", textSizes[size])}>{text}</p>}
    </div>
  );

  const renderPulse = () => (
    <div className="flex flex-col items-center gap-3">
      <div className={cn(
        "rounded-full bg-primary animate-pulse",
        sizeClasses[size],
        className
      )} />
      {text && <p className={cn("text-muted-foreground", textSizes[size])}>{text}</p>}
    </div>
  );

  const renderCraft = () => (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className={cn(
          "animate-spin rounded-full border-2 border-transparent border-t-[#FF9933] border-r-[#FF9933]",
          sizeClasses[size],
          className
        )} />
        <Palette className={cn(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#4B0082] animate-pulse",
          size === "sm" ? "h-2 w-2" : size === "md" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-8 w-8"
        )} />
      </div>
      {text && <p className={cn("text-muted-foreground font-medium", textSizes[size])}>{text}</p>}
    </div>
  );

  const renderLogo = () => (
    <div className="flex flex-col items-center gap-4">
      <div className="relative animate-pulse">
        <Logo className={size === "xl" ? "h-16" : "h-12"} />
        <div className="absolute -top-1 -right-1">
          <Sparkles className="h-4 w-4 text-[#FF9933] animate-bounce" />
        </div>
      </div>
      {text && <p className={cn("text-muted-foreground font-medium", textSizes[size])}>{text}</p>}
    </div>
  );

  switch (variant) {
    case "spinner":
      return renderSpinner();
    case "dots":
      return renderDots();
    case "pulse":
      return renderPulse();
    case "craft":
      return renderCraft();
    case "logo":
      return renderLogo();
    default:
      return renderCraft();
  }
}

// Full Page Loading Component
export function PageLoading({ 
  text = "Loading...", 
  subtext, 
  className 
}: PageLoadingProps) {
  return (
    <div className={cn(
      "min-h-[60vh] flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg",
      className
    )}>
      <div className="text-center space-y-6 max-w-md mx-auto p-8">
        <Loading variant="logo" size="xl" />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{text}</h3>
          {subtext && (
            <p className="text-sm text-muted-foreground">{subtext}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Inline Loading Component (for buttons, small sections)
export function InlineLoading({ 
  text, 
  size = "sm", 
  className 
}: InlineLoadingProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Loading variant="craft" size={size} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

// Section Loading Component (for content areas)
export function SectionLoading({ 
  text = "Loading content...", 
  className 
}: { text?: string; className?: string }) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-6 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/20",
      className
    )}>
      <Loading variant="craft" size="lg" text={text} />
    </div>
  );
}

// Card Loading Skeleton
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3 p-4 bg-card rounded-lg border", className)}>
      <div className="animate-pulse space-y-3">
        <div className="bg-muted h-40 rounded-md" />
        <div className="space-y-2">
          <div className="bg-muted h-4 w-3/4 rounded" />
          <div className="bg-muted h-3 w-1/2 rounded" />
        </div>
        <div className="flex justify-between items-center">
          <div className="bg-muted h-4 w-1/4 rounded" />
          <div className="bg-muted h-8 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}

// Loading Grid for marketplace/product grids
export function LoadingGrid({ 
  count = 8, 
  columns = 4,
  className 
}: { 
  count?: number; 
  columns?: number;
  className?: string; 
}) {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  };

  return (
    <div className={cn(
      "grid gap-6",
      gridClasses[columns as keyof typeof gridClasses] || gridClasses[4],
      className
    )}>
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// Button Loading State
export function ButtonLoading({ 
  text = "Loading...",
  variant = "default",
  size = "default",
  className
}: {
  text?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}) {
  const baseClasses = "inline-flex items-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  };

  const sizeClasses = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-9 px-3 text-xs",
    lg: "h-11 px-8 text-base"
  };

  return (
    <button
      disabled
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        "cursor-not-allowed opacity-70",
        className
      )}
    >
      <Loading variant="spinner" size="sm" />
      {text}
    </button>
  );
}
