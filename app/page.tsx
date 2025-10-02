"use client"

import { useState, useEffect } from "react"
import { FileUpload } from "@/components/file-upload"
import { CostCalculator } from "@/components/cost-calculator"
import { ChargingReport } from "@/components/charging-report"
import type { ChargeData, CostInputs, CalculationResults } from "@/types/charging"

export default function Home() {
  const [chargeData, setChargeData] = useState<ChargeData | null>(null)
  const [costInputs, setCostInputs] = useState<CostInputs>({
    houseUsage: 0,
    nettleie: 0,
    energyCostHouse: 0,
    tibberMonthCost: 0,
    paslag: 0,
  })
  const [calculationResults, setCalculationResults] = useState<CalculationResults | null>(null)

  // Load saved values from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ev-cost-inputs")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCostInputs(parsed)
      } catch (e) {
        console.error("[v0] Failed to parse saved inputs:", e)
      }
    }
  }, [])

  // Save to localStorage whenever inputs change
  useEffect(() => {
    if (costInputs.houseUsage > 0) {
      localStorage.setItem("ev-cost-inputs", JSON.stringify(costInputs))
    }
  }, [costInputs])

  const handleFileUpload = (data: ChargeData) => {
    setChargeData(data)
    setCalculationResults(null)
  }

  const handleCalculate = () => {
    if (!chargeData || costInputs.houseUsage === 0) return

    const paslagInKr = costInputs.paslag / 100

    // Perform calculations
    const nettleiePerKwh = costInputs.nettleie / costInputs.houseUsage
    const energyCostPerKwh = costInputs.energyCostHouse / costInputs.houseUsage
    const tibberPerKwh = costInputs.tibberMonthCost / costInputs.houseUsage
    const costPerKwh = nettleiePerKwh + energyCostPerKwh + tibberPerKwh + paslagInKr
    const totalChargingCost = costPerKwh * chargeData.totalEnergy

    setCalculationResults({
      nettleiePerKwh,
      energyCostPerKwh,
      tibberPerKwh,
      costPerKwh,
      totalChargingCost,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8 no-print">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">Elbil Ladekostnad Kalkulator</h1>
          <p className="text-muted-foreground text-lg">
            Last opp laderapport og beregn den faktiske kostnaden for lading av elbilen din
          </p>
        </header>

        <div className="space-y-8">
          <FileUpload onDataParsed={handleFileUpload} />

          {chargeData && (
            <CostCalculator
              chargeData={chargeData}
              costInputs={costInputs}
              onInputsChange={setCostInputs}
              onCalculate={handleCalculate}
            />
          )}

          {calculationResults && chargeData && (
            <ChargingReport chargeData={chargeData} costInputs={costInputs} results={calculationResults} />
          )}
        </div>
      </div>
    </div>
  )
}
