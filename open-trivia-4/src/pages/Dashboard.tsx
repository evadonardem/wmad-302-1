import React, { useEffect, useState } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '../components/ui/carousel';
import axios from 'axios';
import { Star, StarOff, Settings, RefreshCw, Trophy, Award, Target, Home, BarChart3, Play, Filter, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Progress } from '../components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

interface Question {
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
    category: string;
    difficulty: string;
    type: string;
}

interface AnsweredQuestion extends Question {
    selectedAnswer: string;
    isCorrect: boolean;
}

interface FavoriteQuestion extends Question {
    id: string;
}

interface DashboardProps {
    difficulty: string;
    questionType: string;
}

const Dashboard = ({ difficulty, questionType }: DashboardProps) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [favoriteQuestions, setFavoriteQuestions] = useState<Set<string>>(new Set());
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('quiz');
    const navigate = useNavigate();

    // Sample questions as fallback
    const sampleQuestions: Question[] = [
        {
            question: "What is the capital of France?",
            correct_answer: "Paris",
            incorrect_answers: ["London", "Berlin", "Madrid"],
            category: "Geography",
            difficulty: "easy",
            type: "multiple"
        },
        {
            question: "Which planet is known as the Red Planet?",
            correct_answer: "Mars",
            incorrect_answers: ["Venus", "Jupiter", "Saturn"],
            category: "Science",
            difficulty: "easy",
            type: "multiple"
        },
        {
            question: "What is 2 + 2?",
            correct_answer: "4",
            incorrect_answers: ["3", "5", "6"],
            category: "Mathematics",
            difficulty: "easy",
            type: "multiple"
        },
        {
            question: "The Great Wall of China is visible from space.",
            correct_answer: "False",
            incorrect_answers: ["True"],
            category: "History",
            difficulty: "medium",
            type: "boolean"
        },
        {
            question: "Which element has the chemical symbol 'O'?",
            correct_answer: "Oxygen",
            incorrect_answers: ["Gold", "Silver", "Iron"],
            category: "Science",
            difficulty: "easy",
            type: "multiple"
        }
    ];

    useEffect(() => {
        const savedCategory = localStorage.getItem("selectedCategory");
        if (savedCategory) {
            try {
                const parsedCategory = JSON.parse(savedCategory);
                setSelectedCategory(parsedCategory);
            } catch (err) {
                console.error("Error parsing saved category:", err);
            }
        }
    }, []);

    useEffect(() => {
        fetchQuestions();
    }, [difficulty, questionType, selectedCategory]);

    useEffect(() => {
        const raw = localStorage.getItem('favoriteQuestions');
        if (raw) {
            try {
                const favs: FavoriteQuestion[] = JSON.parse(raw);
                const questionIds = favs.map((q: FavoriteQuestion) => q.id);
                setFavoriteQuestions(new Set(questionIds));
            } catch (err) {
                console.error("Error parsing favorite questions:", err);
            }
        }
    }, []);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            setError(null);
            setAnsweredQuestions([]);
            setCurrentQuestionIndex(0);
            setQuizCompleted(false);

            let apiUrl = `https://opentdb.com/api.php?amount=10`;
            
            if (questionType && questionType !== 'any') {
                apiUrl += `&type=${questionType}`;
            }
            
            if (difficulty && difficulty !== 'any') {
                apiUrl += `&difficulty=${difficulty}`;
            }
            
            if (selectedCategory && selectedCategory !== 'any' && selectedCategory !== 'null') {
                apiUrl += `&category=${selectedCategory}`;
            }

            const response = await axios.get(apiUrl);

            if (response.data.results && response.data.results.length > 0) {
                setQuestions(response.data.results);
                return;
            } else {
                throw new Error('No questions found with current filters.');
            }

        } catch (err: any) {
            console.error("Error fetching questions:", err);
            
            let filteredSamples = sampleQuestions;
            
            if (questionType && questionType !== 'any') {
                filteredSamples = filteredSamples.filter(q => q.type === questionType);
            }
            if (difficulty && difficulty !== 'any') {
                filteredSamples = filteredSamples.filter(q => q.difficulty === difficulty);
            }
            
            if (filteredSamples.length > 0) {
                setQuestions(filteredSamples);
                setError('Using sample questions. Some features may be limited.');
            } else {
                setQuestions(sampleQuestions);
                setError('Using default sample questions.');
            }
        } finally {
            setLoading(false);
        }
    };

    const decodeHTML = (html: string) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    const shuffleArray = (array: string[]) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const handleAnswerClick = (answer: string, question: Question) => {
        if (answeredQuestions.some(aq => aq.question === question.question)) return;

        const isCorrect = answer === question.correct_answer;
        const answeredQuestion: AnsweredQuestion = { 
            ...question, 
            selectedAnswer: answer, 
            isCorrect 
        };
        
        setAnsweredQuestions(prev => [...prev, answeredQuestion]);

        if (currentQuestionIndex < questions.length - 1) {
            setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 1500);
        } else {
            setTimeout(() => setQuizCompleted(true), 1500);
        }
    };

    const getAnswerColor = (answer: string, question: Question) => {
        const answeredQuestion = answeredQuestions.find(aq => aq.question === question.question);
        if (!answeredQuestion) return 'border-gray-200 hover:border-blue-300 hover:bg-blue-50';
        if (answer === question.correct_answer) return 'bg-green-500 text-white border-green-600 shadow-lg scale-105';
        if (answer === answeredQuestion.selectedAnswer && answer !== question.correct_answer) return 'bg-red-500 text-white border-red-600';
        return 'border-gray-200 bg-gray-100 opacity-70';
    };

    const toggleFavoriteQuestion = (question: Question) => {
        const questionId = btoa(question.question);
        const raw = localStorage.getItem('favoriteQuestions');
        let currentFavorites: FavoriteQuestion[] = [];
        
        try {
            if (raw) {
                currentFavorites = JSON.parse(raw);
            }
        } catch (err) {
            console.error("Error parsing favorites:", err);
        }

        if (favoriteQuestions.has(questionId)) {
            const updatedFavorites = currentFavorites.filter((q: FavoriteQuestion) => q.id !== questionId);
            localStorage.setItem('favoriteQuestions', JSON.stringify(updatedFavorites));
            setFavoriteQuestions(prev => {
                const next = new Set(prev);
                next.delete(questionId);
                return next;
            });
        } else {
            const newFavorite: FavoriteQuestion = { 
                id: questionId, 
                ...question 
            };
            const updatedFavorites = [...currentFavorites, newFavorite];
            localStorage.setItem('favoriteQuestions', JSON.stringify(updatedFavorites));
            setFavoriteQuestions(prev => new Set(prev).add(questionId));
        }
    };

    const resetQuiz = () => { 
        setAnsweredQuestions([]); 
        setCurrentQuestionIndex(0); 
        setQuizCompleted(false); 
        fetchQuestions(); 
    };

    const clearCategory = () => { 
        setSelectedCategory(null); 
        localStorage.removeItem("selectedCategory"); 
        fetchQuestions(); 
    };

    const goToPreferences = () => navigate('/preferences');
    const goToCategories = () => navigate('/categories');
    const goToDashboard = () => navigate('/dashboard');

    const getDifficultyBadgeColor = (diff: string) => {
        switch (diff) {
            case 'easy': return 'bg-green-100 text-green-800 border-green-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'hard': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const score = answeredQuestions.filter(q => q.isCorrect).length;
    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    const getScoreMessage = () => {
        if (percentage === 100) return { message: 'Perfect Score! 🎉', color: 'text-green-600', icon: Trophy, bg: 'bg-green-50' };
        if (percentage >= 80) return { message: 'Excellent! 🏆', color: 'text-blue-600', icon: Award, bg: 'bg-blue-50' };
        if (percentage >= 60) return { message: 'Good Job! 👍', color: 'text-yellow-600', icon: Target, bg: 'bg-yellow-50' };
        if (percentage >= 40) return { message: 'Not Bad! 💪', color: 'text-orange-600', icon: Target, bg: 'bg-orange-50' };
        return { message: 'Keep Practicing! 📚', color: 'text-red-600', icon: RefreshCw, bg: 'bg-red-50' };
    };

    const scoreInfo = getScoreMessage();
    const ScoreIcon = scoreInfo.icon;

    if (quizCompleted) {
        return (
            <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-green-50">
                <div className="max-w-4xl mx-auto">
                    <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-8 text-center">
                            <div className="flex justify-center mb-6">
                                <div className={`p-4 rounded-full ${scoreInfo.bg}`}>
                                    <ScoreIcon className={`w-16 h-16 ${scoreInfo.color}`} />
                                </div>
                            </div>
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
                                Quiz Completed!
                            </h1>
                            <p className={`text-2xl font-semibold mb-8 ${scoreInfo.color}`}>
                                {scoreInfo.message}
                            </p>
                            
                            <div className="mb-8">
                                <div className="text-7xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                                    {score}<span className="text-3xl text-gray-500">/{totalQuestions}</span>
                                </div>
                                <div className="text-2xl font-semibold text-gray-600 mb-4">{percentage}%</div>
                                <Progress value={percentage} className="h-4 bg-gray-200" />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <Card className="border-green-200 bg-green-50">
                                    <CardContent className="p-4">
                                        <div className="text-3xl font-bold text-green-600">{score}</div>
                                        <div className="text-sm text-green-700 font-medium">Correct Answers</div>
                                    </CardContent>
                                </Card>
                                <Card className="border-red-200 bg-red-50">
                                    <CardContent className="p-4">
                                        <div className="text-3xl font-bold text-red-600">{totalQuestions - score}</div>
                                        <div className="text-sm text-red-700 font-medium">Incorrect Answers</div>
                                    </CardContent>
                                </Card>
                                <Card className="border-blue-200 bg-blue-50">
                                    <CardContent className="p-4">
                                        <div className="text-3xl font-bold text-blue-600">{percentage}%</div>
                                        <div className="text-sm text-blue-700 font-medium">Success Rate</div>
                                    </CardContent>
                                </Card>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button onClick={resetQuiz} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                                    <RefreshCw className="w-5 h-5 mr-2" />New Quiz
                                </Button>
                                <Button onClick={goToPreferences} variant="outline" className="px-8 py-3 border-2">
                                    <Settings className="w-5 h-5 mr-2" />Change Preferences
                                </Button>
                                <Button onClick={goToDashboard} variant="outline" className="px-8 py-3 border-2">
                                    <BarChart3 className="w-5 h-5 mr-2" />View Dashboard
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
                    <CardContent className="p-8">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            <div className="flex-1">
                                <h1 className="text-4xl md:text-5xl font-bold mb-2">Quiz Challenge</h1>
                                <p className="text-blue-100 text-lg md:text-xl">
                                    Test your knowledge with trivia questions from various categories
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button 
                                    onClick={resetQuiz}
                                    variant="secondary"
                                    size="lg"
                                    className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                                >
                                    <RefreshCw className="w-5 h-5 mr-2" />New Quiz
                                </Button>
                                <Button 
                                    onClick={goToPreferences}
                                    variant="secondary"
                                    size="lg"
                                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                                >
                                    <Settings className="w-5 h-5 mr-2" />Settings
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Current Settings */}
                        <Card className="border-2 border-blue-100">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Filter className="w-5 h-5" />
                                    Current Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Question Type</label>
                                    <div className="mt-1 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <span className="font-medium text-blue-800">
                                            {questionType === 'multiple' ? 'Multiple Choice' : 
                                             questionType === 'boolean' ? 'True/False' : 'Any Type'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Difficulty</label>
                                    <div className="mt-1 p-3 bg-green-50 rounded-lg border border-green-200">
                                        <span className="font-medium text-green-800">
                                            {difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : 'All Levels'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Category</label>
                                    <div className="mt-1 p-3 bg-purple-50 rounded-lg border border-purple-200">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-purple-800">
                                                {selectedCategory || 'All Categories'}
                                            </span>
                                            {selectedCategory && (
                                                <Button
                                                    onClick={clearCategory}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 hover:bg-purple-200"
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Progress */}
                        <Card className="border-2 border-green-100">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <BarChart3 className="w-5 h-5" />
                                    Progress
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Completed</span>
                                        <span className="font-medium">{answeredQuestions.length}/{questions.length}</span>
                                    </div>
                                    <Progress value={(answeredQuestions.length / questions.length) * 100} className="h-2" />
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Score</span>
                                        <span className="font-medium text-green-600">{score}/{questions.length}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quiz Content */}
                    <div className="lg:col-span-3">
                        <Card className="shadow-lg border-0">
                            <CardContent className="p-6">
                                {loading && (
                                    <div className="text-center py-12">
                                        <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
                                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Questions</h3>
                                        <p className="text-gray-500">Preparing your quiz experience...</p>
                                    </div>
                                )}

                                {error && !loading && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                                        <div className="flex items-center gap-3">
                                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                                            <div className="flex-1">
                                                <p className="text-yellow-700 font-medium">{error}</p>
                                            </div>
                                            <Button onClick={fetchQuestions} variant="outline" size="sm">
                                                <RefreshCw className="w-4 h-4 mr-2" />Retry
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {questions.length > 0 && !loading && (
                                    <div className="space-y-6">
                                        {/* Question Header */}
                                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <Badge variant="secondary" className="text-sm">
                                                    Question {currentQuestionIndex + 1} of {questions.length}
                                                </Badge>
                                                <div className="text-sm font-medium text-gray-600">
                                                    Score: <span className="text-green-600">{score}</span>
                                                </div>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => toggleFavoriteQuestion(questions[currentQuestionIndex])}
                                            >
                                                {favoriteQuestions.has(btoa(questions[currentQuestionIndex].question)) ? 
                                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" /> : 
                                                    <Star className="w-5 h-5 text-gray-400 hover:text-yellow-400" />
                                                }
                                            </Button>
                                        </div>

                                        {/* Question Card */}
                                        <Card className="border-2 border-blue-100">
                                            <CardContent className="p-6">
                                                {questions[currentQuestionIndex] && (
                                                    <>
                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            <Badge className={getDifficultyBadgeColor(questions[currentQuestionIndex].difficulty)}>
                                                                {questions[currentQuestionIndex].difficulty.charAt(0).toUpperCase() + questions[currentQuestionIndex].difficulty.slice(1)}
                                                            </Badge>
                                                            <Badge variant="outline">
                                                                {questions[currentQuestionIndex].type === 'boolean' ? 'True/False' : 'Multiple Choice'}
                                                            </Badge>
                                                            <Badge variant="secondary">
                                                                {decodeHTML(questions[currentQuestionIndex].category)}
                                                            </Badge>
                                                        </div>
                                                        
                                                        <h2 className="text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
                                                            {decodeHTML(questions[currentQuestionIndex].question)}
                                                        </h2>

                                                        <div className="space-y-3">
                                                            {shuffleArray([...questions[currentQuestionIndex].incorrect_answers, questions[currentQuestionIndex].correct_answer])
                                                                .map((answer, idx) => (
                                                                    <button
                                                                        key={idx}
                                                                        onClick={() => handleAnswerClick(answer, questions[currentQuestionIndex])}
                                                                        disabled={answeredQuestions.some(aq => aq.question === questions[currentQuestionIndex].question)}
                                                                        className={`w-full p-4 text-left border-2 rounded-xl transition-all duration-300 font-medium ${getAnswerColor(answer, questions[currentQuestionIndex])} ${!answeredQuestions.some(aq => aq.question === questions[currentQuestionIndex].question) ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}`}
                                                                    >
                                                                        {decodeHTML(answer)}
                                                                    </button>
                                                                ))}
                                                        </div>
                                                    </>
                                                )}
                                            </CardContent>
                                        </Card>

                                        {/* Navigation */}
                                        <div className="flex justify-between items-center">
                                            <Button
                                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                                disabled={currentQuestionIndex === 0}
                                                variant="outline"
                                            >
                                                Previous
                                            </Button>
                                            <div className="flex gap-2">
                                                {questions.map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className={`w-3 h-3 rounded-full transition-all ${
                                                            index === currentQuestionIndex 
                                                                ? 'bg-blue-600 scale-125' 
                                                                : answeredQuestions.some(aq => aq.question === questions[index]?.question)
                                                                ? 'bg-green-500'
                                                                : 'bg-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <Button
                                                onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                                disabled={currentQuestionIndex === questions.length - 1}
                                                variant="outline"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {questions.length === 0 && !loading && !error && (
                                    <div className="text-center py-12">
                                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Play className="w-12 h-12 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Questions Available</h3>
                                        <p className="text-gray-500 mb-6">Try adjusting your preferences or choose a different category.</p>
                                        <div className="flex gap-3 justify-center">
                                            <Button onClick={goToCategories}>Choose Category</Button>
                                            <Button onClick={goToPreferences} variant="outline">
                                                <Settings className="w-4 h-4 mr-2" />Preferences
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Add missing AlertCircle component
const AlertCircle = ({ className }: { className?: string }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);

export default Dashboard;