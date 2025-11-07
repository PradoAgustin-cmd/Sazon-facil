"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRecipes } from "@/context/recipes-context";
import { auth } from "@/lib/firebase";
import { getUserRole } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Clock, Users, Soup, Heart, Download, Loader2 } from "lucide-react";
import { downloadRecipePDF } from "@/lib/pdf";
import { Recipe } from "@/lib/types";
import Link from "next/link";

interface RecipeListProps {
  recipes: Recipe[];
}

function RecipeList({ recipes }: RecipeListProps) {
  if (!recipes.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay recetas disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}

function RecipesPageContent() {
  const params = useSearchParams();
  const id = params.get("id");
  const { recipes } = useRecipes();

  if (id) {
    return <RecipeDetailQueryPage />;
  }

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Descubre Recetas</CardTitle>
        </CardHeader>
      </Card>
      <RecipeList recipes={recipes} />
    </>
  );
}

export default function Page() {
  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
          <RecipesPageContent />
        </Suspense>
      </div>
    </main>
  );
}

function RecipeDetailQueryPage() {
  const { recipes, canDeleteRecipe, removeRecipe } = useRecipes();
  const [user, setUser] = useState<{ uid: string; role?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useSearchParams();
  const id = params.get("id") || "";
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
          <h1 className="font-headline text-3xl font-bold">
            Receta no especificada
          </h1>
          <p className="mt-2 text-muted-foreground">
            Falta el parámetro id en la URL.
          </p>
        </div>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-headline text-3xl font-bold">
            Receta no encontrada
          </h1>
          <p className="mt-2 text-muted-foreground">
            La receta que estás buscando no existe o ha sido eliminada.
          </p>
        </div>
      </main>
    );
  }

  const placeholder = PlaceHolderImages.find((p) => p.id === recipe.image) ?? {
    imageUrl: "https://picsum.photos/seed/placeholder/1200/800",
    imageHint: "food placeholder",
  };
  const imageSrc =
    recipe.image &&
    (recipe.image.startsWith("http") || recipe.image.startsWith("data:"))
      ? recipe.image
      : placeholder.imageUrl;

  const handleDelete = () => {
    removeRecipe(recipe.id);
    router.push("/");
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
            data-ai-hint={
              imageSrc === placeholder.imageUrl
                ? placeholder.imageHint
                : undefined
            }
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <a key={tag} href={`/?tag=${encodeURIComponent(tag)}`}>
              <Badge
                variant="secondary"
                className="capitalize cursor-pointer hover:opacity-80"
              >
                {tag}
              </Badge>
            </a>
          ))}
        </div>

        <header className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">{recipe.name}</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={downloadPDF}
              disabled={pdfLoading}
              aria-busy={pdfLoading}
            >
              {pdfLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Guardar PDF
            </Button>
            {!loading && user && canDeleteRecipe(recipe, user) && (
              <Button variant="destructive" onClick={handleDelete}>
                Eliminar
              </Button>
            )}
          </div>
        </header>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardContent className="space-y-4 p-6">
              <h2 className="font-headline text-xl font-semibold">
                Descripción
              </h2>
              <p className="text-muted-foreground">{recipe.description}</p>

              <h2 className="font-headline text-xl font-semibold">
                Ingredientes
              </h2>
              <ul className="list-inside list-disc space-y-1">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx}>
                    {ing.amount} {ing.item}
                  </li>
                ))}
              </ul>

              <h2 className="font-headline text-xl font-semibold">
                Instrucciones
              </h2>
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
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Prep: {recipe.prepTime || "-"}
                </div>
                <div className="flex items-center gap-2">
                  <Soup className="h-4 w-4" /> Cocción: {recipe.cookTime || "-"}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" /> Porciones:{" "}
                  {recipe.servings || "-"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-3 p-6">
                <Label className="text-sm">Marcar como favorita</Label>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Checkbox id="fav" disabled />
                  <label
                    htmlFor="fav"
                    className="flex items-center gap-2 text-sm"
                  >
                    <Heart className="h-4 w-4" /> Guardar en Favoritas (desde la
                    lista)
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

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const placeholder = PlaceHolderImages.find((p) => p.id === recipe.image) ?? {
    imageUrl: "https://picsum.photos/seed/placeholder/1200/800",
    imageHint: "food placeholder",
  };
  const imageSrc =
    recipe.image &&
    (recipe.image.startsWith("http") || recipe.image.startsWith("data:"))
      ? recipe.image
      : placeholder.imageUrl;

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-lg">
      <div className="aspect-h-3 aspect-w-4 w-full overflow-hidden rounded-t-lg">
        <Image
          src={imageSrc}
          alt={recipe.name}
          fill
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          sizes="(min-width: 640px) 50vw, 100vw"
          data-ai-hint={
            imageSrc === placeholder.imageUrl
              ? placeholder.imageHint
              : undefined
          }
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1">
          <h3 className="font-headline text-lg font-semibold">{recipe.name}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="capitalize cursor-pointer"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Link href={`/recipes?id=${recipe.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Ver receta
            </Button>
          </Link>
          <Button
            variant="destructive"
            className="flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              // Aquí va la lógica para eliminar la receta
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
