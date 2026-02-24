import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";

interface PracticeSummaryCardProps {
  accuracy: number;
  onContinue: () => void;
}

export function PracticeSummaryCard({
  accuracy,
  onContinue,
}: PracticeSummaryCardProps) {
  const { surface, border, text, textMuted } = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: surface, borderColor: border }]}>
      <View style={styles.body}>
        <Text style={[styles.title, { color: text }]}>Continue Practice</Text>
        <Text style={[styles.subtitle, { color: textMuted }]}>
          Accuracy: {accuracy}% this run. Keep the streak alive with your next checkpoint.
        </Text>
      </View>

      <Button
        title="Continue Practice"
        variant="primary"
        size="md"
        icon={<Ionicons name="play" size={18} color="#FFFFFF" />}
        onPress={onContinue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  body: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 7,
    fontSize: 14,
    lineHeight: 21,
  },
});
