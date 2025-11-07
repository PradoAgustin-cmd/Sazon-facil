"use client";

import Image from "next/image";
import Link from "next/link";
import { Recipe } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
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
    <Link href={`/recipes?id=${recipe.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 w-full">
          <Image
            src={imageSrc}
            alt={recipe.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-1">{recipe.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="capitalize">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.prepTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} porc.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
