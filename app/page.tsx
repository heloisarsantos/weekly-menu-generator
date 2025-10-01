"use client";

import { useState } from "react";
import { UserDataForm } from "@/components/user-data-form";
import { NutritionalSummary } from "@/components/nutritional-summary";
import { WeeklyMealPlanDisplay } from "@/components/weekly-meal-plan";
import { FitnessRecommendations } from "@/components/fitness-recommendations";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Download } from "lucide-react";
import type { UserData, NutritionalNeeds } from "@/lib/nutrition-calculator";
import { calculateNutritionalNeeds } from "@/lib/nutrition-calculator";
import { generateWeeklyMealPlan } from "@/lib/ai-recipe-generator";
import { generateFitnessRecommendations } from "@/lib/ai-fitness-generator";
import { generatePDFReport } from "@/lib/pdf-generator";
import type { AIRecipe } from "@/lib/ai-recipe-generator";
import type { AIFitnessRecommendations } from "@/lib/ai-fitness-generator";
import packageJson from "../package.json";

export default function Home() {
  const [step, setStep] = useState<"form" | "loading" | "results">("form");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [nutritionalNeeds, setNutritionalNeeds] =
    useState<NutritionalNeeds | null>(null);
  const [recipes, setRecipes] = useState<AIRecipe[] | null>(null);
  const [fitnessRecs, setFitnessRecs] =
    useState<AIFitnessRecommendations | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: UserData) => {
    setUserData(data);
    setError(null);
    setStep("loading");

    try {
      // Calculate nutritional needs
      const needs = calculateNutritionalNeeds(data);
      setNutritionalNeeds(needs);

      // Generate meal plan and fitness recommendations in parallel
      const [generatedRecipes, generatedFitness] = await Promise.all([
        generateWeeklyMealPlan(
          needs.targetCalories,
          needs.protein,
          needs.carbs,
          needs.fats,
          data.goal
        ),
        generateFitnessRecommendations(
          data.weight,
          data.height,
          data.age,
          data.gender,
          data.activityLevel,
          data.goal,
          needs.calorieDeficitOrSurplus
        ),
      ]);

      setRecipes(generatedRecipes);
      setFitnessRecs(generatedFitness);
      setStep("results");
    } catch (err) {
      console.error("[v0] Error generating recommendations:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao gerar recomendações. Tente novamente."
      );
      setStep("form");
    }
  };

  const handleReset = () => {
    setStep("form");
    setUserData(null);
    setNutritionalNeeds(null);
    setRecipes(null);
    setFitnessRecs(null);
    setError(null);
  };

  const handleDownloadPDF = () => {
    if (userData && nutritionalNeeds && recipes && fitnessRecs) {
      generatePDFReport(userData, nutritionalNeeds, recipes, fitnessRecs);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h1 className="text-xl md:text-3xl font-bold leading-tight text-balance">
                Gerar Cardápio Personalizado com IA | Weekly Menu Generator
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-0.5 md:mt-1">
                Cardápios semanais adaptados às suas necessidades nutricionais
                com IA
              </p>
            </div>

            {step === "results" && (
              <div className="flex flex-col gap-2 w-full md:w-auto md:flex-row md:gap-2">
                <Button
                  onClick={handleDownloadPDF}
                  variant="default"
                  className="w-full md:w-auto"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar relatório completo
                </Button>

                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full md:w-auto"
                >
                  Novo cardápio
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {step === "form" && (
          <div className="max-w-2xl mx-auto">
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive">
                <p className="font-medium">Erro</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}
            <UserDataForm onSubmit={handleFormSubmit} />
          </div>
        )}

        {step === "loading" && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-6 text-primary" />
            <h2 className="text-2xl font-bold mb-2">
              Gerando seu cardápio personalizado...
            </h2>
            <p className="text-muted-foreground mb-4">
              Nossa IA está criando receitas brasileiras e recomendações de
              exercícios especialmente para você.
            </p>
            <p className="text-sm text-muted-foreground">
              Isso pode levar alguns segundos.
            </p>
          </div>
        )}

        {step === "results" &&
          userData &&
          nutritionalNeeds &&
          recipes &&
          fitnessRecs && (
            <div className="space-y-8">
              <NutritionalSummary
                needs={nutritionalNeeds}
                weight={userData.weight}
                height={userData.height}
              />

              <Tabs defaultValue="meal-plan" className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                  <TabsTrigger value="meal-plan">Cardápio semanal</TabsTrigger>
                  <TabsTrigger value="fitness">
                    Exercícios e hidratação
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="meal-plan" className="mt-6">
                  <WeeklyMealPlanDisplay
                    recipes={recipes}
                    targetCalories={nutritionalNeeds.targetCalories}
                  />
                </TabsContent>

                <TabsContent value="fitness" className="mt-6">
                  <FitnessRecommendations recommendations={fitnessRecs} />
                </TabsContent>
              </Tabs>
            </div>
          )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Cardápios com receitas fáceis e acessíveis gerados por IA</p>
          <p className="mt-2">
            Os valores nutricionais são estimativas. Consulte um nutricionista
            para orientação personalizada.
          </p>
          <p className="mt-2 text-xs">Versão {packageJson.version}</p>
        </div>
      </footer>
    </div>
  );
}
