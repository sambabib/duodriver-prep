import React, { useMemo, useState } from "react";
import { Text, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useUserStore } from "@/store/useUserStore";
import { categories } from "@/constants/categories";
import { router } from "expo-router";
import {
  CategoryPathSection,
  PracticeSummaryCard,
  CategoryPathProgress,
  PracticeNodeData,
} from "@/components/practice";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

const QUESTIONS_PER_CHECKPOINT = 5;

function getCategoryPathProgress(
  categoryId: string,
  categoryTotalQuestions: number,
  completedQuestions: number
): Omit<CategoryPathProgress, "category"> {
  const nodesPerCategory = Math.max(4, Math.ceil(categoryTotalQuestions / QUESTIONS_PER_CHECKPOINT));
  const questionsPerNode = Math.max(1, Math.ceil(categoryTotalQuestions / nodesPerCategory));
  const completedNodeCount = Math.min(
    nodesPerCategory,
    Math.floor(completedQuestions / questionsPerNode)
  );

  const nodes: PracticeNodeData[] = Array.from({ length: nodesPerCategory }).map((_, nodeIndex) => {
    let status: PracticeNodeData["status"] = "locked";
    if (nodeIndex < completedNodeCount) status = "completed";
    if (nodeIndex === completedNodeCount && completedNodeCount < nodesPerCategory) status = "active";

    return {
      categoryId,
      nodeIndex,
      status,
    };
  });

  return { completedNodeCount, nodes };
}

export default function PracticeScreen() {
  const { background, text, textMuted, border } = useThemeColors();
  const { progress } = useUserStore();
  const [lockHint, setLockHint] = useState<string | null>(null);

  const accuracy =
    progress.questionsAnswered > 0
      ? Math.round((progress.correctAnswers / progress.questionsAnswered) * 100)
      : 0;

  const categoryPaths = useMemo<CategoryPathProgress[]>(() => {
    return categories.map((category) => {
      const completedQuestions = progress.categoryProgress[category.id]?.completed ?? 0;
      const path = getCategoryPathProgress(category.id, category.totalQuestions, completedQuestions);
      return {
        category,
        completedNodeCount: path.completedNodeCount,
        nodes: path.nodes,
      };
    });
  }, [progress.categoryProgress]);

  const goToQuiz = (categoryId: string) => {
    router.push({
      pathname: "/quiz/[categoryId]",
      params: { categoryId },
    });
  };

  const handlePressNode = (categoryTitle: string, node: PracticeNodeData) => {
    if (node.status === "locked") {
      setLockHint(`Complete the previous ${categoryTitle} checkpoint first.`);
      setTimeout(() => setLockHint(null), 1800);
      return;
    }

    goToQuiz(node.categoryId);
  };

  const handleContinuePractice = () => {
    const firstAvailableCategory =
      categoryPaths.find((path) => path.nodes.some((node) => node.status === "active"))?.category.id ??
      categories[0]?.id;

    if (!firstAvailableCategory) return;
    goToQuiz(firstAvailableCategory);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: text }]}>Practice</Text>
          <Text style={[styles.subtitle, { color: textMuted }]}>
            Follow your checkpoint trail and train with UK theory quizzes.
          </Text>
        </View>

        <PracticeSummaryCard
          streak={progress.dayStreak}
          hearts={progress.hearts}
          maxHearts={progress.maxHearts}
          xp={progress.totalXP}
          accuracy={accuracy}
          onContinue={handleContinuePractice}
        />

        {lockHint ? (
          <View style={[styles.hintBanner, { borderColor: border }]}>
            <Ionicons name="lock-closed" size={14} color={colors.warning[600]} />
            <Text style={styles.hintText}>{lockHint}</Text>
          </View>
        ) : null}

        <Text style={[styles.pathTitle, { color: text }]}>Practice Path</Text>
        <Text style={[styles.pathSubtitle, { color: textMuted }]}>
          Each checkpoint covers around {QUESTIONS_PER_CHECKPOINT} questions. Complete one to unlock the next.
        </Text>

        <View style={styles.pathSection}>
          {categoryPaths.map((path) => (
            <CategoryPathSection
              key={path.category.id}
              category={path.category}
              nodes={path.nodes}
              onPressNode={(node) => handlePressNode(path.category.title, node)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 28 },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 19,
  },
  hintBanner: {
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FEF3C7",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  hintText: {
    flex: 1,
    color: "#92400E",
    fontSize: 12,
    fontWeight: "500",
  },
  pathTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  pathSubtitle: {
    marginTop: 4,
    fontSize: 13,
  },
  pathSection: {
    marginTop: 10,
  },
});
