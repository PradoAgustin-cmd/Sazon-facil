'use client';

import { useRecipes } from '@/context/recipes-context';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { cn } from '@/lib/utils';

export default function UploadRecipePage() {
  const { addRecipe } = useRecipes();
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [ingredients, setIngredients] = useState([{ amount: '', item: '' }]);
  const [instructions, setInstructions] = useState(['']);
  const [image, setImage] = useState<File | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [submitting, setSubmitting] = useState(false);
  const COMMON_TAGS = [
    'Desayuno',
    'Almuerzo',
    'Cena',
    'Postre',
    'Pastel',
    'Vegetariano',
    'Vegano',
    'Tacos',
    'Saludable',
    'Pescados y Mariscos',
    'Carne',
    'Sopa',
    'Ensalada',
    'Pasta',
    'Rápido',
    'Económico',
  ];
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setIsAuthed(!!u);
      setAuthReady(true);
      if (!u) {
        // Redirige a login si no está autenticado
        router.replace('/login?from=/upload-recipe');
      }
    });
    return () => unsub();
  }, [router]);
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setErrors((p) => ({ ...p, tags: undefined }));
  };

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

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!auth.currentUser) {
      setErrorMsg('Debes iniciar sesión para subir recetas.');
      return;
    }
    const user = auth.currentUser;
    const imgDataUrl = image ? await fileToDataUrl(image) : '';
    const manualTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
    const tags = Array.from(new Set([...selectedTags, ...manualTags]));
    // Validaciones mínimas + por campo
    const errs: Record<string, string> = {};
    if (!recipeName.trim()) errs.name = 'El nombre es obligatorio.';
    if (!description.trim()) errs.description = 'La descripción es obligatoria.';
    if (!prepTime.trim()) errs.prepTime = 'Tiempo de preparación requerido.';
    if (!cookTime.trim()) errs.cookTime = 'Tiempo de cocción requerido.';
    if (!servings || Number.isNaN(parseInt(servings, 10))) errs.servings = 'Ingresa porciones válidas.';
    if (ingredients.length === 0 || ingredients.some((i) => !i.amount.trim() || !i.item.trim())) {
      errs.ingredients = 'Completa al menos un ingrediente (cantidad e ingrediente).';
    }
    if (instructions.length === 0 || instructions.some((s) => !s.trim())) {
      errs.instructions = 'Agrega al menos un paso de instrucción.';
    }
    if (tags.length === 0) errs.tags = 'Selecciona o agrega al menos una etiqueta.';

    if (Object.keys(errs).length) {
      setErrors(errs);
      setErrorMsg('Revisa los campos marcados.');
      return;
    }
    setErrors({});

    setSubmitting(true);

    const newRecipe = {
      id: Date.now().toString(), // Simple unique ID
      name: recipeName,
      description,
      prepTime,
      cookTime,
      servings: parseInt(servings, 10),
      ingredients,
      instructions,
      tags,
      image: imgDataUrl, // store uploaded image as data URL
      authorName: user?.displayName || user?.email || 'Anónimo',
      userId: user?.uid || '',
    };
    addRecipe(newRecipe);
    router.push(`/recipes?id=${newRecipe.id}`);
    setSubmitting(false);
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
              {errorMsg && (
                <div role="alert" className="text-sm text-red-600">{errorMsg}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Receta</Label>
                <Input
                  id="name"
                  placeholder="ej., Tarta de Manzana de la Abuela"
                  value={recipeName}
                  onChange={(e) => {
                    setRecipeName(e.target.value);
                    setErrors((p) => ({ ...p, name: undefined }));
                  }}
                  className={cn(errors.name && 'border-red-500 focus-visible:ring-red-500')}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Una descripción breve y atractiva de tu plato."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setErrors((p) => ({ ...p, description: undefined }));
                  }}
                  className={cn(errors.description && 'border-red-500 focus-visible:ring-red-500')}
                  aria-invalid={!!errors.description}
                />
                {errors.description && <p className="text-xs text-red-600">{errors.description}</p>}
              </div>
              <div className="space-y-3">
                <Label htmlFor="tags">Categorías / Etiquetas</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMMON_TAGS.map((tag) => (
                    <label key={tag} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={() => toggleTag(tag)}
                        aria-label={tag}
                      />
                      <span>{tag}</span>
                    </label>
                  ))}
                </div>
                <div className="space-y-2">
                  <Input
                    id="tags"
                    placeholder="Agregar otras etiquetas (ej., Criollo, Parrilla)"
                    value={tagsInput}
                    onChange={(e) => { setTagsInput(e.target.value); setErrors((p)=>({...p, tags: undefined})); }}
                  />
                  {errors.tags && <p className="text-xs text-red-600">{errors.tags}</p>}
                  <p className="text-xs text-muted-foreground">Puedes seleccionar varias categorías y opcionalmente agregar otras separadas por comas.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="prep-time">Tiempo de Prep.</Label>
                      <Input
                        id="prep-time"
                        placeholder="ej., 15 min"
                        value={prepTime}
                        onChange={(e) => { setPrepTime(e.target.value); setErrors((p)=>({...p, prepTime: undefined})); }}
                        className={cn(errors.prepTime && 'border-red-500 focus-visible:ring-red-500')}
                        aria-invalid={!!errors.prepTime}
                      />
                      {errors.prepTime && <p className="text-xs text-red-600">{errors.prepTime}</p>}
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="cook-time">Tiempo de Cocción</Label>
                      <Input
                        id="cook-time"
                        placeholder="ej., 30 min"
                        value={cookTime}
                        onChange={(e) => { setCookTime(e.target.value); setErrors((p)=>({...p, cookTime: undefined})); }}
                        className={cn(errors.cookTime && 'border-red-500 focus-visible:ring-red-500')}
                        aria-invalid={!!errors.cookTime}
                      />
                      {errors.cookTime && <p className="text-xs text-red-600">{errors.cookTime}</p>}
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="servings">Porciones</Label>
                      <Input
                        id="servings"
                        type="number"
                        placeholder="ej., 4"
                        value={servings}
                        onChange={(e) => { setServings(e.target.value); setErrors((p)=>({...p, servings: undefined})); }}
                        className={cn(errors.servings && 'border-red-500 focus-visible:ring-red-500')}
                        aria-invalid={!!errors.servings}
                      />
                      {errors.servings && <p className="text-xs text-red-600">{errors.servings}</p>}
                  </div>
              </div>
              <div className="space-y-4">
                <Label>Ingredientes</Label>
                {errors.ingredients && <p className="text-xs text-red-600">{errors.ingredients}</p>}
                <div className="space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <Input placeholder="Cantidad (ej., 1 taza)" value={ingredient.amount} onChange={(e) => { const newIngredients = [...ingredients]; newIngredients[index].amount = e.target.value; setIngredients(newIngredients); setErrors((p)=>({...p, ingredients: undefined})); }} />
                      <Input placeholder="Ingrediente (ej., Harina)" value={ingredient.item} onChange={(e) => { const newIngredients = [...ingredients]; newIngredients[index].item = e.target.value; setIngredients(newIngredients); setErrors((p)=>({...p, ingredients: undefined})); }} />
                      <Button type="button" variant="outline" size="icon" onClick={() => removeIngredient(index)}><Trash2 className="h-4 w-4"/></Button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addIngredient}><Plus className="mr-2 h-4 w-4"/>Añadir Ingrediente</Button>
              </div>
               <div className="space-y-4">
                <Label>Instrucciones</Label>
                {errors.instructions && <p className="text-xs text-red-600">{errors.instructions}</p>}
                <div className="space-y-2">
                  {instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <span className="pt-2 font-bold">{index + 1}.</span>
                      <Textarea placeholder="Primer paso..." value={instruction} onChange={(e) => { const newInstructions = [...instructions]; newInstructions[index] = e.target.value; setInstructions(newInstructions); setErrors((p)=>({...p, instructions: undefined})); }} />
                      <Button type="button" variant="outline" size="icon" className="mt-1" onClick={() => removeInstruction(index)}><Trash2 className="h-4 w-4"/></Button>
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addInstruction}><Plus className="mr-2 h-4 w-4"/>Añadir Paso</Button>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="image">Imagen de la Receta</Label>
                  <Input id="image" type="file" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? 'Guardando...' : 'Añadir Receta'}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </main>
  );
}
