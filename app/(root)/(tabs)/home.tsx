import { SignOutButton } from "@/components/SignOutButton";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home =() => {
  return (
    <SafeAreaView>
      <Text>Home Screen</Text>
      <SignOutButton />
    </SafeAreaView>

  );
};

export default Home;