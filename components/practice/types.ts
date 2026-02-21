import { Category } from "@/constants/categories";

export type PracticeNodeStatus = "completed" | "active" | "locked";

export interface PracticeNodeData {
  categoryId: string;
  nodeIndex: number;
  status: PracticeNodeStatus;
}

export interface CategoryPathProgress {
  category: Category;
  completedNodeCount: number;
  nodes: PracticeNodeData[];
}
