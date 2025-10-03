export type User = {
  id: string;
  name: string;
  email: string;
  class: "JSS1" | "JSS2" | "JSS3";
  xp: number;
  avatarUrl: string;
  courses: CourseProgress[];
  achievements: Achievement[];
};

export type CourseProgress = {
  subjectId: string;
  subjectName: string;
  lessonsCompleted: number;
  totalLessons: number;
  level: number;
  icon: string;
};

export type Subject = {
  id: string;
  name: string;
  level: number;
  image: string;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export type Notification = {
  id: string;
  text: string;
  timestamp: string;
  read: boolean;
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  xp: number;
  avatarUrl: string;
};

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  xp: number;
}

export interface LessonModule {
  title: string;
  content: string;
  illustrationPrompt: string;
  imageUrl?: string;
}

export interface LessonData {
  lessons: LessonModule[];
}

export interface TopicData {
  topic: string;
}
