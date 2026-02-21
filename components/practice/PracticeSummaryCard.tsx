import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { colors } from "@/constants/theme";

interface PracticeSummaryCardProps {
  streak: number;
  hearts: number;
  maxHearts: number;
  xp: number;
  accuracy: number;
  onContinue: () => void;
}

export function PracticeSummaryCard({
  streak,
  hearts,
  maxHearts,
  xp,
  accuracy,
  onContinue,
}: PracticeSummaryCardProps) {
  const { surface, border, text, textMuted, isDark } = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: surface, borderColor: border }]}>
      <View style={styles.metricsRow}>
        <View style={[styles.metricChip, { backgroundColor: isDark ? "rgba(245,158,11,0.18)" : colors.warning[100] }]}>
          <Ionicons name="flame" size={16} color={colors.warning[500]} />
          <Text style={[styles.metricText, { color: isDark ? colors.warning[300] : colors.warning[700] }]}>{streak}</Text>
        </View>
        <View style={[styles.metricChip, { backgroundColor: isDark ? "rgba(239,68,68,0.18)" : colors.error[100] }]}>
          <Ionicons name="heart" size={16} color={colors.error[500]} />
          <Text style={[styles.metricText, { color: isDark ? colors.error[300] : colors.error[700] }]}>{hearts}/{maxHearts}</Text>
        </View>
        <View style={[styles.metricChip, { backgroundColor: isDark ? "rgba(34,197,94,0.18)" : colors.success[100] }]}>
          <Ionicons name="star" size={16} color={colors.success[500]} />
          <Text style={[styles.metricText, { color: isDark ? colors.success[300] : colors.success[700] }]}>{xp}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={[styles.title, { color: text }]}>Continue Practice</Text>
        <Text style={[styles.subtitle, { color: textMuted }]}>
          Accuracy: {accuracy}% this run. Keep the streak alive with your next checkpoint.
        </Text>
      </View>

      <Button
        title="Continue Practice"
        variant="primary"
        size="md"
        icon={<Ionicons name="play" size={18} color="#FFFFFF" />}
        onPress={onContinue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 10,
  },
  metricChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 11,
    gap: 4,
  },
  metricText: {
    fontSize: 14,
    fontWeight: "700",
  },
  body: {
    marginTop: 14,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 7,
    fontSize: 14,
    lineHeight: 21,
  },
});
