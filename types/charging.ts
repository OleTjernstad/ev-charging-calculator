export interface ChargeData {
  totalEnergy: number
  location: string
  chargerName: string
  fromDate: string
  endDate: string
  sessions: number
  duration: string
  generatedDate: string
}

export interface CostInputs {
  houseUsage: number
  nettleie: number
  energyCostHouse: number
  tibberMonthCost: number
  paslag: number
}

export interface CalculationResults {
  nettleiePerKwh: number
  energyCostPerKwh: number
  tibberPerKwh: number
  costPerKwh: number
  totalChargingCost: number
}
