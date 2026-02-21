import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/store/useUserStore";
import { useThemeStore } from "@/store/useThemeStore";
import { LevelBadge, XPDisplay } from "@/components/gamification";
import { colors } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function ProfileScreen() {
  const { progress, resetProgress } = useUserStore();
  const { mode, setMode } = useThemeStore();
  const { isDark, background, surface, text, textMuted, border } = useThemeColors();

  const xpToNextLevel = 100 - (progress.totalXP % 100);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: text }]}>Profile</Text>

        <View style={[styles.profileCard, { backgroundColor: surface }]}>
          <View style={[styles.avatar, { backgroundColor: isDark ? "rgba(99,102,241,0.2)" : colors.primary[100] }]}>
            <Ionicons name="person" size={40} color={colors.primary[500]} />
          </View>
          <Text style={[styles.username, { color: text }]}>Learner</Text>
          <View style={styles.badgeRow}>
            <LevelBadge level={progress.level} size="sm" />
            <XPDisplay xp={progress.totalXP} size="sm" />
          </View>
          <Text style={[styles.xpText, { color: textMuted }]}>{xpToNextLevel} XP to next level</Text>
        </View>

        <View style={[styles.settingsCard, { backgroundColor: surface }]}>
          <Text style={[styles.sectionTitle, { color: text }]}>Settings</Text>

          <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: border }]}
            onPress={() => setMode(mode === "dark" ? "light" : mode === "light" ? "system" : "dark")}
          >
            <View style={styles.settingLeft}>
              <Ionicons name={isDark ? "moon" : "sunny"} size={24} color={textMuted} />
              <Text style={[styles.settingText, { color: text }]}>Theme</Text>
            </View>
            <Text style={[styles.settingValue, { color: textMuted }]}>{mode}</Text>
          </TouchableOpacity>

          <View style={[styles.settingRow, { borderBottomColor: border }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={24} color={textMuted} />
              <Text style={[styles.settingText, { color: text }]}>Notifications</Text>
            </View>
            <Switch value={true} trackColor={{ false: "#E4E4E7", true: colors.primary[500] }} thumbColor="#FFFFFF" />
          </View>

          <View style={styles.settingRowLast}>
            <View style={styles.settingLeft}>
              <Ionicons name="volume-high-outline" size={24} color={textMuted} />
              <Text style={[styles.settingText, { color: text }]}>Sound Effects</Text>
            </View>
            <Switch value={true} trackColor={{ false: "#E4E4E7", true: colors.primary[500] }} thumbColor="#FFFFFF" />
          </View>
        </View>

        <View style={[styles.dangerCard, { backgroundColor: surface }]}>
          <Text style={[styles.sectionTitle, { color: text }]}>Data</Text>
          <TouchableOpacity style={styles.dangerRow} onPress={resetProgress}>
            <Ionicons name="trash-outline" size={24} color={colors.error[500]} />
            <Text style={[styles.dangerText, { color: colors.error[500] }]}>Reset Progress</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 22, paddingBottom: 36 },
  title: { fontSize: 26, lineHeight: 32, fontWeight: "700", paddingVertical: 18 },
  profileCard: { borderRadius: 16, padding: 24, marginBottom: 18, alignItems: "center" },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  username: { fontSize: 22, lineHeight: 28, fontWeight: "700" },
  badgeRow: { flexDirection: "row", alignItems: "center", marginTop: 10, gap: 12 },
  xpText: { fontSize: 15, lineHeight: 21, marginTop: 10 },
  settingsCard: { borderRadius: 16, marginBottom: 18 },
  sectionTitle: { fontSize: 20, lineHeight: 26, fontWeight: "600", padding: 18, paddingBottom: 10 },
  settingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingVertical: 17, borderBottomWidth: 1 },
  settingRowLast: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingVertical: 17 },
  settingLeft: { flexDirection: "row", alignItems: "center" },
  settingText: { fontSize: 16, lineHeight: 22, marginLeft: 12 },
  settingValue: { fontSize: 15, lineHeight: 20, textTransform: "capitalize" },
  dangerCard: { borderRadius: 16, marginBottom: 32 },
  dangerRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 17 },
  dangerText: { fontSize: 16, lineHeight: 22, marginLeft: 12 },
});
