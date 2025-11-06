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
import { useState, useEffect } from 'react';

// Sinónimos en español para hacer que la búsqueda también coincida con tags conocidos
const TAG_SYNONYMS: Record<string, string[]> = {
  'vegetarian': ['vegetariana', 'vegetariano', 'vegetarian'],
  'vegan': ['vegana', 'vegano', 'vegan'],
  'gluten-free': ['sin gluten', 'gluten free', 'gluten-free'],
  'keto': ['keto', 'cetogénica', 'cetogenica'],
};

export default function Home() {
  const { recipes } = useRecipes();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // Read tag from query (?tag=...) on mount (client side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const t = params.get('tag');
      if (t) setSelectedTag(t);
    }
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    const q = searchQuery.toLowerCase();
    const searchMatch =
      q === '' ||
      recipe.name.toLowerCase().includes(q) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.item.toLowerCase().includes(q)
      ) ||
      recipe.tags.some((tag) => {
        const t = tag.toLowerCase();
        if (t.includes(q)) return true;
        const synonyms = TAG_SYNONYMS[tag] || TAG_SYNONYMS[t] || [];
        return synonyms.some((s) => s.toLowerCase().includes(q));
      });
    const dietMatch = selectedDiet ? recipe.tags.includes(selectedDiet) : true;
    const tagMatch = selectedTag ? recipe.tags.includes(selectedTag) : true;
    return searchMatch && dietMatch && tagMatch;
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
            <div className="flex items-center gap-4 flex-wrap">
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
              {selectedTag && (
                <div className="flex items-center gap-2 text-sm bg-card border rounded px-3 py-1">
                  <span>Tag: <strong className="capitalize">{selectedTag}</strong></span>
                  <button
                    onClick={() => setSelectedTag('')}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Quitar filtro de tag"
                  >✕</button>
                </div>
              )}
            </div>
          </div>
          <RecipeList recipes={filteredRecipes} />
        </div>
      </main>
    </div>
  );
}
