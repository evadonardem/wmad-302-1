import { Home, List, Settings, Star } from 'lucide-react';
import { Button } from './components/ui/button';
import './App.css';
import { Separator } from './components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Favorites from './pages/Favorites';
import Preferences from './pages/Preference';
import { useState, useEffect } from 'react';

// ---------------- Overview Card Component ----------------
const OverviewCard = ({
  title,
  description,
  buttonLabel,
  icon: Icon,
  proceedTo,
  iconColor,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  proceedTo: string;
  iconColor: string;
}) => {
  const navigate = useNavigate();
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-start justify-between transition-all duration-300 shadow-lg hover:-translate-y-1`}>
      <div className="flex items-center gap-4 mb-4">
        <Icon className={`w-12 h-12 ${iconColor}`} />
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      </div>
      <p className="text-slate-600 mb-6">{description}</p>
      <div className="w-full mt-6 flex justify-center">
        <Button variant="default" size="default" onClick={() => navigate(proceedTo)}>
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
};

// ---------------- Home Page (All Overviews) ----------------
const HomePage = () => {
  const overviewItems = [
    {
      title: "Quiz Overview",
      description: "Welcome to the quiz! Select your preferences and get started.",
      buttonLabel: "Start Quiz",
      icon: Home,
      proceedTo: "/quiz",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      buttonColor: "bg-blue-600",
      buttonHover: "hover:bg-blue-700"
    },
    {
      title: "Categories Overview",
      description: "Choose from multiple categories to customize your quiz experience.",
      buttonLabel: "Go to Categories",
      icon: List,
      proceedTo: "/categories",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      buttonColor: "bg-green-600",
      buttonHover: "hover:bg-green-700"
    },
    {
      title: "Favorites Overview",
      description: "See your saved favorite questions in one place.",
      buttonLabel: "Go to Favorites",
      icon: Star,
      proceedTo: "/favorites",
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      buttonColor: "bg-yellow-600",
      buttonHover: "hover:bg-yellow-700"
    },
    {
      title: "Preferences Overview",
      description: "Adjust quiz difficulty and question type before starting.",
      buttonLabel: "Set Preferences",
      icon: Settings,
      proceedTo: "/preferences",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      buttonColor: "bg-purple-600",
      buttonHover: "hover:bg-purple-700"
    },
  ];

  return (
    <div className="min-h-screen p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {overviewItems.map((item) => (
        <OverviewCard key={item.title} {...item} />
      ))}
    </div>
  );
};

// ---------------- Sidebar Groups ----------------
const SidebarGroupContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="sidebar-group-content">{children}</div>;
};

const ApplicationSidebarGroup = () => {
  const menuItems = [
    { title: "Home", icon: Home, url: '/' },
    { title: "Categories", icon: List, url: '/categories' },
    { title: "Favorites", icon: Star, url: '/favorites' },
  ];

  // Recommended icon sources for a professional look:
  // - Lucide: https://lucide.dev/ (used in this project)
  // - Heroicons: https://heroicons.com/
  // - Feather: https://feathericons.com/
  // Using consistent sizes and color tokens improves professionalism.

  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Application</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive =
              item.url === '/' ? location.pathname === '/' : location.pathname.startsWith(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link to={item.url} className="flex items-center gap-3">
                    <item.icon className={`w-6 h-6 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

const SettingsSidebarGroup = () => (
  <SidebarGroup>
    <SidebarGroupLabel>Settings</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link to='/preferences'>
              <Settings />
              <span>Preferences</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
);

// ---------------- Main App ----------------
function App() {
  const [difficulty, setDifficulty] = useState('');
  const [questionType, setQuestionType] = useState('multiple');

  useEffect(() => {
    const loadSavedPreferences = () => {
      try {
        const savedPrefs = localStorage.getItem('quizPreferences');
        if (savedPrefs) {
          const prefs = JSON.parse(savedPrefs);
          setDifficulty(prefs.difficulty || '');
          setQuestionType(prefs.questionType || 'multiple');
        }
      } catch (error) {
        console.error('Error loading saved preferences:', error);
      }
    };
    loadSavedPreferences();
  }, []);

  return (
    <BrowserRouter>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
              <h1 className="scroll-m-20 text-center text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                Open Trivia
              </h1>
              <p className="text-slate-500 text-lg mb-6">
                For every <em>Juan</em>
              </p>
            <Separator />
          </SidebarHeader>
          <SidebarContent>
            <ApplicationSidebarGroup />
            <SettingsSidebarGroup />
          </SidebarContent>
          <SidebarFooter>
            <p className="text-muted-foreground text-sm">
              WMAD-302 Group 4 <br />
              &copy; 2025
            </p>
          </SidebarFooter>
        </Sidebar>

        <main className="relative">
          <div className="fixed top-4 right-4 z-50">
            <SidebarTrigger className="btn-secondary shadow-md border-slate-200 transition-colors" />
          </div>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/quiz" element={<Dashboard difficulty={difficulty} questionType={questionType} />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/preferences" element={<Preferences difficulty={difficulty} setDifficulty={setDifficulty} questionType={questionType} setQuestionType={setQuestionType} />} />
          </Routes>
        </main>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;