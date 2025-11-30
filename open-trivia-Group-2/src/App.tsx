import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Link } from "react-router-dom";
import { Home, List, Star, Settings } from "lucide-react";
import "./App.css";
import { Separator } from "./components/ui/separator";
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
} from "./components/ui/sidebar";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Favorites from "./pages/Favorites";
import Quiz from "./pages/Quiz";
import Preference from "./pages/Preference"; // Preference page
import "./pages/global.css";

const ApplicationSidebarGroup = () => {
  const menuItems = [
    { title: "Home", icon: Home, url: "/" },
    { title: "Categories", icon: List, url: "/categories" },
    { title: "Favorites", icon: Star, url: "/favorites" },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Application</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.url} className="flex items-center gap-2">
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

const SettingsSidebarGroup = () => {
  const menuItems = [{ title: "Preferences", icon: Settings, url: "/preferences" }];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.url} className="flex items-center gap-2">
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

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
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
              WMAD-302 Group 2 <br />
              &copy; 2025
            </p>
          </SidebarFooter>
        </Sidebar>

        <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
          

          <main className="app-main">
            <header className="topbar">
              <div className="topbar-left">
                <button
                  className="mobile-sidebar-toggle"
                  onClick={() => setCollapsed((s) => !s)}
                  aria-label="Toggle sidebar"
                >
                  ☰
                </button>
                <div className="app-title">
                  <span className="app-title-main">Open Trivia</span>
                  <span className="app-title-sub">— Play & Learn</span>
                </div>
              </div>

              <div className="topbar-right">
                
              </div>
            </header>

            <section className="app-content" aria-live="polite">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/quiz/:categoryId/:categoryName" element={<Quiz />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/preferences" element={<Preference />} />
              </Routes>
            </section>

            <footer className="app-footer">
              <small>© {new Date().getFullYear()} For every juan — built with 🎯</small>
            </footer>
          </main>
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;
