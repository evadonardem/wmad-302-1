import { Home, List, Settings, Star } from 'lucide-react';
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
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
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
  bgColor,
  iconColor,
  buttonColor,
  buttonHover
}: {
  title: string;
  description: string;
  buttonLabel: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  proceedTo: string;
  bgColor: string;
  iconColor: string;
  buttonColor: string;
  buttonHover: string;
}) => {
  const navigate = useNavigate();
  return (
    <div className={`rounded-lg shadow-lg p-6 flex flex-col items-center justify-between transition-transform duration-200 ${bgColor} hover:scale-105`}>
      <Icon className={`w-12 h-12 mb-4 ${iconColor} transition-transform duration-300 hover:scale-125`} />
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-700 mb-4 text-center">{description}</p>
      <button
        className={`px-4 py-2 text-white font-semibold rounded-lg ${buttonColor} ${buttonHover}`}
        onClick={() => navigate(proceedTo)}
      >
        {buttonLabel}
      </button>
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
    <div className="min-h-screen p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
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

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Application</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
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
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
              Open Trivia
            </h1>
            <p className="text-muted-foreground text-xl">
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
            <SidebarTrigger className="bg-white shadow-md border hover:bg-gray-50 transition-colors" />
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