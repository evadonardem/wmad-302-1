import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy, Flame, Activity, Heart, Calendar, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, AreaChart, Area, ReferenceLine } from 'recharts';
import { getWeeklyStats, getCategoryStats, getOverallStats, getGameHistory } from '../services/storageService';
import { GameResult } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [stats, setStats] = useState({ wins: 0, streak: 0, accuracy: 0, total: 0 });
  const [history, setHistory] = useState<GameResult[]>([]);
  
  // Modal State
  const [activeModal, setActiveModal] = useState<'wins' | 'streak' | 'total' | null>(null);

  useEffect(() => {
    setWeeklyData(getWeeklyStats());
    setCategoryData(getCategoryStats());
    setStats(getOverallStats());
    setHistory(getGameHistory());
  }, []);

  // Use CSS variables for chart colors to support Light/Dark mode automatically
  const chartColors = {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    accent: 'hsl(var(--accent))',
    text: 'hsl(var(--muted-foreground))',
    grid: 'hsl(var(--border))',
    card: 'hsl(var(--card))',
    foreground: 'hsl(var(--foreground))',
  };

  // Mock data for mini charts background visuals
  const miniChartData = weeklyData.length > 0 ? weeklyData : Array(7).fill(0).map((_, i) => ({ val: Math.random() * 50 + 20 }));

  // Helper to render modal content based on active card
  const renderModalContent = () => {
    if (activeModal === 'wins') {
        const topGames = [...history]
            .filter(g => (g.score / g.totalQuestions) >= 0.6)
            .sort((a, b) => (b.score / b.totalQuestions) - (a.score / a.totalQuestions))
            .slice(0, 10);

        return (
            <div className="space-y-4">
                <div className="text-center mb-6">
                    <div className="inline-block p-4 bg-yellow-500/10 rounded-full mb-2">
                        <Trophy className="w-8 h-8 text-yellow-500 animate-bounce" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Hall of Fame</h2>
                    <p className="text-muted-foreground">Your top performing games</p>
                </div>
                {topGames.length > 0 ? (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {topGames.map((game, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-transparent hover:border-yellow-500/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="font-display font-bold text-lg text-yellow-500 w-6">#{idx + 1}</span>
                                    <div>
                                        <p className="font-bold text-sm text-foreground">{game.category}</p>
                                        <p className="text-[10px] text-muted-foreground">{new Date(game.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-green-500">{Math.round((game.score / game.totalQuestions) * 100)}%</span>
                                    <span className="text-[10px] text-muted-foreground uppercase">{game.difficulty}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-8">No wins recorded yet. Keep playing!</p>
                )}
            </div>
        );
    }

    if (activeModal === 'streak') {
        const recentGames = [...history]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10);

        return (
            <div className="space-y-4">
                 <div className="text-center mb-6">
                    <div className="inline-block p-4 bg-orange-500/10 rounded-full mb-2">
                        <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
                    <p className="text-muted-foreground">Last 10 games timeline</p>
                </div>
                {recentGames.length > 0 ? (
                    <div className="relative border-l-2 border-muted ml-4 space-y-6 py-2">
                        {recentGames.map((game, idx) => {
                            const isWin = (game.score / game.totalQuestions) >= 0.6;
                            return (
                                <div key={idx} className="relative pl-6">
                                    <span className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-background ${isWin ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{game.category}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(game.date).toLocaleString()}</p>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${isWin ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {isWin ? 'WIN' : 'LOSS'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-8">No games played yet.</p>
                )}
            </div>
        );
    }

    if (activeModal === 'total') {
        const easy = history.filter(g => g.difficulty === 'easy').length;
        const medium = history.filter(g => g.difficulty === 'medium').length;
        const hard = history.filter(g => g.difficulty === 'hard').length;

        return (
            <div className="space-y-6">
                <div className="text-center mb-6">
                    <div className="inline-block p-4 bg-blue-500/10 rounded-full mb-2">
                        <Activity className="w-8 h-8 text-blue-500 animate-spin-slow" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Activity Breakdown</h2>
                    <p className="text-muted-foreground">Games by difficulty</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                        <h4 className="text-2xl font-bold text-green-500">{easy}</h4>
                        <p className="text-xs uppercase font-bold text-green-600/70 mt-1">Easy</p>
                    </div>
                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                        <h4 className="text-2xl font-bold text-yellow-500">{medium}</h4>
                        <p className="text-xs uppercase font-bold text-yellow-600/70 mt-1">Medium</p>
                    </div>
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <h4 className="text-2xl font-bold text-red-500">{hard}</h4>
                        <p className="text-xs uppercase font-bold text-red-600/70 mt-1">Hard</p>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-muted/30 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-muted-foreground">Overall Accuracy</span>
                        <span className="text-sm font-bold text-foreground">{stats.accuracy}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${stats.accuracy}%` }}></div>
                    </div>
                </div>
            </div>
        );
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 relative overflow-hidden min-h-[300px] flex flex-col justify-center border-0">
          {/* Hero Background */}
          <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000" 
               className="w-full h-full object-cover opacity-20 dark:opacity-40 filter grayscale contrast-125 transition-transform duration-[20s] hover:scale-110" 
               alt="Hero"
             />
             <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-transparent"></div>
          </div>
          
          <div className="relative z-10 p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 uppercase tracking-wider border border-primary/20">
                Daily Challenge
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
                Ready to test <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">your knowledge?</span>
              </h1>
              <p className="text-muted-foreground max-w-md mb-8">
                Challenge yourself with thousands of questions across 20+ categories. 
                Earn badges and climb the leaderboard.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => navigate('/categories')}>
                    <Play className="w-5 h-5 mr-2 fill-current" /> Play Now
                </Button>
                <Button size="lg" variant="secondary" onClick={() => navigate('/favorites')}>
                    <Heart className="w-5 h-5 mr-2 fill-current" /> Favorites
                </Button>
              </div>
            </motion.div>
          </div>
        </Card>

        {/* Rectangular Summary Cards */}
        <div className="grid grid-cols-1 gap-4">
          
          {/* Wins Card */}
          <Card 
            className="group relative overflow-hidden min-h-[160px] flex flex-col justify-center cursor-pointer hover:scale-[1.02] transition-transform duration-300 border-0"
            onClick={() => setActiveModal('wins')}
          >
             <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
             <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-yellow-500/20 rounded-full blur-2xl"></div>
             
             <div className="relative z-10 flex items-center justify-between px-2">
                <div>
                   <p className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest mb-1">Total Wins</p>
                   <h3 className="text-4xl lg:text-5xl font-display font-bold text-foreground">{stats.wins}</h3>
                   <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground font-medium">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span>Top 10%</span>
                   </div>
                </div>
                <div className="p-4 rounded-2xl bg-yellow-500/10 text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300 shadow-lg shadow-yellow-500/20">
                    <Trophy className="w-8 h-8 animate-float" />
                </div>
             </div>
          </Card>
          
          {/* Streak Card */}
          <Card 
            className="group relative overflow-hidden min-h-[160px] flex flex-col justify-center cursor-pointer hover:scale-[1.02] transition-transform duration-300 border-0"
            onClick={() => setActiveModal('streak')}
          >
             <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
             <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl"></div>

             <div className="relative z-10 flex items-center justify-between px-2">
                <div>
                   <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1">Best Streak</p>
                   <h3 className="text-4xl lg:text-5xl font-display font-bold text-foreground">{stats.streak}</h3>
                   <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground font-medium">
                      <Calendar className="w-3 h-3" />
                      <span>Keep it up!</span>
                   </div>
                </div>
                <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shadow-lg shadow-orange-500/20">
                    <Flame className="w-8 h-8 animate-float" style={{ animationDelay: '1s' }} />
                </div>
             </div>
          </Card>

          {/* Activity Card */}
          <Card 
             className="group relative overflow-hidden min-h-[160px] flex flex-col justify-center cursor-pointer hover:scale-[1.02] transition-transform duration-300 border-0"
             onClick={() => setActiveModal('total')}
          >
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
             <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>

             <div className="relative z-10 flex items-center justify-between px-2">
                <div>
                   <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Games Played</p>
                   <h3 className="text-4xl lg:text-5xl font-display font-bold text-foreground">{stats.total}</h3>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground font-medium">
                      <Activity className="w-3 h-3" />
                      <span>Active Player</span>
                   </div>
                </div>
                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 shadow-lg shadow-blue-500/20">
                    <Activity className="w-8 h-8 animate-float" style={{ animationDelay: '2s' }} />
                </div>
             </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Performance Graph */}
        <Card className="lg:col-span-2 p-6">
           <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-foreground">Weekly Performance</h3>
                <p className="text-sm text-muted-foreground">Your average score over the last 7 days</p>
              </div>
           </div>
           
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3}/>
                     <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} opacity={0.4} />
                 <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: chartColors.text, fontSize: 11 }} 
                    dy={10}
                 />
                 <YAxis 
                    hide={false}
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: chartColors.text, fontSize: 11 }}
                    domain={[0, 100]}
                 />
                 <Tooltip 
                    cursor={{ stroke: chartColors.grid, strokeWidth: 1 }}
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                        return (
                            <div className="glass-panel p-3 rounded-xl border border-border shadow-xl">
                                <p className="text-foreground font-bold mb-1">{label}</p>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    <p className="text-sm text-muted-foreground">Score: <span className="text-foreground font-bold">{payload[0].value}%</span></p>
                                </div>
                                <p className="text-xs text-muted-foreground pl-4">Games Played: {payload[0].payload.gamesPlayed}</p>
                            </div>
                        );
                        }
                        return null;
                    }}
                 />
                 <ReferenceLine y={60} stroke={chartColors.secondary} strokeDasharray="3 3" label={{ position: 'right',  value: 'Pass', fill: chartColors.secondary, fontSize: 10 }} />
                 <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke={chartColors.primary} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    animationDuration={1500}
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </Card>

        {/* Top Categories Indicators */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-6">Most Played Categories</h3>
          <div className="space-y-6">
            {categoryData.length > 0 ? (
                categoryData.map((cat, idx) => (
                    <div key={idx} className="group">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-foreground">{cat.name}</span>
                            <span className="text-xs font-bold text-muted-foreground">{cat.count} Plays</span>
                        </div>
                        {/* Progress Bar for Accuracy/Performance */}
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${cat.accuracy}%` }}
                                transition={{ duration: 1, delay: idx * 0.2 }}
                                className={`h-full rounded-full ${
                                    idx === 0 ? 'bg-secondary shadow-[0_0_10px_rgba(236,72,153,0.5)]' : 
                                    idx === 1 ? 'bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 
                                    'bg-accent shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                                }`}
                            />
                        </div>
                        <div className="mt-1 text-right">
                            <span className="text-[10px] text-muted-foreground font-medium">Avg. Accuracy: {cat.accuracy}%</span>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-10 text-muted-foreground">
                    <Activity className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p>No games played yet.</p>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/categories')} className="mt-2 text-primary">Explore Categories</Button>
                </div>
            )}
          </div>
        </Card>
      </div>

      {/* Details Modal */}
      <Modal 
        isOpen={!!activeModal} 
        onClose={() => setActiveModal(null)}
        title={
            activeModal === 'wins' ? 'Victory Log' : 
            activeModal === 'streak' ? 'Streak History' : 
            'Gameplay Statistics'
        }
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};