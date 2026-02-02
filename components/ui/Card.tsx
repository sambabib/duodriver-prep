import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";
import { colors } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useThemeColors";

interface CardProps extends ViewProps {
  variant?: "default" | "elevated" | "outlined";
}

export function Card({
  children,
  variant = "default",
  style,
  ...props
}: CardProps) {
  const { surface, border } = useThemeColors();

  const variantStyles = {
    default: { backgroundColor: surface },
    elevated: { backgroundColor: surface, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    outlined: { backgroundColor: surface, borderWidth: 1, borderColor: border },
  };

  return (
    <View style={[styles.base, variantStyles[variant], style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    padding: 16,
  },
});
