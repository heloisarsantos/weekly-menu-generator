export interface UserData {
  age: number
  gender: "male" | "female"
  weight: number // kg
  height: number // cm
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very-active"
  goal: "lose" | "maintain" | "gain"
}

export interface NutritionalNeeds {
  bmr: number // Taxa Metabólica Basal
  tdee: number // Total Daily Energy Expenditure
  targetCalories: number
  protein: number // gramas
  carbs: number // gramas
  fats: number // gramas
  recommendation: string
  calorieDeficitOrSurplus: number
}

// Cálculo da Taxa Metabólica Basal usando a fórmula de Mifflin-St Jeor
export function calculateBMR(userData: UserData): number {
  const { weight, height, age, gender } = userData

  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161
  }
}

// Multiplicadores de atividade física
const activityMultipliers = {
  sedentary: 1.2, // Pouco ou nenhum exercício
  light: 1.375, // Exercício leve 1-3 dias/semana
  moderate: 1.55, // Exercício moderado 3-5 dias/semana
  active: 1.725, // Exercício intenso 6-7 dias/semana
  "very-active": 1.9, // Exercício muito intenso, trabalho físico
}

// Cálculo do TDEE (gasto calórico diário total)
export function calculateTDEE(bmr: number, activityLevel: UserData["activityLevel"]): number {
  return Math.round(bmr * activityMultipliers[activityLevel])
}

// Cálculo das necessidades nutricionais completas
export function calculateNutritionalNeeds(userData: UserData): NutritionalNeeds {
  const bmr = calculateBMR(userData)
  const tdee = calculateTDEE(bmr, userData.activityLevel)

  let targetCalories: number
  let recommendation: string

  // Ajuste calórico baseado no objetivo
  switch (userData.goal) {
    case "lose":
      targetCalories = Math.round(tdee - 500) // Deficit de 500 calorias
      recommendation = "Deficit calórico para perda de peso saudável (0,5kg por semana)"
      break
    case "gain":
      targetCalories = Math.round(tdee + 300) // Superavit de 300 calorias
      recommendation = "Superavit calórico para ganho de massa muscular"
      break
    case "maintain":
    default:
      targetCalories = tdee
      recommendation = "Manutenção do peso atual"
      break
  }

  // Cálculo de macronutrientes
  // Proteína: 2g por kg de peso corporal (importante para massa muscular)
  const protein = Math.round(userData.weight * 2)

  // Gordura: 25% das calorias totais
  const fats = Math.round((targetCalories * 0.25) / 9) // 9 calorias por grama de gordura

  // Carboidratos: restante das calorias
  const proteinCalories = protein * 4 // 4 calorias por grama de proteína
  const fatCalories = fats * 9
  const carbCalories = targetCalories - proteinCalories - fatCalories
  const carbs = Math.round(carbCalories / 4) // 4 calorias por grama de carboidrato

  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    protein,
    carbs,
    fats,
    recommendation, 
    calorieDeficitOrSurplus: targetCalories - tdee
  }
}

// Função auxiliar para calcular IMC
export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
}

// Classificação do IMC
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Abaixo do peso"
  if (bmi < 25) return "Peso normal"
  if (bmi < 30) return "Sobrepeso"
  return "Obesidade"
}
