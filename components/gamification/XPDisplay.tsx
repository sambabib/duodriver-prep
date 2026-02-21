import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useThemeColors";

interface XPDisplayProps {
  xp: number;
  size?: "sm" | "md" | "lg";
}

export function XPDisplay({ xp, size = "md" }: XPDisplayProps) {
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
          backgroundColor: isDark ? "rgba(34, 197, 94, 0.2)" : colors.success[100],
        },
      ]}
    >
      <Ionicons name="star" size={config.icon} color={colors.success[500]} />
      <Text
        style={[
          styles.text,
          {
            fontSize: config.fontSize,
            color: isDark ? colors.success[400] : colors.success[600],
          },
        ]}
      >
        {xp}
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
