"use client";
import { QuizQuestion } from "@/lib/types";
import { useUser } from "@/hooks/useUser";
import React, { useState } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";

interface QuizProps {
  questions: QuizQuestion[];
  subjectId: string;
  onQuizComplete: (totalXpGained: number) => void;
}

const Quiz: React.FC<QuizProps> = ({
  questions,
  subjectId,
  onQuizComplete,
}) => {
  const { addXp, completeLesson } = useUser();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [xpGained, setXpGained] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (option: string) => {
    if (showResult) return;
    setSelectedAnswer(option);
  };

  const handleNext = () => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore((s) => s + 1);
      setXpGained((xp) => xp + currentQuestion.xp);
      addXp(currentQuestion.xp);
    }
    setShowResult(false);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      completeLesson(subjectId);
      onQuizComplete(
        xpGained +
          (selectedAnswer === currentQuestion.correctAnswer
            ? currentQuestion.xp
            : 0)
      );
    }
  };

  const getButtonClass = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option ? "bg-brand-accent" : "bg-brand-primary";
    }
    if (option === currentQuestion.correctAnswer) {
      return "bg-green-500 text-white";
    }
    if (option === selectedAnswer) {
      return "bg-red-500 text-white";
    }
    return "bg-brand-primary";
  };
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <Card>
        <div className="p-4">
          <p className="text-sm font-semibold text-brand-text-secondary">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <h2 className="text-xl font-bold my-4 text-brand-text-primary">
            {currentQuestion.question}
          </h2>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
                className={`w-full text-left p-3 border border-brand-surface cursor-pointer rounded-lg transition-colors ${getButtonClass(
                  option
                )}`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-6 text-right">
            {showResult ? (
              <Button onClick={handleNext}>
                {currentQuestionIndex < questions.length - 1
                  ? "Next Question"
                  : "Finish Quiz"}
              </Button>
            ) : (
              <Button
                onClick={() => setShowResult(true)}
                disabled={!selectedAnswer}
              >
                Check Answer
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Quiz;
