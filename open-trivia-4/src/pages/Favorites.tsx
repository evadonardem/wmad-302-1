// src/pages/FavoritesPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Star, List, MessageSquare, Play, Plus } from 'lucide-react';

interface FavoriteQuestion {
  id: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  category: string;
  difficulty: string;
  type: string;
}

interface FavoriteCategory {
  id: string;
  name: string;
}

// Utility to decode HTML entities
const decodeHTML = (html: string) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

export default function FavoritesPage() {
  const [favoriteQuestions, setFavoriteQuestions] = useState<FavoriteQuestion[]>([]);
  const [favoriteCategories, setFavoriteCategories] = useState<FavoriteCategory[]>([]);
  const [activeTab, setActiveTab] = useState<string>('questions');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load favorites from localStorage
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    try {
      const questionsRaw = localStorage.getItem('favoriteQuestions');
      if (questionsRaw) {
        const parsed = JSON.parse(questionsRaw);
        if (Array.isArray(parsed)) {
          setFavoriteQuestions(parsed);
        }
      }
    } catch (err) {
      console.error('Error loading favorite questions:', err);
      setFavoriteQuestions([]);
    }

    try {
      const categoriesRaw = localStorage.getItem('favoriteCategories');
      if (categoriesRaw) {
        const parsed = JSON.parse(categoriesRaw);
        if (Array.isArray(parsed)) {
          setFavoriteCategories(parsed);
        }
      }
    } catch (err) {
      console.error('Error loading favorite categories:', err);
      setFavoriteCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const persistQuestions = (questions: FavoriteQuestion[]) => {
    try {
      localStorage.setItem('favoriteQuestions', JSON.stringify(questions));
    } catch (err) {
      console.error('Error saving favorite questions:', err);
    }
  };

  const persistCategories = (categories: FavoriteCategory[]) => {
    try {
      localStorage.setItem('favoriteCategories', JSON.stringify(categories));
    } catch (err) {
      console.error('Error saving favorite categories:', err);
    }
  };

  const removeFavoriteQuestion = (id: string) => {
    const next = favoriteQuestions.filter(f => f.id !== id);
    setFavoriteQuestions(next);
    persistQuestions(next);
  };

  const removeFavoriteCategory = (id: string) => {
    const next = favoriteCategories.filter(f => f.id !== id);
    setFavoriteCategories(next);
    persistCategories(next);
  };

  const startQuizWithCategory = (categoryId: string) => {
    localStorage.setItem('selectedCategory', JSON.stringify(categoryId));
    // Clear any previous quiz state
    localStorage.removeItem('selectedCategoryColor');
    navigate('/quiz');
  };

  const startCustomQuiz = (questions: FavoriteQuestion[]) => {
    // Save the favorite questions for a custom quiz
    localStorage.setItem('customQuizQuestions', JSON.stringify(questions));
    localStorage.setItem('selectedCategory', JSON.stringify('custom'));
    navigate('/quiz');
  };

  const clearAllFavorites = () => {
    if (activeTab === 'questions') {
      setFavoriteQuestions([]);
      persistQuestions([]);
    } else {
      setFavoriteCategories([]);
      persistCategories([]);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuestionType = (type: string) => {
    switch (type) {
      case 'multiple': return 'Multiple Choice';
      case 'boolean': return 'True/False';
      default: return 'Multiple Choice';
    }
  };

  const navigateToCategories = () => {
    navigate('/categories');
  };

  const navigateToQuiz = () => {
    navigate('/quiz');
  };

  const totalFavorites = favoriteQuestions.length + favoriteCategories.length;

  // Loading state
  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl">Favorites</CardTitle>
            <CardDescription className="text-base md:text-lg">
              Loading your favorites...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your saved items...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (totalFavorites === 0) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl">Favorites</CardTitle>
            <CardDescription className="text-base md:text-lg">
              Your saved questions and categories will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
              <p className="text-muted-foreground mb-6">
                Start adding questions and categories to your favorites!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={navigateToCategories} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Browse Categories
                </Button>
                <Button onClick={navigateToQuiz} variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  Start a Quiz
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl">Favorites</CardTitle>
          <CardDescription className="text-base md:text-lg">
            {totalFavorites} saved item{totalFavorites !== 1 ? 's' : ''} - Manage your favorite questions and categories
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <Button 
              onClick={navigateToCategories} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add More Categories
            </Button>
            <Button variant="outline" onClick={clearAllFavorites}>
              Clear All {activeTab === 'questions' ? 'Questions' : 'Categories'}
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="questions" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Questions ({favoriteQuestions.length})
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <List className="w-4 h-4" />
                Categories ({favoriteCategories.length})
              </TabsTrigger>
            </TabsList>

            {/* Questions Tab */}
            <TabsContent value="questions" className="space-y-4">
              {favoriteQuestions.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-2">No favorite questions</h3>
                    <p className="text-muted-foreground">
                      Add questions to favorites while taking quizzes!
                    </p>
                    <Button onClick={navigateToQuiz} className="mt-4">
                      <Play className="w-4 h-4 mr-2" />
                      Start a Quiz to Add Questions
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Favorite Questions</h3>
                    <Button 
                      onClick={() => startCustomQuiz(favoriteQuestions)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Quiz with These Questions
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {favoriteQuestions.map(q => (
                      <Card key={q.id} className="hover:shadow-md transition-all duration-200 hover:scale-105 h-72 flex flex-col p-6">
                        <div className="mb-3 flex-shrink-0">
                          <h3 className="font-semibold text-base line-clamp-3 mb-2">{decodeHTML(q.question)}</h3>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3 flex-shrink-0">
                          <Badge variant="secondary" className="text-xs">{decodeHTML(q.category)}</Badge>
                          <Badge className={`text-xs ${getDifficultyColor(q.difficulty)}`}>
                            {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {getQuestionType(q.type)}
                          </Badge>
                        </div>
                        <div className="mb-4 flex-grow overflow-hidden">
                          <p className="text-xs font-medium text-gray-700 mb-1">Correct Answer:</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{decodeHTML(q.correct_answer)}</p>
                        </div>
                        <div className="mt-auto flex-shrink-0">
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => removeFavoriteQuestion(q.id)} 
                            className="w-full"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Remove
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-4">
              {favoriteCategories.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <List className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-2">No favorite categories</h3>
                    <p className="text-muted-foreground">Add categories to favorites from the Categories page!</p>
                    <Button onClick={navigateToCategories} className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Browse Categories
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Favorite Categories</h3>
                    <Button 
                      onClick={navigateToCategories}
                      variant="outline"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add More Categories
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {favoriteCategories.map(category => (
                      <Card key={category.id} className="hover:shadow-md transition-all duration-200 hover:scale-105 h-56 flex flex-col p-6">
                        <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          <h3 className="font-semibold text-lg line-clamp-1">{category.name}</h3>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">Favorite</Badge>
                          <Badge variant="outline" className="text-xs">ID: {category.id}</Badge>
                        </div>
                        <div className="flex gap-2 mt-auto flex-shrink-0">
                          <Button 
                            onClick={() => startQuizWithCategory(category.id)} 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 flex-1"
                          >
                            <Play className="w-4 h-4 mr-2" /> Use
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => removeFavoriteCategory(category.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}