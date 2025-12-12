// pages/Quiz.tsx
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Check, X, Star, BookOpen } from 'lucide-react';
import { useFavorites, type TriviaQuestion } from '../contexts/FavoritesContext';
import axios from 'axios';
import { Spinner } from '../components/ui/spinner';

const Quiz = () => {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quizFinished, setQuizFinished] = useState(false);
  
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const favoritesContext = useFavorites();
  const { addToFavorites, removeFromFavorites, isFavorite } = favoritesContext || {};

  const source = searchParams.get('source');

  useEffect(() => {
    fetchQuizQuestions();
  }, [category, source]);

  const fetchQuizQuestions = async () => {
    try {
      setIsLoading(true);
      let endpoint = 'https://opentdb.com/api.php?amount=10&type=multiple';
      
      if (category && category !== 'undefined') {
        // In a real app, you'd map category names to IDs
        endpoint += `&category=9`; // Using General Knowledge as default
      }

      if (source === 'favorites') {
        // For favorites quiz, we'd use the favorites context
        // This is a simplified version
        endpoint += `&difficulty=medium`;
      }

      const result = await axios.get(endpoint);
      
      if (result.status === 200) {
        const { data } = result;
        setQuestions(data.results || []);
      }
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer === currentQuestion.correct_answer) {
      setScore(score + 1);
    }

    if (isLastQuestion) {
      setQuizFinished(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const toggleFavorite = () => {
    if (isFavorite && isFavorite(currentQuestion.question)) {
      removeFromFavorites?.(currentQuestion.question);
    } else {
      addToFavorites?.(currentQuestion);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setQuizFinished(false);
    fetchQuizQuestions();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Spinner className="w-8 h-8 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to {category || 'Dashboard'}
        </Button>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
            <CardDescription>
              {category ? `Category: ${category}` : 'Random Quiz'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-6xl font-bold text-primary">
              {score}/{questions.length}
            </div>
            <div className="text-lg text-muted-foreground">
              {score === questions.length ? 'Perfect score! 🎉' : 
               score >= questions.length * 0.7 ? 'Great job! 👍' : 
               'Keep practicing! 💪'}
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={restartQuiz} className="gap-2">
                <BookOpen className="w-4 h-4" />
                Try Again
              </Button>
              <Button variant="outline" onClick={() => navigate('/categories')}>
                Choose Another Category
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No questions available.</p>
        <Button onClick={() => navigate('/categories')} className="mt-4">
          Choose a Category
        </Button>
      </div>
    );
  }

  const options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];

  var a = 1;

  if(a === 1){
    options.sort(() => Math.random() - 0.5);
    a++;
  }
    
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="text-sm font-medium">
            Score: {score}
          </div>
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={toggleFavorite}
          >
            <Star 
              className={`w-4 h-4 ${isFavorite?.(currentQuestion.question) ? 'fill-yellow-400 text-yellow-400' : ''}`} 
            />
          </Button> */}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded">
              {currentQuestion.category}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
              currentQuestion.difficulty === 'easy' 
                ? 'bg-green-100 text-green-800 border-green-200'
                : currentQuestion.difficulty === 'medium'
                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                : 'bg-red-100 text-red-800 border-red-200'
            }`}>
              {currentQuestion.difficulty}
            </span>
          </div>
          <CardTitle className="text-xl">
            <div dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {options.map((option, index) => {
              const isCorrect = option === currentQuestion.correct_answer;
              const isSelected = selectedAnswer === option;
              const showCorrect = showResult && isCorrect;
              const showIncorrect = showResult && isSelected && !isCorrect;

              return (
                <Button
                  key={index}
                  variant={isSelected ? "default" : "outline"}
                  className={`h-auto py-4 px-4 text-left justify-start whitespace-normal ${
                    showCorrect ? 'bg-green-500 text-white hover:bg-green-600' :
                    showIncorrect ? 'bg-red-500 text-white hover:bg-red-600' :
                    isSelected ? 'bg-primary text-primary-foreground' : ''
                  }`}
                  onClick={() => !showResult && handleAnswerSelect(option)}
                  disabled={showResult}
                >
                  <div className="flex items-center gap-3">
                    {showCorrect && <Check className="w-4 h-4 shrink-0" />}
                    {showIncorrect && <X className="w-4 h-4 shrink-0" />}
                    <span dangerouslySetInnerHTML={{ __html: option }} />
                  </div>
                </Button>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-4">
            {!showResult ? (
              <Button 
                onClick={() => setShowResult(true)}
                disabled={!selectedAnswer}
              >
                Check Answer
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                {selectedAnswer === currentQuestion.correct_answer ? (
                  <div className="text-green-600 font-medium">Correct! 🎉</div>
                ) : (
                  <div className="text-red-600 font-medium">
                    Incorrect. The correct answer is:{" "}
                    <span dangerouslySetInnerHTML={{ __html: currentQuestion.correct_answer }} />
                  </div>
                )}
                <Button onClick={handleNext}>
                  {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz;