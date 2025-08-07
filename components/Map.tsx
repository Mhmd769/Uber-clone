import { View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const Map = () => {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ width: "100%", height: "100%" }}
        initialRegion={{
          latitude: 33.8274,         // Coordinates for Laylaky
          longitude: 35.5122,
          latitudeDelta: 0.01,       // Zoom level
          longitudeDelta: 0.01,
        }}
        mapType="standard"
        showsUserLocation={true}
        showsPointsOfInterest={true}
      >
        <Marker
          coordinate={{
            latitude: 33.8274,
            longitude: 35.5122,
          }}
          title="Laylaky"
          description="ليلكي - بيروت"
        />
      </MapView>
    </View>
  );
};

export default Map;
