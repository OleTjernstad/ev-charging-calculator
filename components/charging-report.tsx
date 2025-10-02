"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { useRouter } from "next/navigation"
import type { ChargeData, CostInputs, CalculationResults } from "@/types/charging"

interface ChargingReportProps {
  chargeData: ChargeData
  costInputs: CostInputs
  results: CalculationResults
}

export function ChargingReport({ chargeData, costInputs, results }: ChargingReportProps) {
  const router = useRouter()

  const handlePrint = () => {
    // Store data in localStorage for the print page
    const printData = {
      chargeData,
      costInputs,
      results,
    }
    localStorage.setItem("printData", JSON.stringify(printData))
    router.push("/print")
  }

  const paslagInKr = costInputs.paslag / 100

  return (
    <Card className="p-8 border-4 border-primary">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground uppercase tracking-wide">Ladekostnad rapport</h2>
        </div>

        <div className="space-y-6">
          {/* Installation Information */}
          <div className="border-4 border-primary p-6 rounded">
            <h3 className="text-xl font-bold text-foreground mb-4 uppercase">Installasjonsinformasjon</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground font-semibold">Lokasjon:</span>
                <p className="text-foreground text-lg">{chargeData.location}</p>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold">Lader:</span>
                <p className="text-foreground text-lg">{chargeData.chargerName}</p>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold">Periode:</span>
                <p className="text-foreground text-lg">
                  {chargeData.fromDate} til {chargeData.endDate}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold">Økter:</span>
                <p className="text-foreground text-lg">{chargeData.sessions}</p>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold">Total varighet:</span>
                <p className="text-foreground text-lg">{chargeData.duration}</p>
              </div>
              <div>
                <span className="text-muted-foreground font-semibold">Total energi:</span>
                <p className="text-foreground text-lg font-bold">{chargeData.totalEnergy} kWh</p>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="border-4 border-primary p-6 rounded">
            <h3 className="text-xl font-bold text-foreground mb-4 uppercase">Kostnadsoversikt</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b-2 border-primary/20">
                <span className="text-foreground">Husforbruk:</span>
                <span className="font-semibold">{costInputs.houseUsage.toFixed(2)} kWh</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b-2 border-primary/20">
                <span className="text-foreground">Nettleie:</span>
                <span className="font-semibold">{costInputs.nettleie.toFixed(2)} kr</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b-2 border-primary/20">
                <span className="text-foreground">Energikostnad hus:</span>
                <span className="font-semibold">{costInputs.energyCostHouse.toFixed(2)} kr</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b-2 border-primary/20">
                <span className="text-foreground">Tibber månedskostnad:</span>
                <span className="font-semibold">{costInputs.tibberMonthCost.toFixed(2)} kr</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b-2 border-primary/20">
                <span className="text-foreground">Påslag:</span>
                <span className="font-semibold">
                  {costInputs.paslag} øre ({paslagInKr.toFixed(2)} kr)
                </span>
              </div>
            </div>
          </div>

          {/* Calculated Rates */}
          <div className="border-4 border-primary p-6 rounded bg-muted/30">
            <h3 className="text-xl font-bold text-foreground mb-4 uppercase">Beregnede satser (per kWh)</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-foreground">Nettleie / kWh:</span>
                <span className="font-semibold">{results.nettleiePerKwh.toFixed(4)} kr</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-foreground">Energikostnad / kWh:</span>
                <span className="font-semibold">{results.energyCostPerKwh.toFixed(4)} kr</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-foreground">Tibber / kWh:</span>
                <span className="font-semibold">{results.tibberPerKwh.toFixed(4)} kr</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-foreground">Påslag:</span>
                <span className="font-semibold">{paslagInKr.toFixed(4)} kr</span>
              </div>
              <div className="flex justify-between items-center py-3 border-t-4 border-primary mt-3">
                <span className="text-foreground font-bold text-lg">Total kostnad / kWh:</span>
                <span className="font-bold text-xl text-accent">{results.costPerKwh.toFixed(4)} kr</span>
              </div>
            </div>
          </div>

          {/* Final Charging Cost */}
          <div className="border-4 border-accent p-8 rounded bg-accent/10">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2 uppercase">Total ladekostnad</h3>
              <p className="text-muted-foreground mb-4">
                {chargeData.totalEnergy} kWh × {results.costPerKwh.toFixed(4)} kr/kWh
              </p>
              <p className="text-5xl font-bold text-accent">{results.totalChargingCost.toFixed(2)} kr</p>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button onClick={handlePrint} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Printer className="mr-2 h-5 w-5" />
              Skriv ut rapport
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
