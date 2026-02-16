"use client"

import { useState, useEffect, useCallback } from "react"
import { Get } from "@/lib/api"
import type {
  PublicOrganization,
  PublicOrganizationResponse,
  PublicOrganizationCategory,
} from "@/types/public-organization"

interface UsePublicOrganizationsParams {
  limit: number
  offset: number
  searchTerm?: string
  category?: string
}

interface UsePublicOrganizationsReturn {
  organizations: PublicOrganization[]
  total: number
  loading: boolean
  error: string | null
  refetch: () => void
}

// Category grouping for statistics
const CATEGORY_GROUPS = {
  educational: ["gov_educational", "community_educational", "private_educational", "other_educational", "educational"],
  health: ["health"],
  financial: ["financial", "commercial_bank", "cooperative"],
  social: ["ngo", "cso", "social", "community_space", "religious"],
}

export function usePublicOrganizations({
  limit,
  offset,
  searchTerm,
  category,
}: UsePublicOrganizationsParams): UsePublicOrganizationsReturn {
  const [organizations, setOrganizations] = useState<PublicOrganization[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrganizations = useCallback(async () => {
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

      if (category && category !== "all") {
        params.append("category", category)
      }

      const response = (await Get({
        url: `/public/organizations/?${params.toString()}`,
      })) as PublicOrganizationResponse

      setOrganizations(response.results || [])
      setTotal(response.count || 0)
    } catch (err) {
      console.error("Error fetching public organizations:", err)
      setError("संस्थाहरू लोड गर्न समस्या भयो। कृपया पुनः प्रयास गर्नुहोस्।")
      setOrganizations([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [limit, offset, searchTerm, category])

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  return {
    organizations,
    total,
    loading,
    error,
    refetch: fetchOrganizations,
  }
}

export function usePublicOrganizationCategories() {
  const [categories, setCategories] = useState<PublicOrganizationCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        // Use the provided categories data structure
        const categoriesData = [
          { value: "gov_educational", label: "Government Educational Institution" },
          { value: "community_educational", label: "Community Educational Institution" },
          { value: "private_educational", label: "Private Educational Institution" },
          { value: "other_educational", label: "Other Educational Institution" },
          { value: "health", label: "Health Institution" },
          { value: "community_space", label: "Community Space" },
          { value: "government", label: "Government Office" },
          { value: "industry", label: "Industry" },
          { value: "commercial_bank", label: "Commercial Bank" },
          { value: "cooperative", label: "Cooperatives" },
          { value: "ngo", label: "Non-Governmental Organization" },
          { value: "educational", label: "Educational Institution" },
          { value: "financial", label: "Financial Institution" },
          { value: "media", label: "Media Organization" },
          { value: "religious", label: "Religious Organization" },
          { value: "social", label: "Social Organization" },
          { value: "business", label: "Business Organization" },
          { value: "cso", label: "CSO" },
          { value: "other", label: "Other" },
        ]

        setCategories(categoriesData)
      } catch (err) {
        console.error("Error setting categories:", err)
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

export function useOrganizationStats() {
  const [stats, setStats] = useState({
    educational: 0,
    health: 0,
    financial: 0,
    social: 0, // Changed from 'ngo' to 'social' to be more inclusive
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch counts for each category group
        const fetchCategoryGroupCount = async (categories: string[]) => {
          let totalCount = 0
          for (const category of categories) {
            try {
              const response = (await Get({
                url: `/public/organizations/?category=${category}&limit=1`,
              })) as PublicOrganizationResponse
              totalCount += response.count || 0
            } catch (err) {
              console.error(`Error fetching count for category ${category}:`, err)
            }
          }
          return totalCount
        }

        const [educational, health, financial, social] = await Promise.all([
          fetchCategoryGroupCount(CATEGORY_GROUPS.educational),
          fetchCategoryGroupCount(CATEGORY_GROUPS.health),
          fetchCategoryGroupCount(CATEGORY_GROUPS.financial),
          fetchCategoryGroupCount(CATEGORY_GROUPS.social),
        ])

        setStats({
          educational,
          health,
          financial,
          social,
        })
      } catch (err) {
        console.error("Error fetching organization stats:", err)
        setError("तथ्याङ्क लोड गर्न समस्या भयो।")
        setStats({ educational: 0, health: 0, financial: 0, social: 0 })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}
