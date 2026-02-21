import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TextInput } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as SplashScreen from "expo-splash-screen";
import { colors } from "@/constants/theme";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";

void SplashScreen.preventAutoHideAsync();

let typographyApplied = false;

function resolvePoppinsFamily(style: unknown) {
  const flattened = StyleSheet.flatten(style) || {};

  if (flattened.fontFamily) {
    return null;
  }

  const weight = `${flattened.fontWeight ?? "400"}`;

  if (weight === "700" || weight === "800" || weight === "900" || weight === "bold") {
    return "Poppins_700Bold";
  }
  if (weight === "600") {
    return "Poppins_600SemiBold";
  }
  if (weight === "500") {
    return "Poppins_500Medium";
  }
  return "Poppins_400Regular";
}

function applyGlobalTypography() {
  if (typographyApplied) return;
  typographyApplied = true;

  const originalTextRender = (Text as unknown as { render?: Function }).render;
  if (typeof originalTextRender === "function") {
    (Text as unknown as { render: Function }).render = (props: Record<string, unknown>, ...args: unknown[]) => {
      const fontFamily = resolvePoppinsFamily(props?.style);
      if (!fontFamily) return originalTextRender(props, ...args);
      return originalTextRender(
        {
          ...props,
          style: [props?.style, { fontFamily, fontWeight: "normal" }],
        },
        ...args
      );
    };
  }

  const originalTextInputRender = (TextInput as unknown as { render?: Function }).render;
  if (typeof originalTextInputRender === "function") {
    (TextInput as unknown as { render: Function }).render = (props: Record<string, unknown>, ...args: unknown[]) => {
      const fontFamily = resolvePoppinsFamily(props?.style);
      if (!fontFamily) return originalTextInputRender(props, ...args);
      return originalTextInputRender(
        {
          ...props,
          style: [props?.style, { fontFamily, fontWeight: "normal" }],
        },
        ...args
      );
    };
  }
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    if (!fontsLoaded) return;
    applyGlobalTypography();
    void SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: isDark ? colors.dark.background : colors.light.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
