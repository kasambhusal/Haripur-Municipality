"use client"

import { useState, useEffect, useCallback } from "react"
import { Get, Delete, Patch } from "@/lib/api"
import type { Feedback, FeedbackListResponse, FeedbackFilters } from "@/types/feedback"

export function useFeedback() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)

  const fetchFeedbacks = useCallback(async (filters: FeedbackFilters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters.search) params.append("search", filters.search)
      if (filters.limit) params.append("limit", filters.limit.toString())
      if (filters.offset) params.append("offset", filters.offset.toString())
      if (filters.status =="pending" || filters.status == "resolved") params.append("status", filters.status)

      const queryString = params.toString()
      const url = `/feedback/list/${queryString ? `?${queryString}` : ""}`

      const response = (await Get({ url })) as FeedbackListResponse

      setFeedbacks(response.results || [])
      setTotalCount(response.count || 0)
      setHasNext(!!response.next)
      setHasPrevious(!!response.previous)
    } catch (err) {
      console.error("Error fetching feedbacks:", err)
      setError("Failed to fetch feedbacks")
      setFeedbacks([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }, [])

  const getFeedbackById = useCallback(async (id: number): Promise<Feedback | null> => {
    try {
      const response = (await Get({ url: `/feedback/${id}/` })) as Feedback
      return response
    } catch (err) {
      console.error("Error fetching feedback:", err)
      return null
    }
  }, [])

  const deleteFeedback = useCallback(async (id: number): Promise<boolean> => {
    try {
      await Delete({ url: `/feedback/${id}/delete/` })

      // Update local state
      setFeedbacks((prev) => prev.filter((feedback) => feedback.id !== id))
      setTotalCount((prev) => prev - 1)

      return true
    } catch (err) {
      console.error("Error deleting feedback:", err)
      return false
    }
  }, [])

  const updateFeedbackStatus = useCallback(async (id: number, status: "pending" | "resolved"): Promise<boolean> => {
    try {
      await Patch({
        url: `/feedback/${id}/update-status/`,
        data: { status },
      })

      // Update local state
      setFeedbacks((prev) => prev.map((feedback) => (feedback.id === id ? { ...feedback, status } : feedback)))

      return true
    } catch (err) {
      console.error("Error updating feedback status:", err)
      return false
    }
  }, [])

  // Fixed useEffect - removed fetchFeedbacks from dependencies to prevent infinite loops
  useEffect(() => {
    const initialFetch = async () => {
      await fetchFeedbacks({ limit: 10, offset: 0 })
    }
    initialFetch()
  }, [fetchFeedbacks]) // Empty dependency array for initial load only

  return {
    feedbacks,
    loading,
    error,
    totalCount,
    hasNext,
    hasPrevious,
    fetchFeedbacks,
    getFeedbackById,
    deleteFeedback,
    updateFeedbackStatus,
    refetch: fetchFeedbacks,
  }
}
