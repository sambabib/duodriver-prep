import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useThemeColors";

interface HeartsDisplayProps {
  hearts: number;
  maxHearts: number;
  size?: "sm" | "md" | "lg";
}

export function HeartsDisplay({
  hearts,
  maxHearts,
  size = "md",
}: HeartsDisplayProps) {
  const { isDark } = useThemeColors();

  const sizeConfig = {
    sm: { icon: 16, fontSize: 14, paddingH: 8, paddingV: 4 },
    md: { icon: 20, fontSize: 16, paddingH: 12, paddingV: 6 },
    lg: { icon: 28, fontSize: 20, paddingH: 16, paddingV: 8 },
  };

  const config = sizeConfig[size];

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: config.paddingH,
          paddingVertical: config.paddingV,
          backgroundColor: isDark ? "rgba(239, 68, 68, 0.2)" : colors.error[100],
        },
      ]}
    >
      <Ionicons
        name={hearts > 0 ? "heart" : "heart-outline"}
        size={config.icon}
        color={hearts > 0 ? colors.error[500] : "#A1A1AA"}
      />
      <Text
        style={[
          styles.text,
          {
            fontSize: config.fontSize,
            color: hearts > 0 ? (isDark ? colors.error[400] : colors.error[600]) : "#A1A1AA",
          },
        ]}
      >
        {hearts}
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
