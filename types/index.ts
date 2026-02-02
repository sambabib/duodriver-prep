export interface Question {
  id: string;
  categoryId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  imageUrl?: string;
}

export interface UserProgress {
  dayStreak: number;
  totalXP: number;
  level: number;
  hearts: number;
  maxHearts: number;
  questionsAnswered: number;
  correctAnswers: number;
  categoryProgress: Record<string, CategoryProgress>;
  lastPracticeDate: string | null;
}

export interface CategoryProgress {
  completed: number;
  total: number;
  bestScore: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  requirement: number;
  progress: number;
}

export interface QuizSession {
  categoryId: string;
  questions: Question[];
  currentIndex: number;
  answers: number[];
  startTime: number;
  endTime: number | null;
  xpEarned: number;
}

export type ThemeMode = "light" | "dark" | "system";
