import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { NutritionalNeeds } from "@/lib/nutrition-calculator"
import { calculateBMI, getBMICategory } from "@/lib/nutrition-calculator"

interface NutritionalSummaryProps {
  needs: NutritionalNeeds
  weight: number
  height: number
}

function getBMIColor(bmi: number): string {
  if (bmi < 25) return "text-foreground"
  if (bmi < 30) return "text-orange-600"
  return "text-red-600"
}

export function NutritionalSummary({ needs, weight, height }: NutritionalSummaryProps) {
  const bmi = calculateBMI(weight, height)
  const bmiCategory = getBMICategory(bmi)
  const bmiColor = getBMIColor(bmi)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seu perfil nutricional</CardTitle>
        <CardDescription>{needs.recommendation}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">IMC</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold mb-1">Índice de Massa Corporal</p>
                    <p className="text-xs">
                      Medida que relaciona peso e altura para avaliar se você está no peso ideal. Calculado como: peso
                      (kg) ÷ altura² (m).
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className={`text-2xl font-bold ${bmiColor}`}>{bmi}</p>
            <Badge variant="secondary" className="text-xs">
              {bmiCategory}
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">TMB</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold mb-1">Taxa Metabólica Basal</p>
                    <p className="text-xs">
                      Quantidade mínima de calorias que seu corpo precisa em repouso para manter funções vitais como
                      respiração, circulação e temperatura corporal.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-2xl font-bold">{needs.bmr}</p>
            <p className="text-xs text-muted-foreground">kcal/dia</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground">TDEE</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold mb-1">Gasto Energético Total Diário</p>
                    <p className="text-xs">
                      Total de calorias que você queima por dia, incluindo atividades físicas e exercícios. É a TMB
                      multiplicada pelo seu nível de atividade.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-2xl font-bold">{needs.tdee}</p>
            <p className="text-xs text-muted-foreground">kcal/dia</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Meta Diária</p>
            <p className="text-2xl font-bold">{needs.targetCalories}</p>
            <p className="text-xs text-muted-foreground">kcal/dia</p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm font-medium mb-3">Distribuição de macronutrientes</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Proteínas</p>
              <p className="text-xl font-bold">{needs.protein}g</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Carboidratos</p>
              <p className="text-xl font-bold">{needs.carbs}g</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Gorduras</p>
              <p className="text-xl font-bold">{needs.fats}g</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
