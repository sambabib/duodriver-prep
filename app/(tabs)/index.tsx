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

export default function HomeScreen() {
  const { progress } = useUserStore();
  const { background, surface, text, textMuted, border, isDark } = useThemeColors();
  const accuracy =
    progress.questionsAnswered > 0
      ? Math.round((progress.correctAnswers / progress.questionsAnswered) * 100)
      : 0;

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

          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: surface, borderColor: border }]}>
              <View style={[styles.statIconWrap, { backgroundColor: isDark ? "rgba(139,92,246,0.22)" : colors.primary[100] }]}>
                <Ionicons name="help-circle" size={18} color={colors.primary[500]} />
              </View>
              <Text style={[styles.statValue, { color: text }]}>{progress.questionsAnswered}</Text>
              <Text style={[styles.statLabel, { color: textMuted }]}>Questions Answered</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: surface, borderColor: border }]}>
              <View style={[styles.statIconWrap, { backgroundColor: isDark ? "rgba(34,197,94,0.2)" : colors.success[100] }]}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success[500]} />
              </View>
              <Text style={[styles.statValue, { color: text }]}>{progress.correctAnswers}</Text>
              <Text style={[styles.statLabel, { color: textMuted }]}>Correct Answers</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: surface, borderColor: border }]}>
              <View style={[styles.statIconWrap, { backgroundColor: isDark ? "rgba(245,158,11,0.2)" : colors.warning[100] }]}>
                <Ionicons name="speedometer" size={18} color={colors.warning[500]} />
              </View>
              <Text style={[styles.statValue, { color: text }]}>{accuracy}%</Text>
              <Text style={[styles.statLabel, { color: textMuted }]}>Accuracy</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: surface, borderColor: border }]}>
              <View style={[styles.statIconWrap, { backgroundColor: isDark ? "rgba(239,68,68,0.2)" : colors.error[100] }]}>
                <Ionicons name="heart" size={18} color={colors.error[500]} />
              </View>
              <Text style={[styles.statValue, { color: text }]}>{progress.hearts}/{progress.maxHearts}</Text>
              <Text style={[styles.statLabel, { color: textMuted }]}>Hearts Available</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 32 },
  header: { alignItems: "center", paddingVertical: 12 },
  statusIsland: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 4,
  },
  islandDivider: { width: 1, height: 18, opacity: 0.8 },
  welcomeTitle: { fontSize: 22, fontWeight: "700" },
  welcomeSubtitle: { marginTop: 8, fontSize: 14, lineHeight: 22 },
  welcomeButton: { marginTop: 20 },
  welcomeCard: {
    borderRadius: 22,
    padding: 22,
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
    marginTop: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
  },
  statsGrid: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    width: "48.5%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  statIconWrap: {
    alignSelf: "flex-start",
    borderRadius: 999,
    padding: 8,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
  },
});
