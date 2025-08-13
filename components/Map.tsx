import React, { useEffect, useState, useRef } from "react";
import { ActivityIndicator, Text, View, Platform } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { Driver, MarkerData } from "@/types/type";

const LEBANON_CENTER = {
  latitude: 33.8547,
  longitude: 35.8623,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

const Map = () => {
  const {
    userLongitude,
    userLatitude,
    destinationLongitude,
    destinationLatitude,
  } = useLocationStore();
  const { selectedDriver, setSelectedDriver, setDrivers } = useDriverStore();

  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const mapRef = useRef<MapView>(null);

  // Generate driver markers
  useEffect(() => {
    if (!Array.isArray(drivers) || !userLatitude || !userLongitude) return;

    const newMarkers = generateMarkersFromData({
      data: drivers,
      userLatitude,
      userLongitude,
    });
    setMarkers(newMarkers);
    setDrivers(newMarkers); // update store
  }, [drivers, userLatitude, userLongitude, setDrivers]);

  // Calculate driver times & prices
  useEffect(() => {
    if (
      !userLatitude ||
      !userLongitude ||
      !destinationLatitude ||
      !destinationLongitude ||
      markers.length === 0
    )
      return;

    calculateDriverTimes({
      markers,
      userLatitude,
      userLongitude,
      destinationLatitude,
      destinationLongitude,
    }).then((updatedMarkers) => setDrivers(updatedMarkers as MarkerData[]));
  }, [
    markers,
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
    setDrivers,
  ]);

  // Fetch route from OSRM
  useEffect(() => {
    const fetchRoute = async () => {
      if (!userLatitude || !userLongitude || !destinationLatitude || !destinationLongitude)
        return;

      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${userLongitude},${userLatitude};${destinationLongitude},${destinationLatitude}?overview=full&geometries=geojson`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map(
            ([lon, lat]: [number, number]) => ({ latitude: lat, longitude: lon })
          );
          setRouteCoords(coords);
        }
      } catch (err) {
        console.error("OSRM route error:", err);
      }
    };

    fetchRoute();
  }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude]);

  const region = calculateRegion({
    userLatitude: userLatitude ?? LEBANON_CENTER.latitude,
    userLongitude: userLongitude ?? LEBANON_CENTER.longitude,
    destinationLatitude: destinationLatitude ?? LEBANON_CENTER.latitude,
    destinationLongitude: destinationLongitude ?? LEBANON_CENTER.longitude,
  });

  if (loading || !userLatitude || !userLongitude)
    return (
      <View className="flex justify-center items-center w-full">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );

  if (error)
    return (
      <View className="flex justify-center items-center w-full">
        <Text>Error: {error}</Text>
      </View>
    );

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={{ flex: 1 }}
      mapType={Platform.OS === "ios" ? "mutedStandard" : "standard"}
      showsUserLocation
      showsPointsOfInterest={false}
      initialRegion={region}
      userInterfaceStyle="light"
    >
      {/* Driver markers */}
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          title={marker.title}
          image={selectedDriver === marker.id ? icons.selectedMarker : icons.marker}
          onPress={() => setSelectedDriver(marker.id)}
        />
      ))}

      {/* Destination marker */}
      {destinationLatitude && destinationLongitude && (
        <Marker
          key="destination"
          coordinate={{ latitude: destinationLatitude, longitude: destinationLongitude }}
          title="Destination"
          image={icons.pin}
        />
      )}

      {/* Draw route from OSRM */}
      {routeCoords.length > 0 && (
        <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="#0286FF" />
      )}
    </MapView>
  );
};

export default Map;
