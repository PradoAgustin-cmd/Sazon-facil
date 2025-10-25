import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

export default function UploadRecipePage() {
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
          <CardHeader>
            <CardTitle>Detalles de la Receta</CardTitle>
            <CardDescription>Completa el formulario a continuación para subir tu receta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Receta</Label>
              <Input id="name" placeholder="ej., Tarta de Manzana de la Abuela" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" placeholder="Una descripción breve y atractiva de tu plato." />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="prep-time">Tiempo de Prep.</Label>
                    <Input id="prep-time" placeholder="ej., 15 min" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="cook-time">Tiempo de Cocción</Label>
                    <Input id="cook-time" placeholder="ej., 30 min" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="servings">Porciones</Label>
                    <Input id="servings" type="number" placeholder="ej., 4" />
                </div>
            </div>
            <div className="space-y-4">
              <Label>Ingredientes</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                    <Input placeholder="Cantidad (ej., 1 taza)" />
                    <Input placeholder="Ingrediente (ej., Harina)" />
                    <Button variant="outline" size="icon"><Trash2 className="h-4 w-4"/></Button>
                </div>
                                  <div className="flex gap-2">
                                     <Input defaultValue="2" />
                                     <Input defaultValue="Huevos grandes" />
                                     <Button variant="outline" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                 </div>
              </div>
              <Button variant="outline" size="sm"><Plus className="mr-2 h-4 w-4"/>Añadir Ingrediente</Button>
            </div>
             <div className="space-y-4">
              <Label>Instrucciones</Label>
              <div className="space-y-2">
                <div className="flex gap-2 items-start">
                    <span className="pt-2 font-bold">1.</span>
                    <Textarea placeholder="Primer paso..." />
                    <Button variant="outline" size="icon" className="mt-1"><Trash2 className="h-4 w-4"/></Button>
                </div>
              </div>
              <Button variant="outline" size="sm"><Plus className="mr-2 h-4 w-4"/>Añadir Paso</Button>
            </div>
            <div className="space-y-2">
                <Label htmlFor="image">Imagen de la Receta</Label>
                <Input id="image" type="file" />
            </div>
            <Button type="submit" size="lg" className="w-full">Enviar para Revisión</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
