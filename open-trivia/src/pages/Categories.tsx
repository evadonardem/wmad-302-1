import React, { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

const cn = (...classes: (string | boolean)[]) => classes.filter(Boolean).join(' ');

interface Category {
  id: number;
  name: string;
}

interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const CATEGORIES: Category[] = [
  { id: 9, name: "General Knowledge" },
  { id: 10, name: "Books" },
  { id: 11, name: "Film" },
  { id: 12, name: "Music" },
  { id: 15, name: "Video Games" },
  { id: 17, name: "Science & Nature" },
  { id: 18, name: "Computers" },
  { id: 19, name: "Mathematics" },
  { id: 21, name: "Sports" },
  { id: 22, name: "Geography" },
  { id: 23, name: "History" },
  { id: 24, name: "Politics" },
  { id: 27, name: "Animals" },
];

const CategoriesTrivia: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const decodeHTML = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const fetchQuestions = (categoryId: number) => {
    setLoading(true);
    setError(null);
    setSelectedCategoryId(categoryId);
    setQuestions([]);
    setAnswers({});

    fetch(`https://opentdb.com/api.php?amount=50&category=${categoryId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.response_code === 0) {
          setQuestions(data.results);
        } else {
          setError("No questions found for this category.");
        }
      })
      .catch((err) => setError("Failed to fetch questions"))
      .finally(() => setLoading(false));
  };

  const handleAnswer = (qIndex: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: answer }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Category Explorer</h1>
          <p className="text-slate-600">Choose a category and start playing</p>
        </div>

        {/* Category Buttons */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => fetchQuestions(cat.id)}
              className={cn(
                "px-4 py-3 rounded-lg font-medium transition-all text-sm border",
                selectedCategoryId === cat.id
                  ? "bg-blue-500 text-white border-blue-600 shadow-md"
                  : "bg-white text-slate-900 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
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
        {questions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                {questions.length} Questions
              </h2>
            </div>

            {questions.map((q, i) => {
              const allAnswers =
                q.type === "multiple"
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
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-xs font-semibold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
                        #{i + 1}
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
                      <span className="text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                        {q.type === "multiple" ? "Multiple Choice" : "True/False"}
                      </span>
                    </div>
                    <p className="text-base font-medium text-slate-900 leading-relaxed">
                      {decodeHTML(q.question)}
                    </p>
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
                          onClick={() => handleAnswer(i, a)}
                          disabled={isAnswered}
                          className={cn(
                            "px-4 py-3 rounded-lg font-medium transition-all text-left flex items-center gap-2 border",
                            !isAnswered && "bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-900 border-slate-200",
                            showCorrect && "bg-green-50 border-green-300 text-green-900",
                            showIncorrect && "bg-red-50 border-red-300 text-red-900",
                            isAnswered && !isSelected && !isCorrectAnswer && "bg-slate-50 border-slate-200 text-slate-500 opacity-75"
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
                          <span>Incorrect. Correct: <strong>{decodeHTML(q.correct_answer)}</strong></span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesTrivia;