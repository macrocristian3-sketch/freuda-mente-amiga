import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { useToast } from "@/hooks/use-toast";
import { generateMentalHealthResponse } from "@/lib/llm";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "¡Hola! Soy Freuda, tu compañera de apoyo emocional con inteligencia artificial. Estoy aquí para escucharte y ayudarte a explorar tus sentimientos en un espacio seguro y confidencial. Puedes hablarme sobre cualquier cosa que esté en tu mente. ¿Cómo te sientes hoy?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      content: userMessage,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Generate bot response using LLM
      const response = await generateMentalHealthResponse(userMessage);
      
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        content: response,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu mensaje. Por favor, intenta de nuevo en unos momentos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-gradient-chat rounded-lg shadow-chat border border-border/50">
      <div className="p-4 border-b border-border/50 bg-card/50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-calm-green rounded-full animate-pulse"></div>
          <div>
            <h3 className="font-medium text-foreground">Chat con Freuda</h3>
            <p className="text-xs text-muted-foreground">Tu compañera de apoyo emocional</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-0" ref={scrollAreaRef}>
        <div className="space-y-0">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.content}
              isBot={message.isBot}
              timestamp={message.timestamp}
            />
          ))}
          {isLoading && (
            <div className="flex gap-3 p-4 bg-gradient-card">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-white">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">Freuda</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span>Escribiendo</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t border-border/50 bg-card/30">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            disabled={isLoading}
            className="flex-1 border-border/50 bg-background/50 focus:ring-primary"
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Enviar mensaje</span>
          </Button>
        </div>
      </form>
    </div>
  );
}