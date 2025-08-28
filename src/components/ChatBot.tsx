import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { useToast } from "@/hooks/use-toast";

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
      content: "¡Hola! Soy Freuda, tu compañera de apoyo emocional. Estoy aquí para escucharte y ayudarte a explorar tus sentimientos en un espacio seguro. ¿Cómo te sientes hoy?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simple mental health focused responses
    const responses = [
      "Entiendo cómo te sientes. Es completamente normal tener estas emociones. ¿Puedes contarme más sobre lo que está pasando en tu vida ahora?",
      "Gracias por compartir eso conmigo. Tus sentimientos son válidos y es importante que los reconozcas. ¿Hay algo específico que te gustaría explorar más?",
      "Es muy valiente de tu parte hablar sobre esto. El primer paso para el bienestar emocional es reconocer nuestros sentimientos. ¿Cómo crees que podrías cuidar mejor de ti mismo/a hoy?",
      "Escucho tu preocupación y quiero que sepas que no estás solo/a. A veces hablar sobre nuestros pensamientos y sentimientos puede ayudar a aclararlos. ¿Qué te ayuda normalmente cuando te sientes así?",
      "Aprecio tu honestidad al compartir esto. Es normal pasar por momentos difíciles. ¿Has notado algún patrón en lo que sientes, o hay algo que desencadena estas emociones?",
      "Me alegra que hayas decidido hablar sobre esto. Cuidar nuestra salud mental es tan importante como cuidar nuestra salud física. ¿Hay alguna actividad que te haga sentir más tranquilo/a?",
    ];

    // Add some delay to simulate thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

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
      // Generate bot response
      const response = await generateResponse(userMessage);
      
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
        description: "No pude procesar tu mensaje. Por favor, intenta de nuevo.",
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