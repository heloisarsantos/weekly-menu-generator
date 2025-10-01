import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AIFitnessRecommendations } from "@/lib/ai-fitness-generator"
import { Droplets, Flame, Clock, Zap } from "lucide-react"

interface FitnessRecommendationsProps {
  recommendations: AIFitnessRecommendations
}

const intensityColors = {
  low: "bg-green-500/10 text-green-700 dark:text-green-400",
  moderate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  high: "bg-red-500/10 text-red-700 dark:text-red-400",
}

const intensityLabels = {
  low: "Baixa",
  moderate: "Moderada",
  high: "Alta",
}

export function FitnessRecommendations({ recommendations }: FitnessRecommendationsProps) {
  return (
    <div className="space-y-6">
      {/* Water Recommendation */}
      <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle>Hidratação diária</CardTitle>
          </div>
          <CardDescription>Mantenha-se hidratado para melhor desempenho</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">{recommendations.waterIntake}L</span>
            <span className="text-muted-foreground">por dia</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Aproximadamente {Math.round((recommendations.waterIntake * 1000) / 250)} copos de 250ml
          </p>
        </CardContent>
      </Card>

      {/* Exercise Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <CardTitle>Atividades físicas recomendadas</CardTitle>
          </div>
          <CardDescription>Exercícios personalizados gerados por IA para seus objetivos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.exercises.map((exercise, index) => (
              <div key={index} className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-semibold">{exercise.name}</h4>
                      <Badge variant="outline" className={intensityColors[exercise.intensity]}>
                        {intensityLabels[exercise.intensity]}
                      </Badge>
                      <Badge variant="secondary">{exercise.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{exercise.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{exercise.duration} min</p>
                      <p className="text-xs text-muted-foreground">Duração</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <div>
                      <p className="font-medium">{exercise.caloriesBurned} kcal</p>
                      <p className="text-xs text-muted-foreground">Por sessão</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{exercise.caloriesPerHour} kcal/h</p>
                      <p className="text-xs text-muted-foreground">Intensidade</p>
                    </div>
                  </div>
                </div>

                {exercise.tips && exercise.tips.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Dicas:</p>
                    <ul className="text-sm space-y-1">
                      {exercise.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="text-muted-foreground">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">
              <strong>Dica:</strong> Comece devagar e aumente a intensidade gradualmente. Consulte um profissional de
              educação física para orientação personalizada.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
