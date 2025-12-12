// pages/Categories.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Grid3X3, List, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  questionCount: number;
  color: string;
}

const Categories = ({ }: { onCategorySelect: (category: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  const categories: Category[] = [
    { id: 9, name: 'General Knowledge', questionCount: 125, color: 'bg-blue-500' },
    { id: 10, name: 'Entertainment: Books', questionCount: 89, color: 'bg-green-500' },
    { id: 11, name: 'Entertainment: Film', questionCount: 156, color: 'bg-purple-500' },
    { id: 12, name: 'Entertainment: Music', questionCount: 203, color: 'bg-pink-500' },
    { id: 13, name: 'Entertainment: Musicals & Theatres', questionCount: 45, color: 'bg-indigo-500' },
    { id: 14, name: 'Entertainment: Television', questionCount: 178, color: 'bg-red-500' },
    { id: 15, name: 'Entertainment: Video Games', questionCount: 267, color: 'bg-orange-500' },
    { id: 16, name: 'Entertainment: Board Games', questionCount: 67, color: 'bg-teal-500' },
    { id: 17, name: 'Science & Nature', questionCount: 189, color: 'bg-emerald-500' },
    { id: 18, name: 'Science: Computers', questionCount: 234, color: 'bg-cyan-500' },
    { id: 19, name: 'Science: Mathematics', questionCount: 98, color: 'bg-amber-500' },
    { id: 20, name: 'Mythology', questionCount: 56, color: 'bg-rose-500' },
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startCategoryQuiz = (categoryName: string) => {
    navigate(`/quiz/${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <br />
          <p className="text-muted-foreground">
            Explore trivia questions by category
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-3"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-3"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <Card 
              key={category.id} 
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${category.color}`} />
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {category.name}
                  </CardTitle>
                </div>
                <CardDescription>
                  {category.questionCount} questions available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => startCategoryQuiz(category.name)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            {filteredCategories.map((category, index) => (
              <div
                key={category.id}
                className={`flex items-center justify-between p-4 hover:bg-accent cursor-pointer ${
                  index < filteredCategories.length - 1 ? 'border-b' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${category.color}`} />
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.questionCount} questions
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => startCategoryQuiz(category.name)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start Quiz
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {filteredCategories.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No categories found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms to find what you're looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Categories;