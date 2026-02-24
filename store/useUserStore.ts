import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProgress, CategoryProgress } from "@/types";
import { categories } from "@/constants/categories";

const initialCategoryProgress: Record<string, CategoryProgress> = {};
categories.forEach((cat) => {
  initialCategoryProgress[cat.id] = {
    completed: 0,
    total: cat.totalQuestions,
    bestScore: 0,
  };
});

const initialProgress: UserProgress = {
  dayStreak: 0,
  totalXP: 0,
  level: 1,
  hearts: 5,
  maxHearts: 5,
  questionsAnswered: 0,
  correctAnswers: 0,
  categoryProgress: initialCategoryProgress,
  lastPracticeDate: null,
};

interface UserState {
  progress: UserProgress;
  addXP: (amount: number) => void;
  loseHeart: () => void;
  refillHearts: () => void;
  updateStreak: () => void;
  recordAnswer: (correct: boolean, categoryId: string) => void;
  resetProgress: () => void;
}

const XP_PER_LEVEL = 100;

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      progress: initialProgress,

      addXP: (amount) =>
        set((state) => {
          const newXP = state.progress.totalXP + amount;
          const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
          return {
            progress: {
              ...state.progress,
              totalXP: newXP,
              level: newLevel,
            },
          };
        }),

      loseHeart: () =>
        set((state) => ({
          progress: {
            ...state.progress,
            hearts: Math.max(0, state.progress.hearts - 1),
          },
        })),

      refillHearts: () =>
        set((state) => ({
          progress: {
            ...state.progress,
            hearts: state.progress.maxHearts,
          },
        })),

      updateStreak: () =>
        set((state) => {
          const today = new Date().toDateString();
          const lastPractice = state.progress.lastPracticeDate;

          if (lastPractice === today) {
            return state;
          }

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const wasYesterday = lastPractice === yesterday.toDateString();

          return {
            progress: {
              ...state.progress,
              dayStreak: wasYesterday ? state.progress.dayStreak + 1 : 1,
              lastPracticeDate: today,
            },
          };
        }),

      recordAnswer: (correct, categoryId) =>
        set((state) => {
          const catProgress = state.progress.categoryProgress[categoryId] || {
            completed: 0,
            total: 0,
            bestScore: 0,
          };

          return {
            progress: {
              ...state.progress,
              questionsAnswered: state.progress.questionsAnswered + 1,
              correctAnswers: correct
                ? state.progress.correctAnswers + 1
                : state.progress.correctAnswers,
              categoryProgress: {
                ...state.progress.categoryProgress,
                [categoryId]: {
                  ...catProgress,
                  completed: correct ? catProgress.completed + 1 : catProgress.completed,
                },
              },
            },
          };
        }),

      resetProgress: () => set({ progress: initialProgress }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persistedState: unknown) => {
        if (!persistedState || typeof persistedState !== "object") {
          return persistedState as UserState;
        }

        const state = persistedState as { progress?: UserProgress };
        if (!state.progress) {
          return persistedState as UserState;
        }

        return {
          ...state,
          progress: {
            ...state.progress,
            hearts: 5,
            maxHearts: 5,
          },
        } as UserState;
      },
    }
  )
);
