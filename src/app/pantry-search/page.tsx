import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RecipeList } from '@/components/recipes/recipe-list';
import { recipes } from '@/lib/recipes';

export default function PantrySearchPage() {
    const suggestedRecipes = recipes.slice(0, 2);
  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            ¿Qué hay en tu despensa?
          </h1>
          <p className="mt-2 text-muted-foreground">
            Ingresa los ingredientes que tienes y te sugeriremos recetas que puedes hacer.
          </p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Tus Ingredientes</CardTitle>
                <CardDescription>Añade ingredientes uno por uno y presiona Enter.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 mb-4">
                    <Input placeholder="ej., pollo, tomates, arroz" />
                    <Button>Añadir</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Badge>Pollo <Button variant="ghost" size="icon" className="h-4 w-4 ml-1"><X className="h-3 w-3"/></Button></Badge>
                    <Badge>Tomates <Button variant="ghost" size="icon" className="h-4 w-4 ml-1"><X className="h-3 w-3"/></Button></Badge>
                </div>
            </CardContent>
        </Card>

        <div className="mt-12">
            <h2 className="text-2xl font-bold font-headline mb-6">Recetas Sugeridas</h2>
            <RecipeList recipes={suggestedRecipes} />
        </div>
      </div>
    </main>
  );
}
