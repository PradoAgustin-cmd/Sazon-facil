'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRecipes } from '@/context/recipes-context';
import { auth } from '@/lib/firebase';
import { getUserRole } from '@/lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Clock, Users, Soup, Heart, Download, Loader2 } from 'lucide-react';
import { downloadRecipePDF } from '@/lib/pdf';

export default function Page() {
  return (
    <Suspense fallback={<main className="flex-1 p-4 md:p-6"><div className="mx-auto max-w-4xl">Cargando…</div></main>}>
      <RecipeDetailQueryPage />
    </Suspense>
  );
}

function RecipeDetailQueryPage() {
  const { recipes, canDeleteRecipe, removeRecipe } = useRecipes();
  const [user, setUser] = useState<{ uid: string; role?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useSearchParams();
  const id = params.get('id') || '';
  const router = useRouter();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser({ uid: u.uid, role: getUserRole(u) });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const recipe = useMemo(() => recipes.find((r) => r.id === id), [recipes, id]);

  if (!id) {
    return (
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-headline text-3xl font-bold">Receta no especificada</h1>
          <p className="mt-2 text-muted-foreground">Falta el parámetro id en la URL.</p>
        </div>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-headline text-3xl font-bold">Receta no encontrada</h1>
          <p className="mt-2 text-muted-foreground">
            La receta que estás buscando no existe o ha sido eliminada.
          </p>
        </div>
      </main>
    );
  }

  const placeholder = PlaceHolderImages.find((p) => p.id === recipe.image) ?? {
    imageUrl: 'https://picsum.photos/seed/placeholder/1200/800',
    imageHint: 'food placeholder',
  };
  const imageSrc = recipe.image && (recipe.image.startsWith('http') || recipe.image.startsWith('data:'))
    ? recipe.image
    : placeholder.imageUrl;

  const handleDelete = () => {
    removeRecipe(recipe.id);
    router.push('/');
  };

  const [pdfLoading, setPdfLoading] = useState(false);
  const downloadPDF = async () => {
    try {
      setPdfLoading(true);
      await downloadRecipePDF(recipe);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="relative h-64 w-full overflow-hidden rounded-lg">
          <Image
            src={imageSrc}
            alt={recipe.name}
            fill
            className="object-cover"
            sizes="100vw"
            data-ai-hint={imageSrc === placeholder.imageUrl ? placeholder.imageHint : undefined}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <a key={tag} href={`/?tag=${encodeURIComponent(tag)}`}>
              <Badge variant="secondary" className="capitalize cursor-pointer hover:opacity-80">{tag}</Badge>
            </a>
          ))}
        </div>

        <header className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">{recipe.name}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadPDF} disabled={pdfLoading} aria-busy={pdfLoading}>
              {pdfLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />} Guardar PDF
            </Button>
            {!loading && user && canDeleteRecipe(recipe, user) && (
              <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
            )}
          </div>
        </header>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardContent className="space-y-4 p-6">
              <h2 className="font-headline text-xl font-semibold">Descripción</h2>
              <p className="text-muted-foreground">{recipe.description}</p>

              <h2 className="font-headline text-xl font-semibold">Ingredientes</h2>
              <ul className="list-inside list-disc space-y-1">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing.amount} {ing.item}</li>
                ))}
              </ul>

              <h2 className="font-headline text-xl font-semibold">Instrucciones</h2>
              <ol className="list-inside list-decimal space-y-2">
                {recipe.instructions.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <aside className="space-y-4">
            <Card>
              <CardContent className="space-y-3 p-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> Prep: {recipe.prepTime || '-'}</div>
                <div className="flex items-center gap-2"><Soup className="h-4 w-4" /> Cocción: {recipe.cookTime || '-'}</div>
                <div className="flex items-center gap-2"><Users className="h-4 w-4" /> Porciones: {recipe.servings || '-'}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-3 p-6">
                <Label className="text-sm">Marcar como favorita</Label>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Checkbox id="fav" disabled />
                  <label htmlFor="fav" className="flex items-center gap-2 text-sm">
                    <Heart className="h-4 w-4" /> Guardar en Favoritas (desde la lista)
                  </label>
                </div>
              </CardContent>
            </Card>
          </aside>
        </section>
      </div>
    </main>
  );
}
