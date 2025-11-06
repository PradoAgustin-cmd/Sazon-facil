'use server';

import { z } from 'zod';

const formSchema = z.object({
  description: z
    .string()
    .min(10, { message: 'Por favor, proporciona una descripción más detallada (al menos 10 caracteres).' }),
});

export interface GenerateRecipeActionState {
  message?: string | null;
  errors?: {
    description?: string[];
  } | null;
  recipe?: unknown | null;
}

export async function generateRecipeAction(
  prevState: GenerateRecipeActionState,
  formData: FormData
): Promise<GenerateRecipeActionState> {
  const validatedFields = formSchema.safeParse({
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Datos de formulario no válidos',
      errors: validatedFields.error.flatten().fieldErrors,
      recipe: null,
    };
  }

  // IA deshabilitada en esta build offline/APK. Devolver un mensaje amable.
  return {
    message: 'Generación por IA deshabilitada en esta versión (offline) — próximamente.',
    recipe: null,
    errors: null,
  };
}
