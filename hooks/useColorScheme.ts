import { useColorScheme as useNativeColorScheme } from "react-native";
import { useThemeStore } from "@/store/useThemeStore";

export function useColorScheme() {
  const systemScheme = useNativeColorScheme();
  const { mode } = useThemeStore();

  if (mode === "system") {
    return systemScheme ?? "light";
  }

  return mode;
}
