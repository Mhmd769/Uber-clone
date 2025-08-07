import { SignOutButton } from "@/components/SignOutButton";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile =() => {
  return (
    <SafeAreaView>
      <Text>Profile Screen</Text>
      <SignOutButton/>
    </SafeAreaView>

  );
};

export default Profile;