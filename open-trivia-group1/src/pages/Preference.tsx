import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuiz } from "@/context/QuizContext";
import { useNavigate } from "react-router-dom";
import { categories } from "@/data/categories";
import { 
  Settings, 
  Timer, 
  Zap, 
  Infinity as InfinityIcon, 
  Layers, 
  Gauge, 
  ArrowLeft, 
  PlayCircle,
  Hash,
  Gamepad2
} from "lucide-react";

export default function Preference() {
  const navigate = useNavigate();
  const { config, updateConfig, resetGame } = useQuiz();

  const handleSaveAndExit = () => {
    resetGame(); 
    navigate('/quiz');
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-8 animate-in fade-in zoom-in-95 duration-500">
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-primary/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center flex items-center justify-center gap-2 text-2xl">
            <Settings className="w-6 h-6 text-primary animate-[spin_3s_linear_infinite]" />
            Quiz Settings
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">Customize your challenge</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          
          {/* Game Mode */}
          <div className="space-y-2 group">
            <Label className="text-primary font-semibold flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Game Mode
            </Label>
            <Select 
              value={config.mode} 
              onValueChange={(val: any) => updateConfig("mode", val)}
            >
              <SelectTrigger className="transition-all duration-200 focus:ring-2 ring-primary/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" /> 
                    Standard (Fixed)
                  </div>
                </SelectItem>
                <SelectItem value="time_attack">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-red-500" /> 
                    Time Attack
                  </div>
                </SelectItem>
                <SelectItem value="endless">
                  <div className="flex items-center gap-2">
                    <InfinityIcon className="w-4 h-4 text-blue-500" /> 
                    Endless Mode
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            {/* Dynamic Description Box */}
            <div className="bg-muted/50 p-3 rounded-md text-xs text-muted-foreground border-l-4 border-primary transition-all duration-300">
              {config.mode === 'standard' && "Classic mode. Answer a set number of questions at your own pace."}
              {config.mode === 'time_attack' && "Speed run! Get the highest score possible before the timer runs out."}
              {config.mode === 'endless' && "Survival mode. Play continuously until you decide to stop or get bored."}
            </div>
          </div>

          {/* Time Limit (Only for Time Attack) */}
          {config.mode === 'time_attack' && (
             <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
             <Label className="flex items-center gap-2">
               <Timer className="w-4 h-4" />
               Time Limit (Seconds)
             </Label>
             <Input 
               type="number" 
               min={10} max={300} step={10}
               className="font-mono"
               value={config.timeLimit} 
               onChange={(e) => updateConfig("timeLimit", parseInt(e.target.value) || 60)} 
             />
           </div>
          )}

          {/* Amount (Only for Standard) */}
          {config.mode === 'standard' && (
            <div className="space-y-2 animate-in slide-in-from-top-2 fade-in duration-300">
              <Label className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Number of Questions
              </Label>
              <Input 
                type="number" 
                min={1} max={50}
                value={config.amount} 
                onChange={(e) => updateConfig("amount", parseInt(e.target.value) || 10)} 
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Category
              </Label>
              <Select 
                value={config.category ? String(config.category) : "any"} 
                onValueChange={(val) => updateConfig("category", val === "any" ? null : Number(val))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Category</SelectItem>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Difficulty
              </Label>
              <Select 
                value={config.difficulty} 
                onValueChange={(val) => updateConfig("difficulty", val)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Difficulty</SelectItem>
                  <SelectItem value="easy" className="text-green-600">Easy</SelectItem>
                  <SelectItem value="medium" className="text-yellow-600">Medium</SelectItem>
                  <SelectItem value="hard" className="text-red-600">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

        </CardContent>
        <CardFooter className="justify-between pt-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="gap-2 hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            
            <Button 
              onClick={handleSaveAndExit}
              className="gap-2 bg-primary hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
            >
              Start Quiz <PlayCircle className="w-4 h-4" />
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}