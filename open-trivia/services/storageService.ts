import { GameResult, FavoriteQuestion, FormattedQuestion } from '../types';

const STORAGE_KEY = 'trivia_history';
const FAVORITES_KEY = 'trivia_favorites';

// -- GAME HISTORY --

export const saveGameResult = (result: Omit<GameResult, 'id' | 'date'>) => {
  const history = getGameHistory();
  const newResult: GameResult = {
    ...result,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  history.push(newResult);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return newResult;
};

export const getGameHistory = (): GameResult[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const getWeeklyStats = () => {
  const history = getGameHistory();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayName = `${days[d.getDay()]} ${d.getDate()}`; // e.g. "Mon 24"
    const dateStr = d.toLocaleDateString();

    // Filter games for this day
    const dayGames = history.filter(g => new Date(g.date).toLocaleDateString() === dateStr);
    
    // Calculate average accuracy score (0-100)
    const avgScore = dayGames.length > 0 
      ? Math.round(dayGames.reduce((acc, g) => acc + (g.score / g.totalQuestions) * 100, 0) / dayGames.length)
      : 0;

    last7Days.push({ 
      name: dayName, 
      score: avgScore, 
      gamesPlayed: dayGames.length 
    });
  }
  return last7Days;
};

export const getCategoryStats = () => {
  const history = getGameHistory();
  const stats: Record<string, { count: number, totalScore: number, totalQuestions: number }> = {};

  history.forEach(game => {
    // Group by category name
    const catName = game.category || 'General';
    if (!stats[catName]) {
      stats[catName] = { count: 0, totalScore: 0, totalQuestions: 0 };
    }
    stats[catName].count += 1;
    stats[catName].totalScore += game.score;
    stats[catName].totalQuestions += game.totalQuestions;
  });

  return Object.entries(stats)
    .map(([name, data]) => ({
      name,
      count: data.count,
      accuracy: Math.round((data.totalScore / data.totalQuestions) * 100) || 0
    }))
    .sort((a, b) => b.count - a.count) // Sort by popularity
    .slice(0, 4); // Top 4 categories
};

export const getOverallStats = () => {
  const history = getGameHistory();
  const totalGames = history.length;
  if (totalGames === 0) return { wins: 0, streak: 0, accuracy: 0, total: 0 };

  const totalQuestions = history.reduce((acc, g) => acc + g.totalQuestions, 0);
  const totalScore = history.reduce((acc, g) => acc + g.score, 0);
  const accuracy = Math.round((totalScore / totalQuestions) * 100);
  
  // Calculate Wins (Assume > 60% accuracy is a "Win")
  const wins = history.filter(g => (g.score / g.totalQuestions) > 0.6).length;

  // Calculate Streak (Consecutive wins in recent history)
  let streak = 0;
  // Sort history by date descending (newest first)
  const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  for (const game of sortedHistory) {
      const isWin = (game.score / game.totalQuestions) > 0.6;
      if (isWin) {
          streak++;
      } else {
          break;
      }
  }

  return {
    wins,
    streak,
    accuracy,
    total: totalGames
  };
};

// -- FAVORITES --

export const getFavorites = (): FavoriteQuestion[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load favorites", e);
    return [];
  }
};

export const isQuestionFavorite = (questionQuestion: string): boolean => {
  const favorites = getFavorites();
  return favorites.some(f => f.question === questionQuestion);
};

export const toggleFavorite = (question: FormattedQuestion): boolean => {
  const favorites = getFavorites();
  const index = favorites.findIndex(f => f.question === question.question);
  
  let isAdded = false;

  if (index >= 0) {
    // Remove
    favorites.splice(index, 1);
    isAdded = false;
  } else {
    // Add
    favorites.push({ ...question, addedAt: new Date().toISOString() });
    isAdded = true;
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return isAdded;
};