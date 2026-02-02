import React from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";
import { colors } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useThemeColors";

interface ExplanationModalProps {
  visible: boolean;
  correct: boolean;
  explanation: string;
  onContinue: () => void;
}

export function ExplanationModal({
  visible,
  correct,
  explanation,
  onContinue,
}: ExplanationModalProps) {
  const { isDark, text } = useThemeColors();

  const bgColor = correct
    ? isDark ? "rgba(34, 197, 94, 0.3)" : colors.success[50]
    : isDark ? "rgba(239, 68, 68, 0.3)" : colors.error[50];

  const titleColor = correct
    ? isDark ? colors.success[300] : colors.success[700]
    : isDark ? colors.error[300] : colors.error[700];

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: bgColor }]}>
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: correct ? colors.success[500] : colors.error[500] }]}>
              <Ionicons name={correct ? "checkmark" : "close"} size={28} color="#FFFFFF" />
            </View>
            <Text style={[styles.title, { color: titleColor }]}>
              {correct ? "Correct!" : "Incorrect"}
            </Text>
          </View>

          <Text style={[styles.explanation, { color: text }]}>{explanation}</Text>

          <Button title="Continue" variant={correct ? "success" : "primary"} size="lg" onPress={onContinue} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginLeft: 12,
  },
  explanation: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
});
