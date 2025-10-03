import { GoogleGenAI, Type } from "@google/genai";
import type { QuizQuestion, LessonData } from "@/lib/types";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a mock service");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const mockLessonData: LessonData = {
  lessons: [
    {
      title: "Introduction to Basic Algebra",
      content:
        "Algebra is part of mathematics that helps us use letters to stand for numbers. These letters are called variables. For example, in the statement 'x + 2 = 5', the letter 'x' is used instead of a number we do not know. Algebra is like solving a riddle to find the missing number.",
      illustrationPrompt:
        "A Nigerian classroom setting where a teacher points to the equation x + 2 = 5 on the chalkboard, while students look curious.",
    },
    {
      title: "Understanding Variables and Constants",
      content:
        "In algebra, a variable is a symbol (like x, y, or z) that can represent different numbers. Constants are numbers that do not change. For example, in the equation 'x + 2 = 5', 'x' is the variable, while '2' and '5' are constants. Think of a variable as a basket that can hold different numbers, while constants are like stones that remain the same.",
      illustrationPrompt:
        'A basket labeled "x" that can contain different amounts of fruits, next to solid blocks with the numbers 2 and 5 carved into them.',
    },
    {
      title: "Solving Simple Equations",
      content:
        "To solve for the variable, we need to make it stand alone. For example, in 'x + 2 = 5', we want to find the value of x. To remove '+2', we do the opposite, which is subtracting 2. But we must subtract 2 from both sides of the equation to keep it balanced. So, x + 2 – 2 = 5 – 2, giving x = 3.",
      illustrationPrompt:
        'A balance scale with "x + 2" on one side and "5" on the other. The "2" is being removed from both sides, showing how the equation stays balanced.',
    },
    {
      title: "Real-World Applications",
      content:
        "Let's see how algebra helps in real life! When buying items at a market: If one orange costs ₦50 and you have ₦200, you can use the equation '50x = 200' to find how many oranges (x) you can buy. In sports: If your team needs to score an average of 3 goals per game, and has played 4 games scoring 14 goals total, you can use algebra to find how many goals are needed in the next game to maintain the average.",
      illustrationPrompt:
        "A split scene showing a Nigerian market with fruits and prices, and a football field with goal calculations floating above it.",
    },
  ],
};

const mockQuiz: QuizQuestion[] = [
  {
    question: "In the equation a + 8 = 12, what does the letter 'a' represent?",
    options: [
      "A variable",
      "A constant",
      "A number that does not change",
      "An operation",
    ],
    correctAnswer: "A variable",
    xp: 10,
  },
  {
    question: "What is the first step to solve x + 7 = 15?",
    options: [
      "Add 7 to both sides",
      "Subtract 7 from both sides",
      "Multiply both sides by 15",
      "Divide both sides by 7",
    ],
    correctAnswer: "Subtract 7 from both sides",
    xp: 10,
  },
  {
    question: "If y - 4 = 6, what is the value of y?",
    options: ["2", "8", "10", "12"],
    correctAnswer: "10",
    xp: 15,
  },
  {
    question: "Which of these is an example of a constant?",
    options: ["x", "y", "19", "z"],
    correctAnswer: "19",
    xp: 10,
  },
  {
    question: "What does the '=' sign mean in an equation?",
    options: [
      "Greater than",
      "Less than",
      "That the two sides are equal",
      "It shows a variable",
    ],
    correctAnswer: "That the two sides are equal",
    xp: 5,
  },
];

const lessonSchema = {
  type: Type.OBJECT,
  properties: {
    lessons: {
      type: Type.ARRAY,
      minItems: 4,
      maxItems: 4,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          illustrationPrompt: { type: Type.STRING },
        },
        required: ["title", "content", "illustrationPrompt"],
      },
    },
  },
  required: ["lessons"],
};

const getCourseTopic = async (
  subject: string,
  level: string
): Promise<string> => {
  const prompt = `Generate a single, specific topic from the Nigerian curriculum for ${subject} for a ${level} student. For example, for Mathematics JSS 1, a good topic would be 'Basic Algebraic Processes'. For History JSS 2, 'The Benin Kingdom'. Return only the topic name, nothing else.`;
  try {
    const response = await ai?.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response?.text?.trim() ?? `Introduction to ${subject}`;
  } catch (error) {
    console.error("Error generating topic:", error);
    return `Introduction to ${subject}`;
  }
};

export const generateLessonContent = async (
  subject: string,
  level: string
): Promise<LessonData> => {
  if (!ai) return Promise.resolve(mockLessonData);
  const topic = await getCourseTopic(subject, level);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert curriculum designer for Nigerian schools. Create 4 distinct learning modules 
                     for a ${level} student on the topic of '${topic}' in ${subject}. Each module should build upon the previous one
                     and cover a different aspect or subtopic. Structure it as follows:

                     Module 1: Introduction and basic concepts
                     Module 2: Core principles and examples
                     Module 3: Practice and application
                     Module 4: Advanced concepts and real-world connections

                     For each module:
                     - Give it a clear, specific title
                     - Provide concise, engaging content
                     - Use examples relevant to Nigerian students
                     - Keep language suitable for 12-14 year olds
                     - Include a visual description prompt for each module
                     
                     Follow the Nigerian Basic Education Curriculum standards. Do not use markdown formatting.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: lessonSchema,
      },
    });
    const jsonText = response?.text?.trim() ?? '{"lessons": []}';
    return JSON.parse(jsonText) as LessonData;
  } catch (error) {
    console.log("Error generating lesson content:", error);
    return mockLessonData;
  }
};

export const generateQuiz = async (
  subject: string,
  level: string
): Promise<QuizQuestion[]> => {
  if (!ai) return Promise.resolve(mockQuiz);

  const quizSchema = {
    type: Type.OBJECT,
    properties: {
      quiz: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
            xp: { type: Type.INTEGER },
          },
          required: ["question", "options", "correctAnswer", "xp"],
        },
      },
    },
    required: ["quiz"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a quiz with 5 multiple-choice questions (4 options each) on the topic of "${subject}" for a Nigerian Junior Secondary School student in class ${level}. The questions must be based on the Nigerian (NERDC) curriculum and use locally relevant context where appropriate. For each question, provide the question text, an array of 4 options, the correct answer text, and assign XP points (between 5 and 15) based on difficulty.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      },
    });
    const jsonText = response?.text?.trim() ?? '{"quiz": []}';
    const parsed = JSON.parse(jsonText);
    return parsed.quiz;
  } catch (error) {
    console.error("Error generating quiz: ", error);
    return mockQuiz;
  }
};

export const askAIAssistant = async (prompt: string): Promise<string> => {
  if (!ai) {
    return Promise.resolve(
      "I'm currently running in mock mode. I can't answert that right now, but I'm ready to help with your lessons!"
    );
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are a helpful and friendly AI assistant for a Nigerian junior secondary school student. Provide clear, concise, and encouraging answers. Use locally relevant examples where possible.",
        tools: [{ googleSearch: {} }],
      },
    });
    return (
      response.text ?? "I couldn't process your request. Please try again."
    );
  } catch (error) {
    console.error("Error asking AI assistant:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
};

export const generateIllustration = async (prompt: string): Promise<string> => {
  if (!ai) {
    // Return a placeholder image
    const seed = prompt.length + Math.floor(Math.random() * 100);
    return `https://picsum.photos/seed/${seed}/512/512`;
  }
  try {
    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt: `A simple, colorful, flat 2D vector illustration for a children's e-learning platform. ${prompt}`,
      config: {
        numberOfImages: 1,
        outputMimeType: "image/png",
        aspectRatio: "16:9",
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string =
        response.generatedImages?.[0]?.image?.imageBytes ?? "";
      return `data:image/png;base64,${base64ImageBytes}`;
    }
    return `https://picsum.photos/seed/error/512/512`;
  } catch (error) {
    console.error("Error generating illustration:", error);
    return `https://picsum.photos/seed/error/512/512`;
  }
};
