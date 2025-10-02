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
    <>
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>

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
          <div className="border-4 border-primary p-6 rounded bg-card">
            <h2 className="text-2xl font-bold text-foreground mb-6 uppercase text-center">Installasjonsinformasjon</h2>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex flex-col">
                <span className="text-muted-foreground font-semibold text-sm">Lokasjon:</span>
                <span className="text-foreground font-bold text-lg">{chargeData.location}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground font-semibold text-sm">Lader:</span>
                <span className="text-foreground font-bold text-lg">{chargeData.chargerName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground font-semibold text-sm">Fra dato:</span>
                <span className="text-foreground font-bold text-lg">{chargeData.fromDate}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground font-semibold text-sm">Til dato:</span>
                <span className="text-foreground font-bold text-lg">{chargeData.endDate}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground font-semibold text-sm">Antall økter:</span>
                <span className="text-foreground font-bold text-lg">{chargeData.sessions}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground font-semibold text-sm">Total varighet:</span>
                <span className="text-foreground font-bold text-lg">{chargeData.duration}</span>
              </div>

              <div className="flex flex-col col-span-2 pt-4 mt-4 border-t-4 border-primary">
                <span className="text-muted-foreground font-semibold text-sm">Total energi:</span>
                <span className="text-foreground font-bold text-2xl">{chargeData.totalEnergy} kWh</span>
              </div>

              <div className="flex flex-col col-span-2 pt-4 mt-2 border-t-4 border-accent bg-accent/10 -mx-6 -mb-6 px-6 py-6 rounded-b">
                <span className="text-foreground font-semibold text-lg mb-3">Total ladekostnad:</span>
                <div className="flex justify-between items-baseline">
                  <span className="text-muted-foreground text-base">
                    {chargeData.totalEnergy} kWh × {formatNumber(results.costPerKwh, 4)} kr/kWh
                  </span>
                  <span className="text-accent font-bold text-5xl">
                    {formatNumber(results.totalChargingCost, 2)} kr
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
