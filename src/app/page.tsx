'use client';
import { RecipeList } from '@/components/recipes/recipe-list';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRecipes } from '@/context/recipes-context';
import { Filter, Search } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const { recipes } = useRecipes();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');

  const filteredRecipes = recipes.filter((recipe) => {
    const searchMatch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) || recipe.ingredients.some((ingredient) => ingredient.item.toLowerCase().includes(searchQuery.toLowerCase()));
    const dietMatch = selectedDiet ? recipe.tags.includes(selectedDiet) : true;
    return searchMatch && dietMatch;
  });

  return (
    <div className="flex flex-1 flex-col">
      <main className="flex-1 bg-background p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 space-y-2">
            <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Descubre Recetas Deliciosas
            </h1>
            <p className="text-muted-foreground">
              Encuentra la receta perfecta para cualquier ocasión.
            </p>
          </div>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por palabras clave, ingredientes..."
                className="w-full rounded-lg bg-card pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <Select onValueChange={setSelectedDiet}>
                <SelectTrigger className="w-full sm:w-[200px] rounded-lg bg-card">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filtrar por dieta" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetarian">Vegetariana</SelectItem>
                  <SelectItem value="vegan">Vegana</SelectItem>
                  <SelectItem value="gluten-free">Sin Gluten</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <RecipeList recipes={filteredRecipes} />
        </div>
      </main>
    </div>
  );
}
