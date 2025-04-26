import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, StatusBar } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import colors from "@/constants/colors";
import { useAuthStore } from "@/store/auth-store";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={colors.white} 
      />
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const { isAuthenticated } = useAuthStore();
  return (
    <Stack>
       {isAuthenticated ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
      <Stack.Screen 
        name="post/[id]" 
        options={{ 
          title: "Post",
          headerTintColor: colors.primary,
          headerStyle: { backgroundColor: colors.white },
        }} 
      />
      <Stack.Screen 
        name="profile/[id]" 
        options={{ 
          title: "Profile",
          headerTintColor: colors.primary,
          headerStyle: { backgroundColor: colors.white },
        }} 
      />
      <Stack.Screen 
        name="job/[id]" 
        options={{ 
          title: "Job Details",
          headerTintColor: colors.primary,
          headerStyle: { backgroundColor: colors.white },
        }} 
      />
      <Stack.Screen 
        name="messages/[id]" 
        options={{ 
          title: "Messages",
          headerTintColor: colors.primary,
          headerStyle: { backgroundColor: colors.white },
        }} 
      />
      <Stack.Screen 
        name="create-post" 
        options={{ 
          title: "Create Post",
          headerTintColor: colors.primary,
          headerStyle: { backgroundColor: colors.white },
          presentation: "modal",
        }} 
      />
      <Stack.Screen 
        name="edit-profile" 
        options={{ 
          title: "Edit Profile",
          headerTintColor: colors.primary,
          headerStyle: { backgroundColor: colors.white },
          presentation: "modal",
        }} 
      />
    </Stack>
    
  );
}