// API Response Types
export interface ApiError {
  response?: {
    data?: {
      detail?: string
      message?: string
    }
    status?: number
  }
  message?: string
}

// Generic API Response wrapper
export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  status?: number
}

// Error handling utility type
export type ErrorWithResponse = Error & {
  response?: {
    data?: {
      detail?: string
      message?: string
    }
    status?: number
  }
}
