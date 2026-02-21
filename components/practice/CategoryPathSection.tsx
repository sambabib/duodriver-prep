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

const DEFAULT_VISIBLE_NODES = 4;

export function CategoryPathSection({
  category,
  nodes,
  onPressNode,
}: CategoryPathSectionProps) {
  const { surface, border, text } = useThemeColors();
  const [expanded, setExpanded] = useState(false);
  const completedCount = nodes.filter((node) => node.status === "completed").length;
  const shouldCollapse = nodes.length > DEFAULT_VISIBLE_NODES;

  const visibleNodes = useMemo(() => {
    if (!shouldCollapse || expanded) return nodes;
    return nodes.slice(0, DEFAULT_VISIBLE_NODES);
  }, [nodes, expanded, shouldCollapse]);

  const nodeRows = useMemo(() => {
    const rows: PracticeNodeData[][] = [];
    for (let i = 0; i < visibleNodes.length; i += 4) {
      rows.push(visibleNodes.slice(i, i + 4));
    }
    return rows;
  }, [visibleNodes]);

  return (
    <View style={[styles.container, { backgroundColor: surface, borderColor: border }]}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: `${category.color}22` }]}>
          <Ionicons name={category.icon} size={18} color={category.color} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: text }]}>{category.title}</Text>
        </View>
        <View
          style={[
            styles.counterPill,
            {
              backgroundColor: `${category.color}1A`,
              borderColor: `${category.color}66`,
            },
          ]}
        >
          <Text style={[styles.counterText, { color: category.color }]}>
            {completedCount}/{nodes.length}
          </Text>
        </View>
      </View>

      <View style={styles.pathArea}>
        {nodeRows.map((row, rowIndex) => (
          <View key={`${category.id}-row-${rowIndex}`} style={styles.pathRow}>
            {row.map((node) => (
              <PathNode
                status={node.status}
                color={category.color}
                label={`${node.nodeIndex + 1}`}
                onPress={() => onPressNode(node)}
                key={`${category.id}-${node.nodeIndex}`}
              />
            ))}
          </View>
        ))}
      </View>

      {shouldCollapse ? (
        <View style={styles.showMoreButton}>
          <View
            style={[
              styles.showMoreShadow,
              { backgroundColor: `${category.color}CC` },
            ]}
          />
          <Pressable
            onPress={() => setExpanded((prev) => !prev)}
            style={({ pressed }) => [
              styles.showMoreFace,
              { backgroundColor: category.color, opacity: pressed ? 0.92 : 1 },
            ]}
          >
            <Text style={styles.showMoreText}>
              {expanded ? "Show Less" : `Show More (${nodes.length - visibleNodes.length})`}
            </Text>
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={14}
              color="#FFFFFF"
            />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
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
    flex: 1,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
  },
  counterPill: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 7,
    minWidth: 78,
    alignItems: "center",
  },
  counterText: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "700",
  },
  pathArea: {
    marginTop: 16,
  },
  pathRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  showMoreButton: {
    marginTop: 6,
    width: "100%",
    position: "relative",
  },
  showMoreShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -3,
    height: "100%",
    borderRadius: 12,
  },
  showMoreFace: {
    width: "100%",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  showMoreText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
