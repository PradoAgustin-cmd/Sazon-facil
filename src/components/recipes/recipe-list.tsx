import { RecipeCard } from './recipe-card';
import type { Recipe } from '@/lib/types';

type RecipeListProps = {
  recipes: Recipe[];
};

export function RecipeList({ recipes }: RecipeListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
