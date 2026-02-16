"use client"

import { useCallback, useEffect } from "react"
import { useState } from "react"
import { Get } from "@/lib/api"
import type { Plan, PlansApiResponse } from "@/types/plans"

interface UsePlansParams {
  limit: number
  offset: number
  searchTerm?: string
}

interface UsePlansReturn {
  plans: Plan[]
  total: number
  loading: boolean
  error: string | null
  refetch: () => void
}

export function usePlans({ limit, offset, searchTerm }: UsePlansParams): UsePlansReturn {
  const [plans, setPlans] = useState<Plan[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      })

      if (searchTerm && searchTerm.trim()) {
        params.append("search", searchTerm.trim())
      }

      const response = (await Get({
        url: `/public/plans/?${params.toString()}`,
      })) as PlansApiResponse

      setPlans(response.results || [])
      setTotal(response.count || 0)
    } catch (err) {
      console.error("Error fetching plans:", err)
      setError("योजनाहरू लोड गर्न समस्या भयो। कृपया पुनः प्रयास गर्नुहोस्।")
      setPlans([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [limit, offset, searchTerm])

  // Add useEffect to fetch data initially and when dependencies change
  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  return {
    plans,
    total,
    loading,
    error,
    refetch: fetchPlans,
  }
}
