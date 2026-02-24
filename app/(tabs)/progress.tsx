import React, { useMemo, useState } from "react";
import { Text, ScrollView, StyleSheet, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useUserStore } from "@/store/useUserStore";
import { StatusIsland } from "@/components/gamification";
import { categories } from "@/constants/categories";
import { colors } from "@/constants/theme";
import {
  ProgressKpiCard,
  ProgressRange,
  buildDateRange,
  deriveDailySeries,
  fillMissingDays,
  formatCompactNumber,
} from "@/components/progress";

export default function ProgressScreen() {
  const { progress } = useUserStore();
  const { background, text, textMuted, isDark } = useThemeColors();
  const [selectedRange, setSelectedRange] = useState<ProgressRange>("7d");

  const totalQuestionPool = useMemo(
    () => categories.reduce((sum, category) => sum + category.totalQuestions, 0),
    []
  );
  const answeredForProgress = Math.min(progress.questionsAnswered, totalQuestionPool);
  const overallAccuracy =
    progress.questionsAnswered > 0
      ? Math.round((progress.correctAnswers / progress.questionsAnswered) * 100)
      : 0;
  const bestStreak = Math.max(
    progress.dayStreak,
    ...progress.history.map((point) => point.dayStreak)
  );

  const rangeHistory = useMemo(() => {
    return fillMissingDays(buildDateRange(progress.history, selectedRange));
  }, [progress.history, selectedRange]);

  const rangeDailySeries = useMemo(() => deriveDailySeries(rangeHistory), [rangeHistory]);

  const streakSeries = useMemo(
    () =>
      rangeHistory.map((point) => ({
        dateKey: point.dateKey,
        label: point.dateKey,
        value: point.dayStreak,
      })),
    [rangeHistory]
  );

  const totalXpSeries = useMemo(
    () =>
      rangeHistory.map((point) => ({
        dateKey: point.dateKey,
        label: point.dateKey,
        value: point.totalXP,
      })),
    [rangeHistory]
  );

  const totalQuestionsSeries = useMemo(
    () =>
      rangeHistory.map((point) => ({
        dateKey: point.dateKey,
        label: point.dateKey,
        value: point.questionsAnswered,
      })),
    [rangeHistory]
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.statusIslandRow}>
          <StatusIsland
            streak={progress.dayStreak}
            hearts={progress.hearts}
            maxHearts={progress.maxHearts}
            xp={progress.totalXP}
          />
        </View>

        <Text style={[styles.title, { color: text }]}>Progress</Text>
        <Text style={[styles.subtitle, { color: textMuted }]}>
          See how your practice is trending.
        </Text>

        <View
          style={[
            styles.rangeStrip,
            {
              backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#F3F4F8",
              borderColor: isDark ? "rgba(255,255,255,0.12)" : "#E2E5EC",
            },
          ]}
        >
          <Text style={[styles.rangeLabel, { color: textMuted }]}>Time Range</Text>
          <View style={styles.rangeControls}>
            {(["7d", "30d", "all"] as const).map((option) => {
              const active = option === selectedRange;
              return (
                <Pressable
                  key={option}
                  onPress={() => setSelectedRange(option)}
                  style={[
                    styles.rangePill,
                    {
                      backgroundColor: active
                        ? isDark
                          ? "rgba(255,255,255,0.16)"
                          : "#FFFFFF"
                        : "transparent",
                      borderColor: active
                        ? isDark
                          ? "rgba(255,255,255,0.26)"
                          : "#D7DBE4"
                        : "transparent",
                    },
                  ]}
                >
                  <Text style={[styles.rangePillText, { color: active ? text : textMuted }]}>
                    {option === "all" ? "All" : option.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.kpiGrid}>
          <ProgressKpiCard
            title="Current Streak"
            metric={`${progress.dayStreak}`}
            subtitle={`Best ${bestStreak} days`}
            icon="flame"
            accentColor={colors.warning[500]}
            series={streakSeries}
          />
          <ProgressKpiCard
            title="Accuracy"
            metric={`${overallAccuracy}%`}
            subtitle={`${progress.correctAnswers}/${progress.questionsAnswered} correct`}
            icon="checkmark-circle"
            accentColor={colors.success[500]}
            series={rangeDailySeries.accuracyDaily}
          />
          <ProgressKpiCard
            title="Total XP"
            metric={formatCompactNumber(progress.totalXP)}
            subtitle={`Level ${progress.level}`}
            icon="sparkles"
            accentColor={colors.primary[500]}
            series={totalXpSeries}
          />
          <ProgressKpiCard
            title="Questions Answered"
            metric={`${progress.questionsAnswered}`}
            subtitle={`${answeredForProgress}/${totalQuestionPool} in bank`}
            icon="help-circle"
            accentColor={colors.warning[500]}
            series={totalQuestionsSeries}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 22, paddingTop: 10, paddingBottom: 32 },
  statusIslandRow: {
    alignItems: "center",
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 22,
  },
  rangeStrip: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  rangeLabel: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "700",
  },
  rangeControls: {
    flexDirection: "row",
    gap: 6,
  },
  rangePill: {
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  rangePillText: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: "700",
  },
  kpiGrid: {
    marginTop: 14,
    gap: 12,
  },
});
