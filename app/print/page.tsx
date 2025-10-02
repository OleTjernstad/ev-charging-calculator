"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Printer } from "lucide-react"
import type { ChargeData, CostInputs, CalculationResults } from "@/types/charging"

interface PrintData {
  chargeData: ChargeData
  costInputs: CostInputs
  results: CalculationResults
}

export default function PrintPage() {
  const router = useRouter()
  const [printData, setPrintData] = useState<PrintData | null>(null)

  useEffect(() => {
    // Retrieve print data from localStorage
    const storedData = localStorage.getItem("printData")
    if (storedData) {
      setPrintData(JSON.parse(storedData))
    }
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const handleBack = () => {
    router.back()
  }

  if (!printData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">Laster utskriftsdata...</p>
        </div>
      </div>
    )
  }

  const { chargeData, results } = printData

  const formatNumber = (value: number | undefined, decimals = 2): string => {
    return (value ?? 0).toFixed(decimals)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* No-print controls */}
      <div className="no-print fixed top-4 right-4 flex gap-2 z-50">
        <Button onClick={handleBack} variant="outline" className="bg-background">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tilbake
        </Button>
        <Button onClick={handlePrint} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Printer className="mr-2 h-4 w-4" />
          Skriv ut
        </Button>
      </div>

      <div className="max-w-5xl mx-auto p-6 print:p-8">
        {/* Compact header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Elbil ladekostnad rapport</h1>
          <p className="text-muted-foreground text-sm">
            Generert:{" "}
            {new Date().toLocaleDateString("no-NO", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Integrated layout with installation info and total cost */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Installation Information - Takes 2 columns */}
          <div className="md:col-span-2 border-2 border-primary p-5 rounded">
            <h2 className="text-xl font-bold text-foreground mb-4 uppercase">Installasjonsinformasjon</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground font-semibold">Lokasjon:</span>
                <span className="text-foreground font-bold">{chargeData.location}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground font-semibold">Lader:</span>
                <span className="text-foreground font-bold">{chargeData.chargerName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground font-semibold">Fra dato:</span>
                <span className="text-foreground font-bold">{chargeData.fromDate}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground font-semibold">Til dato:</span>
                <span className="text-foreground font-bold">{chargeData.endDate}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground font-semibold">Antall økter:</span>
                <span className="text-foreground font-bold">{chargeData.sessions}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground font-semibold">Total varighet:</span>
                <span className="text-foreground font-bold">{chargeData.duration}</span>
              </div>
              <div className="flex flex-col col-span-2 pt-2 border-t-2 border-primary/20">
                <span className="text-muted-foreground font-semibold">Total energi:</span>
                <span className="text-foreground font-bold text-lg">{chargeData.totalEnergy} kWh</span>
              </div>
            </div>
          </div>

          {/* Total Charging Cost - Takes 1 column, integrated on the right */}
          <div className="border-2 border-accent p-5 rounded bg-accent/10 flex flex-col justify-center items-center">
            <h2 className="text-lg font-bold text-foreground mb-3 uppercase text-center">Total ladekostnad</h2>
            <p className="text-4xl font-bold text-accent mb-2">{formatNumber(results.totalChargingCost, 2)} kr</p>
            <p className="text-muted-foreground text-xs text-center">
              {chargeData.totalEnergy} kWh × {formatNumber(results.costPerKwh, 4)} kr/kWh
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
