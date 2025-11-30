import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Settings, CheckCircle, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PreferencesProps {
  difficulty: string;
  setDifficulty: (value: string) => void;
  questionType: string;
  setQuestionType: (value: string) => void;
}

interface QuizPreferences {
  difficulty: string;
  questionType: string;
}

export default function Preference({
  difficulty,
  setDifficulty,
  questionType,
  setQuestionType,
}: PreferencesProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showProceed, setShowProceed] = useState(false);
  const navigate = useNavigate();

  // Load saved preferences
  useEffect(() => {
    const savedPrefs = localStorage.getItem('quizPreferences');
    if (savedPrefs) {
      try {
        const prefs: QuizPreferences = JSON.parse(savedPrefs);
        setDifficulty(prefs.difficulty ?? '');
        setQuestionType(prefs.questionType ?? 'multiple');
      } catch (error) {
        console.error('Error loading saved preferences:', error);
      }
    }
  }, [setDifficulty, setQuestionType]);

  // Save preferences to localStorage
  const savePreferences = () => {
    const preferences: QuizPreferences & { savedAt: string } = {
      difficulty,
      questionType,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem('quizPreferences', JSON.stringify(preferences));
      setIsSaved(true);
      setTimeout(() => setShowProceed(true), 500);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  // Reset preferences
  const resetPreferences = () => {
    setDifficulty('');
    setQuestionType('multiple');
    setIsSaved(false);
    setShowProceed(false);
    localStorage.removeItem('quizPreferences');
  };

  const proceedToQuiz = () => navigate('/quiz');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600" />
            <div>
              <CardTitle className="text-3xl font-bold">Quiz Preferences</CardTitle>
              <CardDescription>
                Customize your quiz experience. Your settings will be applied to all new quizzes.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {isSaved && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-in fade-in duration-500">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-800">Preferences Saved Successfully!</h4>
                  <p className="text-sm text-green-700">
                    Your quiz settings have been saved. You can now proceed to the quiz or make further
                    changes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Difficulty Section */}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Difficulty Level
              </h3>
              <RadioGroup
                value={difficulty}
                onValueChange={(val) => {
                  setDifficulty(val);
                  setIsSaved(false);
                  setShowProceed(false);
                }}
                className="space-y-3"
              >
                {[
                  {
                    id: 'all',
                    value: '',
                    label: 'All Difficulties',
                    desc: 'Mix of easy, medium, and hard questions',
                    colors: ['green', 'yellow', 'red'],
                  },
                  { id: 'easy', value: 'easy', label: 'Easy', desc: 'Perfect for beginners', colors: ['green'] },
                  { id: 'medium', value: 'medium', label: 'Medium', desc: 'Balanced challenge', colors: ['green', 'yellow'] },
                  { id: 'hard', value: 'hard', label: 'Hard', desc: 'For trivia experts', colors: ['green', 'yellow', 'red'] },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <RadioGroupItem value={opt.value} id={opt.id} />
                    <div className="flex-1">
                      <Label htmlFor={opt.id} className="cursor-pointer">
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-sm text-muted-foreground mt-1">{opt.desc}</div>
                      </Label>
                    </div>
                    <div className="flex gap-1 pt-1">
                      {opt.colors.map((c, i) => (
                        <div key={i} className={`w-2 h-4 bg-${c}-400 rounded`}></div>
                      ))}
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Question Type Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                Question Type
              </h3>
              <RadioGroup
                value={questionType}
                onValueChange={(val) => {
                  setQuestionType(val);
                  setIsSaved(false);
                  setShowProceed(false);
                }}
                className="space-y-4"
              >
                <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
                  <RadioGroupItem value="multiple" id="multiple" />
                  <Label htmlFor="multiple" className="flex-1 cursor-pointer">
                    <div className="font-medium">Multiple Choice</div>
                    <div className="text-sm text-muted-foreground mt-1">Choose from 4 different options</div>
                  </Label>
                  <div className="text-2xl pt-1">🔠</div>
                </div>
                <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors">
                  <RadioGroupItem value="boolean" id="boolean" />
                  <Label htmlFor="boolean" className="flex-1 cursor-pointer">
                    <div className="font-medium">True / False</div>
                    <div className="text-sm text-muted-foreground mt-1">Simple true or false questions</div>
                  </Label>
                  <div className="text-2xl pt-1">✅❌</div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Current Settings */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">Current Settings</h4>
            <div className="text-sm text-blue-700 space-y-2">
              <p>
                <strong>Difficulty:</strong>{' '}
                {difficulty === '' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </p>
              <p>
                <strong>Question Type:</strong> {questionType === 'multiple' ? 'Multiple Choice' : 'True/False'}
              </p>
              {isSaved && (
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Settings are saved and ready to use
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button onClick={resetPreferences} variant="outline" className="sm:flex-1">
              Reset to Default
            </Button>
            <div className="flex flex-col sm:flex-row gap-3 sm:flex-1">
              <Button
                onClick={savePreferences}
                className="bg-blue-600 hover:bg-blue-700 flex-1"
                disabled={isSaved}
              >
                {isSaved ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Preferences Saved
                  </>
                ) : (
                  'Save Preferences'
                )}
              </Button>
              {showProceed && (
                <Button
                  onClick={proceedToQuiz}
                  className="bg-green-600 hover:bg-green-700 flex-1 animate-in slide-in-from-right duration-500"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Proceed to Quiz
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
