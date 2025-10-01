import jsPDF from "jspdf"
import type { UserData, NutritionalNeeds } from "./nutrition-calculator"
import type { AIRecipe } from "./ai-recipe-generator"
import type { AIFitnessRecommendations } from "./ai-fitness-generator"
import { calculateBMI, getBMICategory } from "./nutrition-calculator"

const mealTimes: Record<string, string> = {
  breakfast: "07:00 - 08:00",
  "morning-snack": "09:00 - 10:00",
  lunch: "12:00 - 13:00",
  "afternoon-snack": "15:00 - 16:00",
  dinner: "19:00 - 20:00",
  snack: "15:00 - 16:00",
  supper: "21:00 - 22:00",
}

function getBMIColor(bmi: number): [number, number, number] {
  if (bmi < 25) return [0, 0, 0] // Black
  if (bmi < 30) return [234, 88, 12] // Orange
  return [220, 38, 38] // Red
}

export function generatePDFReport(
  userData: UserData,
  nutritionalNeeds: NutritionalNeeds,
  recipes: AIRecipe[],
  fitnessRecs: AIFitnessRecommendations,
) {
  const doc = new jsPDF()
  const bmi = calculateBMI(userData.weight, userData.height)
  const bmiCategory = getBMICategory(bmi)
  const bmiColor = getBMIColor(bmi)

  // Title
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("Relatório nutricional personalizado", 105, 20, { align: "center" })

  // Date
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 105, 28, { align: "center" })

  let yPos = 40

  // User Profile Section
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Perfil do usuário", 14, yPos)
  yPos += 8

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Idade: ${userData.age} anos`, 14, yPos)
  doc.text(`Sexo: ${userData.gender === "male" ? "Masculino" : "Feminino"}`, 80, yPos)
  yPos += 6
  doc.text(`Peso: ${userData.weight} kg`, 14, yPos)
  doc.text(`Altura: ${userData.height} cm`, 80, yPos)
  yPos += 6

  doc.setTextColor(...bmiColor)
  doc.text(`IMC: ${bmi} (${bmiCategory})`, 14, yPos)
  doc.setTextColor(0, 0, 0) // Reset to black
  yPos += 10

  // Nutritional Diagnosis Section
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Diagnóstico nutricional", 14, yPos)
  yPos += 8

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")

  doc.text(`Objetivo: ${getGoalText(userData.goal)}`, 14, yPos)
  yPos += 6
  doc.text(`TMB (Taxa Metabólica Basal): ${nutritionalNeeds.bmr} kcal/dia`, 14, yPos)
  yPos += 4
  doc.setFontSize(8)
  doc.setFont("helvetica", "italic")
  doc.text(`Calorias necessárias em repouso para funções vitais`, 18, yPos)
  yPos += 5

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`TDEE (Gasto Energético Total Diário): ${nutritionalNeeds.tdee} kcal/dia`, 14, yPos)
  yPos += 4
  doc.setFontSize(8)
  doc.setFont("helvetica", "italic")
  doc.text(`Total de calorias queimadas por dia incluindo atividades`, 18, yPos)
  yPos += 5

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Meta Calórica Diária: ${nutritionalNeeds.targetCalories} kcal/dia`, 14, yPos)
  yPos += 6

  if (nutritionalNeeds.calorieDeficitOrSurplus !== 0) {
    const deficitOrSurplus = nutritionalNeeds.calorieDeficitOrSurplus > 0 ? "Superávit" : "Déficit"
    doc.text(`${deficitOrSurplus} Calórico: ${Math.abs(nutritionalNeeds.calorieDeficitOrSurplus)} kcal/dia`, 14, yPos)
    yPos += 6
  }

  doc.text(`Proteínas: ${nutritionalNeeds.protein}g/dia`, 14, yPos)
  doc.text(`Carboidratos: ${nutritionalNeeds.carbs}g/dia`, 80, yPos)
  doc.text(`Gorduras: ${nutritionalNeeds.fats}g/dia`, 140, yPos)
  yPos += 10

  // Recommendation
  doc.setFont("helvetica", "italic")
  const splitRecommendation = doc.splitTextToSize(nutritionalNeeds.recommendation, 180)
  doc.text(splitRecommendation, 14, yPos)
  yPos += splitRecommendation.length * 5 + 10

  // Weekly Meal Plan
  if (yPos > 240) {
    doc.addPage()
    yPos = 20
  }

  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Cardápio semanal", 14, yPos)
  yPos += 8

  const mealsByDay = groupRecipesByDay(recipes)
  const daysOfWeek = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]

  daysOfWeek.forEach((day, index) => {
    const dayMeals = mealsByDay[index]
    if (!dayMeals || dayMeals.length === 0) return

    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(day, 14, yPos)
    yPos += 6

    dayMeals.forEach((recipe) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      const mealTime = mealTimes[recipe.category] || ""
      doc.text(`${getMealTypeText(recipe.category)} (${mealTime}): ${recipe.name}`, 18, yPos)
      yPos += 5

      doc.setFont("helvetica", "normal")
      doc.text(`${recipe.calories} kcal | P: ${recipe.protein}g | C: ${recipe.carbs}g | G: ${recipe.fats}g`, 18, yPos)
      yPos += 5

      const ingredients = doc.splitTextToSize(`Ingredientes: ${recipe.ingredients.join(", ")}`, 175)
      doc.text(ingredients, 18, yPos)
      yPos += ingredients.length * 4 + 3
    })

    yPos += 3
  })

  // Fitness Recommendations
  doc.addPage()
  yPos = 20

  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Recomendações de atividade física", 14, yPos)
  yPos += 10

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  const summaryText = getSummaryText(userData.goal)
  const splitSummary = doc.splitTextToSize(summaryText, 180)
  doc.text(splitSummary, 14, yPos)
  yPos += splitSummary.length * 5 + 8

  fitnessRecs.exercises.forEach((exercise) => {
    if (yPos > 260) {
      doc.addPage()
      yPos = 20
    }

    doc.setFont("helvetica", "bold")
    doc.text(`• ${exercise.name}`, 14, yPos)
    yPos += 5

    doc.setFont("helvetica", "normal")
    doc.text(`Tipo: ${exercise.type}`, 18, yPos)
    yPos += 5
    doc.text(`Duração: ${exercise.duration} minutos`, 18, yPos)
    yPos += 5
    doc.text(`Calorias queimadas: ~${exercise.caloriesBurned} kcal`, 18, yPos)
    yPos += 5

    const splitDescription = doc.splitTextToSize(exercise.description, 175)
    doc.text(splitDescription, 18, yPos)
    yPos += splitDescription.length * 4 + 6
  })

  // Hydration
  if (yPos > 240) {
    doc.addPage()
    yPos = 20
  }

  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Hidratação", 14, yPos)
  yPos += 8

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Meta diária de água: ${fitnessRecs.waterIntake} litros`, 14, yPos)
  yPos += 6

  const hydrationTips = `Beba água regularmente ao longo do dia, especialmente antes, durante e após exercícios. Mantenha uma garrafa de água sempre por perto e aumente a ingestão em dias quentes ou durante atividades físicas intensas.`
  const splitHydrationTips = doc.splitTextToSize(hydrationTips, 180)
  doc.text(splitHydrationTips, 14, yPos)

  // Footer
  doc.setFontSize(8)
  doc.setFont("helvetica", "italic")
  doc.text(
    "Os valores nutricionais são estimativas. Consulte um nutricionista para orientação personalizada.",
    105,
    285,
    { align: "center" },
  )

  // Save PDF
  doc.save(`relatorio-nutricional-${new Date().toISOString().split("T")[0]}.pdf`)
}

function groupRecipesByDay(recipes: AIRecipe[]): AIRecipe[][] {
  const days: AIRecipe[][] = [[], [], [], [], [], [], []]
  const mealsPerDay = Math.ceil(recipes.length / 7)

  recipes.forEach((recipe, index) => {
    const dayIndex = Math.floor(index / mealsPerDay)
    if (dayIndex < 7) {
      days[dayIndex].push(recipe)
    }
  })

  return days
}

function getMealTypeText(mealType: string): string {
  const types: Record<string, string> = {
    breakfast: "Café da manhã",
    "morning-snack": "Lanche da manhã",
    lunch: "Almoço",
    "afternoon-snack": "Lanche da tarde",
    dinner: "Jantar",
    snack: "Lanche",
    supper: "Ceia",
  }
  return types[mealType] || mealType
}

function getGoalText(goal: string): string {
  const goals: Record<string, string> = {
    "lose": "Perder peso",
    "gain": "Ganhar peso",
    "gain-muscle": "Ganhar massa muscular",
    maintain: "Manter peso",
  }
  return goals[goal] || goal
}

function getSummaryText(goal: string): string {
  const summaries: Record<string, string> = {
    "lose":
      "Para perder peso de forma saudável, combine exercícios cardiovasculares com treino de força. O cardio ajuda a queimar calorias, enquanto o treino de força preserva e constrói massa muscular, aumentando seu metabolismo.",
    "gain":
      "Para ganhar massa muscular, priorize exercícios de força e hipertrofia. Combine com exercícios cardiovasculares moderados para manter a saúde cardiovascular sem comprometer o ganho de massa.",
    maintain:
      "Para manter seu peso atual, mantenha um equilíbrio entre exercícios cardiovasculares e de força. Isso ajudará a preservar sua composição corporal e saúde geral.",
  }
  return (
    summaries[goal] || "Mantenha uma rotina regular de exercícios para alcançar seus objetivos de saúde e bem-estar."
  )
}
