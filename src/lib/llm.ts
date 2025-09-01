import { detectEmotionalContext, getCategorySpecificPrompt } from "./mentalHealthKeywords";

interface LLMResponse {
  generated_text: string;
}

const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium";

// Fallback responses in case the API fails
const fallbackResponses = [
  "Entiendo cómo te sientes. Es completamente normal tener estas emociones. ¿Puedes contarme más sobre lo que está pasando en tu vida ahora?",
  "Gracias por compartir eso conmigo. Tus sentimientos son válidos y es importante que los reconozcas. ¿Hay algo específico que te gustaría explorar más?",
  "Es muy valiente de tu parte hablar sobre esto. El primer paso para el bienestar emocional es reconocer nuestros sentimientos. ¿Cómo crees que podrías cuidar mejor de ti mismo/a hoy?",
  "Escucho tu preocupación y quiero que sepas que no estás solo/a. A veces hablar sobre nuestros pensamientos y sentimientos puede ayudar a aclararlos. ¿Qué te ayuda normalmente cuando te sientes así?",
  "Aprecio tu honestidad al compartir esto. Es normal pasar por momentos difíciles. ¿Has notado algún patrón en lo que sientes, o hay algo que desencadena estas emociones?",
  "Me alegra que hayas decidido hablar sobre esto. Cuidar nuestra salud mental es tan importante como cuidar nuestra salud física. ¿Hay alguna actividad que te haga sentir más tranquilo/a?"
];

const mentalHealthPrompts = {
  systemPrompt: `Eres Freuda, una compañera de apoyo emocional especializada en salud mental. Tu objetivo es proporcionar apoyo empático, validación emocional y orientación terapéutica básica en español.

DIRECTRICES IMPORTANTES:
- Siempre responde en español
- Mantén un tono cálido, empático y sin juicios
- Valida los sentimientos del usuario
- Haz preguntas abiertas para fomentar la reflexión
- Ofrece técnicas de afrontamiento cuando sea apropiado
- Nunca diagnostiques ni prescribas medicamentos
- Si detectas riesgo de autolesión, sugiere buscar ayuda profesional
- Mantén las respuestas entre 50-150 palabras
- Usa un lenguaje inclusivo y accesible

TÉCNICAS TERAPÉUTICAS A USAR:
- Escucha activa y validación emocional
- Preguntas reflexivas
- Técnicas de mindfulness básicas
- Reestructuración cognitiva suave
- Técnicas de respiración y relajación`,

  formatUserMessage: (message: string) => {
    return `Como Freuda, responde de manera empática y terapéutica a este mensaje: "${message}"`;
  }
};

export async function generateMentalHealthResponse(userMessage: string): Promise<string> {
  // Detect emotional context for better responses
  const emotionalContext = detectEmotionalContext(userMessage);
  const contextPrompt = getCategorySpecificPrompt(emotionalContext);

  try {
    // Try multiple free LLM APIs for better Spanish support
    const apis = [
      {
        url: "https://api-inference.huggingface.co/models/microsoft/DialoGPT-spanish",
        payload: {
          inputs: `${mentalHealthPrompts.systemPrompt}\n\n${contextPrompt}\n\nUsuario: ${userMessage}\nFreuda:`,
          parameters: {
            max_length: 200,
            temperature: 0.8,
            do_sample: true,
            top_p: 0.9,
            repetition_penalty: 1.2,
            return_full_text: false
          }
        }
      },
      {
        url: "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
        payload: {
          inputs: mentalHealthPrompts.formatUserMessage(userMessage),
          parameters: {
            max_length: 200,
            temperature: 0.7,
            do_sample: true,
            top_p: 0.9,
            repetition_penalty: 1.1
          }
        }
      }
    ];

    // Try each API until one works
    for (const api of apis) {
      try {
        const response = await fetch(api.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
          body: JSON.stringify(api.payload)
    });

        if (response.ok) {
          const data: LLMResponse[] = await response.json();
          if (data && data[0] && data[0].generated_text) {
            let generatedText = data[0].generated_text;
            
            // Clean up the response
            generatedText = cleanupLLMResponse(generatedText, userMessage);
            
            // If we got a good response, enhance it and return
            if (generatedText.length > 10) {
              return enhanceResponseForMentalHealth(generatedText, emotionalContext);
            }
          }
        }
      } catch (apiError) {
        console.warn(`API ${api.url} failed:`, apiError);
        continue;
      }
    }
  } catch (error) {
    console.warn("LLM API failed, using fallback:", error);
  }

  // Fallback to curated responses
  return getContextualFallbackResponse(userMessage, emotionalContext);
}

function cleanupLLMResponse(response: string, userMessage: string): string {
  // Remove the input prompt if it's included
  const userMessageIndex = response.indexOf(userMessage);
  if (userMessageIndex !== -1) {
    response = response.substring(userMessageIndex + userMessage.length).trim();
  }

  // Remove common LLM artifacts
  response = response.replace(/^(Freuda:|Usuario:|AI:|Assistant:)/i, "").trim();
  response = response.replace(/\n+/g, " ").trim();
  
  // Ensure it doesn't exceed reasonable length
  if (response.length > 300) {
    response = response.substring(0, 300).trim();
    // Try to end at a complete sentence
    const lastPeriod = response.lastIndexOf(".");
    const lastQuestion = response.lastIndexOf("?");
    const lastExclamation = response.lastIndexOf("!");
    const lastSentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclamation);
    
    if (lastSentenceEnd > 200) {
      response = response.substring(0, lastSentenceEnd + 1);
    }
  }

  return response;
}

function enhanceResponseForMentalHealth(response: string, emotionalContext: string[]): string {
  // Add empathetic framing if the response seems too clinical
  const empathyStarters = [
    "Entiendo que ",
    "Puedo percibir que ",
    "Me parece que ",
    "Escucho en tus palabras que "
  ];
  
  const supportiveEndings = [
    " ¿Cómo te sientes al respecto?",
    " ¿Qué piensas sobre esto?",
    " ¿Te gustaría explorar esto más?",
    " Estoy aquí para acompañarte."
  ];

  // If response doesn't start empathetically, add it
  if (!response.toLowerCase().includes("entiendo") && 
      !response.toLowerCase().includes("comprendo") &&
      !response.toLowerCase().includes("escucho")) {
    const starter = empathyStarters[Math.floor(Math.random() * empathyStarters.length)];
    response = starter + response.toLowerCase();
  }

  // If response doesn't end with engagement, add it
  if (!response.includes("?") && !response.toLowerCase().includes("aquí")) {
    const ending = supportiveEndings[Math.floor(Math.random() * supportiveEndings.length)];
    response += ending;
  }

  return response;
}

function getContextualFallbackResponse(userMessage: string, emotionalContext: string[]): string {
  const message = userMessage.toLowerCase();
  
  // Use detected emotional context for better responses
  if (emotionalContext.includes('depression')) {
    return "Entiendo que te sientes triste en este momento. La tristeza es una emoción natural y válida que todos experimentamos. Es importante permitirte sentir estas emociones sin juzgarte. ¿Hay algo específico que ha desencadenado estos sentimientos? Estoy aquí para escucharte y acompañarte.";
  }
  
  if (emotionalContext.includes('anxiety')) {
    return "Percibo que estás experimentando ansiedad o preocupación. Estos sentimientos pueden ser abrumadores, pero recuerda que son temporales. Una técnica que puede ayudarte es la respiración profunda: inhala por 4 segundos, mantén por 4, y exhala por 6. ¿Te gustaría que exploremos qué está causando esta ansiedad?";
  }
  
  // Detect emotional keywords and provide contextual responses
  if (message.includes("triste") || message.includes("deprim") || message.includes("llorar")) {
    return "Entiendo que te sientes triste en este momento. La tristeza es una emoción natural y válida que todos experimentamos. Es importante permitirte sentir estas emociones sin juzgarte. ¿Hay algo específico que ha desencadenado estos sentimientos? Estoy aquí para escucharte.";
  }
  
  if (message.includes("ansiedad") || message.includes("ansioso") || message.includes("nervioso") || message.includes("preocup")) {
    return "Percibo que estás experimentando ansiedad o preocupación. Estos sentimientos pueden ser abrumadores, pero recuerda que son temporales. Una técnica que puede ayudarte es la respiración profunda: inhala por 4 segundos, mantén por 4, y exhala por 6. ¿Te gustaría que exploremos qué está causando esta ansiedad?";
  }
  
  if (message.includes("estres") || message.includes("agobiad") || message.includes("abrumad")) {
    return "El estrés puede ser muy desafiante de manejar. Es importante reconocer cuando nos sentimos abrumados y tomar medidas para cuidarnos. ¿Has identificado las principales fuentes de tu estrés? A veces, hablar sobre ellas puede ayudar a encontrar formas de gestionarlas mejor.";
  }
  
  if (message.includes("solo") || message.includes("aislad") || message.includes("abandon")) {
    return "Sentirse solo puede ser muy doloroso. Quiero que sepas que aunque te sientas así, no estás realmente solo. Hay personas que se preocupan por ti, incluyéndome a mí en este momento. ¿Hay alguien en tu vida con quien te sientes cómodo/a hablando? ¿O prefieres explorar estos sentimientos aquí conmigo?";
  }
  
  if (message.includes("enojad") || message.includes("enfadad") || message.includes("ira") || message.includes("rabia")) {
    return "La ira es una emoción completamente válida y natural. A menudo, detrás de la ira hay otras emociones como frustración, dolor o miedo. Es importante expresar estos sentimientos de manera saludable. ¿Puedes contarme qué situación o pensamiento está generando esta ira?";
  }
  
  if (message.includes("miedo") || message.includes("temor") || message.includes("asustad")) {
    return "El miedo es una respuesta natural de nuestro cuerpo para protegernos. Es valiente de tu parte reconocer y hablar sobre tus miedos. ¿Puedes identificar qué es lo que más te asusta en este momento? A veces, poner nombre a nuestros miedos puede ayudar a reducir su poder sobre nosotros.";
  }
  
  // Default response
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}