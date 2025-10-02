"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator } from "lucide-react"
import type { ChargeData, CostInputs } from "@/types/charging"

interface CostCalculatorProps {
  chargeData: ChargeData
  costInputs: CostInputs
  onInputsChange: (inputs: CostInputs) => void
  onCalculate: () => void
}

export function CostCalculator({ chargeData, costInputs, onInputsChange, onCalculate }: CostCalculatorProps) {
  const handleInputChange = (field: keyof CostInputs, value: string) => {
    const numValue = Number.parseFloat(value) || 0
    onInputsChange({
      ...costInputs,
      [field]: numValue,
    })
  }

  const isValid = costInputs.houseUsage > 0

  return (
    <Card className="p-8 border-4 border-primary no-print">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2 uppercase tracking-wide">
            Steg 2: Fyll inn kostnadsinformasjon
          </h2>
          <p className="text-foreground/80">Skriv inn husholdningens energikostnader for å beregne ladeutgifter</p>
        </div>

        <div className="bg-muted/50 p-6 rounded border-2 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">Ladedata hentet:</h3>
            <span className="text-2xl font-bold text-accent">{chargeData.totalEnergy} kWh</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Lokasjon:</span>
              <span className="ml-2 font-semibold">{chargeData.location || "N/A"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Lader:</span>
              <span className="ml-2 font-semibold">{chargeData.chargerName || "N/A"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Periode:</span>
              <span className="ml-2 font-semibold">
                {chargeData.fromDate} - {chargeData.endDate}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Økter:</span>
              <span className="ml-2 font-semibold">{chargeData.sessions}</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="houseUsage" className="text-foreground font-bold uppercase text-sm">
              Husforbruk (kWh)
            </Label>
            <Input
              id="houseUsage"
              type="number"
              step="0.01"
              value={costInputs.houseUsage || ""}
              onChange={(e) => handleInputChange("houseUsage", e.target.value)}
              className="h-12 border-4 border-primary bg-input text-foreground text-lg"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nettleie" className="text-foreground font-bold uppercase text-sm">
              Nettleie (kr)
            </Label>
            <Input
              id="nettleie"
              type="number"
              step="0.01"
              value={costInputs.nettleie || ""}
              onChange={(e) => handleInputChange("nettleie", e.target.value)}
              className="h-12 border-4 border-primary bg-input text-foreground text-lg"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="energyCostHouse" className="text-foreground font-bold uppercase text-sm">
              Energikostnad hus (kr)
            </Label>
            <Input
              id="energyCostHouse"
              type="number"
              step="0.01"
              value={costInputs.energyCostHouse || ""}
              onChange={(e) => handleInputChange("energyCostHouse", e.target.value)}
              className="h-12 border-4 border-primary bg-input text-foreground text-lg"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tibberMonthCost" className="text-foreground font-bold uppercase text-sm">
              Tibber månedskostnad (kr)
            </Label>
            <Input
              id="tibberMonthCost"
              type="number"
              step="0.01"
              value={costInputs.tibberMonthCost || ""}
              onChange={(e) => handleInputChange("tibberMonthCost", e.target.value)}
              className="h-12 border-4 border-primary bg-input text-foreground text-lg"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paslag" className="text-foreground font-bold uppercase text-sm">
              Påslag (øre)
            </Label>
            <Input
              id="paslag"
              type="number"
              step="0.01"
              value={costInputs.paslag || ""}
              onChange={(e) => handleInputChange("paslag", e.target.value)}
              className="h-12 border-4 border-primary bg-input text-foreground text-lg"
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">Skriv inn verdi i øre (100 øre = 1 kr)</p>
          </div>
        </div>

        <Button
          onClick={onCalculate}
          disabled={!isValid}
          className="w-full h-14 text-lg font-bold bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Calculator className="mr-2 h-5 w-5" />
          Beregn ladekostnad
        </Button>
      </div>
    </Card>
  )
}
