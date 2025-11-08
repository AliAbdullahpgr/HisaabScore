'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Loader2, Minimize2, Sparkles, TrendingUp, DollarSign, PiggyBank, RotateCcw } from 'lucide-react';
import { chatWithFinanceAdvisor } from '@/ai/flows/finance-chat';
import { Transaction } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface FinanceChatbotProps {
  transactions: Transaction[];
}

const SUGGESTED_PROMPTS = [
  { icon: TrendingUp, text: "Analyze my spending patterns", color: "text-blue-600" },
  { icon: DollarSign, text: "What's my total income?", color: "text-green-600" },
  { icon: PiggyBank, text: "Give me saving tips", color: "text-purple-600" },
];

export function FinanceChatbot({ transactions }: FinanceChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi there! 👋 I'm your AI finance advisor. I've analyzed your transaction history and I'm here to help you make smarter financial decisions. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    setInput('');
    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await chatWithFinanceAdvisor({
        message: textToSend,
        transactions: transactions.map((t) => ({
          date: t.date,
          merchant: t.merchant,
          amount: t.amount,
          type: t.type,
          category: t.category,
          status: t.status || 'cleared',
        })),
        conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.response,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I apologize, but I encountered an error processing your request. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Hi there! 👋 I'm your AI finance advisor. I've analyzed your transaction history and I'm here to help you make smarter financial decisions. What would you like to know?",
        timestamp: new Date(),
      },
    ]);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full shadow-2xl hover:scale-110 transition-transform"
          size="icon"
        >
          <MessageCircle className="h-7 w-7" />
        </Button>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-14 px-6 rounded-full shadow-2xl hover:scale-105 transition-transform"
          variant="default"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          <span className="font-semibold">Finance Advisor</span>
          {transactions.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {transactions.length}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  const showSuggestions = messages.length === 1 && !isLoading;

  return (
    <Card className="fixed bottom-6 right-6 w-[420px] h-[75vh] max-h-[800px] min-h-[500px] shadow-2xl z-50 flex flex-col border-2 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-primary/5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Finance Advisor</h3>
            <p className="text-xs text-muted-foreground">AI-powered insights</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-background/80"
            onClick={handleReset}
            title="Reset conversation"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-background/80"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-background/80"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20" ref={scrollRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              'flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300',
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            )}
          >
            {message.role === 'assistant' && (
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            <div
              className={cn(
                'rounded-2xl px-4 py-3 max-w-[85%] shadow-sm',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                  : 'bg-background border rounded-tl-sm'
              )}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              <p className={cn(
                "text-xs mt-1.5 opacity-60",
                message.role === 'user' ? 'text-right' : 'text-left'
              )}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {message.role === 'user' && (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold">You</span>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="bg-background border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5">
                <div className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Suggested Prompts */}
        {showSuggestions && (
          <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-xs text-muted-foreground text-center font-medium">Suggested questions:</p>
            <div className="grid gap-2">
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(prompt.text)}
                  className="flex items-center gap-2 p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors text-left group"
                >
                  <prompt.icon className={cn("h-4 w-4 shrink-0", prompt.color)} />
                  <span className="text-sm group-hover:text-primary transition-colors">{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-background shrink-0">
        <div className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me anything about your finances..."
            disabled={isLoading}
            className="min-h-[44px] max-h-[120px] resize-none"
            rows={1}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-11 w-11 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">
            {transactions.length} transactions • AI-powered
          </p>
          <p className="text-xs text-muted-foreground">
            Press Enter to send
          </p>
        </div>
      </div>
    </Card>
  );
}
