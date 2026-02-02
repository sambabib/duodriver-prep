import { colors } from "@/constants/theme";
import { useColorScheme } from "./useColorScheme";

export function useThemeColors() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return {
    isDark,
    background: isDark ? colors.dark.background : colors.light.background,
    surface: isDark ? colors.dark.surface : colors.light.surface,
    text: isDark ? colors.dark.text : colors.light.text,
    textMuted: isDark ? colors.dark.textMuted : colors.light.textMuted,
    border: isDark ? colors.dark.border : colors.light.border,
    primary: colors.primary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
  };
}
