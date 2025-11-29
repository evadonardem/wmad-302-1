import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/ui/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Categories } from './pages/Categories';
import { Quiz } from './pages/Quiz';
import { Favorites } from './pages/Favorites';
import { Preferences } from './pages/Preferences';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from 'lucide-react';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className="h-full"
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/categories" element={<PageWrapper><Categories /></PageWrapper>} />
        <Route path="/quiz/:categoryId" element={<PageWrapper><Quiz /></PageWrapper>} />
        <Route path="/favorites" element={<PageWrapper><Favorites /></PageWrapper>} />
        <Route path="/preferences" element={<PageWrapper><Preferences /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const MobileHeader = ({ onMenuClick }: { onMenuClick: () => void }) => (
    <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background/90 backdrop-blur-md border-b border-border z-40 flex items-center px-4 justify-between transition-colors duration-300">
        <span className="font-display font-bold text-foreground text-lg">Open Trivia</span>
        <button onClick={onMenuClick} className="p-2 text-foreground">
            <Menu />
        </button>
    </div>
);

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Initialize Theme Globally
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    // Default to light mode if no theme is saved or if it's explicitly 'light'
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      // Ensure 'light' is consistent if nothing is saved
      if (!savedTheme) localStorage.setItem('theme', 'light');
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 relative overflow-x-hidden transition-colors duration-300">
        
        {/* Flexible Base Background */}
        <div className="absolute top-0 left-0 w-full h-[120vh] pointer-events-none z-0 overflow-hidden">
            {/* Top Left Orb - Theme aware colors */}
            <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] md:w-[50vw] md:h-[50vw] bg-purple-300/30 dark:bg-purple-900/20 rounded-full blur-[80px] md:blur-[120px] opacity-70 transition-colors duration-500"></div>
            
            {/* Center/Right Orb - Theme aware colors */}
            <div className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] bg-indigo-300/30 dark:bg-indigo-900/20 rounded-full blur-[80px] md:blur-[120px] opacity-60 transition-colors duration-500"></div>

            {/* Gradient Mask to fade out the background effects as user scrolls */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent transition-colors duration-300"></div>
        </div>

        <Sidebar />
        
        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
                 <div className="absolute right-0 top-0 bottom-0 w-64 bg-background shadow-xl border-l border-border" onClick={e => e.stopPropagation()}>
                     <div className="p-6">
                        <h2 className="text-foreground font-bold mb-4">Menu</h2>
                        <a href="#/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-500 hover:text-primary">Dashboard</a>
                        <a href="#/categories" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-500 hover:text-primary">Categories</a>
                        <a href="#/preferences" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-500 hover:text-primary">Preferences</a>
                     </div>
                 </div>
            </div>
        )}

        <MobileHeader onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="md:pl-64 min-h-screen relative z-10 pt-16 md:pt-0">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
};

export default App;