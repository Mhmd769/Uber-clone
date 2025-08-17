import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, UrlTile } from "react-native-maps";
import { useFetch } from "@/lib/fetch";
import { useDriverStore, useLocationStore } from "@/store";
import { Driver, MarkerData } from "@/types/type";
import { generateMarkersFromData, calculateDriverTimes } from "@/lib/map";
import { icons } from "@/constants";

const LEBANON_CENTER = { latitude: 33.8547, longitude: 35.8623, latitudeDelta: 0.1, longitudeDelta: 0.1 };

const Map = () => {
  const { userLatitude, userLongitude, destinationLatitude, destinationLongitude } = useLocationStore();
  const { selectedDriver, setSelectedDriver, setDrivers } = useDriverStore();

  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);

  // Generate driver markers
  useEffect(() => {
    if (!Array.isArray(drivers) || !userLatitude || !userLongitude) return;

    const newMarkers = generateMarkersFromData({
      data: drivers,
      userLatitude,
      userLongitude,
    });
    setMarkers(newMarkers);
    setDrivers(newMarkers);
  }, [drivers, userLatitude, userLongitude, setDrivers]);

  // Calculate driver times & prices
  useEffect(() => {
    if (!userLatitude || !userLongitude || !destinationLatitude || !destinationLongitude || markers.length === 0) return;

    calculateDriverTimes({
      markers,
      userLatitude,
      userLongitude,
      destinationLatitude,
      destinationLongitude,
    }).then((updatedMarkers) => setDrivers(updatedMarkers as MarkerData[]));
  }, [markers, userLatitude, userLongitude, destinationLatitude, destinationLongitude, setDrivers]);

  // Fetch route from OSRM
  useEffect(() => {
    const fetchRoute = async () => {
      if (!userLatitude || !userLongitude || !destinationLatitude || !destinationLongitude) return;

      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${userLongitude},${userLatitude};${destinationLongitude},${destinationLatitude}?overview=full&geometries=geojson`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map((c: number[]) => ({
            latitude: c[1],
            longitude: c[0],
          }));
          setRouteCoords(coords);
        }
      } catch (err) {
        console.error("OSRM route error:", err);
      }
    };

    fetchRoute();
  }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude]);

  if (loading || !userLatitude || !userLongitude)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );

  if (error)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error: {error}</Text>
      </View>
    );

  return (
<MapView
  style={{ flex: 1 }}
  provider={PROVIDER_DEFAULT}
  initialRegion={{
    latitude: userLatitude ?? LEBANON_CENTER.latitude,
    longitude: userLongitude ?? LEBANON_CENTER.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }}
>
  {/* Free Carto Light tiles (OSM-based) */}
  <UrlTile
    urlTemplate="https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
    maximumZ={19}
    flipY={false}
  />

  {/* User location marker (red) */}
  {userLatitude && userLongitude && (
    <Marker
      coordinate={{ latitude: userLatitude, longitude: userLongitude }}
      pinColor="red" // <-- red pin for user's location
    />
  )}

  {/* Driver markers */}
  {markers.map((marker) => (
    <Marker
      key={marker.id.toString()}
      coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
      onPress={() => setSelectedDriver(marker.id)}
      image={selectedDriver === marker.id ? icons.selectedMarker : icons.marker} // <-- car icon
    />
  ))}

  {/* Destination marker */}
  {destinationLatitude && destinationLongitude && (
    <Marker
      key="destination"
      coordinate={{ latitude: destinationLatitude, longitude: destinationLongitude }}
      pinColor="green"
    />
  )}

  {/* Route polyline */}
  {routeCoords.length > 0 && (
    <Polyline
      coordinates={routeCoords}
      strokeColor="#0286FF"
      strokeWidth={4}
    />
  )}
</MapView>

  );
};

export default Map;
