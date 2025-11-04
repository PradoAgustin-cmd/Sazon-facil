
'use client';

import { RecipesProvider } from '@/context/recipes-context';
import { FavoritesProvider } from '@/context/favorites-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RecipesProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </RecipesProvider>
  );
}
