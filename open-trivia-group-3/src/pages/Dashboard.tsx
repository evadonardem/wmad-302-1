// pages/Dashboard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Star, Share2, BookOpen } from 'lucide-react';
import { Spinner } from '../components/ui/spinner';
import { useFavorites, type TriviaQuestion } from '../contexts/FavoritesContext';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  triviaQuestions: TriviaQuestion[];
  isLoading: boolean;
}

const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(difficulty)}`}>
      {difficulty}
    </span>
  );
};

const Dashboard = ({ triviaQuestions, isLoading }: DashboardProps) => {
  const favoritesContext = useFavorites();
  if (!favoritesContext) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = favoritesContext;
  const navigate = useNavigate();

  const toggleFavorite = (question: TriviaQuestion) => {
    if (isFavorite(question.question)) {
      removeFromFavorites(question.question);
    } else {
      addToFavorites(question);
    }
  };

  const startRandomQuiz = () => {
    navigate('/quiz');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Spinner className="w-8 h-8 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading trivia questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-linear-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {10 /* {triviaQuestions.length} */}
            </CardTitle>
            <CardDescription>Total Questions</CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="bg-linear-to-br from-green-50 to-emerald-100 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
              { 12 /* {new Set(triviaQuestions.map(q => q.category)).size} */}
            </CardTitle>
            <CardDescription>Categories</CardDescription>
          </CardHeader>
        </Card>
        
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Random Trivia Facts</h2>
          <br />
          <p>Fun Trivia Facts to Review</p>
        </div>
        <Button onClick={startRandomQuiz} className="gap-2">
          <BookOpen className="w-4 h-4" />
          Start Random Quiz
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {triviaQuestions.slice(0, 32).map((item, index) => {
              const { question, category, difficulty, correct_answer} = item;
              const options = [correct_answer];
              const favorite = isFavorite(question);

              return (
                <div key={index} className="group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <DifficultyBadge difficulty={difficulty} />
                      <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded">
                        {category}
                      </span>
                    </div>
                    {/* <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(item)}
                      className={`transition-all ${favorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    >
                      <Star 
                        className={`w-4 h-4 transition-all ${favorite ? 'fill-yellow-400 text-yellow-400 scale-110' : ''}`} 
                      />
                    </Button> */}
                  </div>
                  
                  <div 
                    className="text-lg font-medium mb-4 text-foreground"
                    dangerouslySetInnerHTML={{ __html: question }} 
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-2 mb-4">
                    {options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-lg border text-sm ${
                          option ===  correct_answer 
                            ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' 
                            : 'bg-card border-border'
                        }`}
                      >
                        <div dangerouslySetInnerHTML={{ __html: option }} />
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                  
                  {index < triviaQuestions.length - 1 && <Separator className="mt-4" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;