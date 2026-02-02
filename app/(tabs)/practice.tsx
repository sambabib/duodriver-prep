import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { categories } from "@/constants/categories";
import { useUserStore } from "@/store/useUserStore";
import { CategoryCard } from "@/components/quiz";
import { router } from "expo-router";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function PracticeScreen() {
  const { progress } = useUserStore();
  const { background, text, textMuted } = useThemeColors();

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/quiz/${categoryId}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: text }]}>Practice Categories</Text>
        <Text style={[styles.subtitle, { color: textMuted }]}>Choose a category to start practicing</Text>

        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            progress={progress.categoryProgress[category.id]?.completed || 0}
            onPress={() => handleCategoryPress(category.id)}
          />
        ))}

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: "700", paddingVertical: 16 },
  subtitle: { fontSize: 16, marginBottom: 16 },
  spacer: { height: 32 },
});
