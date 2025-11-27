import React, { useEffect, useState } from "react";
import { Star, Trash2 } from "lucide-react";

interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
}

const cn = (...classes: (string | boolean)[]) => classes.filter(Boolean).join(' ');

const Favorites = () => {
  const [favorites, setFavorites] = useState<Question[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteQuestions");
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
  }, []);

  const removeFavorite = (q: Question) => {
    const updated = favorites.filter((fav) => fav.question !== q.question);
    setFavorites(updated);
    localStorage.setItem("favoriteQuestions", JSON.stringify(updated));
  };

  const decodeHTML = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Your Favorites</h1>
            <p className="text-slate-600 text-sm mt-1">Saved questions for later review</p>
          </div>
        </div>

        {/* Empty State */}
        {favorites.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">No favorites yet</p>
            <p className="text-slate-500 text-sm mt-1">Mark questions as favorites to save them here</p>
          </div>
        )}

        {/* Favorites List */}
        {favorites.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm text-slate-600 font-medium mb-4">
              {favorites.length} {favorites.length === 1 ? "question" : "questions"} saved
            </div>

            {favorites.map((q, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Tags */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
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
                  <span className="text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                    {q.type === "multiple" ? "Multiple Choice" : "True/False"}
                  </span>
                </div>

                {/* Question */}
                <p className="text-base font-medium text-slate-900 mb-4 leading-relaxed">
                  {decodeHTML(q.question)}
                </p>

                {/* Answer */}
                <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
                  <p className="text-xs font-semibold text-green-700 mb-1 uppercase tracking-wide">
                    Correct Answer
                  </p>
                  <p className="text-green-900 font-medium">
                    {decodeHTML(q.correct_answer)}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFavorite(q)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;