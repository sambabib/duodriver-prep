import { Ionicons } from "@expo/vector-icons";

export type CategoryId =
  | "road-signs"
  | "highway-code"
  | "hazard-perception"
  | "vehicle-safety"
  | "road-markings";

export interface Category {
  id: CategoryId;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  totalQuestions: number;
}

export const categories: Category[] = [
  {
    id: "road-signs",
    title: "Road Signs",
    description: "Learn all UK road signs and their meanings",
    icon: "warning-outline",
    color: "#6366F1",
    totalQuestions: 100,
  },
  {
    id: "highway-code",
    title: "Highway Code",
    description: "Master the rules of the road",
    icon: "book-outline",
    color: "#22C55E",
    totalQuestions: 150,
  },
  {
    id: "hazard-perception",
    title: "Hazard Perception",
    description: "Identify potential dangers on the road",
    icon: "eye-outline",
    color: "#F59E0B",
    totalQuestions: 75,
  },
  {
    id: "vehicle-safety",
    title: "Vehicle Safety",
    description: "Vehicle maintenance and safety checks",
    icon: "car-outline",
    color: "#EF4444",
    totalQuestions: 50,
  },
  {
    id: "road-markings",
    title: "Road Markings",
    description: "Understand road markings and lanes",
    icon: "git-merge-outline",
    color: "#8B5CF6",
    totalQuestions: 60,
  },
];
