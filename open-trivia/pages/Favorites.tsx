import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Heart, Trash2, ArrowRight, Star, Grid } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { getFavorites, toggleFavorite } from '../services/storageService';
import { FavoriteQuestion } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteQuestion[]>([]);
  const [categoryStats, setCategoryStats] = useState<{name: string, count: number}[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const favs = getFavorites();
    setFavorites(favs);

    // Calculate Top Categories for Summary Card
    const stats: Record<string, number> = {};
    favs.forEach(f => {
      stats[f.category] = (stats[f.category] || 0) + 1;
    });

    const sortedStats = Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    setCategoryStats(sortedStats);
  };

  const handleRemove = (question: FavoriteQuestion) => {
    toggleFavorite(question);
    loadData(); // Reload to update UI
  };

  if (favorites.length === 0) {
    return (
      <div className="p-10 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="p-6 bg-secondary/10 rounded-full mb-6 animate-float">
            <Heart className="w-16 h-16 text-secondary" />
        </div>
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">Your Collection</h1>
        <p className="text-muted-foreground max-w-md mb-8">
            You haven't saved any quizzes yet. Browse categories and tap the heart icon to add them to your collection for quick access.
        </p>
        <Button onClick={() => navigate('/categories')}>Browse Categories</Button>
      </div>
    );
  }

  // Group favorites for rendering list
  const groupedFavorites = favorites.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, FavoriteQuestion[]>);

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-display font-bold text-foreground">My Favorites</h1>
            <p className="text-muted-foreground">Curated collection of your most interesting questions.</p>
         </div>
         <div className="bg-secondary/10 text-secondary px-4 py-2 rounded-full font-bold flex items-center gap-2">
            <Heart className="w-4 h-4 fill-current" /> {favorites.length} Saved
         </div>
      </div>

      {/* Summary Card: Most Favorited Categories */}
      <Card className="p-6 bg-gradient-to-br from-card to-background border-border">
         <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            Top Categories
         </h3>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categoryStats.map((stat, idx) => (
                <div key={stat.name} className="relative group">
                    <div className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${idx === 0 ? 'bg-primary/10 border-primary/20' : 'bg-card border-border hover:border-primary/30'}`}>
                        {idx === 0 && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                #1 Favorite
                            </div>
                        )}
                        <span className="text-2xl font-bold text-foreground mb-1">{stat.count}</span>
                        <span className="text-xs text-muted-foreground line-clamp-2 h-8 flex items-center justify-center">{stat.name}</span>
                    </div>
                </div>
            ))}
         </div>
      </Card>

      {/* Questions List Grouped by Category */}
      <div className="space-y-8">
        {Object.entries(groupedFavorites).map(([category, questions]) => (
            <div key={category}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 bg-border"></div>
                    <h2 className="text-xl font-display font-bold text-foreground bg-primary/5 px-4 py-1 rounded-full">{category}</h2>
                    <div className="h-px flex-1 bg-border"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>
                        {questions.map((q) => (
                            <motion.div
                                key={q.id} // Note: Using ID might be unstable if API changes, but acceptable for session context. Ideal: Hash question text.
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card className="h-full flex flex-col p-5 hover:border-primary/30 transition-colors group relative">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                            q.difficulty === 'easy' ? 'bg-green-500/10 text-green-500' :
                                            q.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                            'bg-red-500/10 text-red-500'
                                        }`}>
                                            {q.difficulty}
                                        </span>
                                        <button 
                                            onClick={() => handleRemove(q)}
                                            className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                                            title="Remove from favorites"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <h4 className="font-bold text-foreground mb-4 flex-1 line-clamp-3" dangerouslySetInnerHTML={{ __html: q.question }} />

                                    <div className="mt-auto pt-4 border-t border-border">
                                        <p className="text-xs text-muted-foreground mb-1">Answer:</p>
                                        <p className="text-sm font-medium text-primary" dangerouslySetInnerHTML={{ __html: q.correct_answer }} />
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};