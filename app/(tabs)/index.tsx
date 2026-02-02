import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "@/store/useUserStore";
import { StreakCounter, HeartsDisplay, XPDisplay, LevelBadge } from "@/components/gamification";
import { Button } from "@/components/ui";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function HomeScreen() {
  const { progress } = useUserStore();
  const { background, surface, text, textMuted } = useThemeColors();

  const totalCompleted = Object.values(progress.categoryProgress).reduce(
    (sum, cat) => sum + cat.completed,
    0
  );
  const totalQuestions = Object.values(progress.categoryProgress).reduce(
    (sum, cat) => sum + cat.total,
    0
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <LevelBadge level={progress.level} size="md" />
            <Text style={[styles.appTitle, { color: text }]}>DuoDriver</Text>
          </View>
          <View style={styles.headerRight}>
            <StreakCounter streak={progress.dayStreak} size="sm" />
            <HeartsDisplay hearts={progress.hearts} maxHearts={progress.maxHearts} size="sm" />
            <XPDisplay xp={progress.totalXP} size="sm" />
          </View>
        </View>

        <View style={[styles.welcomeCard, { backgroundColor: colors.primary[500] }]}>
          <Text style={styles.welcomeTitle}>Ready to practice?</Text>
          <Text style={styles.welcomeSubtitle}>
            Master the UK driving theory test with daily practice sessions.
          </Text>
          <Button
            title="Start Practice"
            variant="secondary"
            size="lg"
            style={styles.welcomeButton}
            icon={<Ionicons name="play" size={20} color={colors.primary[500]} />}
            onPress={() => router.push("/practice")}
          />
        </View>

        <View style={[styles.progressCard, { backgroundColor: surface }]}>
          <Text style={[styles.sectionTitle, { color: text }]}>Your Progress</Text>
          <ProgressBar progress={totalCompleted} total={totalQuestions} showLabel variant="primary" size="lg" />
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary[500] }]}>{progress.questionsAnswered}</Text>
              <Text style={[styles.statLabel, { color: textMuted }]}>Answered</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.success[500] }]}>{progress.correctAnswers}</Text>
              <Text style={[styles.statLabel, { color: textMuted }]}>Correct</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.warning[500] }]}>
                {progress.questionsAnswered > 0 ? Math.round((progress.correctAnswers / progress.questionsAnswered) * 100) : 0}%
              </Text>
              <Text style={[styles.statLabel, { color: textMuted }]}>Accuracy</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickStatsRow}>
          <View style={[styles.quickStatCard, { backgroundColor: surface }]}>
            <Ionicons name="flame" size={32} color={colors.warning[500]} />
            <Text style={[styles.quickStatValue, { color: text }]}>{progress.dayStreak}</Text>
            <Text style={[styles.quickStatLabel, { color: textMuted }]}>Day Streak</Text>
          </View>
          <View style={[styles.quickStatCard, { backgroundColor: surface }]}>
            <Ionicons name="trophy" size={32} color={colors.primary[500]} />
            <Text style={[styles.quickStatValue, { color: text }]}>{progress.level}</Text>
            <Text style={[styles.quickStatLabel, { color: textMuted }]}>Level</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 16 },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  appTitle: { fontSize: 20, fontWeight: "700", marginLeft: 12 },
  welcomeCard: { borderRadius: 16, padding: 20, marginTop: 16 },
  welcomeTitle: { color: "#FFFFFF", fontSize: 24, fontWeight: "700" },
  welcomeSubtitle: { color: "rgba(255,255,255,0.8)", marginTop: 8 },
  welcomeButton: { marginTop: 16 },
  progressCard: { borderRadius: 16, padding: 20, marginTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "700" },
  statLabel: { fontSize: 14 },
  quickStatsRow: { flexDirection: "row", gap: 12, marginTop: 16, marginBottom: 32 },
  quickStatCard: { flex: 1, borderRadius: 16, padding: 16, alignItems: "center" },
  quickStatValue: { fontSize: 24, fontWeight: "700", marginTop: 8 },
  quickStatLabel: { fontSize: 14 },
});
