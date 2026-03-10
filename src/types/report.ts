export interface ReportMetadata {
  total_households: number
  total_population: number
  wards_included: number[]
  generated_at: string
}

export interface Population {
  total: number
  male: number
  female: number
}

export interface Demographics {
  population?: Population
  gender_distribution?: Record<string, number>
  religion_distribution?: Record<string, number>
  caste_distribution?: Record<string, number>
  mother_tongue_distribution?: Record<string, number>
  education?: Record<string, number>
  employment?: Record<string, number>
}

export interface HousingData {
  [key: string]: number | string | boolean
}

export interface InfrastructureData {
  [key: string]: number | string | boolean
}

export interface SocialData {
  [key: string]: number | string | boolean
}

export interface EconomicData {
  [key: string]: number | string | boolean
}

export interface HealthData {
  [key: string]: number | string | boolean
}

export interface WardData {
  ward: number
  households: number
  demographics?: Demographics
  housing?: HousingData
  infrastructure?: InfrastructureData
  social?: SocialData
  economic?: EconomicData
  health?: HealthData
}

export interface ReportData {
  metadata: ReportMetadata
  ward_wise_data: WardData[]
}

export interface TableExportOptions {
  format: "png" | "jpg" | "pdf"
  filename?: string
  quality?: number
}

// Type alias for metadata to avoid naming conflicts
export type ReportMetadataType = ReportMetadata
