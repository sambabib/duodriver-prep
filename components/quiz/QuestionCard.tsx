import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Question } from "@/types";
import { useThemeColors } from "@/hooks/useThemeColors";

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
}

export function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
}: QuestionCardProps) {
  const { surface, text, textMuted } = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: surface }]}>
      <Text style={[styles.counter, { color: textMuted }]}>
        Question {currentIndex + 1} of {totalQuestions}
      </Text>

      {question.imageUrl && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: question.imageUrl }} style={styles.image} resizeMode="contain" />
        </View>
      )}

      <Text style={[styles.question, { color: text }]}>{question.question}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
  },
  counter: {
    fontSize: 14,
    marginBottom: 8,
  },
  imageContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 192,
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 25,
  },
});
