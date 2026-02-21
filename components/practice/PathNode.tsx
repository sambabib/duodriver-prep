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

  const backgroundColor = isCompleted ? color : isActive ? `${color}14` : isDark ? "#222225" : "#F4F4F5";
  const borderColor = isCompleted ? color : isActive ? color : isDark ? "#3F3F46" : "#E4E4E7";

  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <View style={[styles.node, { backgroundColor, borderColor }]}>
        <Text style={[styles.index, { color: isCompleted ? "#FFFFFF" : isLocked ? textMuted : color }]}>
          {label}
        </Text>
        {isCompleted ? (
          <View style={[styles.badge, styles.badgeCompleted]}>
            <Ionicons name="checkmark" size={10} color={color} />
          </View>
        ) : null}
        {isActive ? (
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Ionicons name="play" size={8} color="#FFFFFF" />
          </View>
        ) : null}
        {isLocked ? (
          <View style={[styles.badge, styles.badgeLocked]}>
            <Ionicons name="lock-closed" size={8} color={textMuted} />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  node: {
    width: 64,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  index: {
    fontSize: 14,
    fontWeight: "700",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 16,
    height: 16,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeCompleted: {
    backgroundColor: "#FFFFFF",
  },
  badgeLocked: {
    backgroundColor: "#E4E4E7",
  },
});
