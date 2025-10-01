"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserData } from "@/lib/nutrition-calculator"

interface UserDataFormProps {
  onSubmit: (data: UserData) => void
}

export function UserDataForm({ onSubmit }: UserDataFormProps) {
  const [formData, setFormData] = useState<Partial<UserData>>({
    gender: "male",
    activityLevel: "moderate",
    goal: "maintain",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      formData.age &&
      formData.weight &&
      formData.height &&
      formData.gender &&
      formData.activityLevel &&
      formData.goal
    ) {
      onSubmit(formData as UserData)
    }
  }

  const updateField = (field: keyof UserData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Seus dados pessoais</CardTitle>
        <CardDescription>Preencha suas informações para gerar seu cardápio personalizado</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Idade, Peso e Altura */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                type="number"
                placeholder="Ex: 25"
                min="15"
                max="100"
                required
                value={formData.age || ""}
                onChange={(e) => updateField("age", Number.parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Ex: 70"
                min="30"
                max="300"
                step="0.1"
                required
                value={formData.weight || ""}
                onChange={(e) => updateField("weight", Number.parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="Ex: 170"
                min="100"
                max="250"
                required
                value={formData.height || ""}
                onChange={(e) => updateField("height", Number.parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Sexo */}
          <div className="space-y-3">
            <Label>Sexo</Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) => updateField("gender", value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="font-normal cursor-pointer">
                  Masculino
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="font-normal cursor-pointer">
                  Feminino
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Nível de Atividade */}
          <div className="space-y-2">
            <Label htmlFor="activity">Nível de atividade física</Label>
            <Select value={formData.activityLevel} onValueChange={(value) => updateField("activityLevel", value)}>
              <SelectTrigger id="activity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentário (pouco ou nenhum exercício)</SelectItem>
                <SelectItem value="light">Leve (exercício 1-3 dias/semana)</SelectItem>
                <SelectItem value="moderate">Moderado (exercício 3-5 dias/semana)</SelectItem>
                <SelectItem value="active">Ativo (exercício 6-7 dias/semana)</SelectItem>
                <SelectItem value="very-active">Muito Ativo (exercício intenso diário)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Objetivo */}
          <div className="space-y-2">
            <Label htmlFor="goal">Seu objetivo</Label>
            <Select value={formData.goal} onValueChange={(value) => updateField("goal", value)}>
              <SelectTrigger id="goal">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose">Perder peso (deficit calórico)</SelectItem>
                <SelectItem value="maintain">Manter peso (manutenção)</SelectItem>
                <SelectItem value="gain">Ganhar massa muscular (superavit calórico)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Gerar meu cardápio
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
