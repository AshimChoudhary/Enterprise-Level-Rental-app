"use client";
import { useGetPropertyQuery } from "@/state/api";
import { Compass, MapPin } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const PropertyLocation = ({ propertyId }: PropertyDetailsProps) => {
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isLoading || isError || !property) return;
    if (!mapContainerRef.current) return;

    // Check if token is available
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      setMapError("Mapbox token not configured");
      return;
    }

    // Set the access token
    mapboxgl.accessToken = token;

    try {
      // Initialize map only if not already initialized
      if (!mapRef.current) {
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [
            property.location.coordinates.longitude,
            property.location.coordinates.latitude,
          ],
          zoom: 14,
        });

        map.on("error", (e: any) => {
          console.error("Mapbox error:", e);
          setMapError("Error loading map");
        });

        const marker = new mapboxgl.Marker()
          .setLngLat([
            property.location.coordinates.longitude,
            property.location.coordinates.latitude,
          ])
          .addTo(map);

        const markerElement = marker.getElement();
        const path = markerElement.querySelector("path[fill='#3FB1CE']");
        if (path) path.setAttribute("fill", "#000000");

        mapRef.current = map;
      }
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError("Failed to initialize map");
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [property, isError, isLoading, isMounted]);

  if (isLoading) return <>Loading...</>;
  if (isError || !property) {
    return <>Property not Found</>;
  }

  return (
    <div className="py-16">
      <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">
        Map and Location
      </h3>
      <div className="flex justify-between items-center text-sm text-primary-500 mt-2">
        <div className="flex items-center text-gray-500">
          <MapPin className="w-4 h-4 mr-1 text-gray-700" />
          Property Address:
          <span className="ml-2 font-semibold text-gray-700">
            {property.location?.address || "Address not available"}
          </span>
        </div>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(
            property.location?.address || ""
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-between items-center hover:underline gap-2 text-primary-600"
        >
          <Compass className="w-5 h-5" />
          Get Directions
        </a>
      </div>
      {mapError ? (
        <div className="relative mt-4 h-[300px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          <p className="text-red-600">{mapError}</p>
        </div>
      ) : (
        <div
          className="relative mt-4 h-[300px] rounded-lg overflow-hidden"
          ref={mapContainerRef}
        />
      )}
    </div>
  );
};

export default PropertyLocation;
