import { useEffect, useState } from "react";
import "./global.css";

type Category = { id: number; name: string };
type Question = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  allAnswers: string[];
};

type Stats = {
  gamesPlayed: number;
  totalQuestions: number;
  totalCorrect: number;
};

const DEFAULT_STATS: Stats = { gamesPlayed: 0, totalQuestions: 0, totalCorrect: 0 };

const TYPE_MAP: Record<string, number[]> = {
  general: [9],
  games: [15, 16, 31, 32],
  science: [17, 18, 19, 30],
  sports: [21],
  history: [23, 20, 24, 25],
  geography: [22, 27, 28],
};

const GAME_MODES = ["Classic", "Survival", "Speedrun", "Endless", "Reward Mode"];
const DIFFICULTIES = ["easy", "medium", "hard"];

const CATEGORY_EMOJI: Record<string, string> = {
  general: "🧠",
  games: "🎮",
  science: "🔬",
  sports: "⚽",
  history: "📚",
  geography: "🗺️",
};

// Individual category emojis for specific categories
const CATEGORY_SPECIFIC_EMOJI: Record<number, string> = {
  // General
  9: "🧠",
  // Games
  15: "🎮",
  16: "🎲",
  31: "🎨",
  32: "📺",
  // Science
  17: "🔬",
  18: "💻",
  19: "🔢",
  30: "📱",
  // Sports
  21: "⚽",
  // History
  23: "📖",
  20: "🏹",
  24: "🏛️",
  25: "🖼️",
  // Geography
  22: "🌍",
  27: "🦁",
  28: "🚗",
};

const Categories = () => {
  const [type, setType] = useState("general");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [mode, setMode] = useState("Classic");
  const [numQuestions, setNumQuestions] = useState(10);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(0);
  const [history, setHistory] = useState<any[]>([]);

  // ✅ Global favorites
  const [favorites, setFavorites] = useState<Question[]>(() => {
    const storedFavs = localStorage.getItem("favorites");
    return storedFavs ? JSON.parse(storedFavs) : [];
  });

  // Statistics
  const [stats, setStats] = useState<Stats>(() => {
    const s = localStorage.getItem("stats");
    return s ? JSON.parse(s) : DEFAULT_STATS;
  });

  // Load coins
  useEffect(() => {
    const savedCoins = localStorage.getItem("coins");
    if (savedCoins) setCoins(parseInt(savedCoins));
  }, []);

  // Save favorites whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Update stats when quiz ends
  useEffect(() => {
    if (!showResult || !quizStarted) return;
    const stored = localStorage.getItem("stats");
    const cur: Stats = stored ? JSON.parse(stored) : { ...DEFAULT_STATS };
    const updated: Stats = {
      gamesPlayed: cur.gamesPlayed + 1,
      totalQuestions: cur.totalQuestions + (questions.length || 0),
      totalCorrect: cur.totalCorrect + score,
    };
    localStorage.setItem("stats", JSON.stringify(updated));
    setStats(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResult, quizStarted]);

  // Timer
  useEffect(() => {
    if (!quizStarted || selectedAnswer) return;
    const speed = mode === "Speedrun" ? 600 : 1000;
    if (timeLeft <= 0) {
      handleAnswerSelect("No Answer");
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), speed);
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, selectedAnswer, mode]);

  // Fetch categories
  useEffect(() => {
    setLoading(true);
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://opentdb.com/api_category.php");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const all: Category[] = data.trivia_categories || [];
        const allowedIds = TYPE_MAP[type];
        const filtered = allowedIds && allowedIds.length
          ? all.filter(c => allowedIds.includes(c.id))
          : all;
        setCategories(filtered);
      } catch {
        const fallback: Record<string, Category[]> = {
          general: [{ id: 9, name: "General Knowledge" }],
          games: [{ id: 15, name: "Video Games" }, { id: 16, name: "Board Games" }, { id: 31, name: "Anime & Manga" }, { id: 32, name: "Cartoon & Animations" }],
          science: [{ id: 17, name: "Science & Nature" }, { id: 18, name: "Computers" }, { id: 19, name: "Mathematics" }, { id: 30, name: "Gadgets" }],
          sports: [{ id: 21, name: "Sports" }],
          history: [{ id: 23, name: "History" }, { id: 20, name: "Mythology" }, { id: 24, name: "Politics" }, { id: 25, name: "Art" }],
          geography: [{ id: 22, name: "Geography" }, { id: 27, name: "Animals" }, { id: 28, name: "Vehicles" }]
        };
        setCategories(fallback[type] || []);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [type]);

  const decodeHTML = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  // Start quiz
  const startQuiz = async () => {
    if (!selectedCategory) return alert("Select a category!");
    const url = `https://opentdb.com/api.php?amount=${numQuestions}&category=${selectedCategory.id}&difficulty=${difficulty}&type=multiple`;
    const res = await fetch(url);
    const data = await res.json();
    const formatted = data.results.map((q: any) => ({
      ...q,
      allAnswers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
    }));
    setQuestions(formatted);
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setLives(3);
    setHistory([]);
    setSelectedAnswer("");
    setTimeLeft(mode === "Speedrun" ? 5 : 15);
    setShowResult(false);
  };

  // Toggle favorite question
  const toggleFavorite = (q: Question) => {
    const questionToSave = {
      question: q.question,
      category: selectedCategory?.name || "Unknown",
      correct_answer: q.correct_answer,
      incorrect_answers: q.incorrect_answers,
      type: q.type,
      difficulty: q.difficulty
    };
    
    const exists = favorites.some(f => f.question === questionToSave.question);
    const updated = exists 
      ? favorites.filter(f => f.question !== questionToSave.question) 
      : [...favorites, questionToSave];
    
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  // Answer selection
  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    const q = questions[currentQuestion];
    setHistory(prev => [...prev, { question: q.question, correct: q.correct_answer, user: answer }]);

    const correct = answer === q.correct_answer;
    if (correct) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
      if (mode === "Reward Mode") setCoins(c => { localStorage.setItem("coins", String(c + 5)); return c + 5; });
    } else {
      setStreak(0);
      if (mode === "Survival") {
        if (lives - 1 === 0) return setShowResult(true);
        setLives(l => l - 1);
      }
      if (mode === "Endless") return setShowResult(true);
    }
  };

  const nextQuestion = () => {
    if (!selectedAnswer) return;
    if (currentQuestion + 1 < questions.length && mode !== "Endless") {
      setCurrentQuestion(c => c + 1);
      setSelectedAnswer("");
      setTimeLeft(mode === "Speedrun" ? 5 : 15);
    } else setShowResult(true);
  };

  // ===== RESULTS SCREEN =====
  if (showResult && quizStarted) {
    const percentage = Math.round((score / questions.length) * 100);
    let bestStreak = 0;
    let currentRun = 0;
    for (const h of history) {
      if (h.user === h.correct) {
        currentRun += 1;
        if (currentRun > bestStreak) bestStreak = currentRun;
      } else {
        currentRun = 0;
      }
    }

    return (
      <div className="categories-container">
        <div className="result-container fancy-result">
          <header className="result-header">
            <h1 className="result-title">🎉 Quiz Complete</h1>
            <div className="result-sub">Nice work — here's your summary</div>
          </header>

          <div className="result-top">
            <div className="result-badge">
              <div className="badge-emoji">🏆</div>
              <div className="badge-score">
                <div className="score-number">{score}</div>
                <div className="score-sub"> / {questions.length}</div>
              </div>
            </div>

            <div className="result-grid">
              <div className="result-stat-card">
                <div className="stat-label">🎯 Accuracy</div>
                <div className="stat-value">{percentage}%</div>
                <div className="stat-mini">
                  <div className="mini-bar">
                    <div className="mini-fill" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              </div>

              <div className="result-stat-card">
                <div className="stat-label">🔥 Best Streak</div>
                <div className="stat-value" style={{ color: "var(--gray-900)" }}>{bestStreak}</div>
                <div className="stat-mini">Keep the momentum!</div>
              </div>

              <div className="result-stat-card">
                <div className="stat-label">💡 Mode</div>
                <div className="stat-value">{mode}</div>
                <div className="stat-mini">{selectedCategory?.name || "—"}</div>
              </div>

              <div className="result-stat-card">
                <div className="stat-label">💾 Games Played</div>
                <div className="stat-value">{stats.gamesPlayed}</div>
                <div className="stat-mini">Total</div>
              </div>
            </div>
          </div>

          <div className="history-container">
            <h3 style={{ color: "#111827", textAlign: "left" }}>📋 Review</h3>
            {history.map((item, idx) => (
              <div key={idx} className="history-item">
                <div className="history-question">{decodeHTML(item.question)}</div>
                <div className="history-user">Your answer: {decodeHTML(item.user)}</div>
                {item.user !== item.correct && (
                  <div className="history-correct">Correct: {decodeHTML(item.correct)}</div>
                )}
              </div>
            ))}
          </div>

          <div className="result-actions">
            <button
              className="btn-primary"
              onClick={() => {
                setQuizStarted(false);
                setSelectedCategory(null);
                setShowResult(false);
                setCurrentQuestion(0);
                setScore(0);
                setSelectedAnswer("");
                setHistory([]);
              }}
            >
              ← Back to Categories
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  if (quizStarted && questions.length > 0) {
    const q = questions[currentQuestion];
    const isFavorite = favorites.some(f => f.question === q.question);
    return (
      <div className="quiz-container">
        <div className="hud">
          <p>⏳ <span className="stat-warning">{timeLeft}s</span></p>
          <p>🔥 Streak: <span className="stat-success">{streak}</span></p>
          <p>❓ {currentQuestion + 1}/{questions.length}</p>
          {mode === "Survival" && <p>❤️ Lives: <span className="stat-danger">{lives}</span></p>}
          {mode === "Reward Mode" && <p>💰 Coins: <span className="stat-success">{coins}</span></p>}
        </div>

        <div className="question-header">
          <div className="question-text">{decodeHTML(q.question)}</div>
          <button onClick={() => toggleFavorite(q)} className="btn-star">
            {isFavorite ? "★" : "☆"}
          </button>
        </div>

        <div className="answers-container">
          {q.allAnswers.map((ans, i) => (
            <button
              key={i}
              className={`answer-btn ${
                selectedAnswer
                  ? ans === q.correct_answer
                    ? "correct"
                    : ans === selectedAnswer
                    ? "incorrect"
                    : ""
                  : ""
              }`}
              onClick={() => handleAnswerSelect(ans)}
              disabled={selectedAnswer !== ""}
            >
              {decodeHTML(ans)}
            </button>
          ))}
        </div>

        {selectedAnswer && (
          <button onClick={nextQuestion} className="btn-next">
            {currentQuestion + 1 === questions.length ? "See Results →" : "Next Question →"}
          </button>
        )}
      </div>
    );
  }

  // Setup / Category Settings
  if (selectedCategory) {
    return (
      <div className="categories-container">
        <button className="btn-back" onClick={() => setSelectedCategory(null)}>
          ← Back
        </button>
        <h1>{selectedCategory.name}</h1>

        <label>Difficulty</label>
        <div className="type-grid">
          {DIFFICULTIES.map(d => (
            <div
              key={d}
              className={`type-panel ${difficulty === d ? "active" : ""}`}
              onClick={() => setDifficulty(d)}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </div>
          ))}
        </div>

        <label>Game Mode</label>
        <div className="type-grid">
          {GAME_MODES.map(m => (
            <div
              key={m}
              className={`type-panel ${mode === m ? "active" : ""}`}
              onClick={() => setMode(m)}
            >
              {m}
            </div>
          ))}
        </div>

        <label>Number of Questions</label>
        <input
          type="number"
          value={numQuestions}
          onChange={e => setNumQuestions(+e.target.value)}
          min="1"
          max="50"
        />

        <button onClick={startQuiz} className="btn-primary">
          🚀 Start Quiz
        </button>
      </div>
    );
  }

  // Type & Categories Selection
  return (
    <div className="categories-container">
      <h1>Trivia Categories</h1>
      <p>Select a type and category to start</p>

      <label>Select Category Type</label>
      <div className="type-grid type-grid-emoji">
        {Object.keys(TYPE_MAP).map(t => (
          <div
            key={t}
            className={`type-panel type-panel-emoji ${type === t ? "active" : ""}`}
            onClick={() => setType(t)}
          >
            <div className="type-emoji">{CATEGORY_EMOJI[t]}</div>
            <div className="type-name">{t.charAt(0).toUpperCase() + t.slice(1)}</div>
          </div>
        ))}
      </div>

      <label>Choose a Category</label>
      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <div className="category-grid">
          {categories.map(c => (
            <div
              key={c.id}
              className="category-card"
              onClick={() => setSelectedCategory(c)}
            >
              <div className="category-emoji">{CATEGORY_SPECIFIC_EMOJI[c.id] || "📌"}</div>
              <p className="category-name">{c.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
