// src/pages/Categories.tsx
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Star, Play, Check, RefreshCw, Grid3X3, List, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

type Category = { id: number; name: string };
type FavoriteCategory = { id: string; name: string };

const colors = [
  "border-blue-200 text-blue-800",
  "border-green-200 text-green-800",
  "border-amber-200 text-amber-800",
  "border-purple-200 text-purple-800",
  "border-pink-200 text-pink-800",
  "border-indigo-200 text-indigo-800",
  "border-teal-200 text-teal-800",
  "border-orange-200 text-orange-800",
];

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>("any");
  const [favoriteCategories, setFavoriteCategories] = useState<FavoriteCategory[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");

  const navigate = useNavigate();

  // Fetch categories
  const fetchCategories = () => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch("https://opentdb.com/api_category.php")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setCategories(data.trivia_categories || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError("Failed to load categories. Please try again.");
          setLoading(false);
          console.error(err);
        }
      });

    return () => {
      isMounted = false;
    };
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Load favorite categories from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("favoriteCategories");
      if (stored) {
        const parsed: FavoriteCategory[] = JSON.parse(stored);
        if (Array.isArray(parsed)) setFavoriteCategories(parsed);
      }
    } catch (err) {
      console.error("Error loading favorite categories:", err);
      setFavoriteCategories([]);
    }
  }, []);

  const persistFavorites = (favorites: FavoriteCategory[]) => {
    try {
      localStorage.setItem("favoriteCategories", JSON.stringify(favorites));
    } catch (err) {
      console.error("Error saving favorites:", err);
    }
  };

  const isFavorite = (id: string) => favoriteCategories.some((fav) => fav.id === id);

  const addToFavorites = (category: Category) => {
    if (isFavorite(String(category.id))) return;
    const updated = [...favoriteCategories, { id: String(category.id), name: category.name }];
    setFavoriteCategories(updated);
    persistFavorites(updated);
    setSuccessMessage(`"${category.name}" added to favorites!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const removeFromFavorites = (categoryId: string) => {
    const updated = favoriteCategories.filter((fav) => fav.id !== categoryId);
    setFavoriteCategories(updated);
    persistFavorites(updated);
    setSuccessMessage("Category removed from favorites");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const useCategory = (categoryId: string, colorClass?: string) => {
    const categoryToUse = categoryId === "any" ? null : categoryId;
    localStorage.setItem("selectedCategory", JSON.stringify(categoryToUse));
    if (colorClass) localStorage.setItem("selectedCategoryColor", colorClass);
    navigate("/quiz");
  };

  // Handle adding to favorites from dropdown selection
  const handleAddToFavorites = () => {
    if (selected === "any") return;
    
    const category = categories.find((c) => String(c.id) === selected);
    if (category) {
      addToFavorites(category);
    }
  };

  // Handle using category from dropdown selection
  const handleUseCategory = () => {
    if (selected === "any") return;
    
    const colorClass = categories.length > 0
      ? colors[categories.findIndex((c) => String(c.id) === selected) % colors.length]
      : undefined;
    useCategory(selected, colorClass);
  };

  const handleRetry = () => {
    fetchCategories();
  };

  // Filter categories based on search query and active tab
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isFavorite = favoriteCategories.some(fav => fav.id === String(category.id));
    
    if (activeTab === "favorites") {
      return matchesSearch && isFavorite;
    }
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-6xl mx-auto">
              <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Categories
              </CardTitle>
              <CardDescription className="text-lg md:text-xl text-gray-600">
                Loading available categories...
              </CardDescription>
            </CardHeader>
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-12 h-12 animate-spin text-green-600" />
                <p className="text-gray-600 text-lg">Loading categories...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-6xl mx-auto">
            <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Categories
            </CardTitle>
            <CardDescription className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from {categories.length} trivia categories. Add favorites for quick access and start quizzing!
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {error && (
              <div className="text-red-500 text-center p-6 bg-red-50 rounded-xl border border-red-200">
                <p className="mb-4 text-lg font-medium">{error}</p>
                <Button onClick={handleRetry} variant="outline" size="lg" className="border-red-300">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            )}
            
            {successMessage && (
              <div className="flex items-center justify-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <Check className="w-5 h-5 text-green-600" />
                <p className="text-green-700 font-medium text-lg">{successMessage}</p>
              </div>
            )}

            {/* Quick Actions Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Quick Selection</h3>
              <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                <div className="flex-1">
                  <Select value={selected} onValueChange={setSelected}>
                    <SelectTrigger className="w-full h-12 text-base">
                      <SelectValue placeholder="Any Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories ({categories.length})</SelectLabel>
                        <SelectItem value="any">Select Category</SelectItem>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToFavorites}
                    disabled={selected === "any" || isFavorite(selected)}
                    variant="secondary"
                    size="lg"
                    className="h-12 px-6 flex items-center gap-2"
                  >
                    <Star className="w-5 h-5" />
                    {selected === "any" ? "Select First" : isFavorite(selected) ? "Already Favorited" : "Add Favorite"}
                  </Button>

                  <Button
                    onClick={handleUseCategory}
                    disabled={selected === "any"}
                    variant="default"
                    size="lg"
                    className="h-12 px-6 flex items-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Start Quiz
                  </Button>
                </div>
              </div>
            </div>

            {/* Browse Section */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Browse Categories</h3>
                  <p className="text-gray-600 mt-1">
                    {activeTab === "all" 
                      ? `All categories (${filteredCategories.length})`
                      : `Favorite categories (${filteredCategories.length})`
                    }
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="flex items-center gap-2"
                    >
                      <Grid3X3 className="w-4 h-4" />
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="flex items-center gap-2"
                    >
                      <List className="w-4 h-4" />
                      List
                    </Button>
                  </div>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "favorites")}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    All Categories
                    <Badge variant="secondary" className="ml-1">
                      {categories.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Favorites
                    <Badge variant="secondary" className="ml-1">
                      {favoriteCategories.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                  {filteredCategories.length === 0 ? (
                    <div className="text-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <div className="max-w-md mx-auto">
                        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-xl font-semibold text-gray-600 mb-2">
                          {activeTab === "favorites" ? "No favorite categories" : "No categories found"}
                        </h4>
                        <p className="text-gray-500 mb-4">
                          {activeTab === "favorites" 
                            ? "Add some categories to your favorites to see them here."
                            : "Try adjusting your search or browse all categories."
                          }
                        </p>
                        {activeTab === "favorites" && (
                          <Button 
                            onClick={() => setActiveTab("all")}
                            variant="outline"
                          >
                            Browse All Categories
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredCategories.map((c, index) => {
                        const isSelected = String(c.id) === selected;
                        const colorClass = colors[index % colors.length];
                        const isCategoryFavorite = isFavorite(String(c.id));
                        
                        return (
                          <Card 
                            key={c.id}
                            className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 ${
                              isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""
                            } ${colorClass}`}
                            onClick={() => setSelected(String(c.id))}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <h4 className="text-lg font-bold leading-tight">{c.name}</h4>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (isCategoryFavorite) {
                                      removeFromFavorites(String(c.id));
                                    } else {
                                      addToFavorites(c);
                                    }
                                  }}
                                  className="p-2 h-auto"
                                >
                                  <Star className={`w-5 h-5 ${
                                    isCategoryFavorite ? "fill-amber-400 text-amber-500" : "text-gray-400"
                                  }`} />
                                </Button>
                              </div>
                              
                              <Badge variant="outline" className="bg-white/50 mb-4">
                                ID: {c.id}
                              </Badge>

                              <div className="flex justify-center mt-6">
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    useCategory(String(c.id), colorClass);
                                  }}
                                  className="flex items-center gap-2"
                                >
                                  <Play className="w-4 h-4 mr-1" />
                                  Start
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredCategories.map((c, index) => {
                        const isSelected = String(c.id) === selected;
                        const colorClass = colors[index % colors.length].split(' ')[0];
                        const isCategoryFavorite = isFavorite(String(c.id));
                        
                        return (
                          <div
                            key={c.id}
                            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              isSelected ? "ring-2 ring-blue-500 ring-offset-2 bg-blue-50" : "bg-white hover:bg-gray-50"
                            }`}
                            onClick={() => setSelected(String(c.id))}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-3 h-12 rounded-full ${colorClass}`}></div>
                              <div>
                                <h4 className="font-semibold text-gray-800">{c.name}</h4>
                                <p className="text-sm text-gray-500">ID: {c.id}</p>
                              </div>
                            </div>
                            
                              <div className="flex items-center gap-3">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isCategoryFavorite) {
                                    removeFromFavorites(String(c.id));
                                  } else {
                                    addToFavorites(c);
                                  }
                                }}
                              >
                                <Star className={`w-4 h-4 ${
                                  isCategoryFavorite ? "fill-amber-400 text-amber-500" : "text-gray-400"
                                }`} />
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="default"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  useCategory(String(c.id), colorClass);
                                }}
                                className="flex items-center gap-2"
                              >
                                <Play className="w-4 h-4 mr-1" />
                                Start
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Categories;