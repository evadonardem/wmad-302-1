// pages/Favorites.tsx
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Star, Trash2, Share2, BookOpen } from 'lucide-react';
import { EmptyState } from '../components/ui/empty-state';
import { useFavorites } from '../contexts/FavoritesContext';
import { useNavigate } from 'react-router-dom';
import { Separator } from '../components/ui/separator';

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

const Favorites = () => {
  const favoritesContext = useFavorites();

  if (!favoritesContext) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }

  const { favorites, removeFromFavorites, clearFavorites } = favoritesContext;
  const navigate = useNavigate();

  const startFavoritesQuiz = () => {
    navigate('/quiz?source=favorites');
  };

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon={Star}
        title="No favorites yet"
        description="Start adding questions to your favorites to see them here."
        action={
          <Button onClick={() => navigate('/')}>
            <BookOpen className="w-4 h-4 mr-2" />
            Browse Questions
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Favorites</h2>
          <p className="text-muted-foreground">
            Your saved trivia questions ({favorites.length})
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={startFavoritesQuiz} className="gap-2">
            <BookOpen className="w-4 h-4" />
            Start Favorites Quiz
          </Button>
          <Button variant="outline" onClick={clearFavorites}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {favorites.map((favorite, index) => (
          <Card key={index} className="group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded">
                    {favorite.category}
                  </span>
                  <DifficultyBadge difficulty={favorite.difficulty} />
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeFromFavorites(favorite.question)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div 
                className="text-lg font-medium mb-4"
                dangerouslySetInnerHTML={{ __html: favorite.question }} 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {[...favorite.incorrect_answers, favorite.correct_answer]
                  .sort(() => Math.random() - 0.5)
                  .map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`p-3 rounded-lg border text-sm ${
                      option === favorite.correct_answer 
                        ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' 
                        : 'bg-card border-border'
                    }`}
                  >
                    <div dangerouslySetInnerHTML={{ __html: option }} />
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Practice Again
                </Button>
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </div>
            </CardContent>
            {index < favorites.length - 1 && <Separator />}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Favorites;