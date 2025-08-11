import { router } from "expo-router";
import { Text, View } from "react-native";

import CustomButton from "@/components/CustmoeButton";
import LocationSearch from "@/components/LocationSearch";
import RideLayout from "@/components/RideLayout";
import { useLocationStore } from "@/store";

const FindRide = () => {
  const {
    userAddress,
    destinationAddress,
    setDestinationLocation,
    setUserLocation,
  } = useLocationStore();

  return (
    <RideLayout title="Ride" snapPoints={['85%']}>
      <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold mb-3">From</Text>

        <LocationSearch
          initialValue={userAddress ?? ""}
          placeholder="Enter your starting point"
          onLocationSelect={(location) => setUserLocation(location)}
        />
      </View>

      <View className="my-3">
        <Text className="text-lg font-JakartaSemiBold mb-3">To</Text>

        <LocationSearch
          initialValue={destinationAddress ?? ""}
          placeholder="Enter your destination"
          onLocationSelect={(location) => setDestinationLocation(location)}
        />
      </View>

      <CustomButton
        title="Find Now"
        onPress={() => router.push(`/(root)/confirm-ride`)}
        className="mt-5"
      />
    </RideLayout>
  );
};

export default FindRide;
