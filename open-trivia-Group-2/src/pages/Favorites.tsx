import React, { useState, useEffect } from 'react';
import "./global.css";

type Question = {
  question: string;
  category?: string;
  correct_answer?: string;
  incorrect_answers?: string[];
  difficulty?: string;
  type?: string;
};

const Favorites = () => {
  const [favoriteQuestions, setFavoriteQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from localStorage on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem('favorites');
    console.log('Saved favorites from localStorage:', savedFavorites);
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        console.log('Parsed favorites:', parsed);
        setFavoriteQuestions(Array.isArray(parsed) ? parsed : []);
      } catch (err) {
        console.error('Error parsing favorites:', err);
        setFavoriteQuestions([]);
      }
    }
    setLoading(false);
  };

  const removeFavorite = (questionText: string) => {
    const updated = favoriteQuestions.filter(q => q.question !== questionText);
    setFavoriteQuestions(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const decodeHTML = (html: string) => {
    if (!html) return "No text";
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  if (loading) {
    return (
      <div className="favorites-container">
        <p>Loading favorites...</p>
      </div>
    );
  }

  if (favoriteQuestions.length === 0) {
    return (
      <div className="favorites-container">
        <h1>⭐ Favorite Questions</h1>
        <p className="mt-6">No favorites saved yet. Star questions during quizzes to save them here!</p>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h1>⭐ Favorite Questions</h1>
      <p className="mb-6">({favoriteQuestions.length} saved)</p>

      <ul className="favorites-list">
        {favoriteQuestions.map((q, idx) => (
          <li key={idx} className="favorite-item">
            <div className="favorite-card">
              <div className="favorite-question">
                {decodeHTML(q.question)}
              </div>

              <div className="favorite-meta">
                {q.category && (
                  <span className="favorite-category">
                    📂 {q.category}
                  </span>
                )}
                {q.difficulty && (
                  <span className="favorite-difficulty">
                    📊 {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                  </span>
                )}
                {q.type && (
                  <span className="favorite-type">
                    ❓ {q.type === 'multiple' ? 'Multiple Choice' : 'True/False'}
                  </span>
                )}
              </div>

              {q.correct_answer && (
                <div className="favorite-answer">
                  ✓ Answer: {decodeHTML(q.correct_answer)}
                </div>
              )}

              <div className="favorite-actions">
                <button
                  onClick={() => removeFavorite(q.question)}
                  className="btn-danger"
                >
                  ✕ Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;
