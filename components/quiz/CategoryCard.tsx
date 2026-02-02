import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "@/constants/categories";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { colors } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useThemeColors";

interface CategoryCardProps {
  category: Category;
  progress: number;
  onPress: () => void;
}

export function CategoryCard({ category, progress, onPress }: CategoryCardProps) {
  const { surface, border, text, textMuted } = useThemeColors();
  const percentage = Math.round((progress / category.totalQuestions) * 100);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, { backgroundColor: surface, borderColor: border }]}
    >
      <View style={styles.row}>
        <View style={[styles.iconContainer, { backgroundColor: `${category.color}20` }]}>
          <Ionicons name={category.icon} size={24} color={category.color} />
        </View>
        <View style={styles.content}>
          <Text style={[styles.title, { color: text }]}>{category.title}</Text>
          <Text style={[styles.description, { color: textMuted }]}>{category.description}</Text>
        </View>
        <View style={styles.rightSection}>
          <Text style={[styles.percentage, { color: colors.primary[500] }]}>{percentage}%</Text>
          <Ionicons name="chevron-forward" size={20} color="#A1A1AA" />
        </View>
      </View>
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} total={category.totalQuestions} size="sm" variant="primary" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  percentage: {
    fontSize: 14,
    fontWeight: "500",
  },
  progressContainer: {
    marginTop: 12,
  },
});
