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
  scrollContent: { paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: "700", paddingVertical: 16 },
  profileCard: { borderRadius: 16, padding: 20, marginBottom: 16, alignItems: "center" },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  username: { fontSize: 20, fontWeight: "700" },
  badgeRow: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 12 },
  xpText: { fontSize: 14, marginTop: 8 },
  settingsCard: { borderRadius: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", padding: 16, paddingBottom: 8 },
  settingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 1 },
  settingRowLast: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
  settingLeft: { flexDirection: "row", alignItems: "center" },
  settingText: { fontSize: 16, marginLeft: 12 },
  settingValue: { fontSize: 14, textTransform: "capitalize" },
  dangerCard: { borderRadius: 16, marginBottom: 32 },
  dangerRow: { flexDirection: "row", alignItems: "center", padding: 16 },
  dangerText: { fontSize: 16, marginLeft: 12 },
});
