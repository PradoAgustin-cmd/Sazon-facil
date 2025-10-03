import { RecipeList } from '@/components/recipes/recipe-list';
import { recipes } from '@/lib/recipes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfilePage() {
  const favoriteRecipes = recipes.slice(0, 3);
  const cookingHistory = recipes.slice(3, 5);

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://picsum.photos/seed/avatar/200" alt="User avatar" data-ai-hint="woman smiling" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-headline text-3xl font-bold">Alex Doe</h1>
            <p className="text-muted-foreground">alex.doe@example.com</p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold tracking-tight mb-6">
            Mis Recetas Favoritas
          </h2>
          <RecipeList recipes={favoriteRecipes} />
        </div>

        <div>
          <h2 className="font-headline text-2xl font-bold tracking-tight mb-6">
            Mi Historial de Cocina
          </h2>
          <RecipeList recipes={cookingHistory} />
        </div>
      </div>
    </main>
  );
}
