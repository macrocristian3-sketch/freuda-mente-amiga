import { ChatBot } from "@/components/ChatBot";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Heart, Brain, MessageCircle, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-chat">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center shadow-soft">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Freuda</h1>
                <p className="text-xs text-muted-foreground">Tu compañera de salud mental</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12 animate-fade-in">
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 shadow-chat">
              <Brain className="h-10 w-10 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Bienvenido a tu espacio de
              <span className="bg-gradient-hero bg-clip-text text-transparent"> bienestar mental</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Freuda es tu compañera digital de apoyo emocional. Un lugar seguro donde puedes 
              expresar tus sentimientos, explorar tus emociones y encontrar claridad en tus pensamientos.
            </p>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 animate-slide-up">
              <div className="bg-gradient-card p-6 rounded-lg shadow-soft border border-border/50">
                <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Conversación Empática</h3>
                <p className="text-sm text-muted-foreground">
                  Comparte tus pensamientos en un ambiente libre de juicios
                </p>
              </div>
              
              <div className="bg-gradient-card p-6 rounded-lg shadow-soft border border-border/50">
                <Shield className="h-8 w-8 text-calm-green mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Espacio Seguro</h3>
                <p className="text-sm text-muted-foreground">
                  Tu privacidad y bienestar son nuestra prioridad
                </p>
              </div>
              
              <div className="bg-gradient-card p-6 rounded-lg shadow-soft border border-border/50">
                <Heart className="h-8 w-8 text-therapy-blue mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Apoyo Continuo</h3>
                <p className="text-sm text-muted-foreground">
                  Disponible cuando necesites hablar o reflexionar
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Chat Section */}
        <section className="max-w-4xl mx-auto animate-slide-up">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              Comienza tu conversación
            </h3>
            <p className="text-muted-foreground">
              Freuda está aquí para escucharte. No hay preguntas incorrectas ni sentimientos inválidos.
            </p>
          </div>
          
          <ChatBot />
          
          <div className="mt-6 p-4 bg-warm-beige/50 rounded-lg border border-border/30">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Nota importante:</strong> Freuda es una herramienta de apoyo emocional y no reemplaza 
              la atención de un profesional de la salud mental. Si experimentas pensamientos de autolesión 
              o crisis emocionales graves, por favor busca ayuda profesional inmediata.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Freuda</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Cuidando tu bienestar emocional con empatía y comprensión
            </p>
            <p className="text-xs text-muted-foreground">
              Desarrollado con ❤️ para tu salud mental
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;