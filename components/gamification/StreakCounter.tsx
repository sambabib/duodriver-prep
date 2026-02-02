import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useThemeColors";

interface StreakCounterProps {
  streak: number;
  size?: "sm" | "md" | "lg";
}

export function StreakCounter({ streak, size = "md" }: StreakCounterProps) {
  const { isDark } = useThemeColors();

  const sizeConfig = {
    sm: { icon: 20, fontSize: 14, paddingH: 8, paddingV: 4 },
    md: { icon: 24, fontSize: 16, paddingH: 12, paddingV: 6 },
    lg: { icon: 32, fontSize: 20, paddingH: 16, paddingV: 8 },
  };

  const config = sizeConfig[size];

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: config.paddingH,
          paddingVertical: config.paddingV,
          backgroundColor: isDark ? "rgba(245, 158, 11, 0.2)" : colors.warning[100],
        },
      ]}
    >
      <Ionicons
        name="flame"
        size={config.icon}
        color={streak > 0 ? colors.warning[500] : "#A1A1AA"}
      />
      <Text
        style={[
          styles.text,
          {
            fontSize: config.fontSize,
            color: streak > 0 ? (isDark ? colors.warning[400] : colors.warning[600]) : "#A1A1AA",
          },
        ]}
      >
        {streak}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
  },
  text: {
    fontWeight: "700",
    marginLeft: 4,
  },
});
