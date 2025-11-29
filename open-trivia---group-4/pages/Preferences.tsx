import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Moon, Sun, Archive, Calendar, Trash2, Clock, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { getGameHistory } from '../services/storageService';
import { GameResult } from '../types';

export const Preferences: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [history, setHistory] = useState<GameResult[]>([]);

  // Initialize theme and load history
  useEffect(() => {
    // Theme initialization
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    
    if (savedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      if (!savedTheme) localStorage.setItem('theme', 'light');
    }

    // Load History
    const data = getGameHistory();
    // Sort by date descending (newest first)
    setHistory(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  const toggleTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to delete your entire game history? This action cannot be undone.")) {
      localStorage.removeItem('trivia_history');
      setHistory([]);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Preferences & Archive</h1>
        <p className="text-muted-foreground">Manage your interface and view your complete gameplay history.</p>
      </motion.div>
      
      {/* Interface Settings */}
      <section>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 px-1">Interface</h3>
        <Card className="p-0 overflow-hidden border-border bg-card">
          <div className="flex items-center justify-between p-6 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground">Theme Mode</h4>
                <p className="text-sm text-muted-foreground">Customize the application visual appearance</p>
              </div>
            </div>
            
            <div className="flex items-center bg-muted rounded-xl p-1.5 relative border border-border w-[160px] h-[48px]">
                {/* Sliding Background Pill */}
                <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-card rounded-lg shadow-sm z-0 ${theme === 'dark' ? 'left-[calc(50%+3px)]' : 'left-1.5'}`}
                />

                {/* Light Button */}
                <button 
                    onClick={() => toggleTheme('light')}
                    className={`flex-1 relative z-10 flex items-center justify-center gap-2 text-sm font-bold transition-colors ${theme === 'light' ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                    <Sun className="w-4 h-4" /> Light
                </button>

                {/* Dark Button */}
                <button 
                    onClick={() => toggleTheme('dark')}
                    className={`flex-1 relative z-10 flex items-center justify-center gap-2 text-sm font-bold transition-colors ${theme === 'dark' ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                    <Moon className="w-4 h-4" /> Dark
                </button>
            </div>
          </div>
        </Card>
      </section>

      {/* History Archive */}
      <section>
         <div className="flex items-center justify-between mb-4 px-1">
             <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">History Archive</h3>
             {history.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-3 h-3" /> Clear Archive
                </button>
             )}
         </div>

         <Card className="min-h-[400px] border-border overflow-hidden p-0">
            {history.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                                <th className="p-4 font-bold whitespace-nowrap">Timestamp</th>
                                <th className="p-4 font-bold">Category</th>
                                <th className="p-4 font-bold">Difficulty</th>
                                <th className="p-4 font-bold text-right">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {history.map((game, index) => {
                                const percentage = Math.round((game.score / game.totalQuestions) * 100);
                                const isPass = percentage >= 60;
                                return (
                                    <tr key={game.id || index} className="hover:bg-muted/30 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                                    {new Date(game.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 font-mono">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(game.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm font-bold text-foreground">{game.category}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border ${
                                                game.difficulty === 'easy' ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400' :
                                                game.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400' :
                                                'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400'
                                            }`}>
                                                {game.difficulty}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className={`text-lg font-bold font-display ${isPass ? 'text-green-500' : 'text-red-500'}`}>
                                                    {percentage}%
                                                </span>
                                                <span className="text-xs text-muted-foreground font-medium">
                                                    {game.score} / {game.totalQuestions} Correct
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground bg-muted/5">
                    <div className="p-6 bg-muted/50 rounded-full mb-4">
                        <Archive className="w-12 h-12 opacity-20" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Archive Empty</h3>
                    <p className="max-w-xs text-center">Play some games to populate your history log.</p>
                </div>
            )}
         </Card>
      </section>
    </div>
  );
};