import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Defs, LinearGradient, Path, Pattern, Rect, Stop } from "react-native-svg";
import { colors } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ChartPoint, computeTrend, formatDelta } from "./utils";

interface ProgressKpiCardProps {
  title: string;
  metric: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  accentColor: string;
  series?: ChartPoint[];
}

const CHART_HEIGHT = 132;

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

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const full = normalized.length === 3
    ? normalized.split("").map((char) => `${char}${char}`).join("")
    : normalized;
  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function ProgressKpiCard({
  title,
  metric,
  subtitle,
  icon,
  accentColor,
  series = [],
}: ProgressKpiCardProps) {
  const { isDark, border, text, textMuted } = useThemeColors();
  const [chartWidth, setChartWidth] = useState(0);

  const trend = useMemo(() => computeTrend(series), [series]);

  const chartData = useMemo(() => {
    if (series.length < 2 || chartWidth <= 0) {
      return {
        linePath: "",
        areaPath: "",
        marker: null as { x: number; y: number } | null,
      };
    }
    const values = series.map((item) => item.value);
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const range = Math.max(1, max - min);
    const denominator = Math.max(1, series.length - 1);

    const points = series.map((item, index) => {
      const x = (index / denominator) * chartWidth;
      const normalizedY = (item.value - min) / range;
      const y = CHART_HEIGHT - normalizedY * (CHART_HEIGHT - 10) - 6;
      return { x, y };
    });

    return {
      linePath: buildLinePath(points),
      areaPath: buildAreaPath(points, CHART_HEIGHT),
      marker: points[points.length - 1] ?? null,
    };
  }, [series, chartWidth]);

  const trendTone =
    trend.direction === "up"
      ? colors.success[500]
      : trend.direction === "down"
      ? colors.error[500]
      : textMuted;
  const chartKey = useMemo(
    () => `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${accentColor.replace("#", "")}`,
    [title, accentColor]
  );
  const gradientId = `kpi-gradient-${chartKey}`;
  const dotsId = `kpi-dots-${chartKey}`;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? hexToRgba(accentColor, 0.18) : hexToRgba(accentColor, 0.12),
          borderColor: border,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "#FFFFFF",
              borderColor: isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.07)",
            },
          ]}
        >
          <Ionicons name={icon} size={16} color={text} />
        </View>
        <Text numberOfLines={1} style={[styles.title, { color: text }]}>
          {title}
        </Text>
        <View style={[styles.deltaChip, { borderColor: trendTone }]}>
          <Text style={[styles.deltaText, { color: trendTone }]}>{formatDelta(trend.delta)}</Text>
        </View>
      </View>

      <Text numberOfLines={1} style={[styles.metric, { color: text }]}>
        {metric}
      </Text>
      <Text numberOfLines={1} style={[styles.subtitle, { color: textMuted }]}>
        {subtitle}
      </Text>

      <View style={styles.sparkWrap} onLayout={(event) => setChartWidth(event.nativeEvent.layout.width)}>
        {chartWidth > 0 ? (
          <Svg width={chartWidth} height={CHART_HEIGHT}>
            <Defs>
              <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={accentColor} stopOpacity={0.36} />
                <Stop offset="100%" stopColor={accentColor} stopOpacity={0.03} />
              </LinearGradient>
              <Pattern id={dotsId} patternUnits="userSpaceOnUse" width="10" height="10">
                <Circle
                  cx="1.5"
                  cy="1.5"
                  r="1"
                  fill={isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.08)"}
                />
              </Pattern>
            </Defs>
            <Rect x={0} y={0} width={chartWidth} height={CHART_HEIGHT} fill={`url(#${dotsId})`} />
            {chartData.areaPath ? <Path d={chartData.areaPath} fill={`url(#${gradientId})`} /> : null}
            {chartData.linePath ? (
              <Path d={chartData.linePath} stroke={accentColor} strokeWidth={2.8} fill="none" />
            ) : null}
            {chartData.marker ? (
              <Circle cx={chartData.marker.x} cy={chartData.marker.y} r={4.5} fill={accentColor} />
            ) : null}
          </Svg>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
    minHeight: 250,
    overflow: "hidden",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600",
  },
  deltaChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  deltaText: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: "700",
  },
  metric: {
    marginTop: 12,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "500",
  },
  sparkWrap: {
    marginTop: 12,
    height: CHART_HEIGHT,
  },
});
