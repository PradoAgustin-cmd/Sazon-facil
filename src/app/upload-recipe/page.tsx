'use client';

import { useRecipes } from '@/context/recipes-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function UploadRecipePage() {
  const { addRecipe } = useRecipes();
  const router = useRouter();
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [ingredients, setIngredients] = useState([{ amount: '', item: '' }]);
  const [instructions, setInstructions] = useState(['']);
  const [image, setImage] = useState<File | null>(null);

  const addIngredient = () => {
    setIngredients([...ingredients, { amount: '', item: '' }]);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index: number) => {
    const newInstructions = [...instructions];
    newInstructions.splice(index, 1);
    setInstructions(newInstructions);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newRecipe = {
      id: Date.now().toString(), // Simple unique ID
      name: recipeName,
      description,
      prepTime,
      cookTime,
      servings: parseInt(servings, 10),
      ingredients,
      instructions,
      tags: [], // User can't add tags in this form yet
      image: '', // Image upload is not fully implemented
    };
    addRecipe(newRecipe);
    router.push(`/recipes/${newRecipe.id}`);
  };

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Comparte Tu Receta
          </h1>
          <p className="mt-2 text-muted-foreground">
            Contribuye a la comunidad de Sazón Fácil compartiendo tus creaciones culinarias.
          </p>
        </div>
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Detalles de la Receta</CardTitle>
              <CardDescription>Completa el formulario a continuación para subir tu receta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Receta</Label>
                <Input id="name" placeholder="ej., Tarta de Manzana de la Abuela" value={recipeName} onChange={(e) => setRecipeName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" placeholder="Una descripción breve y atractiva de tu plato." value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="prep-time">Tiempo de Prep.</Label>
                      <Input id="prep-time" placeholder="ej., 15 min" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="cook-time">Tiempo de Cocción</Label>
                      <Input id="cook-time" placeholder="ej., 30 min" value={cookTime} onChange={(e) => setCookTime(e.target.value)} />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="servings">Porciones</Label>
                      <Input id="servings" type="number" placeholder="ej., 4" value={servings} onChange={(e) => setServings(e.target.value)} />
                  </div>
              </div>
              <div className="space-y-4">
                <Label>Ingredientes</Label>
                <div className="space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <Input placeholder="Cantidad (ej., 1 taza)" value={ingredient.amount} onChange={(e) => { const newIngredients = [...ingredients]; newIngredients[index].amount = e.target.value; setIngredients(newIngredients); }} />
                      <Input placeholder="Ingrediente (ej., Harina)" value={ingredient.item} onChange={(e) => { const newIngredients = [...ingredients]; newIngredients[index].item = e.target.value; setIngredients(newIngredients); }} />
                      <Button variant="outline" size="icon" onClick={() => removeIngredient(index)}><Trash2 className="h-4 w-4"/></Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={addIngredient}><Plus className="mr-2 h-4 w-4"/>Añadir Ingrediente</Button>
              </div>
               <div className="space-y-4">
                <Label>Instrucciones</Label>
                <div className="space-y-2">
                  {instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <span className="pt-2 font-bold">{index + 1}.</span>
                      <Textarea placeholder="Primer paso..." value={instruction} onChange={(e) => { const newInstructions = [...instructions]; newInstructions[index] = e.target.value; setInstructions(newInstructions); }} />
                      <Button variant="outline" size="icon" className="mt-1" onClick={() => removeInstruction(index)}><Trash2 className="h-4 w-4"/></Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={addInstruction}><Plus className="mr-2 h-4 w-4"/>Añadir Paso</Button>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="image">Imagen de la Receta</Label>
                  <Input id="image" type="file" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} />
              </div>
              <Button type="submit" size="lg" className="w-full">Añadir Receta</Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </main>
  );
}
