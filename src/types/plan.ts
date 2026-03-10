export interface Plan {
  id: number
  title: string
  description: string
  progress_note?: string
  images?: string | null
  images_url?: string | null
  documents?: string | null
  documents_url?: string | null
  created_at?: string
  updated_at?: string
}

export interface PlanFormData {
  title: string
  description: string
  progress_note?: string
  image?: File | null
  document?: File | null
  existing_image?: string | null
  existing_document?: string | null
  remove_image?: boolean
  remove_document?: boolean
}

export interface PlansListResponse {
  count: number
  next?: string
  previous?: string
  results: Plan[]
}

export interface PlansSearchResponse {
  count: number
  next?: string
  previous?: string
  results: Plan[]
}
