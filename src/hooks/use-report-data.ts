"use client"

import { useState, useEffect } from "react"
import { Get } from "@/lib/api"
import { getApiHeadersWithAuth } from "@/lib/api-headers"
import type { ReportData } from "@/types/report"

interface UseReportDataReturn {
  reportData: ReportData | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useReportData(): UseReportDataReturn {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReportData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = (await Get({
        url: "/public/reports/",
        headers: getApiHeadersWithAuth(),
      })) as ReportData

      setReportData(response)
    } catch (err) {
      console.error("Error fetching report data:", err)
      setError("रिपोर्ट डेटा लोड गर्न समस्या भयो। कृपया पुनः प्रयास गर्नुहोस्।")
      setReportData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReportData()
  }, [])

  return {
    reportData,
    loading,
    error,
    refetch: fetchReportData,
  }
}
