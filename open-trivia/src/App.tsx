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

const ApplicationSidebarGroup = () => {
  const menuItems = [
    {
      title: "Home",
      icon: Home,
    },
    {
      title: "Categories",
      icon: List,
    },
    {
      title: "Favorites",
      icon: Star,
    },
  ];

  return <SidebarGroup>
    <SidebarGroupLabel>Application</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        {menuItems.map((item) => <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href='#'>
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
    },
  ];

  return <SidebarGroup>
    <SidebarGroupLabel>Settings</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        {menuItems.map((item) => <SidebarMenuItem>
            <SidebarMenuButton asChild isActive>
              <a href='#'>
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
      </main>

    </SidebarProvider>
  )
}

export default App
