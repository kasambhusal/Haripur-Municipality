import { Get } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

interface MunicipalityStats {
  no_of_households: number
  total_population: number
  male_population: number
  female_population: number
}

interface TransformedStats {
  households: number
  totalPopulation: number
  malePopulation: number
  femalePopulation: number
}

const fetchMunicipalityStats = async (): Promise<MunicipalityStats> => {
  try {
    console.log("Fetching municipality stats...")

    // Get() already returns the parsed JSON data, not a Response object
    const data = (await Get({ url: "/public/insight/" })) as MunicipalityStats

    console.log("Municipality stats received:", data)

    // Validate the response structure
    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format")
    }

    // Check if required fields exist
    if (
      typeof data.no_of_households !== "number" ||
      typeof data.total_population !== "number" ||
      typeof data.male_population !== "number" ||
      typeof data.female_population !== "number"
    ) {
      throw new Error("Missing required fields in response")
    }

    return data
  } catch (error) {
    console.error("Error fetching municipality stats:", error)
    throw error
  }
}

const transformStats = (data: MunicipalityStats): TransformedStats => {
  console.log("Transforming stats:", data)

  const transformed = {
    households: data.no_of_households,
    totalPopulation: data.total_population,
    malePopulation: data.male_population,
    femalePopulation: data.female_population,
  }

  console.log("Transformed stats:", transformed)
  return transformed
}

export const useMunicipalityStats = () => {
  const query = useQuery({
    queryKey: ["municipality-stats"],
    queryFn: fetchMunicipalityStats,
    select: transformStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
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
