import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchQuestions } from '../services/triviaService';
import { saveGameResult, toggleFavorite, isQuestionFavorite } from '../services/storageService';
import { FormattedQuestion } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Home, Heart } from 'lucide-react';

export const Quiz: React.FC = () => {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get config from URL
  const difficulty = searchParams.get('difficulty') || 'any';
  const type = searchParams.get('type') || 'any';
  const amount = parseInt(searchParams.get('amount') || '10');

  const [questions, setQuestions] = useState<FormattedQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'finished'>('playing');
  const [hasSaved, setHasSaved] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Trigger for re-fetching questions on retry
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      // Reset game state
      setGameStatus('playing');
      setCurrentIdx(0);
      setScore(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setHasSaved(false);

      const data = await fetchQuestions(amount, Number(categoryId), difficulty, type);
      setQuestions(data);
      setLoading(false);
    };
    loadQuiz();
  }, [categoryId, difficulty, type, amount, retryCount]);

  // Check if current question is favorited whenever question changes
  useEffect(() => {
    if (questions.length > 0 && questions[currentIdx]) {
      setIsFavorite(isQuestionFavorite(questions[currentIdx].question));
    }
  }, [currentIdx, questions]);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    if (answer === questions[currentIdx].correct_answer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    setGameStatus('finished');
  };

  const handleToggleFavorite = () => {
    const currentQ = questions[currentIdx];
    const newStatus = toggleFavorite(currentQ);
    setIsFavorite(newStatus);
  };

  // Save result when game finishes
  useEffect(() => {
    if (gameStatus === 'finished' && !hasSaved && questions.length > 0) {
      saveGameResult({
        category: questions[0].category,
        score: score,
        totalQuestions: questions.length,
        difficulty: difficulty
      });
      setHasSaved(true);
    }
  }, [gameStatus, hasSaved, questions, score, difficulty]);

  const retryQuiz = () => {
     setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse">Preparing your challenge...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl text-foreground mb-2 font-bold">No questions found.</h2>
        <p className="text-muted-foreground mb-6 max-w-md">We couldn't find enough questions with these settings. Try changing the difficulty or type.</p>
        <Button onClick={() => navigate('/categories')}>Change Settings</Button>
        <Button onClick={retryQuiz}>Retry</Button>
      </div>
    );
  }

  // -- RESULTS VIEW --
  if (gameStatus === 'finished') {
    const percentage = Math.round((score / questions.length) * 100);
    let message = "Good effort!";
    if (percentage > 80) message = "Trivia Master!";
    else if (percentage < 50) message = "Keep practicing!";

    return (
      <div className="flex items-center justify-center min-h-[80vh] p-4">
        <Card className="max-w-md w-full text-center p-10">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 mx-auto flex items-center justify-center mb-6 shadow-lg shadow-orange-500/50"
          >
            <span className="text-4xl font-bold text-white">{percentage}%</span>
          </motion.div>
          <h2 className="text-3xl font-display font-bold text-foreground mb-2">{message}</h2>
          <p className="text-muted-foreground mb-8">You scored {score} out of {questions.length}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <Button variant="secondary" onClick={() => navigate('/categories')}>
              <Home className="w-4 h-4 mr-2" /> Home
            </Button>
            <Button onClick={retryQuiz}>
              <RotateCcw className="w-4 h-4 mr-2" /> Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // -- GAME VIEW --
  const currentQuestion = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6 lg:p-10 min-h-[80vh] flex flex-col justify-center">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium bg-card border border-border px-3 py-1 rounded-full">
            <span>Question {currentIdx + 1}/{questions.length}</span>
        </div>
        <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded border ${
                currentQuestion.difficulty === 'easy' ? 'border-green-500 text-green-500' :
                currentQuestion.difficulty === 'medium' ? 'border-yellow-500 text-yellow-500' :
                'border-red-500 text-red-500'
            } uppercase`}>
                {currentQuestion.difficulty}
            </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-8">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary to-secondary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8 mb-6 border-t-4 border-t-primary relative">
            <div className="flex justify-between items-start mb-8 gap-4">
               <div>
                  <span className="text-primary text-sm font-bold uppercase tracking-wider mb-2 block">{currentQuestion.category}</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-relaxed" 
                      dangerouslySetInnerHTML={{ __html: currentQuestion.question }} 
                  />
               </div>
               {/* Heart Toggle */}
               <button 
                  onClick={handleToggleFavorite}
                  className="p-3 rounded-full hover:bg-muted transition-colors focus:outline-none group"
                  title="Save to Favorites"
               >
                  <Heart className={`w-6 h-6 transition-all duration-300 ${
                    isFavorite 
                      ? 'fill-secondary text-secondary scale-110' 
                      : 'text-muted-foreground group-hover:text-secondary'
                  }`} />
               </button>
            </div>

            <div className="space-y-3">
              {currentQuestion.answers.map((answer, idx) => {
                const isSelected = selectedAnswer === answer;
                const isCorrect = answer === currentQuestion.correct_answer;
                
                let buttonStyle = "w-full text-left p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden group ";
                
                if (isAnswered) {
                  if (isCorrect) buttonStyle += "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400";
                  else if (isSelected && !isCorrect) buttonStyle += "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400";
                  else buttonStyle += "border-border opacity-50";
                } else {
                  buttonStyle += "border-border bg-card hover:border-primary/50 hover:bg-muted text-foreground";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(answer)}
                    disabled={isAnswered}
                    className={buttonStyle}
                  >
                    <div className="flex items-center justify-between z-10 relative">
                       <div className="flex items-center gap-3">
                            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                isAnswered && (isCorrect || isSelected) ? 'bg-transparent' : 'bg-muted group-hover:bg-primary group-hover:text-white'
                            }`}>
                                {String.fromCharCode(65 + idx)}
                            </span>
                            <span dangerouslySetInnerHTML={{ __html: answer }} className="font-medium" />
                       </div>
                       {isAnswered && isCorrect && <CheckCircle2 className="text-green-500 w-5 h-5" />}
                       {isAnswered && isSelected && !isCorrect && <XCircle className="text-red-500 w-5 h-5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end h-16">
        {isAnswered && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Button size="lg" onClick={nextQuestion} className="gap-2">
              {currentIdx === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};