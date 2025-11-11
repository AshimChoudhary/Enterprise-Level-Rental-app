"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppSelector } from "@/state/redux";
import { useGetPropertiesQuery } from "@/state/api";
import { Property } from "@/types/prismaTypes";

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const filters = useAppSelector((state) => state.global.filters);
  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isLoading || isError || !properties) return;
    if (!mapContainerRef.current) return;

    // Check if Mapbox token is available and valid
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token || token.includes("example") || token.length < 50) {
      setMapError(
        "Mapbox access token is not configured. Please add a valid NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env.local file."
      );
      return;
    }

    // Set access token
    mapboxgl.accessToken = token;

    try {
      // Only create map if it doesn't exist
      if (!mapRef.current) {
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: filters.coordinates || [-74.5, 40],
          zoom: 9,
        });

        map.on("error", (e) => {
          console.error("Mapbox error:", e);
          setMapError(
            "Invalid Mapbox token. Please get a free token from Mapbox."
          );
        });

        map.on("load", () => {
          properties.forEach((property) => {
            const marker = createPropertyMarker(property, map);
            const markerElement = marker.getElement();
            const path = markerElement.querySelector("path[fill='#3FB1CE']");
            if (path) path.setAttribute("fill", "#000000");
          });

          const resizeMap = () => {
            if (map) setTimeout(() => map.resize(), 700);
          };
          resizeMap();
        });

        mapRef.current = map;
      }
    } catch (error: any) {
      console.error("Error initializing map:", error);
      setMapError("Failed to initialize map. Please get a valid Mapbox token.");
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isLoading, isError, properties, filters.coordinates, isMounted]);

  if (isLoading) return <>Loading...</>;
  if (isError || !properties) return <div>Failed to fetch properties</div>;
  if (mapError) {
    return (
      <div className="basis-5/12 grow relative rounded-xl bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-2">Map Error</p>
          <p className="text-sm text-gray-600">{mapError}</p>
          <a
            href="https://account.mapbox.com/access-tokens/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-sm underline mt-2 inline-block"
          >
            Get a free Mapbox token
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="basis-5/12 grow relative rounded-xl">
      <div
        className="map-container rounded-xl"
        ref={mapContainerRef}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
};

const createPropertyMarker = (property: Property, map: mapboxgl.Map) => {
  const marker = new mapboxgl.Marker()
    .setLngLat([
      property.location.coordinates.longitude,
      property.location.coordinates.latitude,
    ])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        `
        <div class="marker-popup">
          <div class="marker-popup-image"></div>
          <div>
            <a href="/search/${property.id}" target="_blank" class="marker-popup-title">${property.name}</a>
            <p class="marker-popup-price">
              $${property.pricePerMonth}
              <span class="marker-popup-price-unit"> / month</span>
            </p>
          </div>
        </div>
        `
      )
    )
    .addTo(map);
  return marker;
};

export default Map;
