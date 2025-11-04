
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { Recipe } from '@/lib/types';
import { recipes as initialRecipes } from '@/lib/recipes';

interface RecipesContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
}

const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

export function RecipesProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
      setRecipes(JSON.parse(storedRecipes));
    } else {
      setRecipes(initialRecipes);
      localStorage.setItem('recipes', JSON.stringify(initialRecipes));
    }
  }, []);

  const addRecipe = (recipe: Recipe) => {
    setRecipes((prevRecipes) => {
      const newRecipes = [...prevRecipes, recipe];
      localStorage.setItem('recipes', JSON.stringify(newRecipes));
      return newRecipes;
    });
  };

  return (
    <RecipesContext.Provider value={{ recipes, addRecipe }}>
      {children}
    </RecipesContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipesContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipesProvider');
  }
  return context;
}
