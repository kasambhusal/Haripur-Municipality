export interface PublicOrganization {
  id: number
  name: string
  category: string
  address?: string
  phone_no?: string
}

export interface PublicOrganizationResponse {
  results: PublicOrganization[]
  count: number
  next?: string
  previous?: string
}

export interface PublicOrganizationCategory {
  value: string
  label: string
}

export interface PublicCategoriesResponse {
  categories: PublicOrganizationCategory[]
}
