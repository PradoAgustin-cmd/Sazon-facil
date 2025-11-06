export type Recipe = {
  id: string;
  name: string;
  description: string;
  ingredients: { item: string; amount: string }[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  tags: string[];
  image: string;
  authorName: string;
  userId: string;
};
