import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";

// --- Types ---
export type TriviaQuestion = {
  id: string; // Now a STABLE unique ID
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];
};

export type QuizConfig = {
  amount: number;
  difficulty: string; // "easy", "medium", "hard", "any"
  category: number | null;
};

type QuizContextType = {
  // State
  config: QuizConfig;
  questions: TriviaQuestion[];
  status: "idle" | "loading" | "ready" | "error" | "finished";
  error: string | null;
  score: number;
  currentIndex: number;

  // Actions
  updateConfig: (key: keyof QuizConfig, value: any) => void;
  fetchQuestions: () => Promise<void>;
  submitAnswer: (answer: string) => void;
  nextQuestion: () => void;
  resetGame: () => void;

  // Favorites
  favorites: TriviaQuestion[];
  toggleFavorite: (question: TriviaQuestion) => void;
  removeFavorite: (id: string) => void;
};

// --- Defaults ---
const defaultConfig: QuizConfig = { amount: 10, difficulty: "any", category: null };
const LOCAL_STORAGE_CONFIG_KEY = "quiz_config_v1";
const LOCAL_STORAGE_FAVS_KEY = "quiz_favs_v1";

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  // 1. Initialize Config from LocalStorage
  const [config, setConfig] = useState<QuizConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CONFIG_KEY);
      return saved ? JSON.parse(saved) : defaultConfig;
    } catch (e) {
      return defaultConfig;
    }
  });

  // 2. Game State
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error" | "finished">("idle");
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 3. Favorites (Load safely)
  const [favorites, setFavorites] = useState<TriviaQuestion[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FAVS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error loading favorites", e);
      return [];
    }
  });

  // --- Effects ---
  // Save Config on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CONFIG_KEY, JSON.stringify(config));
    } catch (e) {
      console.error("Failed to save config", e);
    }
  }, [config]);

  // Save Favorites on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_FAVS_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites", e);
    }
  }, [favorites]);

  // --- Actions ---

  const updateConfig = (key: keyof QuizConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const fetchQuestions = async () => {
    setStatus("loading");
    setError(null);
    try {
      // Build URL
      let url = `https://opentdb.com/api.php?amount=${config.amount || 10}&type=multiple`;

      // Check for null strictly
      if (config.category !== null) url += `&category=${config.category}`;
      if (config.difficulty && config.difficulty !== "any") url += `&difficulty=${config.difficulty}`;

      const { data } = await axios.get(url);

      if (data.response_code !== 0) {
        throw new Error(data.response_code === 1 ? "No questions found for these settings." : "API Error.");
      }

      // Helper to decode HTML entities safely
      const decode = (str: string) => {
        const txt = new DOMParser().parseFromString(str, "text/html");
        return txt.body.textContent || str;
      };

      const formatted: TriviaQuestion[] = data.results.map((q: any) => {
        const decodedQuestion = decode(q.question);
        const decodedCorrect = decode(q.correct_answer);
        const decodedIncorrect = q.incorrect_answers.map((a: string) => decode(a));

        // combine and shuffle
        const all_answers = [...decodedIncorrect, decodedCorrect].sort(() => Math.random() - 0.5);

        // Generate a stable id from the question text + correct answer
        const stableKey = decodedQuestion + "||" + decodedCorrect;
        // btoa for base64-safe id; handle unicode
       const id = btoa(new TextEncoder().encode(stableKey).toString());


        return {
          id,
          category: q.category,
          type: q.type,
          difficulty: q.difficulty,
          question: decodedQuestion,
          correct_answer: decodedCorrect,
          incorrect_answers: decodedIncorrect,
          all_answers,
        } as TriviaQuestion;
      });

      setQuestions(formatted);
      setScore(0);
      setCurrentIndex(0);
      setStatus("ready");
    } catch (err: any) {
      setError(err.message || "Failed to load questions.");
      setStatus("error");
    }
  };

  const submitAnswer = (answer: string) => {
    if (!questions || questions.length === 0) return;
    if (answer === questions[currentIndex].correct_answer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setStatus("finished");
    }
  };

  const resetGame = () => {
    setStatus("idle");
    setQuestions([]);
    setScore(0);
    setCurrentIndex(0);
  };

  // Toggle by ID (safer)
  const toggleFavorite = (q: TriviaQuestion) => {
    const exists = favorites.find((f) => f.id === q.id);
    if (exists) {
      setFavorites((prev) => prev.filter((f) => f.id !== q.id));
    } else {
      setFavorites((prev) => [...prev, q]);
    }
  };

  // Remove favorite by id (used by Favorites page)
  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <QuizContext.Provider
      value={{
        config,
        questions,
        status,
        error,
        score,
        currentIndex,
        updateConfig,
        fetchQuestions,
        submitAnswer,
        nextQuestion,
        resetGame,
        favorites,
        toggleFavorite,
        removeFavorite,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) throw new Error("useQuiz must be used within a QuizProvider");
  return context;
}
