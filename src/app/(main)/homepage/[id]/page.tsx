"use client";
import Quiz from "@/components/Quiz";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useUser } from "@/hooks/useUser";
import { Icon, SUBJECTS } from "@/lib/constants";
import { LessonData, QuizQuestion } from "@/lib/types";
import {
  generateIllustration,
  generateLessonContent,
  generateQuiz,
} from "@/services/geminiService";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

enum PageState {
  Loading,
  Lesson,
  Quiz,
  Complete,
}

const LessonPage: React.FC = () => {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const router = useRouter();
  const { user } = useUser();
  const userClass = user?.class; // Use a primitive value for dependency array

  const [pageState, setPageState] = useState<PageState>(PageState.Loading);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [xpGained, setXpGained] = useState(0);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);

  const subject = SUBJECTS.find((s) => s.id === id);

  const loadContent = useCallback(async () => {
    if (!subject || !userClass) return;
    setPageState(PageState.Loading);
    try {
      const content = await generateLessonContent(subject.name, userClass);
      const questions = await generateQuiz(subject.name, userClass);

      // Generate illustrations for each module
      const illustratedLessons = await Promise.all(
        content.lessons.map(async (lesson) => ({
          ...lesson,
          imageUrl: await generateIllustration(lesson.illustrationPrompt),
        }))
      );

      setLessonData({ lessons: illustratedLessons });
      setQuizQuestions(questions);
      setPageState(PageState.Lesson);
    } catch (error) {
      console.error("Failed to load lesson content:", error);
      // Handle error state, maybe navigate back or show an error message
    }
  }, [subject, userClass]);

  useEffect(() => {
    // Only load content when userClass is available to prevent unnecessary re-renders.
    if (userClass) {
      loadContent();
    }
  }, [loadContent, userClass]);

  const handleQuizComplete = (totalXp: number) => {
    setXpGained(totalXp);
    setPageState(PageState.Complete);
  };

  const handleNextModule = () => {
    if (lessonData && currentModuleIndex < lessonData.lessons.length - 1) {
      setCurrentModuleIndex((prev) => prev + 1);
    } else {
      setPageState(PageState.Quiz);
    }
  };

  const renderContent = () => {
    switch (pageState) {
      case PageState.Loading:
        return (
          <div className="text-center p-10 flex flex-col items-center justify-center min-h-[400px]">
            <Icon
              name="robot"
              className="w-16 h-16 text-brand-secondary animate-bounce mb-4"
            />
            <h2 className="text-2xl font-bold">Generating your lesson...</h2>
            <p className="text-brand-text-secondary mt-2">
              Our AI is preparing a personalized lesson just for you!
            </p>
          </div>
        );
      case PageState.Lesson:
        if (!lessonData) return null;
        const currentModule = lessonData.lessons[currentModuleIndex];
        const isLastModule =
          currentModuleIndex === lessonData.lessons.length - 1;

        return (
          <div>
            <div className="mb-4">
              <span className="font-bold text-brand-secondary">
                Module {currentModuleIndex + 1} / {lessonData.lessons.length}
              </span>
              <h2 className="text-3xl font-bold my-2 text-brand-text-primary">
                {currentModule.title}
              </h2>
            </div>

            {currentModule.imageUrl ? (
              <Image
                width={300}
                height={300}
                src={currentModule.imageUrl}
                alt={currentModule.title}
                className="w-full h-48 object-cover rounded-lg mb-4 bg-brand-primary"
              />
            ) : (
              <div className="w-full h-48 bg-brand-primary rounded-lg mb-4 flex items-center justify-center">
                <p>Loading illustration...</p>
              </div>
            )}

            <p className="text-brand-text-primary text-lg leading-relaxed">
              {currentModule.content}
            </p>

            <div className="text-center mt-8">
              <Button onClick={handleNextModule}>
                {isLastModule ? "Start Quiz" : "Next Module"}
              </Button>
            </div>
          </div>
        );
      case PageState.Quiz:
        return (
          <Quiz
            questions={quizQuestions}
            subjectId={id}
            onQuizComplete={handleQuizComplete}
          />
        );
      case PageState.Complete:
        return (
          <div className="text-center p-10">
            <Icon
              name="trophy"
              className="w-20 h-20 text-yellow-500 mx-auto mb-4"
            />
            <h2 className="text-3xl font-bold text-brand-secondary">
              Lesson Complete!
            </h2>
            <p className="text-xl my-4">
              You earned <span className="font-bold">{xpGained} XP</span>!
            </p>
            <Button onClick={() => router.push("/homepage")}>
              Back to Subjects
            </Button>
          </div>
        );
    }
  };

  if (!subject) {
    return <div>Subject not found.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-brand-text-primary mb-4">
        {subject.name}
      </h1>
      <Card>
        <div className="p-4 sm:p-6">{renderContent()}</div>
      </Card>
    </div>
  );
};

export default LessonPage;
