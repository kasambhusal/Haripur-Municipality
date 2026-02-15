import { Get } from "@/lib/api"

// Map API has different base URL than user API
const MAP_API_BASE = "https://api.bhuvanpaudel.com.np/haripur/api/v1/map" 

// Type definitions for API responses
export interface ApiLayer {
  id: number
  name: string
  description: string
  is_active: boolean
}

export interface ApiLayerResponse {
  layers: ApiLayer[]
}

export interface GeoJSONFeature {
  type: "Feature"
  id: number
  geometry: {
    type: "Point" | "LineString" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon"
    coordinates: number[] | number[][] | number[][][]
  }
  properties: Record<string, string | number | boolean | null>
}

export interface GeoJSONResponse {
  type: "FeatureCollection"
  features: GeoJSONFeature[]
}

// API functions using existing infrastructure
export class MapAPI {
  private static async makeRequest<T>(endpoint: string, retries = 3): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        // Create full URL by replacing the base URL
        const fullUrl = endpoint.replace("https://api.bhuvanpaudel.com.np/haripur/api/v1/user", MAP_API_BASE)
        const relativeUrl = fullUrl.replace(MAP_API_BASE, "")

        console.log(`Making request to: ${MAP_API_BASE}${relativeUrl}`)

        // Use existing Get function but override the base URL
        const originalGet = Get
        const data = (await originalGet({
          url: relativeUrl,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })) as T

        return data
      } catch (error) {
        console.warn(`API request attempt ${i + 1} failed:`, error)

        if (i === retries - 1) {
          throw error
        }

        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000))
      }
    }

    throw new Error("All retry attempts failed")
  }

  static async getLayers(): Promise<ApiLayer[]> {
    try {
      console.log("Fetching layers from API...")
      const response = await this.makeRequest<ApiLayerResponse | ApiLayer[]>(`${MAP_API_BASE}/layers/`)

      // Handle both array response and object response
      const layers = Array.isArray(response) ? response : (response as ApiLayerResponse).layers || []

      console.log("Layers fetched successfully:", layers.length, "layers")
      return layers
    } catch (error) {
      console.error("Failed to fetch layers:", error)
      throw new Error(`Failed to load map layers: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  static async getLayerData(layerName: string): Promise<GeoJSONResponse> {
    try {
      console.log(`Fetching data for layer: ${layerName}`)
      const data = await this.makeRequest<GeoJSONResponse>(`${MAP_API_BASE}/data/${layerName}/`)

      console.log(`Layer ${layerName} data fetched:`, data.features?.length || 0, "features")
      return data
    } catch (error) {
      console.error(`Failed to fetch data for layer ${layerName}:`, error)
      throw new Error(`Failed to load ${layerName} data: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Utility function to get summary statistics
  static async getMapSummary(): Promise<{
    totalLayers: number
    totalFeatures: number
    activeLayers: number
  }> {
    try {
      const layers = await this.getLayers()
      const activeLayers = layers.filter((layer) => layer.is_active)

      // Get feature counts for active layers (limit to first 3 for performance)
      let totalFeatures = 0
      const layersToCheck = activeLayers.slice(0, 3)

      for (const layer of layersToCheck) {
        try {
          const data = await this.getLayerData(layer.name)
          totalFeatures += data.features?.length || 0
        } catch (error) {
          console.warn(`Could not get feature count for ${layer.name}:`, error)
        }
      }

      return {
        totalLayers: layers.length,
        totalFeatures,
        activeLayers: activeLayers.length,
      }
    } catch (error) {
      console.error("Failed to get map summary:", error)
      return {
        totalLayers: 0,
        totalFeatures: 0,
        activeLayers: 0,
      }
    }
  }
}
