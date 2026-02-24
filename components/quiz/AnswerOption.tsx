import React from "react";
import { Text, Pressable, View, StyleSheet } from "react-native";
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

  const palette = (() => {
    if (!showResult) {
      if (selected) {
        return {
          face: "#FFFFFF",
          borderColor: "#111111",
          shadow: isDark ? "#8B8E96" : "#C8CBD2",
          text: "#111111",
          labelBg: "#EFF1F5",
          dim: false,
        };
      }
      return {
        face: surface,
        borderColor: border,
        shadow: isDark ? "#2A2A31" : "#D6D8DE",
        text: textColor,
        labelBg: isDark ? "rgba(255,255,255,0.08)" : "#ECEEF3",
        dim: false,
      };
    }

    if (correct) {
      return {
        face: isDark ? "rgba(34, 197, 94, 0.2)" : colors.success[100],
        borderColor: colors.success[500],
        shadow: colors.success[700],
        text: isDark ? colors.success[400] : colors.success[600],
        labelBg: isDark ? "rgba(34, 197, 94, 0.25)" : "#DCFCE7",
        dim: false,
      };
    }

    if (selected && !correct) {
      return {
        face: isDark ? "rgba(239, 68, 68, 0.2)" : colors.error[100],
        borderColor: colors.error[500],
        shadow: colors.error[700],
        text: isDark ? colors.error[400] : colors.error[600],
        labelBg: isDark ? "rgba(239, 68, 68, 0.25)" : "#FEE2E2",
        dim: false,
      };
    }

    return {
      face: surface,
      borderColor: border,
      shadow: isDark ? "#2A2A31" : "#D6D8DE",
      text: isDark ? "#A1A1AA" : "#71717A",
      labelBg: isDark ? "rgba(255,255,255,0.08)" : "#ECEEF3",
      dim: true,
    };
  })();

  const icon = (() => {
    if (!showResult) return null;
    if (correct) return <Ionicons name="checkmark-circle" size={22} color={colors.success[500]} />;
    if (selected && !correct) return <Ionicons name="close-circle" size={22} color={colors.error[500]} />;
    return null;
  })();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.wrapper, pressed && !disabled && styles.pressed]}
    >
      <View style={[styles.shadow, { backgroundColor: palette.shadow }]} />
      <View
        style={[
          styles.face,
          {
            backgroundColor: palette.face,
            borderColor: palette.borderColor,
            opacity: palette.dim ? 0.58 : 1,
          },
        ]}
      >
        <Text style={[styles.label, { color: palette.text, backgroundColor: palette.labelBg }]}>
          {optionLabels[index]}
        </Text>
        <Text numberOfLines={2} style={[styles.text, { color: palette.text }]}>
          {text}
        </Text>
        {icon}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    marginBottom: 12,
  },
  pressed: {
    transform: [{ translateY: 2 }],
  },
  shadow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 4,
    bottom: -4,
    borderRadius: 16,
  },
  face: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 64,
  },
  label: {
    width: 32,
    height: 32,
    textAlign: "center",
    lineHeight: 32,
    fontWeight: "700",
    fontSize: 14,
    borderRadius: 10,
  },
  text: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
});
