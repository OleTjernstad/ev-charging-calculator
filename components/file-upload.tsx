"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, FileSpreadsheet } from "lucide-react"
import * as XLSX from "xlsx"
import type { ChargeData } from "@/types/charging"

interface FileUploadProps {
  onDataParsed: (data: ChargeData) => void
}

export function FileUpload({ onDataParsed }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseExcelFile = async (file: File) => {
    setIsProcessing(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: "array" })
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][]

      console.log("[v0] Parsed Excel data:", jsonData)

      // Find the row with "Total Energy (kWh)" and extract the value
      let totalEnergy = 0
      let location = ""
      let chargerName = ""
      let fromDate = ""
      let endDate = ""
      let sessions = 0
      let duration = ""
      let generatedDate = ""

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i]

        // Extract location (first address line)
        if (i < 5 && row[0] && typeof row[0] === "string" && row[0].length > 0 && !location) {
          if (row[0].includes("Sandervegen") || row[0].match(/[A-Za-z]+\s+\d+/)) {
            location = row[0]
          }
        }

        // Extract dates
        if (row[0] === "From Date" && row[2] === "End Date") {
          fromDate = jsonData[i][1] || ""
          endDate = jsonData[i][3] || ""
        }

        // Extract charger info
        if (row[0] === "Charger") {
          chargerName = jsonData[i + 1]?.[0] || ""
          sessions = jsonData[i + 1]?.[1] || 0
          duration = jsonData[i + 1]?.[2] || ""
        }

        // Extract total energy
        if (row[3] === "Total Energy (kWh)") {
          totalEnergy = Number.parseFloat(jsonData[i + 1]?.[3]) || 0
          break
        }

        // Extract generated date
        if (row[0] && typeof row[0] === "string" && row[0].includes("Generated:")) {
          generatedDate = row[0].split("Generated:")[1]?.trim() || ""
        }
      }

      const chargeData: ChargeData = {
        totalEnergy,
        location,
        chargerName,
        fromDate,
        endDate,
        sessions,
        duration,
        generatedDate,
      }

      console.log("[v0] Extracted charge data:", chargeData)
      onDataParsed(chargeData)
      setFileName(file.name)
    } catch (error) {
      console.error("[v0] Error parsing Excel file:", error)
      alert("Failed to parse the Excel file. Please ensure it is a valid charge report.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      parseExcelFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      parseExcelFile(file)
    } else {
      alert("Please upload a valid Excel file (.xlsx or .xls)")
    }
  }

  return (
    <Card className="p-8 border-4 border-primary no-print">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2 uppercase tracking-wide">Steg 1: Last opp fil</h2>
          <p className="text-foreground/80">Last opp laderapport (.xlsx) for å hente ladedata</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-14 text-lg font-semibold border-4 border-primary bg-input text-foreground hover:bg-muted"
            disabled={isProcessing}
          >
            <Upload className="mr-2 h-5 w-5" />
            {isProcessing ? "Behandler..." : "Last opp fil"}
          </Button>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-4 border-primary rounded p-8 text-center transition-colors ${
              isDragging ? "bg-muted" : "bg-input"
            }`}
          >
            <FileSpreadsheet className="mx-auto h-12 w-12 text-foreground/60 mb-3" />
            <p className="text-foreground font-semibold">Dra og slipp en fil her</p>
            {fileName && <p className="mt-2 text-sm text-muted-foreground">Lastet: {fileName}</p>}
          </div>

          <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
        </div>
      </div>
    </Card>
  )
}
