import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PracticeNodeStatus } from "./types";
import { useThemeColors } from "@/hooks/useThemeColors";

interface PathNodeProps {
  status: PracticeNodeStatus;
  color: string;
  label: string;
  onPress: () => void;
}

export function PathNode({ status, color, label, onPress }: PathNodeProps) {
  const { isDark, textMuted } = useThemeColors();
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isActive = status === "active";

  const faceColor = isCompleted ? color : isActive ? (isDark ? "#1F1F23" : "#FFFFFF") : isDark ? "#252529" : "#F4F4F5";
  const borderColor = isCompleted ? color : isActive ? color : isDark ? "#3F3F46" : "#D4D4D8";
  const pedestalColor = isCompleted ? `${color}CC` : isActive ? `${color}88` : isDark ? "#19191C" : "#D4D4D8";
  const iconName = isCompleted ? "checkmark" : isActive ? "star" : "lock-closed";
  const iconColor = isCompleted ? "#FFFFFF" : isActive ? color : textMuted;

  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <View style={[styles.pedestal, { backgroundColor: pedestalColor }]} />
      <View style={[styles.node, { backgroundColor: faceColor, borderColor }]}>
        <Ionicons name={iconName} size={22} color={iconColor} />
      </View>
      <Text style={[styles.index, { color: isLocked ? textMuted : color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    width: 74,
  },
  pedestal: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    top: 6,
  },
  node: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  index: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
  },
});
