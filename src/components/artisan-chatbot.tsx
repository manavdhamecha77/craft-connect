"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  Sparkles
} from "lucide-react";
import type { ChatMessage } from "@/ai/flows/artisan-assistant";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function ArtisanChatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Determine eligibility (artisans who completed onboarding)
  const isEligible = !!user && user.role === 'artisan' && !(user as any).needsProfileMigration && !!user.artisanProfile && user.artisanProfile.name !== 'Anonymous Artisan';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
      // Add welcome message if it's the first time opening
      if (messages.length === 0) {
        setMessages([{
          role: "assistant",
          content: `Hi ${user?.artisanProfile?.name || 'there'}! I'm your CraftConnect AI Assistant. I can help you with managing your products, understanding the platform, pricing tips, and more. What can I help you with today?`
        }]);
      }
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/artisan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: `Hi ${user?.artisanProfile?.name || 'there'}! I'm your CraftConnect AI Assistant. I can help you with managing your products, understanding the platform, pricing tips, and more. What can I help you with today?`
    }]);
  };

  // If not eligible, render nothing (hooks above still called consistently)
  if (!isEligible) {
    return null;
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleToggle}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-[#FF9933] to-[#4B0082] hover:from-[#FF9933]/90 hover:to-[#4B0082]/90"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          <span className="sr-only">Open Artisan Assistant</span>
        </Button>
        
        {/* Pulsing indicator for new users */}
        {messages.length === 0 && (
          <div className="absolute -top-1 -right-1">
            <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse">
              <div className="h-4 w-4 bg-green-500 rounded-full animate-ping"></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={cn(
        "transition-all duration-300 shadow-xl",
        isMinimized ? "w-80 h-14" : "w-80 h-96"
      )}>
        <CardHeader className="pb-2 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#FF9933] to-[#4B0082]">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">Artisan Assistant</CardTitle>
                <Badge variant="secondary" className="text-xs">AI-powered</Badge>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMinimize}
                className="h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="px-4 pb-4 flex flex-col h-80">
            <ScrollArea className="flex-1 pr-2">
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-2",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-[#FF9933] to-[#4B0082] flex-shrink-0 mt-1">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm max-w-[240px]",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted"
                      )}
                    >
                      {message.content}
                    </div>
                    {message.role === "user" && (
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary flex-shrink-0 mt-1">
                        <User className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-[#FF9933] to-[#4B0082] flex-shrink-0 mt-1">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                    <div className="px-3 py-2 rounded-lg text-sm bg-muted">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
            
            <div className="flex items-center gap-2 pt-3 border-t">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about CraftConnect..."
                disabled={isLoading}
                className="flex-1 text-sm"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="sm"
                className="px-3"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
            
            {messages.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-xs mt-2 h-6"
              >
                Clear chat
              </Button>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
