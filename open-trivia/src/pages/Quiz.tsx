import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/context/QuizContext";

export default function Quiz() {
  const navigate = useNavigate();
  const {
    questions,
    status,
    error,
    fetchQuestions,
    currentIndex,
    score,
    submitAnswer,
    nextQuestion,
    resetGame,
    toggleFavorite,
    favorites,
  } = useQuiz();

  const [chosen, setChosen] = useState<string | null>(null);

  // 1. Loading State
  if (status === "loading") {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // 2. Error State
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-red-500 font-medium">{error}</p>
        <div className="flex gap-2">
          <Button onClick={fetchQuestions}>Try Again</Button>
          <Button variant="outline" onClick={() => navigate('/preferences')}>Change Settings</Button>
        </div>
      </div>
    );
  }

  // 3. Start Screen (Idle)
  if (status === "idle" || questions.length === 0) {
    return (
      <Card className="max-w-md mx-auto mt-10 text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Ready to Quiz?</CardTitle>
          <CardDescription>Press start to load questions based on your preferences.</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center gap-2">
          <Button size="lg" onClick={fetchQuestions}>Start Quiz</Button>
          <Button variant="outline" onClick={() => navigate('/preferences')}>Settings</Button>
        </CardFooter>
      </Card>
    );
  }

  // 4. Finished State
  if (status === "finished") {
    return (
      <Card className="max-w-md mx-auto mt-10 text-center">
        <CardHeader><CardTitle>Quiz Complete!</CardTitle></CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary mb-2">{score} / {questions.length}</p>
          <p className="text-muted-foreground">Great job!</p>
        </CardContent>
        <CardFooter className="justify-center gap-2">
          <Button onClick={() => { resetGame(); fetchQuestions(); }}>Play Again</Button>
          <Button variant="outline" onClick={() => { resetGame(); navigate('/'); }}>Home</Button>
        </CardFooter>
      </Card>
    );
  }

  // 5. Game Interface
  const currentQ = questions[currentIndex];
  // Use id-based comparison (more robust)
  const isFav = favorites.some((f) => f.id === currentQ.id);

  const handleOptionClick = (ans: string) => {
    setChosen(ans);
    submitAnswer(ans);
  };

  const handleNext = () => {
    setChosen(null);
    nextQuestion();
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="text-sm font-bold text-primary">Score: {score}</span>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <CardTitle className="text-lg leading-relaxed">{currentQ.question}</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => toggleFavorite(currentQ)}>
            <Star className={`h-5 w-5 ${isFav ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3">
          {currentQ.all_answers.map((ans, i) => {
            let variant = "outline";
            if (chosen) {
              if (ans === currentQ.correct_answer) variant = "default";
              else if (ans === chosen) variant = "destructive";
            }
            return (
              <Button
                key={i}
                variant={variant as any}
                className={`justify-start h-auto py-3 whitespace-normal text-left ${chosen && ans === currentQ.correct_answer ? 'bg-green-600 hover:bg-green-600 text-white' : ''}`}
                disabled={!!chosen}
                onClick={() => handleOptionClick(ans)}
              >
                {ans}
              </Button>
            );
          })}
        </CardContent>
        <CardFooter>
          {chosen && (
            <Button className="w-full" onClick={handleNext}>
              {currentIndex + 1 === questions.length ? "Finish" : "Next Question"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
