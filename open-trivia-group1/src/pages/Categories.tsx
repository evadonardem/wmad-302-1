// src/pages/Categories.tsx
import { useState } from "react";
import { categories } from "../data/categories";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, Sparkles, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "@/context/QuizContext";

export default function Categories() {
  const navigate = useNavigate();
  const { updateConfig, resetGame } = useQuiz();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectCategory = (id: number) => {
    // Reset current game
    resetGame();
    // Update the quiz preference with selected category
    updateConfig("category", id);
    // Navigate to quiz page
    navigate("/quiz");
  };

  // Filter logic for search
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      
      {/* Header & Search Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
           <h2 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
             <LayoutGrid className="w-8 h-8 text-primary" />
             Quiz Categories
           </h2>
           <p className="text-muted-foreground mt-2 text-lg">
             Select a topic to test your knowledge.
           </p>
        </div>

        {/* Dynamic Search Bar */}
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors h-4 w-4" />
          <Input 
            placeholder="Search topics..." 
            className="pl-10 h-12 bg-card/50 backdrop-blur-sm border-2 focus:border-primary/50 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid Section */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center animate-in zoom-in-95 duration-300">
          <div className="bg-muted p-4 rounded-full mb-4">
             <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-xl font-medium text-muted-foreground">No categories found for "{searchQuery}"</p>
          <button 
            onClick={() => setSearchQuery("")}
            className="mt-2 text-primary hover:underline font-medium"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat, index) => (
            <Card
              key={cat.id}
              className="group relative overflow-hidden border-2 border-transparent hover:border-primary/20 hover:shadow-2xl transition-all duration-300 cursor-pointer bg-card hover:bg-card/80 hover:-translate-y-1"
              onClick={() => handleSelectCategory(cat.id)}
              // Inline style for staggered animation delay
              style={{
                animationFillMode: 'both',
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Animation Class (Standard Tailwind Animate) */}
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
                
                {/* Subtle Background Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    {/* Icon Container with Bloom Effect */}
                    <div className="p-3 bg-secondary/50 rounded-2xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:scale-110">
                      <cat.icon className="w-7 h-7" />
                    </div>

                    {/* Sliding Arrow */}
                    <div className="p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 -translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 shadow-sm border">
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {cat.name}
                    </CardTitle>
                    <CardDescription className="text-sm font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                      {cat.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}