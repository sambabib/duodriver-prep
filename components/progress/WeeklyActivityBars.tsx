import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ChartPoint } from "./utils";

interface WeeklyActivityBarsProps {
  data: ChartPoint[];
}

export function WeeklyActivityBars({ data }: WeeklyActivityBarsProps) {
  const { isDark, surface, border, text, textMuted } = useThemeColors();
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <View style={[styles.container, { backgroundColor: surface, borderColor: border }]}>
      <Text style={[styles.title, { color: text }]}>Weekly activity</Text>
      <Text style={[styles.subtitle, { color: textMuted }]}>Questions answered each day</Text>

      <View style={styles.chartRow}>
        {data.map((item) => {
          const fill = Math.max(0.05, item.value / max);
          return (
            <View key={item.dateKey} style={styles.barItem}>
              <View
                style={[
                  styles.barTrack,
                  {
                    backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#ECEFF3",
                  },
                ]}
              >
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${fill * 100}%`,
                      backgroundColor: "#8B5CF6",
                    },
                  ]}
                />
              </View>
              <Text style={[styles.barLabel, { color: textMuted }]} numberOfLines={1}>
                {item.label.slice(0, 1)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
  chartRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  barItem: {
    flex: 1,
    alignItems: "center",
    gap: 7,
  },
  barTrack: {
    width: "100%",
    maxWidth: 28,
    height: 88,
    borderRadius: 10,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 10,
    minHeight: 6,
  },
  barLabel: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "600",
  },
});
