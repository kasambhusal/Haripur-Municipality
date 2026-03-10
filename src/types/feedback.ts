export interface Feedback {
  id: number
  name: string
  phone_number: string
  subject: string
  address: string
  message: string
  status: "pending" | "resolved"
  created_at: string
}

export interface FeedbackListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Feedback[]
}

export interface FeedbackFilters {
  search?: string
  limit?: number
  offset?: number
  status?: "pending" | "resolved" | ""
}

export interface FeedbackFormData {
  name: string
  phone_number: string
  subject: string
  address: string
  message: string
}

export interface FeedbackFormErrors {
  name?: string[]
  phone_number?: string[]
  subject?: string[]
  address?: string[]
  message?: string[]
  non_field_errors?: string[]
}

export interface ApiErrorResponse {
  [key: string]: string[]
}
