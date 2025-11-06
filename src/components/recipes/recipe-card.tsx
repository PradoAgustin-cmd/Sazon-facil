'use client';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Recipe } from '@/lib/types';
import { useRecipes } from '@/context/recipes-context';
import { auth } from '@/lib/firebase';
import { getUserRole } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useFavorites } from '@/context/favorites-context';
import { Clock, Heart, Download, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { downloadRecipePDF } from '@/lib/pdf';

type RecipeCardProps = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { canDeleteRecipe, removeRecipe } = useRecipes();

  const isFavorited = favoriteIds.includes(recipe.id);
  const [user, setUser] = useState<{ uid: string; role?: string } | null>(null);
  const [loading, setLoading] = useState(true);
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
  const router = useRouter();
  const placeholder = PlaceHolderImages.find((p) => p.id === recipe.image) ?? {
    imageUrl: 'https://picsum.photos/seed/placeholder/600/400',
    imageHint: 'food placeholder',
  };
  const imageSrc = recipe.image && (recipe.image.startsWith('http') || recipe.image.startsWith('data:'))
    ? recipe.image
    : placeholder.imageUrl;
  const handleEdit = () => router.push(`/recipes?id=${recipe.id}&edit=1`);
  const handleDelete = () => {
    removeRecipe(recipe.id);
    router.push('/');
  };
  const [pdfLoading, setPdfLoading] = useState(false);
  const handleDownload = async () => {
    try {
      setPdfLoading(true);
      await downloadRecipePDF(recipe);
    } finally {
      setPdfLoading(false);
    }
  };
  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <CardHeader className="p-0">
  <Link href={`/recipes?id=${recipe.id}`} className="block">
          <div className="relative h-48 w-full">
            <Image
              src={imageSrc}
              alt={recipe.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={imageSrc === placeholder.imageUrl ? placeholder.imageHint : undefined}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-4">
    <div className="flex space-x-2 mb-2">
      {recipe.tags.slice(0, 2).map((tag) => (
        <Link key={tag} href={`/?tag=${encodeURIComponent(tag)}`}>
          <Badge variant="secondary" className="capitalize cursor-pointer hover:opacity-80">{tag}</Badge>
        </Link>
      ))}
    </div>
        <CardTitle className="font-headline text-xl leading-tight">
          <Link href={`/recipes?id=${recipe.id}`}>{recipe.name}</Link>
        </CardTitle>
        <div className="text-xs text-muted-foreground mt-1">Autor: {recipe.authorName || 'Anónimo'}</div>
        {!loading && user && canDeleteRecipe(recipe, user) && (
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant="destructive" onClick={handleDelete}>Eliminar</Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{recipe.prepTime}</span>
        </div>
    <div className="flex items-center gap-1">
    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={handleDownload} disabled={pdfLoading} aria-busy={pdfLoading}>
      {pdfLoading ? <Loader2 className="h-5 w-5 animate-spin"/> : <Download className="h-5 w-5"/>}
      <span className="sr-only">Guardar PDF</span>
    </Button>
    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500" onClick={() => toggleFavorite(recipe.id)}>
            <Heart className={`h-5 w-5 ${isFavorited ? 'text-red-500 fill-current' : ''}`}/>
            <span className="sr-only">Favorito</span>
    </Button>
    </div>
      </CardFooter>
    </Card>
  );
}
