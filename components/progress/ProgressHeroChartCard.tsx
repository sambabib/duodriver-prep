import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Pattern, Rect, Stop } from "react-native-svg";
import { colors } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
  ChartPoint,
  ProgressMetric,
  ProgressRange,
  computeTrend,
  formatCompactNumber,
  formatDelta,
  formatPercent,
} from "./utils";

interface ProgressHeroChartCardProps {
  metric: ProgressMetric;
  series: ChartPoint[];
  range: ProgressRange;
  onChangeMetric: (metric: ProgressMetric) => void;
  onChangeRange: (range: ProgressRange) => void;
  isDark: boolean;
}

const CHART_HEIGHT = 188;

function buildLinePath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  return points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
}

function buildAreaPath(points: { x: number; y: number }[], chartHeight: number) {
  if (points.length === 0) return "";
  const line = buildLinePath(points);
  const first = points[0];
  const last = points[points.length - 1];
  return `${line} L${last.x} ${chartHeight} L${first.x} ${chartHeight} Z`;
}

export function ProgressHeroChartCard({
  metric,
  series,
  range,
  onChangeMetric,
  onChangeRange,
  isDark,
}: ProgressHeroChartCardProps) {
  const { text, textMuted, border } = useThemeColors();
  const [chartWidth, setChartWidth] = useState(0);

  const metricConfig = {
    xp: {
      label: "XP",
      color: colors.primary[500],
      bg: isDark ? "rgba(139,92,246,0.18)" : "rgba(139,92,246,0.12)",
      renderMetric: (current: number) => formatCompactNumber(current),
      renderDelta: (delta: number) => `${formatDelta(delta)} XP`,
    },
    accuracy: {
      label: "Accuracy",
      color: colors.success[500],
      bg: isDark ? "rgba(34,197,94,0.18)" : "rgba(34,197,94,0.12)",
      renderMetric: (current: number) => formatPercent(current),
      renderDelta: (delta: number) => `${formatDelta(delta)}%`,
    },
    questions: {
      label: "Questions",
      color: colors.warning[500],
      bg: isDark ? "rgba(245,158,11,0.18)" : "rgba(245,158,11,0.12)",
      renderMetric: (current: number) => `${formatCompactNumber(current)}`,
      renderDelta: (delta: number) => `${formatDelta(delta)}`,
    },
  }[metric];

  const trend = useMemo(() => computeTrend(series), [series]);

  const chartData = useMemo(() => {
    if (chartWidth <= 0 || series.length === 0) {
      return { linePath: "", areaPath: "", marker: null as { x: number; y: number } | null };
    }

    const values = series.map((point) => point.value);
    const max = Math.max(1, ...values);
    const min = Math.min(0, ...values);
    const rangeValue = Math.max(1, max - min);
    const denominator = Math.max(1, series.length - 1);

    const points = series.map((point, index) => {
      const x = (index / denominator) * chartWidth;
      const normalizedY = (point.value - min) / rangeValue;
      const y = CHART_HEIGHT - normalizedY * (CHART_HEIGHT - 10) - 6;
      return { x, y };
    });

    return {
      linePath: buildLinePath(points),
      areaPath: buildAreaPath(points, CHART_HEIGHT),
      marker: points[points.length - 1] ?? null,
    };
  }, [chartWidth, series]);

  const trendTone =
    trend.direction === "up"
      ? colors.success[500]
      : trend.direction === "down"
      ? colors.error[500]
      : textMuted;

  const gradientId = `hero-gradient-${metric}`;
  const dotsId = `hero-dots-${metric}`;

  return (
    <View style={[styles.container, { backgroundColor: metricConfig.bg, borderColor: border }]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.metricLabel, { color: textMuted }]}>{metricConfig.label}</Text>
          <Text style={[styles.metricValue, { color: text }]}>
            {metricConfig.renderMetric(trend.current)}
          </Text>
        </View>
        <View style={[styles.deltaChip, { borderColor: trendTone }]}>
          <Text style={[styles.deltaText, { color: trendTone }]}>
            {metricConfig.renderDelta(trend.delta)}
          </Text>
        </View>
      </View>

      <View style={styles.chartWrap} onLayout={(event) => setChartWidth(event.nativeEvent.layout.width)}>
        {chartWidth > 0 ? (
          <Svg width={chartWidth} height={CHART_HEIGHT}>
            <Defs>
              <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={metricConfig.color} stopOpacity={0.38} />
                <Stop offset="100%" stopColor={metricConfig.color} stopOpacity={0.03} />
              </LinearGradient>
              <Pattern id={dotsId} patternUnits="userSpaceOnUse" width="10" height="10">
                <Circle cx="1.5" cy="1.5" r="1" fill={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)"} />
              </Pattern>
            </Defs>

            <Rect x={0} y={0} width={chartWidth} height={CHART_HEIGHT} fill={`url(#${dotsId})`} />

            {chartData.areaPath ? (
              <Path d={chartData.areaPath} fill={`url(#${gradientId})`} />
            ) : null}
            {chartData.linePath ? (
              <Path d={chartData.linePath} stroke={metricConfig.color} strokeWidth={3} fill="none" />
            ) : null}
            {chartData.marker ? (
              <Circle cx={chartData.marker.x} cy={chartData.marker.y} r={5} fill={metricConfig.color} />
            ) : null}
          </Svg>
        ) : null}
      </View>

      <View style={styles.controls}>
        <View style={styles.segmentRow}>
          {(["xp", "accuracy", "questions"] as const).map((option) => {
            const active = option === metric;
            return (
              <Pressable
                key={option}
                onPress={() => onChangeMetric(option)}
                style={[
                  styles.segmentButton,
                  {
                    backgroundColor: active
                      ? isDark
                        ? "rgba(255,255,255,0.14)"
                        : "#FFFFFF"
                      : "transparent",
                    borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)",
                  },
                ]}
              >
                <Text style={[styles.segmentText, { color: active ? text : textMuted }]}>
                  {option === "xp" ? "XP" : option === "accuracy" ? "Accuracy" : "Questions"}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.segmentRow}>
          {(["7d", "30d", "all"] as const).map((option) => {
            const active = option === range;
            return (
              <Pressable
                key={option}
                onPress={() => onChangeRange(option)}
                style={[
                  styles.segmentButton,
                  styles.rangeButton,
                  {
                    backgroundColor: active
                      ? isDark
                        ? "rgba(255,255,255,0.14)"
                        : "#FFFFFF"
                      : "transparent",
                    borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)",
                  },
                ]}
              >
                <Text style={[styles.segmentText, { color: active ? text : textMuted }]}>
                  {option === "all" ? "All" : option.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "600",
  },
  metricValue: {
    marginTop: 5,
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "700",
    letterSpacing: -0.6,
  },
  deltaChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deltaText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "700",
  },
  chartWrap: {
    height: CHART_HEIGHT,
    marginBottom: 12,
  },
  controls: {
    gap: 10,
  },
  segmentRow: {
    flexDirection: "row",
    gap: 8,
  },
  segmentButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  rangeButton: {
    paddingHorizontal: 14,
  },
  segmentText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "600",
  },
});
