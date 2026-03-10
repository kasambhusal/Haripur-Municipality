"use client"

import { useState, useEffect, useCallback } from "react"
import { Get, Post, Put, Delete } from "@/lib/api"
import { getApiHeadersWithAuth } from "@/lib/api-headers"
import type {
  Organization,
  OrganizationFormData,
  OrganizationListResponse,
  OrganizationSearchResponse,
  OrganizationCategory,
} from "@/types/organization"

interface UseOrganizationsParams {
  limit: number
  offset: number
  searchTerm?: string
  category?: string
}

interface UseOrganizationsReturn {
  organizations: Organization[]
  total: number
  loading: boolean
  error: string | null
  refetch: () => void
  createOrganization: (data: OrganizationFormData) => Promise<void>
  updateOrganization: (id: number, data: OrganizationFormData) => Promise<void>
  deleteOrganization: (id: number) => Promise<void>
}

// API response interface for categories
interface CategoriesApiResponse {
  categories: Array<{
    value: string
    display: string
  }>
}

export function useOrganizations({ limit, offset, searchTerm, category }: UseOrganizationsParams): UseOrganizationsReturn {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let response: OrganizationListResponse | OrganizationSearchResponse

      if (searchTerm && searchTerm.trim()) {
        // Use search endpoint
        const paramsObj: Record<string, string> = {
          q: searchTerm.trim(),
          limit: limit.toString(),
          offset: offset.toString(),
        };
        if (category && category.trim() !== "all" && category.trim() !== "") {
          paramsObj.category = category.trim();
        }
        const params = new URLSearchParams(paramsObj);

        response = (await Get({
          url: `/organizations/?${params.toString()}`,
          headers: getApiHeadersWithAuth(),
        })) as OrganizationSearchResponse
      } else {
        // Use regular list endpoint
         const paramsObj: Record<string, string> = {
          limit: limit.toString(),
          offset: offset.toString(),
        };
         if (category && category.trim() !== "all" && category.trim() !== "") {
          paramsObj.category = category.trim();
        }
        const params = new URLSearchParams(paramsObj);

        response = (await Get({
          url: `/organizations/?${params.toString()}`,
          headers: getApiHeadersWithAuth(),
        })) as OrganizationListResponse
      }

      setOrganizations(response.results || [])
      setTotal(response.count || 0)
    } catch (err) {
      console.error("Error fetching organizations:", err)
      setError("संस्थाहरू लोड गर्न समस्या भयो। कृपया पुनः प्रयास गर्नुहोस्।")
      setOrganizations([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [limit, offset, searchTerm, category])

  const createOrganization = useCallback(
    async (data: OrganizationFormData) => {
      try {
        console.log("Creating organization with data:", data)
        await Post({
          url: "/organizations/",
          data,
          headers: getApiHeadersWithAuth(),
        })
        await fetchOrganizations()
      } catch (err) {
        console.error("Error creating organization:", err)
        throw new Error("संस्था सिर्जना गर्न समस्या भयो। कृपया पुनः प्रयास गर्नुहोस्।")
      }
    },
    [fetchOrganizations],
  )

  const updateOrganization = useCallback(
    async (id: number, data: OrganizationFormData) => {
      try {
        console.log("Updating organization with data:", data)
        await Put({
          url: `/organizations/${id}/`,
          data,
          headers: getApiHeadersWithAuth(),
        })
        await fetchOrganizations()
      } catch (err) {
        console.error("Error updating organization:", err)
        throw new Error("संस्था अपडेट गर्न समस्या भयो। कृपया पुनः प्रयास गर्नुहोस्।")
      }
    },
    [fetchOrganizations],
  )

  const deleteOrganization = useCallback(
    async (id: number) => {
      try {
        await Delete({
          url: `/organizations/${id}/`,
          headers: getApiHeadersWithAuth(),
        })
        await fetchOrganizations()
      } catch (err) {
        console.error("Error deleting organization:", err)
        throw new Error("संस्था मेटाउन समस्या भयो। कृपया पुनः प्रयास गर्नुहोस्।")
      }
    },
    [fetchOrganizations],
  )

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  return {
    organizations,
    total,
    loading,
    error,
    refetch: fetchOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization,
  }
}

export function useOrganizationCategories() {
  const [categories, setCategories] = useState<OrganizationCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("Fetching categories from API...")

        const response = (await Get({
          url: "/organizations/categories/",
          headers: getApiHeadersWithAuth(),
        })) as CategoriesApiResponse

        console.log("Raw categories API response:", response)

        // Handle the correct API response structure
        if (response && response.categories && Array.isArray(response.categories)) {
          const validCategories = response.categories
            .filter((cat) => cat && cat.value && cat.value.trim() !== "")
            .map((cat) => ({
              value: cat.value.trim(),
              label: cat.display && cat.display.trim() !== "" ? cat.display.trim() : cat.value.trim(),
            }))

          setCategories(validCategories)
        } else {
          console.warn("Invalid categories response structure:", response)
          setCategories([])
        }
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("श्रेणीहरू लोड गर्न समस्या भयो।")
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}
