
'use client';

import { useRecipes } from '@/context/recipes-context';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Clock, Users, Soup, Heart, Download } from 'lucide-react';
import jsPDF from 'jspdf';

export default function RecipePage({ params }: { params: { id: string } }) {
  const { recipes } = useRecipes();
  const recipe = recipes.find((r) => r.id === params.id);

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

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.text(recipe.name, 10, 10);
    doc.text(recipe.description, 10, 20);
    doc.text('Ingredientes', 10, 30);
    recipe.ingredients.forEach((ing, i) => {
      doc.text(`${ing.amount} ${ing.item}`, 10, 40 + i * 10);
    });
    doc.text('Instrucciones', 10, 40 + recipe.ingredients.length * 10 + 10);
    recipe.instructions.forEach((step, i) => {
      doc.text(`${i + 1}. ${step}`, 10, 40 + recipe.ingredients.length * 10 + 20 + i * 10);
    });
    doc.save(`${recipe.name}.pdf`);
  };

  const placeholder = PlaceHolderImages.find((p) => p.id === recipe.image) ?? {
    imageUrl: 'https://picsum.photos/seed/placeholder/1200/800',
    imageHint: 'food placeholder',
  };

  return (
    <main className="flex-1">
      <div className="relative h-64 md:h-96 w-full">
        <Image
          src={placeholder.imageUrl}
          alt={recipe.name}
          fill
          className="object-cover"
          priority
          data-ai-hint={placeholder.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <h1 className="font-headline text-3xl font-bold text-white md:text-5xl">
            {recipe.name}
          </h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="capitalize backdrop-blur-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-4xl p-4 md:p-6">
        <Card className="mb-8 -mt-16 border-none bg-card/80 shadow-lg backdrop-blur-lg md:-mt-24">
          <CardContent className="flex flex-wrap justify-around gap-4 p-4 text-center">
            <div className="flex flex-col items-center gap-1">
              <Clock className="h-6 w-6 text-muted-foreground" />
              <span className="font-bold">{recipe.prepTime}</span>
              <span className="text-sm text-muted-foreground">Preparación</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Soup className="h-6 w-6 text-muted-foreground" />
              <span className="font-bold">{recipe.cookTime}</span>
              <span className="text-sm text-muted-foreground">Cocción</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Users className="h-6 w-6 text-muted-foreground" />
              <span className="font-bold">{recipe.servings}</span>
              <span className="text-sm text-muted-foreground">Porciones</span>
            </div>
          </CardContent>
        </Card>
        
        <div className="mb-8 flex items-center justify-between">
            <p className="text-muted-foreground max-w-2xl">{recipe.description}</p>
        </div>


        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <h2 className="font-headline text-2xl font-bold mb-4">Ingredientes</h2>
            <Card>
              <CardContent className="p-4 space-y-3">
                {recipe.ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Checkbox id={`ing-${i}`} />
                    <Label htmlFor={`ing-${i}`} className="flex-1 text-base leading-snug">
                      <span className="font-semibold">{ing.amount}</span> {ing.item}
                    </Label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <h2 className="font-headline text-2xl font-bold mb-4">Instrucciones</h2>
            <div className="space-y-6">
              {recipe.instructions.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold font-headline">
                    {i + 1}
                  </div>
                  <p className="flex-1 text-base leading-relaxed mt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 text-center flex justify-center gap-4">
            <Button variant="outline" size="lg">
                <Heart className="mr-2 h-5 w-5"/> Añadir a Favoritos
            </Button>
            <Button variant="outline" size="lg" onClick={handleDownloadPdf}>
                <Download className="mr-2 h-5 w-5"/> Descargar PDF
            </Button>
        </div>
      </div>
    </main>
  );
}
