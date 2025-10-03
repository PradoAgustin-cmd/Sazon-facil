'use server';
/**
 * @fileOverview An AI agent for generating recipes from a description.
 *
 * - generateRecipeFromDescription - A function that handles the recipe generation process.
 * - GenerateRecipeFromDescriptionInput - The input type for the generateRecipeFromDescription function.
 * - GenerateRecipeFromDescriptionOutput - The return type for the generateRecipeFromDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeFromDescriptionInputSchema = z.object({
  description: z.string().describe('The description of ingredients, dietary restrictions, and cuisine type.'),
});
export type GenerateRecipeFromDescriptionInput = z.infer<typeof GenerateRecipeFromDescriptionInputSchema>;

const GenerateRecipeFromDescriptionOutputSchema = z.object({
  recipeName: z.string().describe('The name of the generated recipe.'),
  ingredients: z.array(z.string()).describe('The list of ingredients required for the recipe.'),
  instructions: z.string().describe('The cooking instructions for the recipe.'),
});
export type GenerateRecipeFromDescriptionOutput = z.infer<typeof GenerateRecipeFromDescriptionOutputSchema>;

export async function generateRecipeFromDescription(input: GenerateRecipeFromDescriptionInput): Promise<GenerateRecipeFromDescriptionOutput> {
  return generateRecipeFromDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipeFromDescriptionPrompt',
  input: {schema: GenerateRecipeFromDescriptionInputSchema},
  output: {schema: GenerateRecipeFromDescriptionOutputSchema},
  prompt: `You are a recipe generating expert. Generate a recipe based on the provided description.

Description: {{{description}}}

Recipe format:
Recipe Name: [Recipe Name]
Ingredients:
- [Ingredient 1]
- [Ingredient 2]
Instructions:
[Step 1]
[Step 2]`,
});

const generateRecipeFromDescriptionFlow = ai.defineFlow(
  {
    name: 'generateRecipeFromDescriptionFlow',
    inputSchema: GenerateRecipeFromDescriptionInputSchema,
    outputSchema: GenerateRecipeFromDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
