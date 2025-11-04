
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRecipes } from '@/context/recipes-context';
import type { Recipe } from '@/lib/types';

interface AddRecipeDialogProps {
  children: React.ReactNode;
  onSelect: (recipe: Recipe) => void;
}

export function AddRecipeDialog({ children, onSelect }: AddRecipeDialogProps) {
  const { recipes } = useRecipes();
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Receta</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="cursor-pointer rounded-lg border p-4 hover:bg-muted"
              onClick={() => onSelect(recipe)}
            >
              <p className="font-semibold">{recipe.name}</p>
              <p className="text-sm text-muted-foreground">
                {recipe.description}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
