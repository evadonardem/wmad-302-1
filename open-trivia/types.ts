export interface Category {
  id: number;
  name: string;
}

export interface Question {
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface FormattedQuestion extends Question {
  id: string;
  answers: string[]; // Mixed correct and incorrect
}

export interface QuizState {
  questions: FormattedQuestion[];
  currentQuestionIndex: number;
  score: number;
  status: 'idle' | 'loading' | 'active' | 'completed';
  selectedAnswer: string | null;
}

export interface UserPreferences {
  difficulty: 'any' | 'easy' | 'medium' | 'hard';
  theme: 'dark' | 'light';
  soundEnabled: boolean;
}

export interface GameResult {
  id: string;
  date: string;
  category: string;
  score: number;
  totalQuestions: number;
  difficulty: string;
}

export interface FavoriteQuestion extends FormattedQuestion {
  addedAt: string;
}