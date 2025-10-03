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
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Clock, Heart } from 'lucide-react';
import { Button } from '../ui/button';

type RecipeCardProps = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const placeholder = PlaceHolderImages.find((p) => p.id === recipe.image) ?? {
    imageUrl: 'https://picsum.photos/seed/placeholder/600/400',
    imageHint: 'food placeholder',
  };

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <CardHeader className="p-0">
        <Link href={`/recipes/${recipe.id}`} className="block">
          <div className="relative h-48 w-full">
            <Image
              src={placeholder.imageUrl}
              alt={recipe.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={placeholder.imageHint}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="flex space-x-2 mb-2">
            {recipe.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="capitalize">{tag}</Badge>
            ))}
        </div>
        <CardTitle className="font-headline text-xl leading-tight">
          <Link href={`/recipes/${recipe.id}`}>{recipe.name}</Link>
        </CardTitle>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{recipe.prepTime}</span>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500">
            <Heart className="h-5 w-5"/>
            <span className="sr-only">Favorito</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
