import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "@/store/useUserStore";
import { StatusIsland } from "@/components/gamification";
import { Button, MiniProgressRing, StatProgressBar } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useThemeColors } from "@/hooks/useThemeColors";
import { colors } from "@/constants/theme";
import { categories } from "@/constants/categories";

type StatCard = {
  key: "accuracy" | "hearts";
  title: string;
  metric: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  progressRatio: number;
};

function clamp(amount: number, min: number, max: number) {
  return Math.max(min, Math.min(max, amount));
}

export default function HomeScreen() {
  const { progress } = useUserStore();
  const { background, surface, text, textMuted, border, isDark } = useThemeColors();

  const accuracy =
    progress.questionsAnswered > 0
      ? Math.round((progress.correctAnswers / progress.questionsAnswered) * 100)
      : 0;

  const totalQuestionPool = categories.reduce((sum, category) => sum + category.totalQuestions, 0);
  const answeredForProgress = Math.min(progress.questionsAnswered, totalQuestionPool);
  const practiceRatio = totalQuestionPool > 0 ? answeredForProgress / totalQuestionPool : 0;

  const accuracyProgress = clamp(accuracy / 100, 0, 1);
  const heartsProgress = progress.maxHearts > 0 ? clamp(progress.hearts / progress.maxHearts, 0, 1) : 0;

  const statCards: StatCard[] = [
    {
      key: "accuracy",
      title: "Accuracy",
      metric: `${accuracy}`,
      icon: "speedometer" as const,
      color: colors.warning[500],
      progressRatio: accuracyProgress,
    },
    {
      key: "hearts",
      title: "Hearts",
      metric: `${progress.hearts}`,
      icon: "heart" as const,
      color: colors.error[500],
      progressRatio: heartsProgress,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}> 
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <StatusIsland
            streak={progress.dayStreak}
            hearts={progress.hearts}
            maxHearts={progress.maxHearts}
            xp={progress.totalXP}
          />
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
          <Text style={[styles.welcomeTitle, { color: text }]}>Ready to practice?</Text>
          <Text style={[styles.welcomeSubtitle, { color: textMuted }]}> 
            Master the UK driving theory test with daily practice sessions.
          </Text>
          <Button
            title="Start Practice"
            variant="primary"
            size="md"
            style={styles.welcomeButton}
            icon={<Ionicons name="play" size={18} color="#FFFFFF" />}
            onPress={() => router.push("/practice")}
          />
        </View>

        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: text }]}>Your Stats</Text>
          <Text style={[styles.sectionSubtitle, { color: textMuted }]}>Little wins add up.</Text>

          <View style={[styles.progressCard, { backgroundColor: surface, borderColor: border }]}> 
            <View style={styles.progressHeader}>
              <Text style={[styles.progressTitle, { color: text }]}>Practice Progress</Text>
              <Text style={[styles.progressCount, { color: textMuted }]}> 
                {answeredForProgress}/{totalQuestionPool}
              </Text>
            </View>
            <StatProgressBar
              progress={practiceRatio}
              fillColor={colors.success[500]}
              trackColor={isDark ? "#242428" : "#E7E8EB"}
            />
          </View>

          <View style={styles.statGrid}>
            {statCards.map((card) => (
              <View key={card.key} style={[styles.statCard, { backgroundColor: surface, borderColor: border }]}> 
                <View style={styles.statCardTop}>
                  <View style={styles.statTitleRow}>
                    <View
                      style={[
                        styles.statIconWrap,
                        {
                          backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#F1F2F4",
                          borderColor: isDark ? "rgba(255,255,255,0.08)" : "#E4E6EA",
                        },
                      ]}
                    >
                      <Ionicons name={card.icon} size={17} color={textMuted} />
                    </View>
                    <Text numberOfLines={1} style={[styles.statTitle, { color: textMuted }]}>
                      {card.title}
                    </Text>
                  </View>
                </View>

                <View style={styles.statMetricRow}>
                  <Text numberOfLines={1} style={[styles.statMetric, { color: text }]}>
                    {card.metric}
                  </Text>
                  <MiniProgressRing
                    progress={card.progressRatio}
                    color={card.color}
                    size={30}
                    strokeWidth={4}
                    trackColor={isDark ? "rgba(255,255,255,0.16)" : "#E7E9EE"}
                  />
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
  statGrid: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 12,
  },
  statCard: {
    width: "48.25%",
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 126,
    justifyContent: "space-between",
  },
  statCardTop: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 8,
  },
  statTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  statIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "500",
    flexShrink: 1,
  },
  statMetricRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  statMetric: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
});
