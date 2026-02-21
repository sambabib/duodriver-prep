import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "@/constants/categories";
import { PathNode } from "./PathNode";
import { PracticeNodeData } from "./types";
import { useThemeColors } from "@/hooks/useThemeColors";

interface CategoryPathSectionProps {
  category: Category;
  nodes: PracticeNodeData[];
  onPressNode: (node: PracticeNodeData) => void;
}

const DEFAULT_VISIBLE_NODES = 8;

export function CategoryPathSection({
  category,
  nodes,
  onPressNode,
}: CategoryPathSectionProps) {
  const { surface, border, text, textMuted, isDark } = useThemeColors();
  const [expanded, setExpanded] = useState(false);
  const completedCount = nodes.filter((node) => node.status === "completed").length;
  const completionRatio = nodes.length > 0 ? completedCount / nodes.length : 0;
  const shouldCollapse = nodes.length > DEFAULT_VISIBLE_NODES;

  const visibleNodes = useMemo(() => {
    if (!shouldCollapse || expanded) return nodes;
    return nodes.slice(0, DEFAULT_VISIBLE_NODES);
  }, [nodes, expanded, shouldCollapse]);

  return (
    <View style={[styles.container, { backgroundColor: surface, borderColor: border }]}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: `${category.color}22` }]}>
          <Ionicons name={category.icon} size={18} color={category.color} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: text }]}>{category.title}</Text>
          <Text style={[styles.subtitle, { color: textMuted }]}>
            {completedCount}/{nodes.length} checkpoints complete
          </Text>
        </View>
      </View>

      <View style={[styles.progressTrack, { backgroundColor: isDark ? "#27272A" : "#E4E4E7" }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${completionRatio * 100}%`,
              backgroundColor: category.color,
            },
          ]}
        />
      </View>

      <View style={styles.grid}>
        {visibleNodes.map((node) => (
          <PathNode
            key={`${category.id}-${node.nodeIndex}`}
            status={node.status}
            color={category.color}
            label={`${node.nodeIndex + 1}`}
            onPress={() => onPressNode(node)}
          />
        ))}
      </View>

      {shouldCollapse ? (
        <Pressable onPress={() => setExpanded((prev) => !prev)} style={styles.showMoreButton}>
          <Text style={[styles.showMoreText, { color: category.color }]}>
            {expanded ? "Show less" : `Show more (${nodes.length - visibleNodes.length})`}
          </Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={14}
            color={category.color}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    marginLeft: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
  },
  progressTrack: {
    marginTop: 12,
    height: 6,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  grid: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  showMoreButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
  },
  showMoreText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
