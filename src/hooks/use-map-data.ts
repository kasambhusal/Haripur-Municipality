"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { MapAPI, type ApiLayer, type GeoJSONResponse } from "@/lib/map-api-client"

export interface LayerInfo extends ApiLayer {
  displayName: string
  color: string
  active: boolean
  featureCount: number
  loading: boolean
  error: string | null
}

export function useMapData() {
  const [layers, setLayers] = useState<LayerInfo[]>([])
  const [wardBoundariesLoaded, setWardBoundariesLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use refs to prevent re-renders that cause map reloading
  const layerDataRef = useRef<Map<string, GeoJSONResponse>>(new Map())
  const activeLayersRef = useRef<Set<string>>(new Set())

  const getLayerConfig = (layerName: string) => {
    const configs: Record<string, { displayName: string; color: string }> = {
      bdpt_v2: { displayName: "भवन बिन्दुहरू", color: "#b91c1c" },
      "Hydro Area": { displayName: "जल क्षेत्रहरू", color: "#0ea5e9" },
      "Hydro Line": { displayName: "नदी/खोलाहरू", color: "#06b6d4" },
      "Land Area": { displayName: "भूमि आवरण", color: "#16a34a" },
      "Topology Line": { displayName: "स्थलाकृति रेखाहरू", color: "#ea580c" },
      "Transportation Line": { displayName: "यातायात मार्गहरू", color: "#7c3aed" },
      Villages: { displayName: "गाउँका नामहरू", color: "#059669" },
      Wards: { displayName: "वार्ड सीमाना", color: "#000000" },
    }
    return configs[layerName] || { displayName: layerName, color: "#6b7280" }
  }

  // Get layer data without causing re-renders
  const getLayerData = useCallback((layerName: string) => {
    return layerDataRef.current.get(layerName)
  }, [])

  // Get active layers without causing re-renders
  const getActiveLayers = useCallback(() => {
    return layers.filter((layer) => activeLayersRef.current.has(layer.name))
  }, [layers])

  const loadLayerData = useCallback(async (layerName: string) => {
    if (layerDataRef.current.has(layerName)) {
      return layerDataRef.current.get(layerName)!
    }

    try {
      console.log(`Loading data for layer: ${layerName}`)
      const data = await MapAPI.getLayerData(layerName)

      // Store the data
      layerDataRef.current.set(layerName, data)

      console.log(`Successfully loaded ${layerName} with ${data.features?.length || 0} features`)

      // Mark ward boundaries as loaded if this is the ward layer
      if (layerName === "Wards") {
        console.log("Ward boundaries data loaded, setting wardBoundariesLoaded to true")
        setWardBoundariesLoaded(true)
      }

      return data
    } catch (err) {
      console.error(`Failed to load ${layerName}:`, err)
      throw err
    }
  }, [])

  const toggleLayer = useCallback(
    async (layerId: number) => {
      const layer = layers.find((l) => l.id === layerId)
      if (!layer) return

      const isCurrentlyActive = activeLayersRef.current.has(layer.name)

      // Update refs immediately (no re-render)
      if (isCurrentlyActive) {
        activeLayersRef.current.delete(layer.name)
      } else {
        activeLayersRef.current.add(layer.name)
      }

      // Update UI state
      setLayers((prev) =>
        prev.map((l) =>
          l.id === layerId
            ? { ...l, active: !isCurrentlyActive, loading: !isCurrentlyActive && !layerDataRef.current.has(l.name) }
            : l,
        ),
      )

      // Load data in background if activating
      if (!isCurrentlyActive && !layerDataRef.current.has(layer.name)) {
        try {
          await loadLayerData(layer.name)
          setLayers((prev) =>
            prev.map((l) =>
              l.id === layerId
                ? { ...l, loading: false, featureCount: layerDataRef.current.get(l.name)?.features?.length || 0 }
                : l,
            ),
          )
        } catch (error: unknown) {
          console.error(error)
          activeLayersRef.current.delete(layer.name)
          setLayers((prev) =>
            prev.map((l) => (l.id === layerId ? { ...l, active: false, loading: false, error: "Failed to load" } : l)),
          )
        }
      }
    },
    [layers, loadLayerData],
  )

  const loadLayers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Loading layers from API...")

      const apiLayers = await MapAPI.getLayers()
      console.log("Received layers:", apiLayers)

      // Separate wards from other layers
      const wardLayer = apiLayers.find((layer) => layer.name === "Wards")
      const otherLayers = apiLayers.filter((layer) => layer.name !== "Wards")

      const enhancedLayers: LayerInfo[] = otherLayers.map((layer) => {
        const config = getLayerConfig(layer.name)
        return {
          ...layer,
          displayName: config.displayName,
          color: config.color,
          active: false,
          featureCount: 0,
          loading: false,
          error: null,
        }
      })

      setLayers(enhancedLayers)
      console.log("Enhanced layers set:", enhancedLayers)

      // Auto-load ward boundaries if available
      if (wardLayer) {
        console.log("Ward layer found, loading ward boundaries...")
        try {
          await loadLayerData("Wards")
          console.log("Ward boundaries loaded successfully")
        } catch (error) {
          console.warn("Could not load ward boundaries:", error)
        }
      } else {
        console.warn("No ward layer found in API response")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load map data"
      console.error("Error loading layers:", err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [loadLayerData])

  useEffect(() => {
    loadLayers()
  }, [loadLayers])

  return {
    layers,
    wardBoundariesLoaded,
    loading,
    error,
    toggleLayer,
    getLayerData,
    getActiveLayers,
    refreshLayers: loadLayers,
  }
}
