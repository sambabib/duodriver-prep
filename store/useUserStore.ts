import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProgress, CategoryProgress, ProgressHistoryPoint } from "@/types";
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
  history: [],
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
const HISTORY_LIMIT = 180;
const SEEDED_HISTORY_DAYS = 7;

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toHistoryPoint(progress: UserProgress, dateKey: string): ProgressHistoryPoint {
  return {
    dateKey,
    totalXP: progress.totalXP,
    questionsAnswered: progress.questionsAnswered,
    correctAnswers: progress.correctAnswers,
    dayStreak: progress.dayStreak,
  };
}

function normalizeHistory(history: ProgressHistoryPoint[]) {
  return [...history]
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .slice(-HISTORY_LIMIT);
}

function upsertTodayHistory(progress: UserProgress) {
  const todayKey = toDateKey(new Date());
  const nextPoint = toHistoryPoint(progress, todayKey);
  const withoutToday = progress.history.filter((point) => point.dateKey !== todayKey);
  return normalizeHistory([...withoutToday, nextPoint]);
}

function buildSeededHistory(progress: UserProgress) {
  const today = new Date();
  const denominator = SEEDED_HISTORY_DAYS - 1;
  const safeStreak = Math.max(0, progress.dayStreak);

  return Array.from({ length: SEEDED_HISTORY_DAYS }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (SEEDED_HISTORY_DAYS - 1 - index));
    const dateKey = toDateKey(date);
    const ratio = denominator === 0 ? 1 : index / denominator;
    const isLatest = index === SEEDED_HISTORY_DAYS - 1;
    const seededQuestions = isLatest
      ? progress.questionsAnswered
      : Math.round(progress.questionsAnswered * ratio);
    const seededCorrect = isLatest
      ? progress.correctAnswers
      : Math.min(seededQuestions, Math.round(progress.correctAnswers * ratio));

    return {
      dateKey,
      totalXP: isLatest ? progress.totalXP : Math.round(progress.totalXP * ratio),
      questionsAnswered: seededQuestions,
      correctAnswers: seededCorrect,
      dayStreak: isLatest ? progress.dayStreak : Math.round(safeStreak * ratio),
    };
  });
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      progress: initialProgress,

      addXP: (amount) =>
        set((state) => {
          const newXP = state.progress.totalXP + amount;
          const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
          const updatedProgress: UserProgress = {
            ...state.progress,
            totalXP: newXP,
            level: newLevel,
          };

          return {
            progress: {
              ...updatedProgress,
              history: upsertTodayHistory(updatedProgress),
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
            const updatedProgress: UserProgress = { ...state.progress };
            return {
              progress: {
                ...updatedProgress,
                history: upsertTodayHistory(updatedProgress),
              },
            };
          }

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const wasYesterday = lastPractice === yesterday.toDateString();

          const updatedProgress: UserProgress = {
            ...state.progress,
            dayStreak: wasYesterday ? state.progress.dayStreak + 1 : 1,
            lastPracticeDate: today,
          };

          return {
            progress: {
              ...updatedProgress,
              history: upsertTodayHistory(updatedProgress),
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

          const updatedProgress: UserProgress = {
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
          };

          return {
            progress: {
              ...updatedProgress,
              history: upsertTodayHistory(updatedProgress),
            },
          };
        }),

      resetProgress: () =>
        set({
          progress: {
            ...initialProgress,
            history: [],
          },
        }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 3,
      migrate: (persistedState: unknown) => {
        if (!persistedState || typeof persistedState !== "object") {
          return persistedState as UserState;
        }

        const state = persistedState as { progress?: UserProgress };
        if (!state.progress) {
          return persistedState as UserState;
        }

        const historyExists = Array.isArray(state.progress.history) && state.progress.history.length > 0;
        const seededHistory = historyExists
          ? normalizeHistory(state.progress.history)
          : buildSeededHistory({
              ...state.progress,
              history: [],
            });

        return {
          ...state,
          progress: {
            ...state.progress,
            hearts: 5,
            maxHearts: 5,
            history: seededHistory,
          },
        } as UserState;
      },
    }
  )
);
