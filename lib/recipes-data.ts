export interface Recipe {
  id: string
  name: string
  category: "breakfast" | "lunch" | "dinner" | "snack"
  calories: number
  protein: number // gramas
  carbs: number // gramas
  fats: number // gramas
  fiber: number // gramas
  ingredients: string[]
  preparation: string
  cost: number // custo estimado em reais
}
