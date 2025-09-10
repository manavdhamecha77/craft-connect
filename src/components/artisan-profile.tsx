import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Palette, Calendar, Award, Heart, Target } from "lucide-react";
import { ArtisanUser } from "@/hooks/use-auth";

interface ArtisanProfileProps {
  artisan: ArtisanUser["artisanProfile"];
  variant?: "compact" | "detailed" | "card";
  showBio?: boolean;
}

export function ArtisanProfile({ artisan, variant = "compact", showBio = true }: ArtisanProfileProps) {
  if (!artisan) {
    return (
      <div className="text-center text-muted-foreground">
        <p>No profile information available</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n.charAt(0)).join("").toUpperCase().slice(0, 2);
  };

  if (variant === "compact") {
    return (
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white">
            {getInitials(artisan.name || "A")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">{artisan.name}</p>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {artisan.specialization && (
              <span className="flex items-center space-x-1">
                <Palette className="h-3 w-3" />
                <span>{artisan.specialization}</span>
              </span>
            )}
            {artisan.region && (
              <span className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{artisan.region}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "detailed") {
    const techniques = (artisan as any).techniques ? (artisan as any).techniques.split(", ") : [];
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white text-xl">
              {getInitials(artisan.name || "A")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{artisan.name}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {artisan.specialization && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Palette className="h-3 w-3" />
                  <span>{artisan.specialization}</span>
                </Badge>
              )}
              {artisan.region && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{artisan.region}</span>
                </Badge>
              )}
              {(artisan as any).experience && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{(artisan as any).experience}</span>
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {showBio && artisan.bio && (
          <div>
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{artisan.bio}</p>
          </div>
        )}

        {/* Techniques */}
        {techniques.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2 flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>Skills & Techniques</span>
            </h3>
            <div className="flex flex-wrap gap-1">
              {techniques.map((technique: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {technique.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Inspiration */}
        {(artisan as any).inspiration && (
          <div>
            <h3 className="font-semibold mb-2 flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Inspiration</span>
            </h3>
            <p className="text-muted-foreground text-sm whitespace-pre-wrap">
              {(artisan as any).inspiration}
            </p>
          </div>
        )}

        {/* Goals */}
        {(artisan as any).goals && (
          <div>
            <h3 className="font-semibold mb-2 flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Goals</span>
            </h3>
            <p className="text-muted-foreground text-sm whitespace-pre-wrap">
              {(artisan as any).goals}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (variant === "card") {
    const techniques = (artisan as any).techniques ? (artisan as any).techniques.split(", ").slice(0, 3) : [];
    
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white text-lg">
                {getInitials(artisan.name || "A")}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-xl">{artisan.name}</CardTitle>
          <div className="flex flex-col items-center space-y-2 mt-2">
            {artisan.specialization && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Palette className="h-3 w-3" />
                <span>{artisan.specialization}</span>
              </Badge>
            )}
            {artisan.region && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{artisan.region}</span>
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Bio Preview */}
          {showBio && artisan.bio && (
            <div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {artisan.bio}
              </p>
            </div>
          )}

          {/* Experience */}
          {(artisan as any).experience && (
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Experience:</span>
              <span className="font-medium">{(artisan as any).experience}</span>
            </div>
          )}

          {/* Top Skills */}
          {techniques.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-sm mb-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Top Skills</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {techniques.map((technique: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {technique.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}

// Simplified version for showing just name and specialization
export function ArtisanBadge({ artisan }: { artisan: ArtisanUser["artisanProfile"] }) {
  if (!artisan) return null;

  return (
    <div className="flex items-center space-x-2 text-sm">
      <span className="text-muted-foreground">By:</span>
      <span className="font-medium">{artisan.name}</span>
      {artisan.specialization && (
        <>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{artisan.specialization}</span>
        </>
      )}
      {artisan.region && (
        <>
          <MapPin className="h-3 w-3 text-muted-foreground ml-1" />
          <span className="text-muted-foreground">{artisan.region}</span>
        </>
      )}
    </div>
  );
}

// Profile completion indicator
export function ProfileCompletionIndicator({ artisan }: { artisan: ArtisanUser["artisanProfile"] }) {
  const getCompletionScore = () => {
    if (!artisan) return 20;
    
    let score = 20; // Base score for having a profile
    
    if (artisan.name && artisan.name !== 'Anonymous Artisan') score += 20;
    if (artisan.region && artisan.region !== 'Unknown Region') score += 15;
    if (artisan.specialization) score += 15;
    if (artisan.bio) score += 20;
    if ((artisan as any).experience) score += 5;
    if ((artisan as any).techniques) score += 5;
    
    return Math.min(score, 100);
  };

  const score = getCompletionScore();
  const isComplete = score >= 80;

  return (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 rounded-full" 
           style={{ backgroundColor: isComplete ? '#22c55e' : '#f59e0b' }} />
      <span className="text-xs text-muted-foreground">
        Profile {score}% complete
      </span>
    </div>
  );
}
