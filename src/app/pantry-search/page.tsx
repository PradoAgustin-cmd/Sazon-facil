"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X } from "lucide-react";
import { useRecipes } from "@/context/recipes-context";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { RecipeList } from "@/components/recipes/recipe-list";

export default function PantrySearchPage() {
  const { recipes } = useRecipes();
  const [ingredients, setIngredients] = useState<string[]>([
    "Pollo",
    "Tomates",
  ]);
  const [newIngredient, setNewIngredient] = useState("");

  const handleAddIngredient = () => {
    if (
      newIngredient.trim() !== "" &&
      !ingredients.includes(newIngredient.trim())
    ) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const suggestedRecipes = recipes
    .map((recipe) => {
      const matchCount = recipe.ingredients.filter((recipeIngredient) =>
        ingredients.some((userIngredient) =>
          recipeIngredient.item
            .toLowerCase()
            .includes(userIngredient.toLowerCase())
        )
      ).length;
      return { ...recipe, matchCount };
    })
    .filter((recipe) => recipe.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount);

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            ¿Qué hay en tu despensa?
          </h1>
          <p className="mt-2 text-muted-foreground">
            Ingresa los ingredientes que tienes y te sugeriremos recetas que
            puedes hacer.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Tus Ingredientes</CardTitle>
            <CardDescription>
              Añade ingredientes uno por uno y presiona Enter.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="ej., pollo, tomates, arroz"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddIngredient()}
              />
              <Button onClick={handleAddIngredient}>Añadir</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient) => (
                <Badge key={ingredient}>
                  {ingredient}{" "}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => handleRemoveIngredient(ingredient)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-12">
          <h2 className="text-2xl font-bold font-headline mb-6">
            Recetas Sugeridas
          </h2>
          <RecipeList recipes={suggestedRecipes} />
        </div>
      </div>
    </main>
  );
}
