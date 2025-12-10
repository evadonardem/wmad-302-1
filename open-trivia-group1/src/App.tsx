import { Home, List, Settings, Star, Trophy, MessageCircle } from 'lucide-react';
import './App.css';
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
import { BrowserRouter, Routes, Route, useLocation ,Link } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext'; // Import the new context

// Page Imports
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Favorites from './pages/Favorites';
import Quiz from './pages/Quiz';
import Preference from './pages/Preference';
import Leaderboard from './pages/LeaderBoards';
import Community from './pages/Community'; // Added Community Page

// --- Sidebar Component Definitions ---

const ApplicationSidebarGroup = () => {
  const location = useLocation(); // Get current route info
  
  const menuItems = [
    { title: "Home", icon: Home, url: '/' },
    { title: "Categories", icon: List, url: '/categories' },
    { title: "Favorites", icon: Star, url: '/favorites' },
    { title: "Leaderboard", icon: Trophy, url: '/leaderboards' },
    { title: "Community", icon: MessageCircle, url: '/community' }, // Added Community Menu Item
    { title: "Take Quiz", icon: List, url: '/quiz' },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Application</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            // Logic: Strict match for Home, loose match (startsWith) for others to handle sub-routes
            const isActive = item.url === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                {/* Pass the isActive prop here */}
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link to={item.url} className="flex items-center gap-2">
                    <item.icon />
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

const SettingsSidebarGroup = () => {
  const location = useLocation(); // Get current route info

  const menuItems = [
    { title: "Preferences", icon: Settings, url: '/preferences' },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.url;
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link to={item.url} className="flex items-center gap-2">
                    <item.icon />
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

// --- Main App Component ---

function App() {
  return (
    <BrowserRouter>
      <QuizProvider>
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                Open Trivia
              </h1>
              <p className="text-muted-foreground text-xl text-center mb-4">
                For every <em>Juan</em> <em>by Group 1</em>
              </p>
              <Separator />
            </SidebarHeader>

            <SidebarContent>
              <ApplicationSidebarGroup />
              <SettingsSidebarGroup />
            </SidebarContent>

            <SidebarFooter style={{ background: "linear-gradient(to right, #4A70A9, #8FABD4)", borderRadius: "0.5rem", padding: "1rem" }}>
                <p style={{ color: "#000000" }} className="text-sm text-center font-semibold">
                WMAD-302 Group 1 <br />
                &copy; 2025
                </p>
            </SidebarFooter>
          </Sidebar>

          <main className="w-full">
            <SidebarTrigger />

            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/leaderboards" element={<Leaderboard />} />
              <Route path="/community" element={<Community />} /> {/* Added Community Route */}
              <Route path="/preferences" element={<Preference />} />
              <Route path="/quiz/:categoryId?" element={<Quiz />} />
            </Routes>
          </main>
        </SidebarProvider>
      </QuizProvider>
    </BrowserRouter>
  );
}

export default App;