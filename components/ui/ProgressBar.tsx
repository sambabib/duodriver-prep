import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useThemeColors";

interface ProgressBarProps {
  progress: number;
  total: number;
  showLabel?: boolean;
  variant?: "primary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  progress,
  total,
  showLabel = false,
  variant = "primary",
  size = "md",
}: ProgressBarProps) {
  const { text, textMuted, border } = useThemeColors();
  const percentage = Math.min((progress / total) * 100, 100);

  const variantColors = {
    primary: colors.primary[500],
    success: colors.success[500],
    warning: colors.warning[500],
    error: colors.error[500],
  };

  const sizeHeights = {
    sm: 4,
    md: 8,
    lg: 12,
  };

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={[styles.labelText, { color: textMuted }]}>Progress</Text>
          <Text style={[styles.labelValue, { color: text }]}>
            {progress}/{total}
          </Text>
        </View>
      )}
      <View style={[styles.track, { height: sizeHeights[size], backgroundColor: border }]}>
        <View
          style={[
            styles.fill,
            { backgroundColor: variantColors[variant], width: `${percentage}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  labelText: {
    fontSize: 14,
  },
  labelValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  track: {
    width: "100%",
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
});
