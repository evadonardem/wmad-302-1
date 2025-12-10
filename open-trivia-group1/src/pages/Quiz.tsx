import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Loader2, 
  Star, 
  BarChart3, 
  Home, 
  Timer, 
  Flame, 
  Trophy, 
  Brain, 
  Play, 
  Settings, 
  Zap, 
  Clock, 
  Infinity as InfinityIcon 
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/context/QuizContext";

export default function Quiz() {
  const navigate = useNavigate();
  const {
    config,
    questions,
    status,
    error,
    fetchQuestions,
    currentIndex,
    score,
    timer,
    streak,
    submitAnswer,
    nextQuestion,
    resetGame,
    toggleFavorite,
    favorites,
  } = useQuiz();

  const [chosen, setChosen] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  // Helper to format time (seconds -> MM:SS)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 1. Loading State
  if (status === "loading") {
    return (
      <div className="flex h-[50vh] items-center justify-center flex-col gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Preparing your quiz...</p>
      </div>
    );
  }

  // 2. Error State
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-red-500 font-medium">{error}</p>
        <div className="flex gap-2">
          <Button onClick={() => fetchQuestions()}>Try Again</Button>
          <Button variant="outline" onClick={() => navigate('/preferences')}>Change Settings</Button>
        </div>
      </div>
    );
  }

  // 3. Start Screen (Idle)
  if (status === "idle" || questions.length === 0) {
    // Determine which icon to show based on selected mode
    let ModeIcon = Zap;
    if (config.mode === 'time_attack') ModeIcon = Clock;
    if (config.mode === 'endless') ModeIcon = InfinityIcon;

    return (
      <Card className="max-w-md mx-auto mt-10 text-center shadow-xl border-t-4 border-t-primary animate-in zoom-in-95 duration-500">
        <CardHeader className="flex flex-col items-center pb-2">
          {/* Bouncing Hero Icon */}
          <div className="p-4 bg-primary/10 rounded-full mb-4 animate-[bounce_3s_infinite]">
            <Brain className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">Ready to Quiz?</CardTitle>
          <CardDescription className="flex items-center gap-2 justify-center text-lg mt-2 bg-muted/50 py-1 px-3 rounded-full">
            <ModeIcon className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground capitalize">{config.mode.replace("_", " ")} Mode</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
           <p>Test your knowledge, beat your high score, and challenge yourself!</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button 
            size="lg" 
            className="w-full gap-2 text-lg shadow-lg hover:scale-105 transition-transform" 
            onClick={() => fetchQuestions()}
          >
            <Play className="w-5 h-5 fill-current" /> Start Quiz
          </Button>
          <Button 
            variant="ghost" 
            className="w-full gap-2 hover:bg-muted" 
            onClick={() => navigate('/preferences')}
          >
            <Settings className="w-4 h-4" /> Quiz Settings
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // 4. Finished State
  if (status === "finished") {
    return (
      <Card className="max-w-md mx-auto mt-10 text-center shadow-lg border-primary/20 animate-in zoom-in-95 duration-500">
        <CardHeader>
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
          <CardDescription>
            {config.mode === 'time_attack' ? "Time's up!" : "All questions answered."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-6 flex flex-col items-center gap-2">
            <div className="p-4 bg-yellow-100 rounded-full mb-2 animate-bounce">
               <Trophy className="h-10 w-10 text-yellow-600" />
            </div>
            <p className="text-5xl font-bold text-primary tracking-tighter">{score}</p>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Total Score</p>
            
            {config.mode !== 'endless' && (
              <div className="mt-4 p-2 bg-secondary/50 rounded-lg text-sm font-medium">
                 Accuracy: {Math.round((score / questions.length) * 100)}%
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full gap-2" onClick={() => { resetGame(); fetchQuestions(); }}>
            <Play className="w-4 h-4" /> Play Again
          </Button>
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button variant="outline" className="gap-2" onClick={() => { resetGame(); navigate('/'); }}>
              <Home className="w-4 h-4" /> Home
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => { resetGame(); navigate('/'); }}>
              <BarChart3 className="w-4 h-4" /> Stats
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }

  // 5. Game Interface
  const currentQ = questions[currentIndex];
  // Guard clause for endless mode lagging behind
  if (!currentQ) return <div className="p-4 text-center">Loading next questions...</div>;

  const isFav = favorites.some((f) => f.id === currentQ.id);

  const handleOptionClick = (ans: string) => {
    setChosen(ans);
    submitAnswer(ans);
    
    // Real-time feedback logic
    if (ans === currentQ.correct_answer) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
  };

  const handleNext = () => {
    setChosen(null);
    setFeedback(null);
    nextQuestion();
  };

  // Timer Color Logic
  let timerColor = "text-foreground";
  if (config.mode === "time_attack" && timer <= 10) timerColor = "text-red-600 animate-pulse font-black";

  return (
    <div className="max-w-xl mx-auto p-4 animate-in fade-in duration-500">
      
      {/* Header Stats */}
      <div className="flex justify-between items-center mb-4 bg-card p-3 rounded-xl shadow-sm border">
        {/* Timer */}
        <div className={`flex items-center gap-2 font-mono text-lg transition-colors duration-300 ${timerColor}`}>
          <Timer className="w-5 h-5" />
          {formatTime(timer)}
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1.5" title="Current Streak">
           <Flame 
             className={`w-5 h-5 transition-all duration-500 ${streak > 2 ? 'text-orange-500 fill-orange-500 scale-125 animate-pulse' : 'text-slate-300'}`} 
           />
           <span className={`font-bold transition-colors ${streak > 2 ? 'text-orange-500' : 'text-muted-foreground'}`}>
             {streak}
           </span>
        </div>

        {/* Score/Progress */}
        <div className="text-right">
           <div className="text-sm font-bold text-primary">Score: {score}</div>
           <div className="text-xs text-muted-foreground">
             {config.mode === 'endless' ? `Q: ${currentIndex + 1}` : `${currentIndex + 1} / ${questions.length}`}
           </div>
        </div>
      </div>

      {/* Question Card */}
      <Card className="shadow-lg transition-all duration-300 border-t-4 border-t-primary">
        <CardHeader className="flex flex-row items-start justify-between pb-4">
          <CardTitle className="text-xl leading-relaxed mr-2 font-bold text-foreground/90">
            {currentQ.question}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => toggleFavorite(currentQ)} 
            className="shrink-0 hover:bg-yellow-50"
            title={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <Star className={`h-6 w-6 transition-all duration-300 ${isFav ? "fill-yellow-400 text-yellow-400 scale-110" : "text-gray-300"}`} />
          </Button>
        </CardHeader>
        
        <CardContent className="grid gap-3 pt-0">
          {currentQ.all_answers.map((ans, i) => {
            let variant = "outline";
            let extraClasses = "hover:border-primary hover:bg-accent";
            
            if (chosen) {
              if (ans === currentQ.correct_answer) {
                variant = "default"; 
                extraClasses = "bg-green-600 hover:bg-green-700 text-white border-green-600 ring-2 ring-green-100 dark:ring-green-900";
              } else if (ans === chosen) {
                variant = "destructive";
                extraClasses = "bg-red-500 hover:bg-red-600 border-red-500";
              } else {
                extraClasses = "opacity-50 grayscale cursor-not-allowed"; 
              }
            }

            return (
              <Button
                key={i}
                variant={variant as any}
                className={`justify-start h-auto py-4 px-4 whitespace-normal text-left text-base transition-all duration-200 ${extraClasses}`}
                disabled={!!chosen}
                onClick={() => handleOptionClick(ans)}
              >
                <div className="flex gap-3">
                  <span className="opacity-50 font-mono text-xs mt-1">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{ans}</span>
                </div>
              </Button>
            );
          })}
        </CardContent>

        {/* Footer with Feedback and Next Button */}
        <CardFooter className="pt-2 flex-col gap-3 min-h-[5.5rem] justify-end">
          {chosen ? (
            <div className="w-full space-y-3 animate-in slide-in-from-bottom-2 fade-in duration-300">
              
              {/* Real-time Feedback Banner */}
              <div className={`w-full p-3 rounded-md text-center text-sm font-bold flex items-center justify-center gap-2 shadow-sm ${feedback === 'correct' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                {feedback === 'correct' ? (
                  <>🎉 Correct! Streak +1</>
                ) : (
                  <>❌ Wrong! The answer was: {currentQ.correct_answer}</>
                )}
              </div>

              <Button className="w-full font-semibold shadow-md" size="lg" onClick={handleNext}>
                 {config.mode !== 'endless' && currentIndex + 1 === questions.length ? "Finish Quiz & See Results" : "Next Question"}
              </Button>
            </div>
          ) : (
             <div className="h-2"></div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}