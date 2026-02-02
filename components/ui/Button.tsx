import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  View,
  StyleSheet,
} from "react-native";
import { colors } from "@/constants/theme";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "success" | "error";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  icon,
  iconPosition = "left",
  style,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary: { backgroundColor: colors.primary[500] },
    secondary: { backgroundColor: colors.light.surface },
    outline: { backgroundColor: "transparent", borderWidth: 2, borderColor: colors.primary[500] },
    ghost: { backgroundColor: "transparent" },
    success: { backgroundColor: colors.success[500] },
    error: { backgroundColor: colors.error[500] },
  };

  const sizeStyles = {
    sm: { paddingHorizontal: 16, paddingVertical: 8 },
    md: { paddingHorizontal: 24, paddingVertical: 12 },
    lg: { paddingHorizontal: 32, paddingVertical: 16 },
  };

  const textColors = {
    primary: "#FFFFFF",
    secondary: colors.light.text,
    outline: colors.primary[500],
    ghost: colors.primary[500],
    success: "#FFFFFF",
    error: "#FFFFFF",
  };

  const textSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles[variant],
        sizeStyles[size],
        (disabled || loading) && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" || variant === "ghost" ? colors.primary[500] : "#FFFFFF"}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === "left" && icon}
          <Text
            style={[
              styles.text,
              { color: textColors[variant], fontSize: textSizes[size] },
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === "right" && icon}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontWeight: "600",
  },
});
