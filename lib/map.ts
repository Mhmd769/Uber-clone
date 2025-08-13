import { Driver, MarkerData } from "@/types/type";

/**
 * Generate markers from driver data around the user's location.
 */
export const generateMarkersFromData = ({
  data,
  userLatitude,
  userLongitude,
}: {
  data: Driver[];
  userLatitude: number;
  userLongitude: number;
}): MarkerData[] => {
  return data.map((driver) => {
    const latOffset = (Math.random() - 0.5) * 0.01;
    const lngOffset = (Math.random() - 0.5) * 0.01;
    return {
      id: driver.driver_id,
      latitude: userLatitude + latOffset,
      longitude: userLongitude + lngOffset,
      title: `${driver.first_name} ${driver.last_name}`,
      first_name: driver.first_name,
      last_name: driver.last_name,
      rating: parseFloat(driver.rating) || 5,
      car_seats: driver.car_seats,
      profile_image_url: driver.profile_image_url,
      car_image_url: driver.car_image_url,
    };
  });
};

/**
 * Calculate map region for user and destination.
 */
export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
}) => {
  const DEFAULT_CENTER = { latitude: 33.8547, longitude: 35.8623, latitudeDelta: 0.5, longitudeDelta: 0.5 };
  if (!userLatitude || !userLongitude) return DEFAULT_CENTER;
  if (!destinationLatitude || !destinationLongitude) {
    return { latitude: userLatitude, longitude: userLongitude, latitudeDelta: 0.01, longitudeDelta: 0.01 };
  }
  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);
  return {
    latitude: (userLatitude + destinationLatitude) / 2,
    longitude: (userLongitude + destinationLongitude) / 2,
    latitudeDelta: (maxLat - minLat) * 1.3,
    longitudeDelta: (maxLng - minLng) * 1.3,
  };
};

/**
 * Calculate driver times and prices using OSRM (free).
 */
export const calculateDriverTimes = async ({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}: {
  markers: MarkerData[];
  userLatitude: number | null;
  userLongitude: number | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
}): Promise<MarkerData[]> => {
  if (!userLatitude || !userLongitude || !destinationLatitude || !destinationLongitude) return markers;

  try {
    const promises = markers.map(async (marker) => {
      // driver -> user
      const resToUser = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${marker.longitude},${marker.latitude};${userLongitude},${userLatitude}?overview=false`
      );
      const dataToUser = await resToUser.json();
      const timeToUser = dataToUser.routes?.[0]?.duration ?? 0; // seconds
      const distanceToUser = dataToUser.routes?.[0]?.distance ?? 0; // meters

      // user -> destination
      const resToDest = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${userLongitude},${userLatitude};${destinationLongitude},${destinationLatitude}?overview=false`
      );
      const dataToDest = await resToDest.json();
      const timeToDestination = dataToDest.routes?.[0]?.duration ?? 0;
      const distanceToDestination = dataToDest.routes?.[0]?.distance ?? 0;

      const totalTime = (timeToUser + timeToDestination) / 60; // minutes
      const totalDistance = (distanceToUser + distanceToDestination) / 1000; // km
      const price = (totalDistance * 1).toFixed(2); // $1 per km

      return { ...marker, time: totalTime, price };
    });

    return await Promise.all(promises);
  } catch (error) {
    console.error("Error calculating driver times:", error);
    return markers;
  }
};
