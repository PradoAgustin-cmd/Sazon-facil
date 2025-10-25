'use client';

import { RecipeList } from '@/components/recipes/recipe-list';
import { recipes } from '@/lib/recipes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const favoriteRecipes = recipes.slice(0, 3);
  const cookingHistory = recipes.slice(3, 5);

  if (loading) {
    return (
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-4xl text-center">
          <p>Cargando perfil...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-headline text-3xl font-bold">Acceso Denegado</h1>
          <p className="mt-2 text-muted-foreground">
            Por favor,{' '}
            <Link href="/login" className="underline">
              inicia sesión
            </Link>{' '}
            para ver tu perfil.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User avatar'} />
            <AvatarFallback>
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-headline text-3xl font-bold">{user.displayName || 'Usuario'}</h1>
            <p className="text-muted-foreground">{user.email}</p>
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
