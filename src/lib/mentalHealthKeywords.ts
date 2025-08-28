// Mental health keywords and phrases for better contextual understanding
export const mentalHealthKeywords = {
  depression: [
    "depresión", "deprimido", "deprimida", "triste", "tristeza", "melancolía",
    "sin energía", "sin ganas", "vacío", "desesperanza", "sin sentido"
  ],
  anxiety: [
    "ansiedad", "ansioso", "ansiosa", "nervioso", "nerviosa", "preocupación",
    "pánico", "miedo", "temor", "inquietud", "agitación", "tensión"
  ],
  stress: [
    "estrés", "estresado", "estresada", "agobiado", "agobiada", "abrumado",
    "abrumada", "presión", "sobrecargado", "sobrecargada"
  ],
  loneliness: [
    "solo", "sola", "soledad", "aislado", "aislada", "abandonado", "abandonada",
    "incomprendido", "incomprendida", "desconectado", "desconectada"
  ],
  anger: [
    "enojado", "enojada", "enfadado", "enfadada", "ira", "rabia", "furioso",
    "furiosa", "molesto", "molesta", "irritado", "irritada"
  ],
  fear: [
    "miedo", "temor", "asustado", "asustada", "terror", "pánico", "fobia",
    "inseguridad", "vulnerabilidad"
  ],
  selfEsteem: [
    "autoestima", "inseguro", "insegura", "no valgo", "inútil", "fracaso",
    "no sirvo", "no soy suficiente", "me odio"
  ],
  relationships: [
    "relación", "pareja", "familia", "amigos", "conflicto", "ruptura",
    "divorcio", "problemas familiares", "soledad social"
  ],
  work: [
    "trabajo", "laboral", "jefe", "compañeros", "burnout", "agotamiento",
    "presión laboral", "desempleo", "estrés laboral"
  ],
  sleep: [
    "sueño", "insomnio", "no puedo dormir", "pesadillas", "cansado",
    "cansada", "agotado", "agotada", "fatiga"
  ]
};

export function detectEmotionalContext(message: string): string[] {
  const lowerMessage = message.toLowerCase();
  const detectedCategories: string[] = [];

  Object.entries(mentalHealthKeywords).forEach(([category, keywords]) => {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      detectedCategories.push(category);
    }
  });

  return detectedCategories;
}

export function getCategorySpecificPrompt(categories: string[]): string {
  const prompts: Record<string, string> = {
    depression: "El usuario parece estar experimentando síntomas depresivos. Responde con validación emocional, normalización de estos sentimientos, y sugiere técnicas de autocuidado suaves.",
    anxiety: "El usuario muestra signos de ansiedad. Ofrece técnicas de respiración, grounding, y validación de sus preocupaciones.",
    stress: "El usuario está experimentando estrés. Ayuda a identificar fuentes de estrés y ofrece estrategias de manejo.",
    loneliness: "El usuario se siente solo. Valida estos sentimientos y explora conexiones sociales y formas de reducir el aislamiento.",
    anger: "El usuario está experimentando ira. Ayuda a explorar las emociones subyacentes y ofrece técnicas de manejo de la ira.",
    fear: "El usuario tiene miedos o temores. Valida estos sentimientos y ayuda a explorar formas de afrontar los miedos.",
    selfEsteem: "El usuario tiene problemas de autoestima. Ofrece validación, desafía pensamientos negativos suavemente, y fomenta la autocompasión.",
    relationships: "El usuario tiene problemas relacionales. Explora la situación y ofrece perspectivas sobre comunicación y límites saludables.",
    work: "El usuario tiene estrés laboral. Ayuda a explorar estrategias de manejo del estrés laboral y equilibrio vida-trabajo.",
    sleep: "El usuario tiene problemas de sueño. Ofrece técnicas de higiene del sueño y relajación."
  };

  if (categories.length === 0) {
    return "Responde de manera empática y abierta, invitando al usuario a compartir más sobre sus sentimientos.";
  }

  return categories.map(cat => prompts[cat] || "").join(" ");
}