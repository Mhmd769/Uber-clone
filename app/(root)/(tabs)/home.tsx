import { SignOutButton } from "@/components/SignOutButton";
import { useUser, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home =() => {

  const {user}=useUser();
  return (
    <SafeAreaView>
      <SignedIn>
          <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in">
          <Text>Sign In</Text>
        </Link>
        <Link href="/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </SafeAreaView>

  );
};

export default Home;