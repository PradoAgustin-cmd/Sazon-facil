'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { generateRecipeAction, type GenerateRecipeActionState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generando...
        </>
      ) : (
        'Generar Receta'
      )}
    </Button>
  );
}

export function GeneratorForm() {
  const initialState: GenerateRecipeActionState = { message: null, errors: {}, recipe: null };
  const [state, dispatch] = useFormState(generateRecipeAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message === 'success' && state.recipe) {
      toast({
        title: "¡Receta Generada!",
        description: `Disfruta tu nueva receta "${state.recipe.recipeName}".`,
      });
    } else if (state.message && state.message !== 'success') {
      toast({
        variant: "destructive",
        title: "Ocurrió un error",
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Describe tu plato ideal</CardTitle>
          <CardDescription>
            Dinos qué ingredientes tienes, necesidades dietéticas o qué tipo de cocina te apetece.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-4">
            <div className="grid w-full gap-2">
              <Textarea
                name="description"
                placeholder="ej., pollo, brócoli, sin gluten, estilo italiano"
                className="min-h-[150px]"
                required
              />
              {state.errors?.description && (
                <p className="text-sm text-destructive">{state.errors.description[0]}</p>
              )}
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="font-headline">Tu Receta Generada por IA</CardTitle>
          <CardDescription>
            Tu creación culinaria aparecerá aquí.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.recipe ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold font-headline">{state.recipe.recipeName}</h3>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 font-headline">Ingredientes</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {state.recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2 font-headline">Instrucciones</h4>
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {state.recipe.instructions}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[200px] text-muted-foreground">
              <p>Esperando tu descripción...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
