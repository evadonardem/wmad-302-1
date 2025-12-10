import { createContext, useContext, useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import axios from "axios";

// --- Types ---
export type TriviaQuestion = {
  id: string;
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[];
};

export type GameMode = "standard" | "time_attack" | "endless";

export type QuizConfig = {
  amount: number;
  difficulty: string;
  category: number | null;
  mode: GameMode;
  timeLimit: number; // in seconds, used for Time Attack
};

type QuizContextType = {
  config: QuizConfig;
  questions: TriviaQuestion[];
  status: "idle" | "loading" | "ready" | "error" | "finished";
  error: string | null;
  score: number;
  currentIndex: number;
  timer: number;
  streak: number;
  
  // Actions
  updateConfig: (key: keyof QuizConfig, value: any) => void;
  fetchQuestions: (isRefetch?: boolean) => Promise<void>;
  submitAnswer: (answer: string) => void;
  nextQuestion: () => void;
  resetGame: () => void;

  // Favorites
  favorites: TriviaQuestion[];
  toggleFavorite: (question: TriviaQuestion) => void;
  removeFavorite: (id: string) => void;
};

// --- Defaults ---
const defaultConfig: QuizConfig = { 
  amount: 10, 
  difficulty: "any", 
  category: null,
  mode: "standard",
  timeLimit: 60 
};

const LOCAL_STORAGE_CONFIG_KEY = "quiz_config_v2";
const LOCAL_STORAGE_FAVS_KEY = "quiz_favs_v1";
const LOCAL_STORAGE_HISTORY_KEY = "quiz_history"; 

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  // 1. Initialize Config
  const [config, setConfig] = useState<QuizConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CONFIG_KEY);
      return saved ? { ...defaultConfig, ...JSON.parse(saved) } : defaultConfig;
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
  
  // New Features State
  const [timer, setTimer] = useState(0);
  const [streak, setStreak] = useState(0);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 3. Favorites
  const [favorites, setFavorites] = useState<TriviaQuestion[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FAVS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CONFIG_KEY, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_FAVS_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Timer Logic
  useEffect(() => {
    if (status === "ready") {
      // Start Timer
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (config.mode === "time_attack") {
            if (prev <= 1) {
              setStatus("finished");
              return 0;
            }
            return prev - 1;
          } else {
            // Standard/Endless: Count up
            return prev + 1;
          }
        });
      }, 1000);
    } else {
      // Clear timer if not playing
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [status, config.mode]);

  // --- Actions ---

  const updateConfig = (key: keyof QuizConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const fetchQuestions = async (isRefetch = false) => {
    if (!isRefetch) {
      setStatus("loading");
      setQuestions([]); // Clear if new game
    }
    
    setError(null);

    try {
      // In endless mode, fetch small batches. In standard, fetch config amount.
      const fetchAmount = config.mode === "endless" ? 10 : config.amount;
      
      let url = `https://opentdb.com/api.php?amount=${fetchAmount}&type=multiple`;
      if (config.category !== null) url += `&category=${config.category}`;
      if (config.difficulty && config.difficulty !== "any") url += `&difficulty=${config.difficulty}`;

      const { data } = await axios.get(url);

      if (data.response_code !== 0) {
        // If endless and we run out (Code 1), strictly speaking we should handle token resets, 
        // but for now we throw error or finish.
        if (config.mode === "endless" && isRefetch) return; // Just stop fetching
        throw new Error("No questions found.");
      }

      const decode = (str: string) => {
        const txt = new DOMParser().parseFromString(str, "text/html");
        return txt.body.textContent || str;
      };

      const formatted: TriviaQuestion[] = data.results.map((q: any) => {
        const decodedQuestion = decode(q.question);
        const decodedCorrect = decode(q.correct_answer);
        const decodedIncorrect = q.incorrect_answers.map((a: string) => decode(a));
        const all_answers = [...decodedIncorrect, decodedCorrect].sort(() => Math.random() - 0.5);
        const stableKey = decodedQuestion + "||" + decodedCorrect;
        // Use a random suffix to avoid ID collisions in endless mode if duplicates occur
        const id = btoa(new TextEncoder().encode(stableKey).toString()) + Math.random().toString(36).substring(7);

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

      if (isRefetch) {
        setQuestions((prev) => [...prev, ...formatted]);
      } else {
        setQuestions(formatted);
        setScore(0);
        setCurrentIndex(0);
        setStreak(0);
        // Set initial timer
        setTimer(config.mode === "time_attack" ? config.timeLimit : 0);
        setStatus("ready");
      }
    } catch (err: any) {
      if (!isRefetch) {
        setError(err.message || "Failed to load questions.");
        setStatus("error");
      }
    }
  };

  const submitAnswer = (answer: string) => {
    if (!questions || questions.length === 0) return;
    
    const currentQ = questions[currentIndex];
    const isCorrect = answer === currentQ.correct_answer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      
      // Time Attack Bonus: Add 2 seconds for correct answer? (Optional game mechanic)
      // if (config.mode === 'time_attack') setTimer(prev => prev + 2);
    } else {
      setStreak(0);
    }

    // Log History (Keep existing logic)
    try {
      const logEntry = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        question: currentQ.question,
        userAnswer: answer,
        correctAnswer: currentQ.correct_answer,
        isCorrect: isCorrect,
        timestamp: Date.now(),
      };
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      const history = storedHistory ? JSON.parse(storedHistory) : [];
      history.unshift(logEntry);
      if (history.length > 500) history.length = 500;
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(history));
    } catch (e) { console.error(e) }
  };

  const nextQuestion = () => {
    // Endless Logic: If we are near the end of the array, fetch more
    if (config.mode === "endless" && currentIndex >= questions.length - 3) {
      fetchQuestions(true); // Background fetch
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Standard Mode: End game
      if (config.mode !== "endless") {
        setStatus("finished");
      }
    }
  };

  const resetGame = () => {
    setStatus("idle");
    setQuestions([]);
    setScore(0);
    setCurrentIndex(0);
    setStreak(0);
    setTimer(config.mode === "time_attack" ? config.timeLimit : 0);
  };

  const toggleFavorite = (q: TriviaQuestion) => {
    const exists = favorites.find((f) => f.id === q.id);
    if (exists) {
      setFavorites((prev) => prev.filter((f) => f.id !== q.id));
    } else {
      setFavorites((prev) => [...prev, q]);
    }
  };

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
        timer,
        streak,
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