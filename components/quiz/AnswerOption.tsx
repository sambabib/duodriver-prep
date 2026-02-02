import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useThemeColors";

interface AnswerOptionProps {
  text: string;
  index: number;
  selected: boolean;
  correct?: boolean;
  showResult: boolean;
  disabled: boolean;
  onPress: () => void;
}

const optionLabels = ["A", "B", "C", "D"];

export function AnswerOption({
  text,
  index,
  selected,
  correct,
  showResult,
  disabled,
  onPress,
}: AnswerOptionProps) {
  const { isDark, surface, border, text: textColor } = useThemeColors();

  const getContainerStyle = () => {
    if (!showResult) {
      return selected
        ? { backgroundColor: isDark ? "rgba(99, 102, 241, 0.2)" : colors.primary[100], borderColor: colors.primary[500] }
        : { backgroundColor: surface, borderColor: border };
    }
    if (correct) {
      return { backgroundColor: isDark ? "rgba(34, 197, 94, 0.2)" : colors.success[100], borderColor: colors.success[500] };
    }
    if (selected && !correct) {
      return { backgroundColor: isDark ? "rgba(239, 68, 68, 0.2)" : colors.error[100], borderColor: colors.error[500] };
    }
    return { backgroundColor: surface, borderColor: border, opacity: 0.5 };
  };

  const getTextColor = () => {
    if (!showResult) {
      return selected ? (isDark ? colors.primary[400] : colors.primary[600]) : textColor;
    }
    if (correct) return isDark ? colors.success[400] : colors.success[600];
    if (selected && !correct) return isDark ? colors.error[400] : colors.error[600];
    return isDark ? "#A1A1AA" : "#71717A";
  };

  const getIcon = () => {
    if (!showResult) return null;
    if (correct) return <Ionicons name="checkmark-circle" size={24} color={colors.success[500]} />;
    if (selected && !correct) return <Ionicons name="close-circle" size={24} color={colors.error[500]} />;
    return null;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[styles.container, getContainerStyle()]}
    >
      <Text style={[styles.label, { color: getTextColor(), backgroundColor: border }]}>
        {optionLabels[index]}
      </Text>
      <Text style={[styles.text, { color: getTextColor() }]}>{text}</Text>
      {getIcon()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  label: {
    width: 32,
    height: 32,
    textAlign: "center",
    lineHeight: 32,
    fontWeight: "700",
    borderRadius: 8,
  },
  text: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
});
