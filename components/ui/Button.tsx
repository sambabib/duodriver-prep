import React from "react";
import {
  Pressable,
  Text,
  ActivityIndicator,
  PressableProps,
  View,
  StyleSheet,
  PressableStateCallbackType,
} from "react-native";
import { colors } from "@/constants/theme";

interface ButtonProps extends PressableProps {
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
    primary: { face: colors.primary[500], shadow: colors.primary[700], text: "#FFFFFF" },
    secondary: { face: colors.light.surface, shadow: colors.light.border, text: colors.light.text },
    outline: { face: "transparent", shadow: colors.primary[500], text: colors.primary[500] },
    ghost: { face: "transparent", shadow: "transparent", text: colors.primary[500] },
    success: { face: colors.success[500], shadow: colors.success[700], text: "#FFFFFF" },
    error: { face: colors.error[500], shadow: colors.error[700], text: "#FFFFFF" },
  };

  const sizeStyles = {
    sm: { paddingHorizontal: 16, paddingVertical: 8, radius: 12, fontSize: 14, shadowOffset: 3 },
    md: { paddingHorizontal: 22, paddingVertical: 12, radius: 14, fontSize: 14, shadowOffset: 4 },
    lg: { paddingHorizontal: 28, paddingVertical: 14, radius: 16, fontSize: 16, shadowOffset: 5 },
  };

  const config = sizeStyles[size];
  const palette = variantStyles[variant];
  const isDisabled = disabled || loading;

  const mergedStyle = (state: PressableStateCallbackType) => {
    const dynamicStyle = typeof style === "function" ? style(state) : style;
    return [styles.wrapper, isDisabled && styles.disabled, dynamicStyle];
  };

  return (
    <Pressable
      disabled={isDisabled}
      style={mergedStyle}
      {...props}
    >
      <View
        style={[
          styles.shadow,
          {
            backgroundColor: palette.shadow,
            borderRadius: config.radius,
            top: config.shadowOffset,
          },
        ]}
      />
      <View
        style={[
          styles.face,
          {
            backgroundColor: palette.face,
            borderRadius: config.radius,
            paddingHorizontal: config.paddingHorizontal,
            paddingVertical: config.paddingVertical,
            borderWidth: variant === "outline" ? 2 : 0,
            borderColor: variant === "outline" ? colors.primary[500] : "transparent",
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === "outline" || variant === "ghost" ? colors.primary[500] : "#FFFFFF"}
            size="small"
          />
        ) : (
          <View style={styles.content}>
            {icon && iconPosition === "left" && icon}
            <Text style={[styles.text, { color: palette.text, fontSize: config.fontSize }]}>{title}</Text>
            {icon && iconPosition === "right" && icon}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  face: {
    alignItems: "center",
    justifyContent: "center",
  },
  shadow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -4,
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
    fontFamily: "Poppins_600SemiBold",
  },
});
