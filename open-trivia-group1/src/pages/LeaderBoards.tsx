import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  Target, 
  Award, 
  ArrowLeft,
  Shield,
  Zap,
  Search,
  ArrowUpDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// --- Types ---
type HistoryLog = {
  id: string;
  category: string;
  difficulty: string;
  isCorrect: boolean;
};

type Player = {
  id: string;
  name: string;
  avatarColor: string;
  totalAnswered: number;
  accuracy: number;
  score: number;
  isUser: boolean;
};

type DifficultyStats = {
  easy: number;
  medium: number;
  hard: number;
};

type SortField = 'score' | 'accuracy' | 'totalAnswered';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<Player[]>([]);
  const [filteredData, setFilteredData] = useState<Player[]>([]);
  const [userRank, setUserRank] = useState<number>(0);
  const [difficultyBreakdown, setDifficultyBreakdown] = useState<DifficultyStats>({ easy: 0, medium: 0, hard: 0 });
  
  // Interactivity States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    generateLeaderboard();
  }, []);

  // Handle Search and Sort
  useEffect(() => {
    let result = [...leaderboardData];

    // 1. Search Filter
    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // 2. Sorting
    result.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });

    setFilteredData(result);
  }, [leaderboardData, searchQuery, sortField, sortDirection]);

  const generateLeaderboard = () => {
    const storedHistory = localStorage.getItem("quiz_history");
    const history: HistoryLog[] = storedHistory ? JSON.parse(storedHistory) : [];

    const totalAnswered = history.length;
    const correctCount = history.filter(h => h.isCorrect).length;
    const accuracy = totalAnswered > 0 ? (correctCount / totalAnswered) : 0;
    
    // Formula: Total Answered * Accuracy * 10
    const userScore = Math.floor(totalAnswered * accuracy * 10); 

    const userPlayer: Player = {
      id: "user-current",
      name: "You",
      avatarColor: "bg-primary",
      totalAnswered,
      accuracy: Math.round(accuracy * 100),
      score: userScore,
      isUser: true,
    };

    const bots: Player[] = [
      { id: "bot-1", name: "TriviaTitan", avatarColor: "bg-red-500", totalAnswered: 150, accuracy: 85, score: 0, isUser: false },
      { id: "bot-2", name: "QuizWizard", avatarColor: "bg-blue-500", totalAnswered: 80, accuracy: 92, score: 0, isUser: false },
      { id: "bot-3", name: "FastFinger", avatarColor: "bg-green-500", totalAnswered: 200, accuracy: 60, score: 0, isUser: false },
      { id: "bot-4", name: "Brainiac", avatarColor: "bg-yellow-500", totalAnswered: 45, accuracy: 98, score: 0, isUser: false },
      { id: "bot-5", name: "NovicePlayer", avatarColor: "bg-purple-500", totalAnswered: 20, accuracy: 40, score: 0, isUser: false },
      { id: "bot-6", name: "AverageJoe", avatarColor: "bg-orange-500", totalAnswered: 60, accuracy: 50, score: 0, isUser: false },
      { id: "bot-7", name: "SpeedDemon", avatarColor: "bg-pink-500", totalAnswered: 110, accuracy: 75, score: 0, isUser: false },
      { id: "bot-8", name: "LogicMaster", avatarColor: "bg-cyan-500", totalAnswered: 95, accuracy: 88, score: 0, isUser: false },
    ].map(bot => ({
      ...bot,
      score: Math.floor(bot.totalAnswered * (bot.accuracy / 100) * 10)
    }));

    const allPlayers = [...bots, userPlayer].sort((a, b) => b.score - a.score);
    
    setLeaderboardData(allPlayers);
    setFilteredData(allPlayers);
    setUserRank(allPlayers.findIndex(p => p.isUser) + 1);

    const breakdown = history.reduce((acc, curr) => {
      if (curr.isCorrect) {
        if (curr.difficulty === 'easy') acc.easy++;
        if (curr.difficulty === 'medium') acc.medium++;
        if (curr.difficulty === 'hard') acc.hard++;
      }
      return acc;
    }, { easy: 0, medium: 0, hard: 0 });

    setDifficultyBreakdown(breakdown);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getRankIcon = (index: number) => {
    // Note: index is 0-based for the filtered array. 
    // We only show trophies if we are sorting by score descending (default view)
    if (sortField !== 'score' || sortDirection !== 'desc') return <span className="font-bold text-muted-foreground w-6 text-center">{index + 1}</span>;

    switch(index) {
      case 0: return <Crown className="h-6 w-6 text-yellow-500 fill-yellow-500 animate-[bounce_2s_infinite]" />;
      case 1: return <Medal className="h-6 w-6 text-gray-400 fill-gray-400" />;
      case 2: return <Medal className="h-6 w-6 text-amber-700 fill-amber-700" />;
      default: return <span className="font-bold text-muted-foreground w-6 text-center">{index + 1}</span>;
    }
  };

  const user = leaderboardData.find(p => p.isUser);

  // Helper for Podium
  const topThree = [...leaderboardData].sort((a, b) => b.score - a.score).slice(0, 3);
  // Reorder for visual podium: 2nd, 1st, 3rd
  const podiumOrder = [topThree[1], topThree[0], topThree[2]]; 

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Navigation */}
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 hover:bg-secondary">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white shadow-2xl p-8 md:p-12">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Trophy className="h-64 w-64 rotate-12" />
        </div>
        
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 z-10">
          <div className="space-y-4 text-center md:text-left max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 text-sm font-medium">
              <Shield className="h-4 w-4" /> Season 1 Rankings
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Global Leaderboard
            </h1>
            <p className="text-slate-300 text-lg">
              Compete against the best! Your ranking is determined by your <span className="text-indigo-400 font-bold">Efficiency Score</span>.
            </p>
          </div>

          {/* PODIUM VISUALIZATION */}
          <div className="flex items-end justify-center gap-2 md:gap-4 h-48 md:h-64 pb-4">
             {podiumOrder.map((player, idx) => {
               if(!player) return null;
               // Heights: 2nd (h-32), 1st (h-48), 3rd (h-24)
               let height = "h-32 md:h-40"; // 2nd
               let color = "bg-slate-400";
               let rank = 2;
               if (idx === 1) { height = "h-44 md:h-56"; color = "bg-yellow-500"; rank = 1; } // 1st
               if (idx === 2) { height = "h-24 md:h-32"; color = "bg-amber-700"; rank = 3; } // 3rd

               return (
                 <div key={player.id} className="flex flex-col items-center group relative">
                    <div className={`mb-2 font-bold text-sm md:text-base ${player.isUser ? "text-indigo-400" : "text-slate-300"}`}>
                      {player.name}
                    </div>
                    {/* Avatar on top */}
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-slate-900 absolute -top-12 md:-top-14 flex items-center justify-center text-white font-bold shadow-lg z-20 ${player.avatarColor}`}>
                      {player.name.substring(0,2).toUpperCase()}
                    </div>
                    {/* Bar */}
                    <div className={`${height} w-16 md:w-24 rounded-t-lg ${color} bg-opacity-90 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-end justify-center pb-2 text-white font-black text-2xl md:text-4xl border-t border-white/20 relative group-hover:brightness-110 transition-all`}>
                      <span className="opacity-50 select-none">{rank}</span>
                    </div>
                 </div>
               )
             })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- MAIN RANKING TABLE --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Rankings
            </h2>
            
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Find player..." 
                className="pl-9 bg-card" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="py-4 px-6 text-left font-medium text-muted-foreground w-[80px]">Rank</th>
                    <th className="py-4 px-6 text-left font-medium text-muted-foreground">Player</th>
                    
                    {/* Sortable Headers */}
                    <th 
                      className="py-4 px-6 text-center font-medium text-muted-foreground cursor-pointer hover:text-primary transition-colors group"
                      onClick={() => handleSort('totalAnswered')}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Answered <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                      </div>
                    </th>
                    <th 
                      className="py-4 px-6 text-center font-medium text-muted-foreground cursor-pointer hover:text-primary transition-colors group"
                      onClick={() => handleSort('accuracy')}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Accuracy <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                      </div>
                    </th>
                    <th 
                      className="py-4 px-6 text-right font-medium text-muted-foreground cursor-pointer hover:text-primary transition-colors group"
                      onClick={() => handleSort('score')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Score <ArrowUpDown className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-muted-foreground">No players found.</td>
                    </tr>
                  ) : (
                    filteredData.map((player, index) => (
                      <tr 
                        key={player.id} 
                        className={`
                          border-b last:border-0 transition-colors animate-in slide-in-from-left-2 duration-300
                          ${player.isUser ? "bg-primary/5 hover:bg-primary/10 border-l-4 border-l-primary" : "hover:bg-muted/50"}
                        `}
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background shadow-sm border font-bold">
                            {getRankIcon(index)}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${player.avatarColor}`}>
                              {player.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className={`font-semibold ${player.isUser ? "text-primary" : ""}`}>
                                {player.name} {player.isUser && "(You)"}
                              </p>
                              {player.isUser && (
                                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase tracking-wide">
                                  It's You
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center font-medium text-muted-foreground">{player.totalAnswered}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`
                            inline-flex items-center px-2 py-1 rounded-md text-xs font-bold
                            ${player.accuracy >= 90 ? 'bg-green-100 text-green-700' : 
                              player.accuracy >= 70 ? 'bg-blue-100 text-blue-700' : 
                              player.accuracy >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}
                          `}>
                            {player.accuracy}%
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-mono font-bold text-lg">{player.score}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* --- PERFORMANCE BREAKDOWN SIDEBAR --- */}
        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Your Rank</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-black text-primary">#{userRank > 0 ? userRank : "-"}</span>
                 <span className="text-sm text-muted-foreground">Global</span>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl font-bold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Your Mastery
          </h2>

          {/* Difficulty Cards */}
          <div className="grid gap-4">
            <Card className="group relative overflow-hidden border-green-200 bg-green-50/50 hover:bg-green-50 transition-colors cursor-default">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-700 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="h-4 w-4" /> Easy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-green-800">
                  {difficultyBreakdown.easy}
                </div>
                <p className="text-xs text-green-600 font-medium">Correct Answers</p>
              </CardContent>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Zap className="h-24 w-24 text-green-600" />
              </div>
            </Card>

            <Card className="group relative overflow-hidden border-yellow-200 bg-yellow-50/50 hover:bg-yellow-50 transition-colors cursor-default">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-yellow-700 uppercase tracking-wider flex items-center gap-2">
                  <Target className="h-4 w-4" /> Medium
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-yellow-800">
                  {difficultyBreakdown.medium}
                </div>
                <p className="text-xs text-yellow-600 font-medium">Correct Answers</p>
              </CardContent>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Target className="h-24 w-24 text-yellow-600" />
              </div>
            </Card>

            <Card className="group relative overflow-hidden border-red-200 bg-red-50/50 hover:bg-red-50 transition-colors cursor-default">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-700 uppercase tracking-wider flex items-center gap-2">
                  <Award className="h-4 w-4" /> Hard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-red-800">
                  {difficultyBreakdown.hard}
                </div>
                <p className="text-xs text-red-600 font-medium">Correct Answers</p>
              </CardContent>
              <div className="absolute right-[-10px] bottom-[-10px] opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Award className="h-24 w-24 text-red-600" />
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How is this calculated?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your <strong>Efficiency Score</strong> is calculated by multiplying your Total Questions Answered by your Accuracy Percentage.
              </p>
              <Separator className="my-3" />
              <p className="text-xs text-muted-foreground">
                Example: 100 questions at 50% accuracy = <span className="font-mono text-primary">500 Points</span>.
              </p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}