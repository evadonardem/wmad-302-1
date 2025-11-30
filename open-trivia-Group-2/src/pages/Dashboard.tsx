import { useEffect, useState } from "react";
import "./global.css";

type Question = {
  question: string;
  category: string;
  correct_answer: string;
  incorrect_answers: string[];
  difficulty: string;
  type: string;
  allAnswers: string[];
};

type TriviaType = { id: string; name: string };

const TYPES: TriviaType[] = [
  { id: "general", name: "General Knowledge" },
  { id: "games", name: "Games" },
  { id: "science", name: "Science" },
  { id: "sports", name: "Sports" },
  { id: "history", name: "History" },
  { id: "geography", name: "Geography" },
];

const DIFFICULTIES = ["easy", "medium", "hard"];
const GAME_MODES = ["Classic", "Survival", "Speedrun", "Endless", "Reward Mode"];

const CATEGORY_IDS: Record<string, number> = {
  general: 9, games: 15, science: 17,
  sports: 21, history: 23, geography: 22,
};

type Stats = {
  gamesPlayed: number;
  totalQuestions: number;
  totalCorrect: number;
};

const DEFAULT_STATS: Stats = { gamesPlayed: 0, totalQuestions: 0, totalCorrect: 0 };

const Dashboard = () => {
  // compact / dropdown-based UI
  const [selectedType, setSelectedType] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [mode, setMode] = useState("Classic");
  const [categoryName, setCategoryName] = useState("");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showCorrect, setShowCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Game Mode Systems
  const [timeLeft, setTimeLeft] = useState(15);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [coins, setCoins] = useState(0);
  const [history, setHistory] = useState<any[]>([]);

  // Favorites (global storage)
  const [favoriteQuestions, setFavoriteQuestions] = useState<Question[]>(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  // Statistics
  const [stats, setStats] = useState<Stats>(() => {
    const s = localStorage.getItem("stats");
    return s ? JSON.parse(s) : DEFAULT_STATS;
  });

  // load coins
  useEffect(() => {
    const savedCoins = localStorage.getItem("coins");
    if (savedCoins) setCoins(parseInt(savedCoins));
  }, []);

  // when quiz ends, update persistent stats
  useEffect(() => {
    if (!showResult) return;
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
  }, [showResult]);

  // Timer system
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

  const startQuiz = async () => {
    if (!selectedType) return alert("Choose a trivia category first!");
    const url =
      `https://opentdb.com/api.php?amount=${numQuestions}&category=${CATEGORY_IDS[selectedType]}&difficulty=${difficulty}&type=multiple`;

    const res = await fetch(url);
    const data = await res.json();

    const formatted: Question[] = data.results.map((q: any) => ({
      question: q.question,
      category: categoryName,
      correct_answer: q.correct_answer,
      incorrect_answers: q.incorrect_answers,
      difficulty: q.difficulty,
      type: q.type,
      allAnswers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
    }));

    setQuestions(formatted);
    setQuizStarted(true);
    setCurrent(0);
    setScore(0);
    setStreak(0);
    setLives(3);
    setHistory([]);
    setTimeLeft(mode === "Speedrun" ? 5 : 15);
  };

  const toggleFavorite = (question: Question) => {
    const exists = favoriteQuestions.some(f => f.question === question.question);
    let updatedFavorites: Question[];
    if (exists) updatedFavorites = favoriteQuestions.filter(f => f.question !== question.question);
    else updatedFavorites = [...favoriteQuestions, question];
    setFavoriteQuestions(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    setShowCorrect(true);

    const q = questions[current];
    setHistory(prev => [...prev, { question: q.question, correct: q.correct_answer, user: answer }]);

    const correct = answer === q.correct_answer;

    if (correct) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
      if (mode === "Reward Mode") {
        setCoins(c => {
          localStorage.setItem("coins", String(c + 5));
          return c + 5;
        });
      }
    } else {
      setStreak(0);
      if (mode === "Survival") {
        if (lives - 1 === 0) return setShowResult(true);
        setLives(l => l - 1);
      }
      if (mode === "Endless") return setShowResult(true);
    }
  };

  const next = () => {
    if (!selectedAnswer) return;
    if (current + 1 < questions.length && mode !== "Endless") {
      setCurrent(c => c + 1);
      setSelectedAnswer("");
      setShowCorrect(false);
      setTimeLeft(mode === "Speedrun" ? 5 : 15);
    } else setShowResult(true);
  };

  const decodeHTML = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  // compact result UI (stats updated via effect)
  if (showResult) {
    // compute metrics
    const percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;

    // compute best streak (longest run of consecutive correct answers)
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

    // persist best streak if it's a new personal best
    try {
      const prev = parseInt(localStorage.getItem("bestStreak") || "0", 10);
      if (bestStreak > prev) localStorage.setItem("bestStreak", String(bestStreak));
    } catch (e) {}

    return (
      <div className="dashboard-container">
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
                <div className="stat-mini">{categoryName || "—"}</div>
              </div>

              <div className="result-stat-card">
                <div className="stat-label">💾 Games Played</div>
                <div className="stat-value">{stats.gamesPlayed}</div>
                <div className="stat-mini">Total</div>
              </div>
            </div>
          </div>

          <div className="result-actions">
            <button
              className="btn-primary"
              onClick={() => {
                // restart same quiz quickly
                setQuizStarted(true);
                setShowResult(false);
                setSelectedAnswer("");
                setCurrent(0);
                setScore(0);
                setStreak(0);
                setLives(3);
                setHistory([]);
                setTimeLeft(mode === "Speedrun" ? 5 : 15);
              }}
            >
              🔁 Play Again
            </button>

            <button
              className="btn-secondary"
              onClick={() => {
                // go back to start menu
                setQuizStarted(false);
                setShowResult(false);
                setQuestions([]);
                setSelectedType("");
                setCategoryName("");
              }}
            >
              🏠 Back to Menu
            </button>
          </div>

          <div className="result-footer">
            <small>Tip: Best streaks update automatically and are saved locally ✨</small>
          </div>
        </div>
      </div>
    );
  }

  // in-quiz UI unchanged (compact)
  if (quizStarted && questions.length > 0) {
    const q = questions[current];
    const isFavorite = favoriteQuestions.some(f => f.question === q.question);

    return (
      <div className="quiz-container">
        <div className="hud compact-hud">
          <p>⏳ <span className="stat-warning">{timeLeft}s</span></p>
          <p>🔥 Streak: <span className="stat-success">{streak}</span></p>
          <p>❓ {current + 1}/{questions.length}</p>
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
          {q.allAnswers.map((ans: string, i: number) => (
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
          <button onClick={next} className="btn-next">
            {current + 1 === questions.length ? "See Results →" : "Next Question →"}
          </button>
        )}
      </div>
    );
  }

  // Start Menu - compressed with dropdowns and stats card
  const overallAccuracy = stats.totalQuestions
    ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
    : 0;

  const avgCorrectPerGame = stats.gamesPlayed
    ? (stats.totalCorrect / stats.gamesPlayed).toFixed(2)
    : "0.00";

  return (
    <div className="dashboard-container compact">
      <h1>🎮 Trivia Master</h1>
      <p className="mb-4">Quick play — pick a category, difficulty and mode</p>

      <label>📚 Category</label>
      <select
        value={selectedType}
        onChange={(e) => {
          setSelectedType(e.target.value);
          const t = TYPES.find(tt => tt.id === e.target.value);
          setCategoryName(t ? t.name : "");
        }}
        className="compact-select"
      >
        <option value="">Select category…</option>
        {TYPES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>

      <label>📊 Difficulty</label>
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="compact-select"
      >
        {DIFFICULTIES.map(d => <option key={d} value={d}>{capitalize(d)}</option>)}
      </select>

      <label>🎯 Game Mode</label>
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="compact-select"
      >
        {GAME_MODES.map(m => <option key={m} value={m}>{m}</option>)}
      </select>

      <label>❓ Number of Questions</label>
      <input
        type="number"
        value={numQuestions}
        onChange={e => setNumQuestions(+e.target.value)}
        min="1"
        max="50"
        className="compact-number"
      />

      <button onClick={startQuiz} className="btn-primary compact-start">
        🚀 Start Game
      </button>

      {/* fancy divider before statistics */}
      <div className="stats-divider">
        <div className="stats-divider-emoji">📊</div>
      </div>

      <div className="stats-card" role="region" aria-label="Player statistics">
        <h3>Player Statistics</h3>

        <div className="stats-row">
          <div className="label"><span className="stats-emoji">🎮</span> Games Played</div>
          <div className="value">{stats.gamesPlayed}</div>
        </div>

        <div className="stats-row">
          <div className="label"><span className="stats-emoji">❓</span> Total Questions</div>
          <div className="value">{stats.totalQuestions}</div>
        </div>

        <div className="stats-row">
          <div className="label"><span className="stats-emoji">✅</span> Total Correct</div>
          <div className="value">{stats.totalCorrect}</div>
        </div>

        <div className="stats-row">
          <div className="label"><span className="stats-emoji">📈</span> Avg Correct / Game</div>
          <div className="value">{avgCorrectPerGame}</div>
        </div>

        <div className="stats-row accuracy">
          <div className="accuracy-top">
            <div className="label"><span className="stats-emoji">🎯</span> Overall Accuracy</div>
            <div className="value">{overallAccuracy}%</div>
          </div>

          <div className="accuracy-bar" aria-hidden>
            <div
              className="accuracy-fill"
              style={{ width: `${overallAccuracy}%` }}
            />
          </div>
        </div>

        <div className="stats-hint">Keep playing to improve your streak — rewards grow with practice ✨</div>

        <div className="stats-actions">
          <button
            className="btn-secondary btn-reset"
            onClick={() => {
              localStorage.removeItem("stats");
              setStats({ gamesPlayed: 0, totalQuestions: 0, totalCorrect: 0 });
            }}
          >
            Reset Stats
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
