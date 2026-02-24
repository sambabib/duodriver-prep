import React from "react";
import Svg, { Circle, G } from "react-native-svg";

interface MiniProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  trackColor?: string;
}

function clamp(amount: number, min: number, max: number) {
  return Math.max(min, Math.min(max, amount));
}

export function MiniProgressRing({
  progress,
  size = 30,
  strokeWidth = 4,
  color,
  trackColor = "rgba(255,255,255,0.2)",
}: MiniProgressRingProps) {
  const safeProgress = clamp(progress, 0, 1);
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - safeProgress);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G rotation="-90" originX={center} originY={center}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          fill="none"
        />
      </G>
    </Svg>
  );
}
