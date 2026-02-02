import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "@/store/useUserStore";
import { categories } from "@/constants/categories";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function ProgressScreen() {
  const { progress } = useUserStore();
  const { isDark, background, surface, text, textMuted } = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: text }]}>Your Progress</Text>

        <View style={[styles.card, { backgroundColor: surface }]}>
          <Text style={[styles.sectionTitle, { color: text }]}>Overall Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statBox, { backgroundColor: isDark ? "rgba(99,102,241,0.2)" : colors.primary[100] }]}>
              <Ionicons name="help-circle" size={24} color={colors.primary[500]} />
              <Text style={[styles.statValue, { color: isDark ? colors.primary[400] : colors.primary[600] }]}>{progress.questionsAnswered}</Text>
              <Text style={[styles.statLabel, { color: textMuted }]}>Questions Answered</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: isDark ? "rgba(34,197,94,0.2)" : colors.success[100] }]}>
              <Ionicons name="checkmark-circle" size={24} color={colors.success[500]} />
              <Text style={[styles.statValue, { color: isDark ? colors.success[400] : colors.success[600] }]}>{progress.correctAnswers}</Text>
              <Text style={[styles.statLabel, { color: textMuted }]}>Correct Answers</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: isDark ? "rgba(245,158,11,0.2)" : colors.warning[100] }]}>
              <Ionicons name="flame" size={24} color={colors.warning[500]} />
              <Text style={[styles.statValue, { color: isDark ? colors.warning[400] : colors.warning[600] }]}>{progress.dayStreak}</Text>
              <Text style={[styles.statLabel, { color: textMuted }]}>Day Streak</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: isDark ? "rgba(239,68,68,0.2)" : colors.error[100] }]}>
              <Ionicons name="trending-up" size={24} color={colors.error[500]} />
              <Text style={[styles.statValue, { color: isDark ? colors.error[400] : colors.error[600] }]}>
                {progress.questionsAnswered > 0 ? Math.round((progress.correctAnswers / progress.questionsAnswered) * 100) : 0}%
              </Text>
              <Text style={[styles.statLabel, { color: textMuted }]}>Accuracy Rate</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, styles.cardBottom, { backgroundColor: surface }]}>
          <Text style={[styles.sectionTitle, { color: text }]}>Category Progress</Text>
          {categories.map((category) => {
            const catProgress = progress.categoryProgress[category.id];
            const completed = catProgress?.completed || 0;
            const total = catProgress?.total || category.totalQuestions;
            return (
              <View key={category.id} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryLeft}>
                    <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                      <Ionicons name={category.icon} size={16} color={category.color} />
                    </View>
                    <Text style={[styles.categoryTitle, { color: text }]}>{category.title}</Text>
                  </View>
                  <Text style={[styles.categoryCount, { color: textMuted }]}>{completed}/{total}</Text>
                </View>
                <ProgressBar progress={completed} total={total} size="sm" variant="primary" />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: "700", paddingVertical: 16 },
  card: { borderRadius: 16, padding: 20, marginBottom: 16 },
  cardBottom: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statBox: { width: "47%", borderRadius: 12, padding: 16 },
  statValue: { fontSize: 24, fontWeight: "700", marginTop: 8 },
  statLabel: { fontSize: 14 },
  categoryItem: { marginBottom: 16 },
  categoryHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  categoryLeft: { flexDirection: "row", alignItems: "center" },
  categoryIcon: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center", marginRight: 8 },
  categoryTitle: { fontSize: 16, fontWeight: "500" },
  categoryCount: { fontSize: 14 },
});
