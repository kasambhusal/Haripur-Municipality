"use client";

import type React from "react";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useMapData } from "@/hooks/use-map-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Droplets,
  Waves,
  Mountain,
  Route,
  MapPin,
  Circle,
  Menu,
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
  Check,
} from "lucide-react";

const MapComponent = dynamic(() => import("@/ui/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
    </div>
  ),
});

const getLayerIcon = (layerName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    bdpt_v2: <Building className="h-4 w-4" />,
    "Hydro Area": <Droplets className="h-4 w-4" />,
    "Hydro Line": <Waves className="h-4 w-4" />,
    "Land Area": <Mountain className="h-4 w-4" />,
    "Topology Line": <Mountain className="h-4 w-4" />,
    "Transportation Line": <Route className="h-4 w-4" />,
    Villages: <MapPin className="h-4 w-4" />,
    Wards: <Circle className="h-4 w-4" />,
  };
  return iconMap[layerName] || <Circle className="h-4 w-4" />;
};

export default function MapWithSidebarPage() {
  const {
    layers,
    wardBoundariesLoaded,
    loading,
    error,
    toggleLayer,
    getLayerData,
    getActiveLayers,
    refreshLayers,
  } = useMapData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
        window.scrollTo({ top: 140, behavior: "smooth" }); // or "auto" for instant
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const activeLayers = getActiveLayers();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-sm mx-auto">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-spin" />
            <h3 className="text-lg font-semibold mb-2">नक्सा लोड हुँदै</h3>
            <p className="text-sm text-gray-600">
              कृपया प्रतीक्षा गर्नुहोस्...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-sm mx-auto border-red-200">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2 text-red-900">त्रुटि</h3>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <Button
              onClick={refreshLayers}
              className="bg-red-600 hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              पुनः प्रयास
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Simple & Clean */}
      <div
        className={`
          ${
            isMobile
              ? "fixed inset-y-0 left-0 w-full max-w-sm"
              : "relative w-80"
          } 
          ${isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"}
          bg-white shadow-lg z-50 transition-transform duration-300 flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-4 bg-[#002c58] text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">हरिपुर नगरपालिका</h2>
              <p className="text-sm text-blue-100">नक्सा तहहरू</p>
            </div>
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-white hover:bg-blue-700 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Ward Status */}
        <div className="p-4 bg-green-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-green-800">
                वार्ड सीमाना
              </h4>
              <p className="text-xs text-green-600">स्वचालित सक्रिय</p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              {wardBoundariesLoaded ? "सक्रिय" : "लोड हुँदै"}
            </Badge>
          </div>
        </div>

        {/* Layers */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            अतिरिक्त तहहरू
          </h3>

          <div className="space-y-2">
            {layers.map((layer) => (
              <div
                key={layer.id}
                onClick={() => toggleLayer(layer.id)}
                className={`
                  p-3 rounded-lg border cursor-pointer transition-all
                  ${
                    layer.active
                      ? "bg-blue-50 border-blue-200 shadow-sm"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-2 rounded"
                      style={{
                        backgroundColor: layer.active ? layer.color : "#f3f4f6",
                        color: layer.active ? "white" : "#6b7280",
                      }}
                    >
                      {getLayerIcon(layer.name)}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {layer.displayName}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {layer.featureCount > 0
                          ? `${layer.featureCount} फिचरहरू`
                          : "तह"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {layer.loading && (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    )}
                    {layer.error && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    {layer.active && !layer.loading && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-600">
              सक्रिय: {activeLayers.length} / {layers.length}
            </p>
            <Button
              onClick={refreshLayers}
              variant="outline"
              size="sm"
              className="w-full"
              disabled={loading}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              रिफ्रेस
            </Button>
          </div>
        </div>
      </div>

      {/* Main Map */}
      <div className="flex-1 relative">
        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 z-30 bg-white hover:bg-gray-50 text-gray-700 shadow-lg border border-gray-200 h-10 w-10 p-0 rounded-lg"
            size="sm"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Map Header */}
        <div className="absolute top-4 right-4 z-30">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardContent className="p-3 text-center">
              <h1 className="text-sm font-bold">हरिपुर नगरपालिका</h1>
              <p className="text-xs text-gray-600">भौगोलिक सूचना प्रणाली</p>
              {activeLayers.length > 0 && (
                <Badge variant="outline" className="text-xs mt-1">
                  {activeLayers.length} तह सक्रिय
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <Suspense
          fallback={
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <MapComponent
            activeLayers={activeLayers}
            getLayerData={getLayerData}
            wardBoundariesLoaded={wardBoundariesLoaded}
          />
        </Suspense>
      </div>
    </div>
  );
}
