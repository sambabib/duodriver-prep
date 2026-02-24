import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { StreakCounter } from "./StreakCounter";
import { HeartsDisplay } from "./HeartsDisplay";
import { XPDisplay } from "./XPDisplay";

interface StatusIslandProps {
  streak: number;
  hearts: number;
  maxHearts: number;
  xp: number;
  style?: StyleProp<ViewStyle>;
}

export function StatusIsland({ streak, hearts, maxHearts, xp, style }: StatusIslandProps) {
  const { surface, border, isDark } = useThemeColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: surface,
          borderColor: border,
          shadowColor: isDark ? "#000000" : "#18181B",
        },
        style,
      ]}
    >
      <StreakCounter streak={streak} size="sm" />
      <View style={[styles.divider, { backgroundColor: border }]} />
      <HeartsDisplay hearts={hearts} maxHearts={maxHearts} size="sm" />
      <View style={[styles.divider, { backgroundColor: border }]} />
      <XPDisplay xp={xp} size="sm" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 999,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 4,
  },
  divider: {
    width: 1,
    height: 18,
    opacity: 0.8,
  },
});
