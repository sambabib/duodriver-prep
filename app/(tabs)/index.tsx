import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "@/store/useUserStore";
import { StreakCounter, HeartsDisplay, XPDisplay } from "@/components/gamification";
import { Button } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useThemeColors } from "@/hooks/useThemeColors";
import { colors } from "@/constants/theme";
import { categories } from "@/constants/categories";

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
const lineChartWidth = 170;
const lineChartHeight = 62;
const heartsMeterWidth = 170;
const heartsMeterHeight = 44;
const heartSlots = 5;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function buildSparkSeries(ratio: number, seed: number) {
  return weekDays.map((_, index) => {
    const wobble = ((seed + index * 17) % 23) - 11;
    return clamp(Math.round(28 + ratio * 56 + wobble), 14, 92);
  });
}

type StatCardBase = {
  key: string;
  title: string;
  valueMain: string;
  valueMeta?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  tint: string;
};

type StatCardLine = StatCardBase & {
  kind: "line";
  series: number[];
};

type StatCardRing = StatCardBase & {
  kind: "ring";
};

type StatCard = StatCardLine | StatCardRing;

export default function HomeScreen() {
  const { progress } = useUserStore();
  const { background, surface, text, textMuted, border, isDark } = useThemeColors();
  const accuracy =
    progress.questionsAnswered > 0
      ? Math.round((progress.correctAnswers / progress.questionsAnswered) * 100)
      : 0;
  const totalQuestionPool = categories.reduce((sum, category) => sum + category.totalQuestions, 0);
  const answeredForProgress = Math.min(progress.questionsAnswered, totalQuestionPool);
  const bankProgress = totalQuestionPool > 0 ? Math.round((answeredForProgress / totalQuestionPool) * 100) : 0;
  const showProgress = bankProgress > 0;
  const answeredRatio = totalQuestionPool > 0 ? answeredForProgress / totalQuestionPool : 0;
  const correctRatio = progress.questionsAnswered > 0 ? progress.correctAnswers / progress.questionsAnswered : 0;
  const accuracyRatio = accuracy / 100;
  const filledHearts = clamp(progress.hearts, 0, heartSlots);

  const statCards: StatCard[] = [
    {
      key: "correct",
      title: "Correct",
      valueMain: `${progress.correctAnswers}`,
      valueMeta: progress.correctAnswers === 1 ? "answer" : "answers",
      icon: "checkmark-circle" as const,
      color: colors.success[500],
      tint: isDark ? "rgba(34,197,94,0.22)" : colors.success[100],
      series: buildSparkSeries(correctRatio, progress.correctAnswers + 11),
      kind: "line",
    },
    {
      key: "accuracy",
      title: "Accuracy",
      valueMain: `${accuracy}`,
      valueMeta: "of 100%",
      icon: "speedometer" as const,
      color: colors.warning[500],
      tint: isDark ? "rgba(245,158,11,0.22)" : colors.warning[100],
      series: buildSparkSeries(accuracyRatio, accuracy + 7),
      kind: "line",
    },
    {
      key: "hearts",
      title: "Hearts",
      valueMain: `${progress.hearts}`,
      valueMeta: `of ${progress.maxHearts}`,
      icon: "heart" as const,
      color: colors.error[500],
      tint: isDark ? "rgba(239,68,68,0.24)" : colors.error[100],
      kind: "ring",
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View
            style={[
              styles.statusIsland,
              {
                backgroundColor: surface,
                borderColor: border,
                shadowColor: isDark ? "#000000" : "#18181B",
              },
            ]}
          >
            <StreakCounter streak={progress.dayStreak} size="sm" />
            <View style={[styles.islandDivider, { backgroundColor: border }]} />
            <HeartsDisplay hearts={progress.hearts} maxHearts={progress.maxHearts} size="sm" />
            <View style={[styles.islandDivider, { backgroundColor: border }]} />
            <XPDisplay xp={progress.totalXP} size="sm" />
          </View>
        </View>

        <View
          style={[
            styles.welcomeCard,
            {
              backgroundColor: surface,
              borderColor: border,
            },
          ]}
        >
          <View
            style={[
              styles.cardGlowPrimary,
              {
                backgroundColor: isDark ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.14)",
              },
            ]}
          />
          <View
            style={[
              styles.cardGlowSecondary,
              {
                backgroundColor: isDark ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.09)",
              },
            ]}
          />
          <Text style={[styles.welcomeTitle, { color: text }]}>Ready to practice?</Text>
          <Text style={[styles.welcomeSubtitle, { color: textMuted }]}>
            Master the UK driving theory test with daily practice sessions.
          </Text>
          <Button
            title="Start Practice"
            variant="primary"
            size="sm"
            style={styles.welcomeButton}
            icon={<Ionicons name="play" size={20} color="#FFFFFF" />}
            onPress={() => router.push("/practice")}
          />
        </View>

        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: text }]}>Your Practice Stats</Text>
          <Text style={[styles.sectionSubtitle, { color: textMuted }]}>
            Track your UK theory progress through practice quizzes, not lessons.
          </Text>

          <View style={[styles.progressCard, { backgroundColor: surface, borderColor: border }]}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressTitle, { color: text }]}>Question Bank Progress</Text>
              <Text style={[styles.progressCount, { color: textMuted }]}>
                {answeredForProgress}/{totalQuestionPool}
              </Text>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: isDark ? "#242428" : "#E7E8EB" }]}>
              {showProgress ? (
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${bankProgress}%`,
                      minWidth: 64,
                      backgroundColor: colors.success[500],
                    },
                  ]}
                >
                  <View style={styles.progressPill}>
                    <Text style={styles.progressPillText}>{bankProgress}%</Text>
                  </View>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.statWideList}>
            {statCards.map((card) => (
              <View key={card.key} style={[styles.statWideCard, { backgroundColor: surface, borderColor: border }]}>
                <View style={styles.statCardTopRow}>
                  <View style={styles.statTitleRow}>
                    <View style={[styles.statIconWrap, { backgroundColor: card.tint }]}>
                      <Ionicons name={card.icon} size={18} color={card.color} />
                    </View>
                    <Text style={[styles.statWideTitle, { color: text }]}>{card.title}</Text>
                  </View>
                  <View style={styles.valueRow}>
                    <Text style={[styles.statWideValue, { color: card.color }]}>{card.valueMain}</Text>
                    {card.valueMeta ? (
                      <Text style={[styles.statWideMeta, { color: textMuted }]}>{card.valueMeta}</Text>
                    ) : null}
                  </View>
                </View>

                <View style={styles.statCardBottom}>
                  {card.kind === "line" ? (
                    <View style={styles.lineChartWrap}>
                      <View style={styles.lineChartArea}>
                        {card.series.map((value, index) => {
                          if (index === card.series.length - 1) return null;
                          const currentX = (index / (card.series.length - 1)) * lineChartWidth;
                          const nextX = ((index + 1) / (card.series.length - 1)) * lineChartWidth;
                          const currentY = lineChartHeight - (value / 100) * lineChartHeight;
                          const nextY = lineChartHeight - (card.series[index + 1] / 100) * lineChartHeight;
                          const dx = nextX - currentX;
                          const dy = nextY - currentY;
                          const length = Math.sqrt(dx * dx + dy * dy);
                          const angle = Math.atan2(dy, dx);

                          return (
                            <View
                              key={`${card.key}-seg-${index}`}
                              style={[
                                styles.lineSegment,
                                {
                                  width: length,
                                  left: currentX + dx / 2 - length / 2,
                                  top: currentY + dy / 2 - 1.5,
                                  backgroundColor: card.color,
                                  transform: [{ rotate: `${angle}rad` }],
                                },
                              ]}
                            />
                          );
                        })}

                        {card.series.map((value, index) => {
                          const x = (index / (card.series.length - 1)) * lineChartWidth;
                          const y = lineChartHeight - (value / 100) * lineChartHeight;
                          return (
                            <View
                              key={`${card.key}-dot-${index}`}
                              style={[
                                styles.lineDot,
                                { left: x - 2.5, top: y - 2.5, borderColor: card.color, backgroundColor: surface },
                              ]}
                            />
                          );
                        })}
                      </View>
                      <View style={styles.sparkLabels}>
                        {weekDays.map((day, index) => (
                          <Text key={`${card.key}-${day}-${index}`} style={[styles.sparkLabel, { color: textMuted }]}>
                            {day}
                          </Text>
                        ))}
                      </View>
                    </View>
                  ) : (
                    <View style={styles.heartsGaugeCard}>
                      <View style={styles.heartsMeterRow}>
                        {Array.from({ length: heartSlots }).map((_, index) => (
                          <Ionicons
                            key={`${card.key}-slot-${index}`}
                            name={index < filledHearts ? "heart" : "heart-outline"}
                            size={26}
                            color={index < filledHearts ? colors.error[500] : isDark ? "rgba(255,255,255,0.42)" : "#9CA0AA"}
                          />
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 22, paddingBottom: 36 },
  header: { alignItems: "center", paddingVertical: 14 },
  statusIsland: {
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
  islandDivider: { width: 1, height: 18, opacity: 0.8 },
  welcomeTitle: { fontSize: 24, lineHeight: 30, fontWeight: "700" },
  welcomeSubtitle: { marginTop: 10, fontSize: 15, lineHeight: 24 },
  welcomeButton: { marginTop: 22 },
  welcomeCard: {
    borderRadius: 22,
    padding: 24,
    marginTop: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardGlowPrimary: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    top: -70,
    right: -40,
  },
  cardGlowSecondary: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    bottom: -65,
    left: -30,
  },
  statsSection: {
    marginTop: 26,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  sectionSubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
  },
  progressCard: {
    marginTop: 14,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
  },
  progressCount: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "700",
  },
  progressTrack: {
    width: "100%",
    height: 44,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 14,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  progressPill: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  progressPillText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
  },
  statWideList: {
    marginTop: 14,
    gap: 12,
  },
  statWideCard: {
    width: "100%",
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "column",
    minHeight: 176,
  },
  statCardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  statCardBottom: {
    marginTop: 14,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  statTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  statWideTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
  },
  statWideValue: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "700",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    flexShrink: 0,
  },
  statWideMeta: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  lineChartWrap: {
    width: "100%",
    alignItems: "center",
  },
  lineChartArea: {
    width: lineChartWidth,
    height: lineChartHeight,
    position: "relative",
  },
  lineSegment: {
    position: "absolute",
    height: 3,
    borderRadius: 2,
  },
  lineDot: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  sparkLabels: {
    marginTop: 8,
    width: lineChartWidth,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sparkLabel: {
    width: 10,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "600",
  },
  heartsGaugeCard: {
    width: "100%",
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  heartsMeterRow: {
    width: heartsMeterWidth,
    height: heartsMeterHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
