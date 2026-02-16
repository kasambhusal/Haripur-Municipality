"use client";

import { useEffect, useRef, useState, memo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import type { LayerInfo } from "@/hooks/use-map-data";
import type { GeoJSONResponse } from "@/lib/map-api-client";

interface IconDefaultWithGetIconUrl extends L.Icon.Default {
  _getIconUrl?: () => string;
}
// Fix Leaflet icons
delete (L.Icon.Default.prototype as IconDefaultWithGetIconUrl)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapComponentProps {
  activeLayers: LayerInfo[];
  getLayerData: (layerName: string) => GeoJSONResponse | undefined;
  wardBoundariesLoaded: boolean;
}

// Memoize to prevent unnecessary re-renders
const MapComponent = memo(function MapComponent({
  activeLayers,
  getLayerData,
  wardBoundariesLoaded,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<Map<string, L.LayerGroup>>(new Map());
  const wardBoundariesRef = useRef<L.LayerGroup | null>(null);
  const wardLabelsRef = useRef<L.LayerGroup | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showWardBoundaries, setShowWardBoundaries] = useState(true);
  const defaultViewRef = useRef<{
    center: L.LatLngExpression;
    zoom: number;
  } | null>(null);

  // Initialize map only once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      touchZoom: true,
      zoomControl: false,
    }).setView([27.02, 85.57], window.innerWidth < 768 ? 13 : 14);

    // 💾 Save default center and zoom
    defaultViewRef.current = {
      center: map.getCenter(),
      zoom: map.getZoom(),
    };

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle ward boundaries with proper data structure and toggle functionality
  useEffect(() => {
    if (!mapInstanceRef.current || !wardBoundariesLoaded) return;

    const map = mapInstanceRef.current;
    const wardData = getLayerData("Wards");

    // Remove existing ward boundaries and labels
    if (wardBoundariesRef.current) {
      map.removeLayer(wardBoundariesRef.current);
      wardBoundariesRef.current = null;
    }
    if (wardLabelsRef.current) {
      map.removeLayer(wardLabelsRef.current);
      wardLabelsRef.current = null;
    }

    if (wardData?.features && wardData.features.length > 0) {
      console.log(
        "Loading ward boundaries with",
        wardData.features.length,
        "wards"
      );

      const wardBoundaries = L.geoJSON(wardData, {
        style: () => ({
          color: "#000000", // Black outline
          weight: 3, // Thick outline
          opacity: 1,
          fillColor: "transparent", // No fill
          fillOpacity: 0,
          dashArray: "0", // Solid line
        }),
        onEachFeature: (feature, layer) => {
          if (feature.properties) {
            const props = feature.properties;

            // Extract ward number from WNO property
            const wardNo =
              props.WNO ||
              props.WARD_NO ||
              props.Ward_No ||
              props.ward_no ||
              feature.id;
            const district = props.DISTRICT || "N/A";
            const area = props.AAN || "N/A";
            const shapeArea = props.Shape_Area
              ? (props.Shape_Area * 100).toFixed(4)
              : "N/A";
            const shapeLength = props.Shape_Length
              ? props.Shape_Length.toFixed(4)
              : "N/A";

            // Create comprehensive popup content
            const popupContent = `
              <div class="p-4 min-w-[280px] max-w-[350px]">
                <h3 class="font-bold text-lg mb-3 text-blue-900 border-b border-blue-200 pb-2">
                  वार्ड नम्बर ${wardNo}
                </h3>
                
                <div class="space-y-2 text-sm">
                  <div class="bg-blue-50 p-2 rounded">
                    <span class="font-semibold text-blue-700">जिल्ला:</span>
                    <span class="text-blue-900 ml-2">${district}</span>
                  </div>
                  
                  <div class="bg-green-50 p-2 rounded">
                    <span class="font-semibold text-green-700">क्षेत्र:</span>
                    <span class="text-green-900 ml-2">${area}</span>
                  </div>
                  
                  ${
                    shapeArea !== "N/A"
                      ? `
                    <div class="flex justify-between items-center py-1">
                      <span class="font-medium text-gray-600">क्षेत्रफल:</span>
                      <span class="text-gray-800">${shapeArea} वर्ग किमी</span>
                    </div>
                  `
                      : ""
                  }
                  
                  ${
                    shapeLength !== "N/A"
                      ? `
                    <div class="flex justify-between items-center py-1">
                      <span class="font-medium text-gray-600">परिधि:</span>
                      <span class="text-gray-800">${shapeLength} किमी</span>
                    </div>
                  `
                      : ""
                  }
                  
                  ${
                    props.VCODE
                      ? `
                    <div class="flex justify-between items-center py-1">
                      <span class="font-medium text-gray-600">गाउँ कोड:</span>
                      <span class="text-gray-800">${props.VCODE}</span>
                    </div>
                  `
                      : ""
                  }
                </div>
                
                <div class="mt-3 pt-2 border-t border-gray-200 text-center">
                  <span class="text-xs text-gray-500">फिचर ID: ${
                    feature.id
                  }</span>
                </div>
              </div>
            `;

            layer.bindPopup(popupContent, {
              maxWidth: isMobile ? 300 : 350,
              className: "custom-popup",
              closeButton: true,
              autoPan: true,
              autoPanPadding: [10, 10],
            });

            // Add hover tooltip
            layer.bindTooltip(`वार्ड ${wardNo} - ${area}`, {
              permanent: false,
              direction: "center",
              className: "custom-tooltip",
            });
          }
        },
      });

      // Create ward labels layer
      const wardLabels = L.layerGroup();

      wardData.features.forEach((feature) => {
        if (
          feature.geometry.type === "Polygon" ||
          feature.geometry.type === "MultiPolygon"
        ) {
          try {
            const tempLayer = L.geoJSON(feature);
            const bounds = tempLayer.getBounds();
            const center = bounds.getCenter();

            // Extract ward number from WNO property
            const wardNo =
              feature.properties?.WNO ||
              feature.properties?.WARD_NO ||
              feature.properties?.Ward_No ||
              feature.properties?.ward_no ||
              feature.id;

            if (wardNo) {
              // Create ward number label with improved styling
              const wardLabel = L.divIcon({
                html: `<div style="
                  background: white;
                  border: 2px solid #000;
                  border-radius: 50%;
                  width: 28px;
                  height: 28px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  font-size: 13px;
                  color: #000;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                  font-family: Arial, sans-serif;
                ">${wardNo}</div>`,
                className: "ward-label",
                iconSize: [28, 28],
                iconAnchor: [14, 14],
              });

              L.marker(center, { icon: wardLabel }).addTo(wardLabels);
            }
          } catch (error) {
            console.warn(
              "Could not add ward label for feature:",
              feature.id,
              error
            );
          }
        }
      });

      // Store references to the layers
      wardBoundariesRef.current = wardBoundaries;
      wardLabelsRef.current = wardLabels;

      // Add layers to map only if showWardBoundaries is true
      if (showWardBoundaries) {
        wardBoundaries.addTo(map);
        wardLabels.addTo(map);

        // Fit map to ward boundaries
        try {
          const bounds = wardBoundaries.getBounds();
          if (bounds.isValid()) {
            map.fitBounds(bounds, {
              padding: isMobile ? [10, 10] : [10, 10], // reduced padding
              maxZoom: isMobile ? 16 : 17, // allow tighter zoom
              animate: true,
              duration: 1.0, // optional smooth zoom
            });
          }
        } catch (error) {
          console.warn("Could not fit ward bounds:", error);
        }
      }
    } else {
      console.warn("No ward features found in data");
    }
  }, [wardBoundariesLoaded, getLayerData, isMobile, showWardBoundaries]);

  // Handle ward boundaries visibility toggle
  useEffect(() => {
    if (
      !mapInstanceRef.current ||
      !wardBoundariesRef.current ||
      !wardLabelsRef.current
    )
      return;

    const map = mapInstanceRef.current;

    if (showWardBoundaries) {
      // Add ward boundaries and labels to map
      if (!map.hasLayer(wardBoundariesRef.current)) {
        wardBoundariesRef.current.addTo(map);
      }
      if (!map.hasLayer(wardLabelsRef.current)) {
        wardLabelsRef.current.addTo(map);
      }
    } else {
      // Remove ward boundaries and labels from map
      if (map.hasLayer(wardBoundariesRef.current)) {
        map.removeLayer(wardBoundariesRef.current);
      }
      if (map.hasLayer(wardLabelsRef.current)) {
        map.removeLayer(wardLabelsRef.current);
      }
    }
  }, [showWardBoundaries]);

  // Handle other layers efficiently
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const activeLayerNames = new Set(activeLayers.map((l) => l.name));

    // Remove inactive layers
    layersRef.current.forEach((layer, layerName) => {
      if (!activeLayerNames.has(layerName)) {
        map.removeLayer(layer);
        layersRef.current.delete(layerName);
      }
    });

    // Add new active layers
    activeLayers.forEach((layerInfo) => {
      if (!layersRef.current.has(layerInfo.name)) {
        const geoJsonData = getLayerData(layerInfo.name);

        if (geoJsonData?.features) {
          const layer = L.geoJSON(geoJsonData, {
            pointToLayer: (feature, latlng) => {
              const size = layerInfo.name === "bdpt_v2" ? 8 : 6;
              const customIcon = L.divIcon({
                html: `<div style="background: ${layerInfo.color}; width: ${size}px; height: ${size}px; border-radius: 50%;"></div>`,
                className: "custom-marker",
                iconSize: [size + 2, size + 2],
                iconAnchor: [size / 2 + 1, size / 2 + 1],
              });
              return L.marker(latlng, { icon: customIcon });
            },
            style: () => ({
              color: layerInfo.color,
              weight: 2,
              opacity: 0.8,
              fillOpacity: 0.3,
            }),
            onEachFeature: (feature, layer) => {
              if (feature.properties) {
                const props = feature.properties;
                const name =
                  props.BUILDING_FUNCTION ||
                  props.VIL_NAME ||
                  props.BFU_DESCRIPTION ||
                  props.name ||
                  layerInfo.displayName;

                layer.bindPopup(
                  `
                <div class="p-3">
                  <h3 class="font-bold text-blue-900 mb-2">${layerInfo.displayName}</h3>
                  <div class="text-sm">${name}</div>
                </div>
              `,
                  { maxWidth: 250 }
                );

                layer.bindTooltip(name, {
                  permanent: false,
                  direction: "top",
                  offset: [0, -10],
                });
              }
            },
          });

          layer.addTo(map);
          layersRef.current.set(layerInfo.name, layer);
        }
      }
    });
  }, [activeLayers, getLayerData]);

  const toggleWardBoundaries = () => {
    setShowWardBoundaries(!showWardBoundaries);
  };

  return (
    <div className="relative h-full w-19/20">
      {/* Ward Boundaries Toggle Button */}
      {wardBoundariesLoaded && (
        <div
          className={`absolute top-4 ${isMobile ? "left-15" : "left-4"} z-[10]`}
        >
          <Button
            onClick={toggleWardBoundaries}
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-white shadow-md"
          >
            {showWardBoundaries ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                वार्ड सीमाना लुकाउनुहोस्
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                वार्ड सीमाना देखाउनुहोस्
              </>
            )}
          </Button>
        </div>
      )}

      <div
        ref={mapRef}
        className="h-full w-full"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
});

export default MapComponent;
