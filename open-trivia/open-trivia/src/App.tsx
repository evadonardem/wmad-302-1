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
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Favorites from './pages/Favorites';

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
      url: 'favorites'
    },
  ];

  return <SidebarGroup>
    <SidebarGroupLabel>Application</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        {menuItems.map((item) => <SidebarMenuItem>
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
  const [triviaQuestions, setTriviaQuestions] = useState([]);
  const [isLoadingTriviaQuestions, setIsLoadingTriviaQuestions] = useState(true); 

  const fetchTriviaQuestions = async (numberOfQuestions = 10, type = 'multiple', difficulty = null, category = null) => {
    const endpoint = `https://opentdb.com/api.php?amount=${numberOfQuestions}&type=${type}`;
    const requestParams = `${difficulty ? `&diffulty=${difficulty}` : ''}${category ? `&category=${category}` : ''}`;
    const result = await axios.get(`${endpoint}${requestParams}`);
    
    // checking the status header is successful
    if (result.status === 200) {
      // fetching and mapping received data
      const { data } = result;
      const { results: questions } = data;
      setTriviaQuestions(questions);
      setIsLoadingTriviaQuestions(false);
    }
  };


  useEffect(() => {
    
    (async () => {
      fetchTriviaQuestions(50);
    })();

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
          </Routes>


          {/* {isLoadingTriviaQuestions && <Spinner />}

          {
            !isLoadingTriviaQuestions && triviaQuestions.map((item) => {
              const { question, category, difficulty, correct_answer, incorrect_answers } = item;
              const options = [...incorrect_answers, correct_answer];
              
              
              return <>
                <div dangerouslySetInnerHTML={{ __html: question }}></div>
                <p>{category}</p>
                <p>{difficulty}</p>

                {options.map((option, index)=> <>
                  <p>Option {index + 1}:</p>
                  <div dangerouslySetInnerHTML={{ __html: option }}></div>
                </>)}

                <Separator />
              </>;
            })
          } */}


        </main>

      </SidebarProvider>
    </BrowserRouter>
  )
}

export default App
