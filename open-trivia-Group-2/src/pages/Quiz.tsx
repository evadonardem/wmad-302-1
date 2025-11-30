import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Question = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

type QuizQuestion = Question & {
  answers: string[];
};

const CATEGORY_IDS: Record<string, number> = {
  general: 9,
  games: 15,
  science: 17,
  sports: 21,
  history: 23,
  geography: 22,
};

function shuffleArray<T>(arr: T[]): T[] {
  return arr
    .map((v) => ({ value: v, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  /** Favorite questions stored in localStorage */
  const [favorites, setFavorites] = useState<string[]>(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );

  const query = new URLSearchParams(location.search);
  const type = query.get("type") || "general";
  const difficulty = query.get("difficulty") || "easy";
  const amount = Number(query.get("amount")) || 5;

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://opentdb.com/api.php?amount=${amount}&category=${CATEGORY_IDS[type]}&difficulty=${difficulty}&type=multiple`
        );
        const data = await res.json();
        const formatted: QuizQuestion[] = data.results.map((q: Question) => ({
          ...q,
          answers: shuffleArray([q.correct_answer, ...q.incorrect_answers]),
        }));
        setQuestions(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [type, difficulty, amount]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === questions[currentIndex].correct_answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      navigate(`/result?score=${score + (questions[currentIndex].correct_answer === selectedAnswer ? 1 : 0)}&total=${questions.length}`);
    }
  };

  /** Toggle favorite question */
  const toggleFavorite = () => {
    const questionText = questions[currentIndex].question;

    let updatedFavs;
    if (favorites.includes(questionText)) {
      updatedFavs = favorites.filter((q) => q !== questionText);
    } else {
      updatedFavs = [...favorites, questionText];
    }

    setFavorites(updatedFavs);
    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
  };

  if (loading) return <p className="p-6">Loading questions...</p>;
  if (!questions.length) return <p className="p-6">No questions found.</p>;

  const current = questions[currentIndex];
  const isFavorite = favorites.includes(current.question);

  return (
    <div className="p-6 max-w-xl mx-auto">
      {/* Question header with favorite heart */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Question {currentIndex + 1} of {questions.length}
        </h2>
      </div>

      <p
        className="mb-6"
        dangerouslySetInnerHTML={{ __html: current.question }}
      />

      <ul className="grid gap-4">
        {current.answers.map((answer) => (
          <li key={answer}>
            <button
              className={`w-full p-3 border rounded hover:bg-gray-200 text-left ${
                selectedAnswer
                  ? answer === current.correct_answer
                    ? "bg-green-200"
                    : answer === selectedAnswer
                    ? "bg-red-200"
                    : ""
                  : ""
              }`}
              disabled={!!selectedAnswer}
              onClick={() => handleAnswer(answer)}
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          </li>
        ))}
      </ul>

      {selectedAnswer && (
        <button
          onClick={handleNext}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next Question"}
        </button>
      )}
    </div>
  );
};

export default Quiz;
