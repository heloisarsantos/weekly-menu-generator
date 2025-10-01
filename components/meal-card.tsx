import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import type { Recipe } from "@/lib/recipes-data"
import type { AIRecipe } from "@/lib/ai-recipe-generator"

interface MealCardProps {
  recipe: Recipe | AIRecipe
  mealType: string
  mealTime?: string
}

const mealTypeLabels: Record<string, string> = {
  breakfast: "Café da Manhã",
  "morning-snack": "Lanche da Manhã",
  lunch: "Almoço",
  "afternoon-snack": "Lanche da Tarde",
  dinner: "Jantar",
  snack: "Lanche",
}

export function MealCard({ recipe, mealType, mealTime }: MealCardProps) {
  if (!recipe) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Receita não disponível</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  const calories = recipe.calories || 0
  const protein = recipe.protein || 0
  const carbs = recipe.carbs || 0
  const fats = recipe.fats || 0
  const fiber = recipe.fiber || 0
  const cost = recipe.cost || 0
  const ingredients = recipe.ingredients || []
  const preparation = recipe.preparation || ""

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <Badge variant="outline" className="mb-2">
              {mealTypeLabels[mealType] || mealType}
            </Badge>
            {mealTime && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <Clock className="h-3 w-3" />
                <span>{mealTime}</span>
              </div>
            )}
            <CardTitle className="text-lg">{recipe.name}</CardTitle>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{calories}</p>
            <p className="text-xs text-muted-foreground">kcal</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Macronutrientes */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-muted rounded">
            <p className="text-xs text-muted-foreground">Proteína</p>
            <p className="font-semibold">{protein}g</p>
          </div>
          <div className="p-2 bg-muted rounded">
            <p className="text-xs text-muted-foreground">Carbo</p>
            <p className="font-semibold">{carbs}g</p>
          </div>
          <div className="p-2 bg-muted rounded">
            <p className="text-xs text-muted-foreground">Gordura</p>
            <p className="font-semibold">{fats}g</p>
          </div>
          <div className="p-2 bg-muted rounded">
            <p className="text-xs text-muted-foreground">Fibra</p>
            <p className="font-semibold">{fiber}g</p>
          </div>
        </div>

        {/* Ingredientes */}
        <div>
          <p className="text-sm font-medium mb-2">Ingredientes:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Preparo */}
        <div>
          <p className="text-sm font-medium mb-2">Modo de preparo:</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{preparation}</p>
        </div>

        {/* Custo */}
        <div className="pt-3 border-t flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Custo estimado:</span>
          <span className="text-lg font-semibold text-green-600">R$ {cost.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
