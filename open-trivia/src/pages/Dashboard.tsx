import React, { useEffect, useState } from 'react';
import { Star, StarOff, Check, X } from 'lucide-react';

const cn = (...classes: (string | boolean)[]) => classes.filter(Boolean).join(' ');

interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface Preferences {
  category: string;
  difficulty: string;
  type: string;
}

const CATEGORIES = [
  { id: "", name: "All Categories" },
  { id: "9", name: "General Knowledge" },
  { id: "17", name: "Science & Nature" },
  { id: "23", name: "History" },
  { id: "11", name: "Film" },
  { id: "12", name: "Music" },
  { id: "21", name: "Sports" },
  { id: "22", name: "Geography" },
  { id: "18", name: "Computers" },
];

const DIFFICULTIES = [
  { value: "", label: "All Levels" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const TYPES = [
  { value: "", label: "All Types" },
  { value: "multiple", label: "Multiple Choice" },
  { value: "boolean", label: "True / False" },
];

const Dashboard = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [preferences, setPreferences] = useState<Preferences>({
    category: "",
    difficulty: "",
    type: "",
  });

  const decodeHTML = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    setQuestions([]);
    setAnswers({});
    setScore({ correct: 0, total: 0 });

    try {
      let url = `https://opentdb.com/api.php?amount=10`;
      if (preferences.category) url += `&category=${preferences.category}`;
      if (preferences.difficulty) url += `&difficulty=${preferences.difficulty}`;
      if (preferences.type) url += `&type=${preferences.type}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.response_code === 0 && data.results.length > 0) {
        setQuestions(data.results);
      } else {
        setError("No questions found. Try different filters.");
      }
    } catch (err) {
      setError("Failed to fetch questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [preferences]);

  const handleAnswer = (qIndex: number, answer: string, correctAnswer: string) => {
    if (answers[qIndex]) return;
    
    setAnswers((prev) => ({ ...prev, [qIndex]: answer }));
    setScore(prev => ({
      correct: prev.correct + (answer === correctAnswer ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const toggleFavorite = (index: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(index)) {
        newFavorites.delete(index);
      } else {
        newFavorites.add(index);
      }
      return newFavorites;
    });
  };

  const resetQuiz = () => {
    setAnswers({});
    setScore({ correct: 0, total: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Trivia Challenge</h1>
          <p className="text-slate-600">Test your knowledge across various topics</p>
        </div>

        {/* Score Card */}
        {score.total > 0 && (
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-sm font-medium text-slate-600 mb-1">Current Score</h3>
                <p className="text-3xl font-bold text-slate-900">{score.correct} / {score.total}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 mb-1">Accuracy</p>
                <p className="text-3xl font-bold text-blue-600">
                  {Math.round((score.correct / score.total) * 100)}%
                </p>
              </div>
              <button
                onClick={resetQuiz}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Reset Quiz
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">Filters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select
                value={preferences.category}
                onChange={(e) => setPreferences({ ...preferences, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
              <select
                value={preferences.difficulty}
                onChange={(e) => setPreferences({ ...preferences, difficulty: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {DIFFICULTIES.map((diff) => (
                  <option key={diff.value} value={diff.value}>{diff.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <select
                value={preferences.type}
                onChange={(e) => setPreferences({ ...preferences, type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Questions */}
        {!loading && !error && questions.length > 0 && (
          <div className="space-y-4">
            {questions.map((q, i) => {
              const allAnswers = q.type === "multiple"
                ? [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
                : ["True", "False"];

              const isAnswered = answers[i] !== undefined;
              const isCorrect = answers[i] === q.correct_answer;

              return (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="text-xs font-semibold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
                          #{i + 1}
                        </span>
                        <span className="text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                          {decodeHTML(q.category)}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-medium px-3 py-1 rounded-full",
                            q.difficulty === "easy" && "text-green-700 bg-green-50",
                            q.difficulty === "medium" && "text-yellow-700 bg-yellow-50",
                            q.difficulty === "hard" && "text-red-700 bg-red-50"
                          )}
                        >
                          {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                        </span>
                      </div>
                      <p className="text-base font-medium text-slate-900">
                        {decodeHTML(q.question)}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(i)}
                      className="ml-4 p-2 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
                    >
                      {favorites.has(i) ? (
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarOff className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                  </div>

                  {/* Answer Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {allAnswers.map((a) => {
                      const isSelected = answers[i] === a;
                      const isCorrectAnswer = a === q.correct_answer;
                      const showCorrect = isAnswered && isCorrectAnswer;
                      const showIncorrect = isAnswered && isSelected && !isCorrectAnswer;

                      return (
                        <button
                          key={a}
                          onClick={() => handleAnswer(i, a, q.correct_answer)}
                          disabled={isAnswered}
                          className={cn(
                            "px-4 py-3 rounded-lg font-medium transition-all text-left flex items-center gap-2 border",
                            !isAnswered && "bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-900 border-slate-200",
                            showCorrect && "bg-green-50 border-green-300 text-green-900",
                            showIncorrect && "bg-red-50 border-red-300 text-red-900",
                            isAnswered && !isSelected && !isCorrectAnswer && "bg-slate-50 border-slate-200 text-slate-500"
                          )}
                        >
                          {showCorrect && <Check className="w-4 h-4 text-green-600 flex-shrink-0" />}
                          {showIncorrect && <X className="w-4 h-4 text-red-600 flex-shrink-0" />}
                          <span>{decodeHTML(a)}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Result Message */}
                  {isAnswered && (
                    <div
                      className={cn(
                        "rounded-lg p-3 text-sm font-medium flex items-center gap-2",
                        isCorrect ? "bg-green-50 text-green-900" : "bg-red-50 text-red-900"
                      )}
                    >
                      {isCorrect ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Correct!</span>
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          <span>Incorrect. Correct answer: <strong>{decodeHTML(q.correct_answer)}</strong></span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Final Score */}
        {!loading && score.total === questions.length && questions.length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
            <p className="text-4xl font-bold mb-2">{score.correct} / {score.total}</p>
            <p className="text-blue-100 mb-6">You got {Math.round((score.correct / score.total) * 100)}% correct!</p>
            <button
              onClick={resetQuiz}
              className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;