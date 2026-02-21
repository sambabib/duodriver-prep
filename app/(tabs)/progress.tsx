import React from "react";
import { Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function ProgressScreen() {
  const { background, text, textMuted } = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: text }]}>Progress</Text>
        <Text style={[styles.subtitle, { color: textMuted }]}>We will rebuild this screen from scratch next.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 16 },
});
