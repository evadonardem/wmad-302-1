// contexts/FavoritesContext.tsx
import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface TriviaQuestion {
  question: string;
  category: string;
  difficulty: string;
  correct_answer: string;
  incorrect_answers: string[];
  type: string;
}

interface FavoritesContextType {
  favorites: TriviaQuestion[];
  addToFavorites: (question: TriviaQuestion) => void;
  removeFromFavorites: (question: string) => void;
  isFavorite: (question: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<TriviaQuestion[]>([]);

  const addToFavorites = (question: TriviaQuestion) => {
    setFavorites(prev => {
      // Avoid duplicates
      if (prev.find(fav => fav.question === question.question)) {
        return prev;
      }
      return [...prev, question];
    });
  };

  const removeFromFavorites = (question: string) => {
    setFavorites(prev => prev.filter(fav => fav.question !== question));
  };

  const isFavorite = (question: string) => {
    return favorites.some(fav => fav.question === question);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      clearFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
// Removed duplicate code
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};