"use server"

import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export type AIRecipe = {
  id: string
  name: string
  category: "breakfast" | "morning-snack" | "lunch" | "afternoon-snack" | "dinner"
  calories: number
  protein: number
  carbs: number
  fats: number
  fiber: number
  ingredients: string[]
  preparation: string
  cost: number
}

export async function generateWeeklyMealPlan(
  targetCalories: number,
  protein: number,
  carbs: number,
  fats: number,
  goal: "lose" | "maintain" | "gain",
) {
  const goalText = {
    lose: "perder peso (deficit calórico)",
    maintain: "manter peso",
    gain: "ganhar peso (superavit calórico)",
  }

  const prompt = `Você é um nutricionista especializado em culinária brasileira. Crie um cardápio semanal (7 dias) com receitas típicas brasileiras, acessíveis e nutritivas.

REQUISITOS NUTRICIONAIS:
- Meta calórica diária: ${targetCalories} kcal
- Proteínas: ${protein}g por dia
- Carboidratos: ${carbs}g por dia
- Gorduras: ${fats}g por dia
- Objetivo: ${goalText[goal]}

INSTRUÇÕES:
1. Crie 35 receitas no total (5 refeições por dia × 7 dias):
   - 7 cafés da manhã (breakfast)
   - 7 lanches da manhã (morning-snack)
   - 7 almoços (lunch)
   - 7 lanches da tarde (afternoon-snack)
   - 7 jantares (dinner)

2. Use APENAS pratos típicos brasileiros e acessíveis como:
   - Café da manhã: pão com ovo, tapioca, mingau de aveia, cuscuz, frutas com granola
   - Lanche da manhã: frutas, iogurte, castanhas, vitaminas, pão integral
   - Almoço/Jantar: arroz com feijão, frango grelhado, peixe assado, carne moída, macarrão, saladas
   - Lanche da tarde: frutas, iogurte, sanduíche natural, vitaminas, biscoitos integrais

3. Cada receita deve ter:
   - id: string único (ex: "breakfast-1", "morning-snack-1", "lunch-1")
   - name: nome descritivo em português
   - category: "breakfast", "morning-snack", "lunch", "afternoon-snack" ou "dinner"
   - calories: número de calorias (número inteiro)
   - protein: gramas de proteína (número inteiro)
   - carbs: gramas de carboidratos (número inteiro)
   - fats: gramas de gordura (número inteiro)
   - fiber: gramas de fibra (número inteiro, entre 2 e 15)
   - ingredients: array de strings com ingredientes
   - preparation: string com modo de preparo (1-2 frases curtas)
   - cost: custo em reais (número decimal entre 2.5 e 15.0)

4. Distribua as calorias aproximadamente assim:
   - Café da manhã: 25% das calorias diárias
   - Lanche da manhã: 10% das calorias diárias
   - Almoço: 30% das calorias diárias
   - Lanche da tarde: 10% das calorias diárias
   - Jantar: 25% das calorias diárias

5. Varie as receitas para não repetir pratos durante a semana.

IMPORTANTE: Retorne APENAS um JSON válido no formato:
{
  "recipes": [
    {
      "id": "breakfast-1",
      "name": "Tapioca com Ovo",
      "category": "breakfast",
      "calories": 350,
      "protein": 15,
      "carbs": 45,
      "fats": 12,
      "fiber": 3,
      "ingredients": ["2 colheres de goma de tapioca", "2 ovos", "sal a gosto"],
      "preparation": "Aqueça a frigideira, espalhe a tapioca e adicione o ovo. Dobre e sirva.",
      "cost": 5.0
    }
  ]
}

Não adicione texto antes ou depois do JSON. Apenas o JSON puro.`

  try {
    console.log("[v0] Generating meal plan with Groq...")

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
      maxOutputTokens: 8000,
    })

    console.log("[v0] Received response from Groq")

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error("[v0] No JSON found in response:", text.substring(0, 200))
      throw new Error("Resposta da IA não contém JSON válido")
    }

    const parsed = JSON.parse(jsonMatch[0])

    if (!parsed.recipes || !Array.isArray(parsed.recipes)) {
      throw new Error("Formato de resposta inválido")
    }

    // Ensure all recipes have required fields with defaults
    const validatedRecipes = parsed.recipes.map((recipe: any, index: number) => ({
      id: recipe.id || `recipe-${index}`,
      name: recipe.name || "Receita sem nome",
      category: recipe.category || "afternoon-snack",
      calories: Number(recipe.calories) || 300,
      protein: Number(recipe.protein) || 15,
      carbs: Number(recipe.carbs) || 40,
      fats: Number(recipe.fats) || 10,
      fiber: Number(recipe.fiber) || 3,
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : ["Ingredientes não disponíveis"],
      preparation: recipe.preparation || recipe.instructions?.join(" ") || "Modo de preparo não disponível",
      cost: Number(recipe.cost) || Number(recipe.estimatedCost) || 5.0,
    }))

    console.log("[v0] Successfully generated", validatedRecipes.length, "recipes")

    return validatedRecipes as AIRecipe[]
  } catch (error) {
    console.error("[v0] Error generating meal plan:", error)
    throw new Error("Erro ao gerar cardápio com IA. Tente novamente.")
  }
}
