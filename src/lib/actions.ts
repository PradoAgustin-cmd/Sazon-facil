'use server';

import {
  generateRecipeFromDescription,
  type GenerateRecipeFromDescriptionOutput,
} from '@/ai/flows/generate-recipe-from-description';
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
  recipe?: GenerateRecipeFromDescriptionOutput | null;
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

  try {
    const recipe = await generateRecipeFromDescription({
      description: validatedFields.data.description,
    });
    return { message: 'success', recipe, errors: null };
  } catch (error) {
    console.error(error);
    return {
      message: 'La generación de IA falló. Por favor, inténtalo de nuevo.',
      recipe: null,
      errors: null,
    };
  }
}
