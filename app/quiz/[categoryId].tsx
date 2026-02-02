import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { categories } from "@/constants/categories";
import { useUserStore } from "@/store/useUserStore";
import { Question } from "@/types";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { QuestionCard, AnswerOption, ExplanationModal } from "@/components/quiz";
import { HeartsDisplay } from "@/components/gamification";
import { colors } from "@/constants/theme";
import { useThemeColors } from "@/hooks/useThemeColors";

const sampleQuestions: Record<string, Question[]> = {
  "road-signs": [
    {
      id: "rs-1",
      categoryId: "road-signs",
      question: "What does a circular sign with a red border and white background indicate?",
      options: ["Give way", "A prohibition or restriction", "A warning", "Information"],
      correctAnswer: 1,
      explanation: "Circular signs with a red border indicate prohibitions or restrictions. The red border signals that something is not allowed or limited.",
    },
    {
      id: "rs-2",
      categoryId: "road-signs",
      question: "What shape are warning signs in the UK?",
      options: ["Circular", "Rectangular", "Triangular", "Octagonal"],
      correctAnswer: 2,
      explanation: "Warning signs in the UK are triangular with a red border. They alert drivers to potential hazards ahead.",
    },
    {
      id: "rs-3",
      categoryId: "road-signs",
      question: "What does a blue circular sign indicate?",
      options: ["A warning", "A prohibition", "A positive instruction", "Information only"],
      correctAnswer: 2,
      explanation: "Blue circular signs give positive instructions, such as 'turn left' or 'minimum speed'. They tell you what you must do.",
    },
  ],
  "highway-code": [
    {
      id: "hc-1",
      categoryId: "highway-code",
      question: "What is the national speed limit on a single carriageway for cars?",
      options: ["50 mph", "60 mph", "70 mph", "80 mph"],
      correctAnswer: 1,
      explanation: "The national speed limit on a single carriageway for cars is 60 mph. On dual carriageways and motorways, it's 70 mph.",
    },
    {
      id: "hc-2",
      categoryId: "highway-code",
      question: "When should you use your horn?",
      options: [
        "To greet a friend",
        "To warn others of your presence",
        "To show frustration",
        "At any time you wish"
      ],
      correctAnswer: 1,
      explanation: "You should only use your horn to warn others of your presence. It should not be used to express frustration or greet people.",
    },
  ],
  "hazard-perception": [
    {
      id: "hp-1",
      categoryId: "hazard-perception",
      question: "What should you do when approaching a pedestrian crossing with people waiting?",
      options: [
        "Speed up to pass quickly",
        "Sound your horn",
        "Be prepared to stop",
        "Flash your headlights"
      ],
      correctAnswer: 2,
      explanation: "You should always be prepared to stop when approaching a pedestrian crossing with people waiting. They have priority once on the crossing.",
    },
  ],
  "vehicle-safety": [
    {
      id: "vs-1",
      categoryId: "vehicle-safety",
      question: "How often should you check your tyre pressure?",
      options: ["Once a year", "Every month", "At least once a week", "Only before MOT"],
      correctAnswer: 2,
      explanation: "You should check your tyre pressure at least once a week and before any long journey. Correct tyre pressure improves safety and fuel efficiency.",
    },
  ],
  "road-markings": [
    {
      id: "rm-1",
      categoryId: "road-markings",
      question: "What do double white lines in the centre of the road mean?",
      options: [
        "You may overtake if safe",
        "You must not cross or straddle them",
        "They mark a bus lane",
        "They indicate a cycle lane"
      ],
      correctAnswer: 1,
      explanation: "Double white lines where the line nearest you is solid mean you must not cross or straddle them except to turn into a premises or side road.",
    },
  ],
};

export default function QuizScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { progress, addXP, loseHeart, recordAnswer, updateStreak } = useUserStore();
  const { isDark, background, surface, text, textMuted } = useThemeColors();

  const category = categories.find((c) => c.id === categoryId);
  const questions = sampleQuestions[categoryId || ""] || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;

  useEffect(() => {
    updateStreak();
  }, []);

  const handleSelectAnswer = (index: number) => {
    if (showResult || progress.hearts <= 0) return;
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    if (isCorrect) {
      setScore((prev) => prev + 1);
      addXP(10);
      recordAnswer(true, categoryId || "");
    } else {
      loseHeart();
      recordAnswer(false, categoryId || "");
    }
    setTimeout(() => setShowExplanation(true), 500);
  };

  const handleContinue = () => {
    setShowExplanation(false);
    if (currentIndex < questions.length - 1 && progress.hearts > 0) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleFinish = () => router.back();

  if (!category || questions.length === 0) {
    return (
      <SafeAreaView style={[styles.containerCenter, { backgroundColor: background }]}>
        <Ionicons name="alert-circle" size={64} color={colors.warning[500]} />
        <Text style={[styles.emptyTitle, { color: text }]}>No questions available</Text>
        <Text style={[styles.emptySubtitle, { color: textMuted }]}>Questions for this category are coming soon!</Text>
        <Button title="Go Back" variant="primary" style={styles.emptyButton} onPress={handleFinish} />
      </SafeAreaView>
    );
  }

  if (isComplete || progress.hearts <= 0) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;
    return (
      <SafeAreaView style={[styles.containerCenter, { backgroundColor: background }]}>
        <View style={[styles.resultIcon, { backgroundColor: isDark ? (passed ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)") : (passed ? colors.success[100] : colors.error[100]) }]}>
          <Ionicons name={passed ? "trophy" : "refresh"} size={48} color={passed ? colors.success[500] : colors.error[500]} />
        </View>
        <Text style={[styles.resultTitle, { color: text }]}>
          {progress.hearts <= 0 ? "Out of Hearts!" : passed ? "Great Job!" : "Keep Practicing!"}
        </Text>
        <Text style={[styles.resultSubtitle, { color: textMuted }]}>You scored {score} out of {questions.length} ({percentage}%)</Text>
        <View style={styles.resultStats}>
          <View style={[styles.resultStatBox, { backgroundColor: surface }]}>
            <Text style={[styles.resultStatValue, { color: colors.primary[500] }]}>{score * 10}</Text>
            <Text style={[styles.resultStatLabel, { color: textMuted }]}>XP Earned</Text>
          </View>
          <View style={[styles.resultStatBox, { backgroundColor: surface }]}>
            <Text style={[styles.resultStatValue, { color: colors.success[500] }]}>{score}</Text>
            <Text style={[styles.resultStatLabel, { color: textMuted }]}>Correct</Text>
          </View>
        </View>
        <Button title="Continue" variant="primary" size="lg" style={styles.resultButton} onPress={handleFinish} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.header}>
        <Button title="" variant="ghost" icon={<Ionicons name="close" size={28} color="#71717A" />} onPress={handleFinish} />
        <View style={styles.progressContainer}>
          <ProgressBar progress={currentIndex + 1} total={questions.length} size="md" variant="primary" />
        </View>
        <HeartsDisplay hearts={progress.hearts} maxHearts={progress.maxHearts} size="md" />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <QuestionCard question={currentQuestion} currentIndex={currentIndex} totalQuestions={questions.length} />
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <AnswerOption
              key={index}
              text={option}
              index={index}
              selected={selectedAnswer === index}
              correct={index === currentQuestion.correctAnswer}
              showResult={showResult}
              disabled={showResult}
              onPress={() => handleSelectAnswer(index)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomButton}>
        <Button
          title={showResult ? "Continue" : "Check Answer"}
          variant={selectedAnswer !== null ? "primary" : "secondary"}
          size="lg"
          disabled={selectedAnswer === null && !showResult}
          onPress={showResult ? handleContinue : handleCheckAnswer}
        />
      </View>

      <ExplanationModal visible={showExplanation} correct={isCorrect} explanation={currentQuestion.explanation} onContinue={handleContinue} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  containerCenter: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 12 },
  progressContainer: { flex: 1, marginHorizontal: 16 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },
  optionsContainer: { marginTop: 24 },
  bottomButton: { paddingHorizontal: 20, paddingBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: "700", marginTop: 16, textAlign: "center" },
  emptySubtitle: { fontSize: 16, marginTop: 8, textAlign: "center" },
  emptyButton: { marginTop: 24 },
  resultIcon: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center" },
  resultTitle: { fontSize: 24, fontWeight: "700", marginTop: 24 },
  resultSubtitle: { fontSize: 16, marginTop: 8, textAlign: "center" },
  resultStats: { flexDirection: "row", gap: 16, marginTop: 24 },
  resultStatBox: { alignItems: "center", borderRadius: 12, padding: 16 },
  resultStatValue: { fontSize: 24, fontWeight: "700" },
  resultStatLabel: { fontSize: 14 },
  resultButton: { marginTop: 32, width: "100%" },
});
