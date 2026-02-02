import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/theme";

interface LevelBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
}

export function LevelBadge({ level, size = "md" }: LevelBadgeProps) {
  const sizeConfig = {
    sm: { size: 24, fontSize: 12 },
    md: { size: 32, fontSize: 14 },
    lg: { size: 48, fontSize: 18 },
  };

  const config = sizeConfig[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: config.size,
          height: config.size,
          backgroundColor: colors.primary[500],
        },
      ]}
    >
      <Text style={[styles.text, { fontSize: config.fontSize }]}>{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  text: {
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
