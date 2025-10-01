"use server"

import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export type AIExerciseRecommendation = {
  name: string
  type: string
  intensity: "low" | "moderate" | "high"
  caloriesPerHour: number
  duration: number
  caloriesBurned: number
  description: string
  tips: string[]
}

export type AIFitnessRecommendations = {
  waterIntake: number
  exercises: AIExerciseRecommendation[]
}

export async function generateFitnessRecommendations(
  weight: number,
  height: number,
  age: number,
  gender: "male" | "female",
  activityLevel: string,
  goal: "lose" | "maintain" | "gain",
  calorieDeficitOrSurplus: number,
) {
  const goalText = {
    lose: "perder peso",
    maintain: "manter peso",
    gain: "ganhar massa muscular",
  }

  const activityLevelText = {
    sedentary: "sedentário",
    light: "levemente ativo",
    moderate: "moderadamente ativo",
    active: "muito ativo",
    veryActive: "extremamente ativo",
  }

  const prompt = `Você é um personal trainer e nutricionista. Crie recomendações personalizadas de exercícios e hidratação.

DADOS DO USUÁRIO:
- Peso: ${weight} kg
- Altura: ${height} cm
- Idade: ${age} anos
- Sexo: ${gender === "male" ? "masculino" : "feminino"}
- Nível de atividade: ${activityLevelText[activityLevel as keyof typeof activityLevelText]}
- Objetivo: ${goalText[goal]}
- ${goal === "lose" ? `Deficit calórico diário: ${Math.abs(calorieDeficitOrSurplus)} kcal` : goal === "gain" ? `Superavit calórico diário: ${calorieDeficitOrSurplus} kcal` : "Manutenção de peso"}

INSTRUÇÕES:

1. HIDRATAÇÃO:
   - Calcule a quantidade de água recomendada em litros por dia
   - Base: 35ml por kg de peso corporal
   - Ajuste para nível de atividade física
   - Retorne apenas o número em litros (ex: 2.5)

2. EXERCÍCIOS (crie exatamente 5 recomendações):
   - Varie as intensidades (low, moderate, high)
   - Inclua exercícios acessíveis que podem ser feitos em casa ou academia
   - Para cada exercício, forneça:
     * name: nome do exercício em português
     * type: tipo (cardio, força, flexibilidade, etc)
     * intensity: "low", "moderate" ou "high"
     * caloriesPerHour: calorias queimadas por hora
     * duration: duração recomendada em minutos
     * caloriesBurned: total de calorias queimadas na sessão
     * description: descrição breve de como fazer
     * tips: array com 2-3 dicas importantes

3. CONSIDERAÇÕES:
   - ${goal === "lose" ? "Priorize exercícios que queimem mais calorias (cardio + força)" : ""}
   - ${goal === "gain" ? "Priorize exercícios de força e hipertrofia" : ""}
   - ${goal === "maintain" ? "Balance entre cardio e força para manutenção" : ""}
   - Adapte a intensidade ao nível de atividade atual
   - Sugira exercícios realistas e sustentáveis

Exemplos de exercícios: caminhada, corrida, ciclismo, natação, musculação, HIIT, yoga, pilates, dança, pular corda, etc.

IMPORTANTE: Retorne APENAS um JSON válido no formato:
{
  "waterIntake": 2.5,
  "exercises": [
    {
      "name": "Caminhada Rápida",
      "type": "cardio",
      "intensity": "moderate",
      "caloriesPerHour": 300,
      "duration": 45,
      "caloriesBurned": 225,
      "description": "Caminhe em ritmo acelerado mantendo a postura ereta",
      "tips": ["Use tênis adequado", "Mantenha os braços em movimento", "Hidrate-se durante"]
    }
  ]
}

Não adicione texto antes ou depois do JSON. Apenas o JSON puro.`

  try {
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
    })

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Resposta da IA não contém JSON válido")
    }

    const parsed = JSON.parse(jsonMatch[0])
    return parsed as AIFitnessRecommendations
  } catch (error) {
    console.error("[v0] Error generating fitness recommendations:", error)
    throw new Error("Erro ao gerar recomendações de exercícios com IA. Tente novamente.")
  }
}
