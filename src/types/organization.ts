export interface Organization {
  id: number
  name: string
  category: string
  category_display?: string
  address?: string
  phone_no?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface OrganizationFormData {
  name: string
  category: string
  address?: string
  phone_no?: string
  is_active: boolean
}

export interface OrganizationCategory {
  value: string
  label: string
}

export interface OrganizationListResponse {
  count: number
  next?: string
  previous?: string
  results: Organization[]
}

export interface OrganizationSearchResponse {
  count: number
  next?: string
  previous?: string
  results: Organization[]
}
