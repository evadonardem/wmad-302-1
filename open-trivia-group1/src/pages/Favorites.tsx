import { useState } from "react";
import { 
  Star, 
  Trash2, 
  BookOpen, 
  Eye, 
  EyeOff, 
  Layers, 
  Trophy, 
  AlertCircle 
} from "lucide-react";
import { useQuiz } from "../context/QuizContext";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Favorites() {
  const { favorites, removeFavorite } = useQuiz();
  
  // Local state to manage which answers are currently revealed
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const handleDeleteFavorite = (id: string) => {
    removeFavorite(id);
  };

  const toggleAnswer = (id: string) => {
    setRevealed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Star className="h-8 w-8 text-yellow-500 fill-yellow-500 animate-[pulse_3s_ease-in-out_infinite]" /> 
            Your Favorites
          </h2>
          <p className="text-muted-foreground mt-1 text-lg">
            Review and practice your saved questions.
          </p>
        </div>
        {favorites.length > 0 && (
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            {favorites.length} Saved
          </div>
        )}
      </div>
      
      <Separator />

      {/* Empty State */}
      {favorites.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-muted/30 animate-in zoom-in-95 duration-500">
          <div className="bg-background p-4 rounded-full shadow-sm mb-4">
            <Star className="h-12 w-12 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold text-primary">No favorites yet</h3>
          <p className="text-muted-foreground max-w-sm mt-2">
            While taking a quiz, click the Star icon to save questions here for later review!
          </p>
        </div>
      )}

      {/* Grid of Favorites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {favorites.map((fav, index) => {
          const isRevealed = revealed[fav.id];

          return (
            <Card 
              key={fav.id} 
              className="group shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/10 bg-card"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  {/* Category & Difficulty Badges */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      <Layers className="w-3 h-3" />
                      {fav.category}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase ${getDifficultyColor(fav.difficulty)}`}>
                      <Trophy className="w-3 h-3" />
                      {fav.difficulty}
                    </span>
                  </div>
                  
                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteFavorite(fav.id)}
                    className="text-muted-foreground hover:text-red-600 hover:bg-red-50 -mr-2 -mt-2 transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardTitle className="text-lg leading-relaxed font-semibold text-foreground/90">
                  {fav.question}
                </CardTitle>
              </CardHeader>

              <CardContent className="pb-2 min-h-[3rem]">
                <div className={`transition-all duration-300 overflow-hidden ${isRevealed ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                   <div className="p-3 bg-green-50 border border-green-100 rounded-md flex items-start gap-3">
                      <div className="bg-green-100 p-1 rounded text-green-600 mt-0.5">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-green-800 uppercase tracking-wide">Correct Answer</p>
                        <p className="text-green-900 font-medium">{fav.correct_answer}</p>
                      </div>
                   </div>
                </div>
                {!isRevealed && (
                  <div className="text-sm text-muted-foreground italic flex items-center gap-2 opacity-60">
                    <EyeOff className="w-4 h-4" /> Answer hidden
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-2 flex gap-3">
                <Button 
                  variant={isRevealed ? "outline" : "default"}
                  size="sm" 
                  className="w-full gap-2"
                  onClick={() => toggleAnswer(fav.id)}
                >
                  {isRevealed ? (
                    <>
                      <EyeOff className="w-4 h-4" /> Hide Answer
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" /> Reveal Answer
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}