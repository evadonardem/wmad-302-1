import React, { useEffect, useState } from "react";
import axios from "axios";

interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const Trivia = ({ preferences }: { preferences: any }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [favorites, setFavorites] = useState<Question[]>([]);

  useEffect(() => {
    const storedFavs = localStorage.getItem("favoriteQuestions");
    if (storedFavs) setFavorites(JSON.parse(storedFavs));
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        let url = `https://opentdb.com/api.php?amount=50`;
        if (preferences.category) url += `&category=${preferences.category}`;
        if (preferences.difficulty) url += `&difficulty=${preferences.difficulty}`;
        if (preferences.type) url += `&type=${preferences.type}`;
        const res = await axios.get(url);
        setQuestions(res.data.results);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
  }, [preferences]);

  const toggleFavorite = (q: Question) => {
    let updatedFavorites;
    if (favorites.some((fav) => fav.question === q.question)) {
      updatedFavorites = favorites.filter((fav) => fav.question !== q.question);
    } else {
      updatedFavorites = [...favorites, q];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteQuestions", JSON.stringify(updatedFavorites));
  };

  return (
    <div>
      <h1>Trivia</h1>
      {questions.map((q, index) => (
        <div key={index} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <p><strong>Question:</strong> {q.question}</p>
          <p><strong>Category:</strong> {q.category}</p>
          <p><strong>Difficulty:</strong> {q.difficulty}</p>
          <button onClick={() => toggleFavorite(q)}>
            {favorites.some((fav) => fav.question === q.question) ? "Remove Favorite" : "Add Favorite"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Trivia;