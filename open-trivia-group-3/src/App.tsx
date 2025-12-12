// App.tsx
import { Home, List, Settings, Star } from 'lucide-react';
import './App.css'
import { Separator } from './components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from './components/ui/sidebar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Favorites from './pages/Favorites';
import Preferences from './pages/Preferences';
import { FavoritesProvider, type TriviaQuestion } from './contexts/FavoritesContext';
import Quiz from './pages/Quiz';

const ApplicationSidebarGroup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    {
      title: "Home",
      icon: Home,
      url: '/',
    },
    {
      title: "Categories",
      icon: List,
      url: '/categories'
    },
    // {
    //   title: "Favorites",
    //   icon: Star,
    //   url: '/favorites'
    // },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Application</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                isActive={location.pathname === item.url}
                onClick={() => navigate(item.url)}
              >
                <a href={item.url} className="cursor-pointer">
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

const SettingsSidebarGroup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    {
      title: "Preferences",
      icon: Settings,
      url: '/preferences'
    },
  ];

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Settings</SidebarGroupLabel> */}
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild 
                isActive={location.pathname === item.url}
                onClick={() => navigate(item.url)}
              >
                {/* <a href={item.url} className="cursor-pointer">
                  <item.icon className="w-4 h-4" />
                  <span>{i  tem.title}</span>
                </a> */}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

function AppContent() {
  const [triviaQuestions, setTriviaQuestions] = useState<TriviaQuestion[]>([]);
  const [isLoadingTriviaQuestions, setIsLoadingTriviaQuestions] = useState(true); 

  const fetchTriviaQuestions = async (numberOfQuestions = 10, type = 'multiple', difficulty = null, category = null) => {
    try {
      setIsLoadingTriviaQuestions(true);
      let endpoint = `https://opentdb.com/api.php?amount=${numberOfQuestions}&type=${type}`;
      
      if (difficulty) endpoint += `&difficulty=${difficulty}`;
      if (category) endpoint += `&category=${category}`;
      
      const result = await axios.get(endpoint);
      
      if (result.status === 200) {
        const { data } = result;
        const { results: questions } = data;
        setTriviaQuestions(questions);
      }
    } catch (error) {
      console.error('Error fetching trivia questions:', error);
    } finally {
      setIsLoadingTriviaQuestions(false);
    }
  };

  useEffect(() => {
    fetchTriviaQuestions(10);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="p-4">
            <div className="text-center">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Open Trivia
              </h1>
              <p className="text-muted-foreground text-lg mt-2">
                For every <em className="text-primary font-semibold">Juan</em>
              </p>
            </div>
            <Separator className="mt-4" />
          </SidebarHeader>
          <SidebarContent>
            <ApplicationSidebarGroup />
            <SettingsSidebarGroup />
          </SidebarContent>
          <SidebarFooter className="p-4">
            <p className="text-muted-foreground text-sm">
              WMAD-302 Group 3 <br />
              &copy; 2025
            </p>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 p-6">
          <div className="flex items-center gap-4 mb-6">
            <SidebarTrigger className="bg-primary text-primary-foreground hover:bg-primary/90" />
            <h1 className="text-3xl font-bold text-foreground">Trivia Dashboard</h1>
          </div>
          
          <Routes>
            <Route path="/" element={<Dashboard triviaQuestions={triviaQuestions} isLoading={isLoadingTriviaQuestions} />} />
            <Route path="/categories" element={<Categories onCategorySelect={(category) => console.log('Selected:', category)} />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/:category" element={<Quiz />} />
          </Routes>
        </main>
      </SidebarProvider>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </BrowserRouter>
  );
}

export default App