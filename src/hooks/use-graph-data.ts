import { Get } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

// API Response Types
interface GenderData {
  male: number
  female: number
  other: number
}

interface CasteWisePopulation {
  [key: string]: number
}

interface WardWisePopulation {
  [key: string]: number
}

interface ReligionWisePopulation {
  [key: string]: number
}

interface GraphsApiResponse {
  gender: GenderData
  caste_wise_population: CasteWisePopulation
  ward_wise_population: WardWisePopulation
  religion_wise_population: ReligionWisePopulation
}

// Transformed Types for Charts
interface GenderChartData {
  name: string
  value: number
  color?: string
}

interface BarChartData {
  category: string
  value: number
  color?: string
}

interface PieChartData {
  name: string
  value: number
  color?: string
}

interface HistogramData {
  range: string
  frequency: number
  color?: string
}

interface TransformedGraphsData {
  genderData: GenderChartData[]
  wardData: BarChartData[]
  casteData: PieChartData[]
  religionData: HistogramData[]
}

const fetchGraphsData = async (): Promise<GraphsApiResponse> => {
  try {
    console.log("Fetching graphs data from government API...")

    const data = (await Get({ url: "/public/graphs/" })) as GraphsApiResponse

    console.log("Graphs data received:", data)

    // Validate the response structure
    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format from government API")
    }

    // Validate required fields
    if (!data.gender || !data.caste_wise_population || !data.ward_wise_population || !data.religion_wise_population) {
      throw new Error("Missing required data fields in government API response")
    }

    return data
  } catch (error) {
    console.error("Error fetching government graphs data:", error)
    throw error
  }
}

const transformGraphsData = (data: GraphsApiResponse): TransformedGraphsData => {
  console.log("Transforming government data for charts...")

  // Government-approved color schemes
  const genderColors = ["#3B82F6", "#EC4899", "#10B981"] // Blue, Pink, Green
  const wardColors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16", "#F97316"]
  const casteColors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16"]
  const religionColors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

  // Transform gender data for semi-pie chart
  const genderData: GenderChartData[] = [
    { name: "पुरुष", value: data.gender.male, color: genderColors[0] },
    { name: "महिला", value: data.gender.female, color: genderColors[1] },
    { name: "अन्य", value: data.gender.other, color: genderColors[2] },
  ]

  // Transform ward data for bar chart
  const wardData: BarChartData[] = Object.entries(data.ward_wise_population).map(([ward, population], index) => ({
    category: ward.replace("Ward ", "वार्ड "),
    value: population,
    color: wardColors[index % wardColors.length],
  }))

  // Transform caste data for pie chart
  const casteData: PieChartData[] = Object.entries(data.caste_wise_population).map(([caste, population], index) => ({
    name: caste,
    value: population,
    color: casteColors[index % casteColors.length],
  }))

  // Transform religion data for histogram
  const religionData: HistogramData[] = Object.entries(data.religion_wise_population).map(
    ([religion, population], index) => ({
      range: religion,
      frequency: population,
      color: religionColors[index % religionColors.length],
    }),
  )

  const transformed = {
    genderData,
    wardData,
    casteData,
    religionData,
  }

  console.log("Government data transformed successfully:", transformed)
  return transformed
}

export const useGraphsData = () => {
  const query = useQuery({
    queryKey: ["government-graphs-data"],
    queryFn: fetchGraphsData,
    select: transformGraphsData,
    staleTime: 10 * 60 * 1000, // 10 minutes - government data doesn't change frequently
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export type { GenderChartData, BarChartData, PieChartData, HistogramData, TransformedGraphsData }
