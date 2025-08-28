import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp?: Date;
}

export function ChatMessage({ message, isBot, timestamp }: ChatMessageProps) {
  return (
    <div className={cn(
      "flex gap-3 p-4 animate-fade-in",
      isBot ? "bg-gradient-card" : "bg-primary-soft/30"
    )}>
      <div className={cn(
        "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md text-white",
        isBot ? "bg-primary" : "bg-therapy-blue"
      )}>
        {isBot ? (
          <Bot className="h-4 w-4" />
        ) : (
          <User className="h-4 w-4" />
        )}
      </div>
      
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium text-foreground">
          {isBot ? "Freuda" : "Tú"}
        </p>
        <div className="text-sm text-foreground/90 leading-relaxed">
          {message}
        </div>
        {timestamp && (
          <p className="text-xs text-muted-foreground">
            {timestamp.toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        )}
      </div>
    </div>
  );
}