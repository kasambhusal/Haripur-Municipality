export interface Plan {
  id: number
  title: string
  description: string
  progress_note: string
  documents_url?: string
  images_url?: string
}

export interface PlansApiResponse {
  results: Plan[]
  count: number
  limit: number
  offset: number
}
