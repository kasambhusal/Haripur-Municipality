"use client"

import { useState, useEffect, useCallback } from "react"
import { Get, Post, Put, Delete } from "@/lib/api"
import { getApiHeadersWithAuth } from "@/lib/api-headers"
import type { Plan, PlanFormData, PlansListResponse, PlansSearchResponse } from "@/types/plan"

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
  createPlan: (data: PlanFormData) => Promise<void>
  updatePlan: (id: number, data: PlanFormData) => Promise<void>
  deletePlan: (id: number) => Promise<void>
  getPlan: (id: number) => Promise<Plan>
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

      let response: PlansListResponse | PlansSearchResponse

      if (searchTerm && searchTerm.trim()) {
        const params = new URLSearchParams({
          search: searchTerm.trim(),
          limit: limit.toString(),
          offset: offset.toString(),
        })
        response = (await Get({
          url: `/plans/?${params.toString()}`,
          headers: getApiHeadersWithAuth(),
        })) as PlansSearchResponse
      } else {
        const params = new URLSearchParams({
          limit: limit.toString(),
          offset: offset.toString(),
        })

        response = (await Get({
          url: `/plans/?${params.toString()}`,
          headers: getApiHeadersWithAuth(),
        })) as PlansListResponse
      }

      console.log("API Response:", response)
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

  const createPlan = useCallback(
    async (data: PlanFormData) => {
      try {
        console.log("Creating plan with data:", data)

        // Create FormData for file upload
        const formData = new FormData()
        formData.append("title", data.title)
        formData.append("description", data.description)

        if (data.progress_note) {
          formData.append("progress_note", data.progress_note)
        }

        // Add single image
        if (data.image) {
          formData.append("images", data.image)
        }

        // Add single document
        if (data.document) {
          formData.append("documents", data.document)
        }

        console.log("FormData contents:")
        for (const [key, value] of formData.entries()) {
          console.log(key, value)
        }

        await Post({
          url: "/plans/",
          data: formData,
          headers: {
            ...getApiHeadersWithAuth(),
            "Content-Type": "multipart/form-data",
          },
        })

        await fetchPlans()
      } catch (err) {
        console.error("Error creating plan:", err)
        throw new Error("योजना सिर्जना गर्न समस्या भयो। कृपया पुनः प्रयास गर्नुहोस्।")
      }
    },
    [fetchPlans],
  )

  const updatePlan = useCallback(
    async (id: number, data: PlanFormData) => {
      try {
        console.log("Updating plan with data:", data)

        // Create FormData for file upload
        const formData = new FormData()
        formData.append("title", data.title)
        formData.append("description", data.description)

        if (data.progress_note) {
          formData.append("progress_note", data.progress_note)
        }

        // Add new image if provided
        if (data.image) {
          formData.append("images", data.image)
        }

        // Add new document if provided
        if (data.document) {
          formData.append("documents", data.document)
        }

        // Only add remove fields if they are true (don't send empty/false values)
        if (data.remove_image === true) {
          formData.append("remove_images", "true")
        }

        if (data.remove_document === true) {
          formData.append("remove_documents", "true")
        }

        console.log("FormData contents for update:")
        for (const [key, value] of formData.entries()) {
          console.log(key, value)
        }
        
        await Put({
          url: `/plans/${id}/`,
          data: formData,
          headers: {
            ...getApiHeadersWithAuth(),
            "Content-Type": "multipart/form-data",
          },
        })

        await fetchPlans()
      } catch (err) {
        console.error("Error updating plan:", err)
        throw new Error("योजना अपडेट गर्न समस्या भयो। कृपया पुनः प्रयास गर्नुहोस्।")
      }
    },
    [fetchPlans],
  )

  const deletePlan = useCallback(
    async (id: number) => {
      try {
        await Delete({
          url: `/plans/${id}/`,
          headers: getApiHeadersWithAuth(),
        })
        await fetchPlans()
      } catch (err) {
        console.error("Error deleting plan:", err)
        throw new Error("योजना मेटाउन समस्या भयो। कृपया पुनः प्रयास गर्नुहोस्।")
      }
    },
    [fetchPlans],
  )

  const getPlan = useCallback(async (id: number): Promise<Plan> => {
    try {
      const response = (await Get({
        url: `/plans/${id}/`,
        headers: getApiHeadersWithAuth(),
      })) as Plan

      console.log("Single plan response:", response)
      return response
    } catch (err) {
      console.error("Error fetching plan:", err)
      throw new Error("योजना लोड गर्न समस्या भयो।")
    }
  }, [])

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  return {
    plans,
    total,
    loading,
    error,
    refetch: fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
    getPlan,
  }
}
