import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  History, 
  Trophy, 
  Target, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RefreshCcw,
  BrainCircuit,
  Dna
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// --- Types ---
type HistoryLog = {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timestamp: number;
};

type CategoryStat = {
  name: string;
  total: number;
  correct: number;
  percentage: number;
  status: 'Master' | 'Proficient' | 'Learning';
};

// --- Constants ---
const HISTORY_KEY = "quiz_history";

export default function Dashboard() {
  const [logs, setLogs] = useState<HistoryLog[]>([]);
  const [stats, setStats] = useState<CategoryStat[]>([]);
  const [overall, setOverall] = useState({ total: 0, accuracy: 0, score: 0 });
  const [loading, setLoading] = useState(true);

  // --- Logic: Load and Calculate Stats ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      const parsedLogs: HistoryLog[] = stored ? JSON.parse(stored) : [];
      
      setLogs(parsedLogs);
      calculateStats(parsedLogs);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: HistoryLog[]) => {
    if (data.length === 0) {
      setOverall({ total: 0, accuracy: 0, score: 0 });
      setStats([]);
      return;
    }

    // 1. Overall Stats
    const total = data.length;
    const correctCount = data.filter(l => l.isCorrect).length;
    const accuracy = Math.round((correctCount / total) * 100);
    
    // 2. Category Breakdown
    const catMap: Record<string, { total: number; correct: number }> = {};
    
    data.forEach(log => {
      const catName = log.category || "General";
      if (!catMap[catName]) {
        catMap[catName] = { total: 0, correct: 0 };
      }
      catMap[catName].total += 1;
      if (log.isCorrect) {
        catMap[catName].correct += 1;
      }
    });

    const categoryStats: CategoryStat[] = Object.keys(catMap).map(cat => {
      const { total, correct } = catMap[cat];
      const pct = Math.round((correct / total) * 100);
      
      let status: CategoryStat['status'] = 'Learning';
      if (pct >= 80 && total >= 3) status = 'Master';
      else if (pct >= 50) status = 'Proficient';

      return {
        name: cat,
        total,
        correct,
        percentage: pct,
        status
      };
    }).sort((a, b) => b.percentage - a.percentage); // Sort best categories first

    setStats(categoryStats);
    setOverall({ total, accuracy, score: correctCount * 10 });
  };

  // --- Demo Data Generator (For Visualization) ---
  const generateDemoData = () => {
    const categoriesList = ["Science: Computers", "Geography", "History", "Entertainment: Film", "Mythology"];
    const difficulties = ["easy", "medium", "hard"];
    const newLogs: HistoryLog[] = Array.from({ length: 20 }).map((_, i) => {
      const isCorrect = Math.random() > 0.4;
      return {
        id: crypto.randomUUID(),
        question: `Demo Question #${i + 1} generated for statistics preview...`,
        category: categoriesList[Math.floor(Math.random() * categoriesList.length)],
        difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
        userAnswer: "A",
        correctAnswer: isCorrect ? "A" : "B",
        isCorrect,
        timestamp: Date.now() - Math.floor(Math.random() * 100000000)
      };
    }).sort((a, b) => b.timestamp - a.timestamp);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(newLogs));
    loadData();
  };

  const clearHistory = () => {
    if (confirm("Are you sure? This will wipe all your progress statistics.")) {
      localStorage.removeItem(HISTORY_KEY);
      loadData();
    }
  };

  const getStatusStyles = (status: CategoryStat['status']) => {
    switch (status) {
      case 'Master': return "bg-green-100 text-green-700 border-green-200";
      case 'Proficient': return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Quiz Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your learning progress and identify your strengths.
          </p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={generateDemoData} title="Populate with fake data to test UI">
             Generate Demo Data
           </Button>
           <Button variant="destructive" size="icon" onClick={clearHistory} title="Clear History">
             <RefreshCcw className="h-4 w-4" />
           </Button>
           <Link to="/quiz">
             <Button className="gap-2 shadow-lg hover:scale-105 transition-transform">
               Start New Quiz <ArrowRight className="h-4 w-4" />
             </Button>
           </Link>
        </div>
      </div>

      <Separator />

      {/* 2. Top Level Stats (Cards) */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card hover:shadow-lg transition-all duration-300 cursor-default">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overall.total}</div>
            <p className="text-xs text-muted-foreground">Lifetime answered</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${overall.accuracy >= 70 ? 'text-green-600' : overall.accuracy >= 40 ? 'text-yellow-600' : 'text-red-500'}`}>
              {overall.accuracy}%
            </div>
            <p className="text-xs text-muted-foreground">Correct answer rate</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Knowledge Score</CardTitle>
            <BrainCircuit className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overall.score}</div>
            <p className="text-xs text-muted-foreground">Experience points (XP)</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-7">
        
        {/* Left Col: Category Performance */}
        <Card className="md:col-span-4 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Category Performance
            </CardTitle>
            <CardDescription>
              Breakdown of how well you know each subject.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {stats.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground flex flex-col items-center">
                <Dna className="h-10 w-10 mb-2 opacity-20" />
                <p>No data available yet.</p>
                <p className="text-sm">Complete a quiz to see your strengths!</p>
              </div>
            ) : (
              stats.map((stat, i) => (
                <div key={stat.name} className="space-y-2 animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium flex items-center gap-2">
                      {stat.name}
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${getStatusStyles(stat.status)}`}>
                        {stat.status}
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      {stat.correct}/{stat.total} ({stat.percentage}%)
                    </div>
                  </div>
                  <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        stat.percentage >= 80 ? 'bg-green-500' : 
                        stat.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-400'
                      }`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Right Col: Recent Activity Logs */}
        <Card className="md:col-span-3 shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest quiz results.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto max-h-[500px] pr-2">
            <div className="space-y-4">
              {logs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No questions answered yet.
                </p>
              ) : (
                logs.slice(0, 20).map((log, i) => ( 
                  <div key={log.id} className="flex gap-3 p-3 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors animate-in fade-in slide-in-from-right-4 duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="mt-1 shrink-0">
                      {log.isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-medium leading-tight truncate" title={log.question}>
                        {log.question}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="truncate max-w-[120px]">{log.category}</span>
                        <span>•</span>
                        <span className={`capitalize ${
                           log.difficulty === 'hard' ? 'text-red-500 font-medium' : 
                           log.difficulty === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {log.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
          {logs.length > 0 && (
            <CardFooter className="pt-2">
              <p className="text-xs text-muted-foreground w-full text-center">
                Showing last {Math.min(logs.length, 20)} items
              </p>
            </CardFooter>
          )}
        </Card>

      </div>
    </div>
  );
}