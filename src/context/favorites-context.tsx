
'use client';

import type { Recipe } from '@/lib/types';
import { createContext, useContext, useState, useEffect } from 'react';

interface FavoritesContextType {
  favoriteIds: string[];
  toggleFavorite: (recipeId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteRecipes');
    if (storedFavorites) {
      setFavoriteIds(JSON.parse(storedFavorites));
    }
  }, []);

  const toggleFavorite = (recipeId: string) => {
    setFavoriteIds((prevIds) => {
      const newIds = prevIds.includes(recipeId)
        ? prevIds.filter((id) => id !== recipeId)
        : [...prevIds, recipeId];
      localStorage.setItem('favoriteRecipes', JSON.stringify(newIds));
      return newIds;
    });
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
