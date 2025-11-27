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
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Favorites from './pages/Favorites';
import Preferences from './pages/Preference';


const ApplicationSidebarGroup = () => {
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
    {
      title: "Favorites",
      icon: Star,
      url: '/favorites'
    },
  ];

  return <SidebarGroup>
    <SidebarGroupLabel>Application</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        {menuItems.map((item, index) => <SidebarMenuItem key={index}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
};

const SettingsSidebarGroup = () => {
  const menuItems = [
    {
      title: "Preferences",
      icon: Settings,
      url: '/preferences'
    },
  ];

  return <SidebarGroup>
    <SidebarGroupLabel>Settings</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        {menuItems.map((item, index) => <SidebarMenuItem key={index}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>;
};

function App() {
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
            <Separator/>
          </SidebarHeader>
          <SidebarContent>
            <ApplicationSidebarGroup />
            <SettingsSidebarGroup />
          </SidebarContent>
          <SidebarFooter>
            <p className="text-muted-foreground text-sm">
              WMAD-302 Group ? <br/>
              &copy; 2025
            </p>
          </SidebarFooter>
        </Sidebar>

        <main>
          <SidebarTrigger />
          
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/preferences" element={<Preferences />} />
          </Routes>
        </main>

      </SidebarProvider>
    </BrowserRouter>
  )
}

export default App