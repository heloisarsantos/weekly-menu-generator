import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { AIRecipe } from "@/lib/ai-recipe-generator"
import { MealCard } from "./meal-card"

interface WeeklyMealPlanProps {
  recipes: AIRecipe[]
  targetCalories: number
}

const mealTimes: Record<string, string> = {
  breakfast: "07:00 - 08:00",
  "morning-snack": "10:00 - 10:30",
  lunch: "12:00 - 13:00",
  "afternoon-snack": "15:00 - 16:00",
  dinner: "19:00 - 20:00",
}

const mealLabels: Record<string, string> = {
  breakfast: "Café da manhã",
  "morning-snack": "Lanche da manhã",
  lunch: "Almoço",
  "afternoon-snack": "Lanche da tarde",
  dinner: "Jantar",
}

function organizeRecipesByWeek(recipes: AIRecipe[]) {
  const days = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"]

  const breakfasts = recipes.filter((r) => r.category === "breakfast")
  const morningSnacks = recipes.filter((r) => r.category === "morning-snack")
  const lunches = recipes.filter((r) => r.category === "lunch")
  const afternoonSnacks = recipes.filter((r) => r.category === "afternoon-snack")
  const dinners = recipes.filter((r) => r.category === "dinner")

  return days.map((day, index) => {
    const breakfast = breakfasts[index] || breakfasts[0]
    const morningSnack = morningSnacks[index] || morningSnacks[0]
    const lunch = lunches[index] || lunches[0]
    const afternoonSnack = afternoonSnacks[index] || afternoonSnacks[0]
    const dinner = dinners[index] || dinners[0]

    const totalCalories =
      breakfast.calories + morningSnack.calories + lunch.calories + afternoonSnack.calories + dinner.calories
    const totalProtein =
      breakfast.protein + morningSnack.protein + lunch.protein + afternoonSnack.protein + dinner.protein
    const totalCarbs = breakfast.carbs + morningSnack.carbs + lunch.carbs + afternoonSnack.carbs + dinner.carbs
    const totalFats = breakfast.fats + morningSnack.fats + lunch.fats + afternoonSnack.fats + dinner.fats
    const totalCost = breakfast.cost + morningSnack.cost + lunch.cost + afternoonSnack.cost + dinner.cost

    return {
      day,
      breakfast,
      morningSnack,
      lunch,
      afternoonSnack,
      dinner,
      totalCalories: Math.round(totalCalories),
      totalProtein: Math.round(totalProtein),
      totalCarbs: Math.round(totalCarbs),
      totalFats: Math.round(totalFats),
      totalCost,
    }
  })
}

export function WeeklyMealPlanDisplay({ recipes, targetCalories }: WeeklyMealPlanProps) {
  const weeklyPlan = organizeRecipesByWeek(recipes)

  const averageDailyCalories = Math.round(
    weeklyPlan.reduce((sum, day) => sum + day.totalCalories, 0) / weeklyPlan.length,
  )

  const weeklyTotalCost = weeklyPlan.reduce((sum, day) => sum + day.totalCost, 0)

  return (
    <div className="space-y-6">
      {/* Resumo Semanal */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do cardápio semanal</CardTitle>
          <CardDescription>Seu plano alimentar personalizado para os próximos 7 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Média diária</p>
              <p className="text-3xl font-bold">{averageDailyCalories}</p>
              <p className="text-xs text-muted-foreground">kcal/dia</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Meta diária</p>
              <p className="text-3xl font-bold">{targetCalories}</p>
              <p className="text-xs text-muted-foreground">kcal/dia</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Custo semanal</p>
              <p className="text-3xl font-bold text-green-600">R$ {weeklyTotalCost.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">~R$ {(weeklyTotalCost / 7).toFixed(2)}/dia</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cardápio por Dia */}
      <Card>
        <CardHeader>
          <CardTitle>Cardápio detalhado</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="0" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              {weeklyPlan.map((day, index) => (
                <TabsTrigger key={index} value={index.toString()} className="text-xs">
                  {day.day.substring(0, 3)}
                </TabsTrigger>
              ))}
            </TabsList>

            {weeklyPlan.map((day, dayIndex) => (
              <TabsContent key={dayIndex} value={dayIndex.toString()} className="space-y-6 mt-6">
                {/* Cabeçalho do Dia */}
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <h3 className="text-2xl font-bold">{day.day}</h3>
                    <p className="text-sm text-muted-foreground">
                      Total: {day.totalCalories} kcal | Custo: R$ {day.totalCost.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-2 flex-wrap justify-end">
                      <Badge variant="secondary">P: {day.totalProtein}g</Badge>
                      <Badge variant="secondary">C: {day.totalCarbs}g</Badge>
                      <Badge variant="secondary">G: {day.totalFats}g</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <MealCard recipe={day.breakfast} mealType="breakfast" mealTime={mealTimes.breakfast} />
                  <MealCard recipe={day.morningSnack} mealType="morning-snack" mealTime={mealTimes["morning-snack"]} />
                  <MealCard recipe={day.lunch} mealType="lunch" mealTime={mealTimes.lunch} />
                  <MealCard
                    recipe={day.afternoonSnack}
                    mealType="afternoon-snack"
                    mealTime={mealTimes["afternoon-snack"]}
                  />
                  <MealCard recipe={day.dinner} mealType="dinner" mealTime={mealTimes.dinner} />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
