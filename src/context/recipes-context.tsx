"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { Recipe } from "@/lib/types";
import { recipes as initialRecipes } from "@/lib/recipes";

interface RecipesContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  removeRecipe: (id: string) => void;
  canEditRecipe: (
    recipe: Recipe,
    user: { uid: string; role?: string }
  ) => boolean;
  canDeleteRecipe: (
    recipe: Recipe,
    user: { uid: string; role?: string }
  ) => boolean;
}

const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

export function RecipesProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRecipes = localStorage.getItem("recipes");
      // Start with the initial recipes
      const recipesMap = new Map(initialRecipes.map((r) => [r.id, r]));

      if (storedRecipes) {
        try {
          const parsedRecipes = JSON.parse(storedRecipes) as Recipe[];
          // Add/overwrite with recipes from local storage
          parsedRecipes.forEach((r) => recipesMap.set(r.id, r));
        } catch (error) {
          console.error("Error parsing recipes from localStorage", error);
        }
      }
      
      const combinedRecipes = Array.from(recipesMap.values());
      setRecipes(combinedRecipes);
      localStorage.setItem("recipes", JSON.stringify(combinedRecipes));
    }
  }, []);

  const addRecipe = (recipe: Recipe) => {
    setRecipes((prevRecipes) => {
      const newRecipes = [...prevRecipes, recipe];
      localStorage.setItem("recipes", JSON.stringify(newRecipes));
      return newRecipes;
    });
  };

  const removeRecipe = (id: string) => {
    setRecipes((prevRecipes) => {
      const newRecipes = prevRecipes.filter((r) => r.id !== id);
      localStorage.setItem("recipes", JSON.stringify(newRecipes));
      return newRecipes;
    });
  };

  const canEditRecipe = (
    recipe: Recipe,
    user: { uid: string; role?: string }
  ) => {
    return user.role === "admin" || recipe.userId === user.uid;
  };

  const canDeleteRecipe = (
    recipe: Recipe,
    user: { uid: string; role?: string }
  ) => {
    return user.role === "admin" || recipe.userId === user.uid;
  };

  return (
    <RecipesContext.Provider
      value={{
        recipes,
        addRecipe,
        removeRecipe,
        canEditRecipe,
        canDeleteRecipe,
      }}
    >
      {children}
    </RecipesContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipesContext);
  if (context === undefined) {
    throw new Error("useRecipes must be used within a RecipesProvider");
  }
  return context;
}

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const placeholder = PlaceHolderImages.find((p) => p.id === recipe.image) ?? {
    imageUrl: "https://picsum.photos/seed/placeholder/1200/800",
    imageHint: "food placeholder",
  };

  const imageSrc =
    recipe.image &&
    (recipe.image.startsWith("http") || recipe.image.startsWith("data:"))
      ? recipe.image
      : placeholder.imageUrl;

  return (
    <Link href={`/recipes?id=${recipe.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 w-full">
          <Image
            src={imageSrc}
            alt={recipe.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-1">{recipe.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="capitalize">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.prepTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} porc.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
