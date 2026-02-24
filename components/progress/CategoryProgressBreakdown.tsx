import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColors";

interface CategoryRow {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  completed: number;
  total: number;
}

interface CategoryProgressBreakdownProps {
  rows: CategoryRow[];
}

export function CategoryProgressBreakdown({ rows }: CategoryProgressBreakdownProps) {
  const { isDark, surface, border, text, textMuted } = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: surface, borderColor: border }]}>
      <Text style={[styles.title, { color: text }]}>Category breakdown</Text>
      <Text style={[styles.subtitle, { color: textMuted }]}>Track how each topic is moving.</Text>

      <View style={styles.list}>
        {rows.map((row, index) => {
          const ratio = row.total > 0 ? Math.min(1, row.completed / row.total) : 0;
          const percent = Math.round(ratio * 100);

          return (
            <View
              key={row.id}
              style={[
                styles.row,
                index > 0 && {
                  borderTopWidth: 1,
                  borderTopColor: border,
                },
              ]}
            >
              <View style={styles.rowTop}>
                <View style={styles.leftCluster}>
                  <View
                    style={[
                      styles.iconWrap,
                      {
                        backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#F1F2F4",
                        borderColor: isDark ? "rgba(255,255,255,0.08)" : "#E4E6EA",
                      },
                    ]}
                  >
                    <Ionicons name={row.icon} size={16} color={textMuted} />
                  </View>
                  <Text numberOfLines={1} style={[styles.rowTitle, { color: text }]}>
                    {row.title}
                  </Text>
                </View>

                <Text style={[styles.count, { color: textMuted }]}>
                  {row.completed}/{row.total}
                </Text>
              </View>

              <View
                style={[
                  styles.progressTrack,
                  {
                    backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#ECEFF3",
                  },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${percent}%`,
                      backgroundColor: row.color,
                    },
                  ]}
                />
              </View>

              <Text style={[styles.percent, { color: row.color }]}>{percent}% complete</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
  list: {
    marginTop: 10,
  },
  row: {
    paddingVertical: 12,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  leftCluster: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600",
  },
  count: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "600",
  },
  progressTrack: {
    marginTop: 10,
    width: "100%",
    height: 10,
    borderRadius: 9,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 9,
  },
  percent: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },
});
