import React from "react";
import { View, Text, StyleSheet } from "react-native";

type StatProgressBarProps = {
  progress: number;
  fillColor: string;
  trackColor: string;
  minFillWidth?: number;
  showPercentPill?: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function StatProgressBar({
  progress,
  fillColor,
  trackColor,
  minFillWidth = 64,
  showPercentPill = true,
}: StatProgressBarProps) {
  const clampedProgress = clamp(progress, 0, 1);
  const percent = Math.round(clampedProgress * 100);
  const showFill = percent > 0;

  return (
    <View style={[styles.track, { backgroundColor: trackColor }]}>
      {showFill ? (
        <View
          style={[
            styles.fill,
            {
              width: `${percent}%`,
              minWidth: minFillWidth,
              backgroundColor: fillColor,
            },
          ]}
        >
          {showPercentPill ? (
            <View style={styles.pill}>
              <Text style={styles.pillText}>{percent}%</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    height: 44,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 14,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  pill: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
  },
});
