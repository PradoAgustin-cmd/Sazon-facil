import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Plus } from 'lucide-react';

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function MealPlannerPage() {
  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Planificador Semanal de Comidas
            </h1>
            <p className="mt-2 text-muted-foreground">
              Planifica tus comidas para la semana y genera una lista de compras.
            </p>
          </div>
          <Button>Generar Lista de Compras</Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {days.map((day) => (
            <Card key={day} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline text-lg">{day}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Desayuno</h3>
                  <Card className="border-dashed">
                    <CardContent className="p-4 text-center text-sm text-muted-foreground">
                      <Button variant="ghost" size="sm" className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Añadir receta
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Almuerzo</h3>
                   <Card className="border-dashed">
                    <CardContent className="p-4 text-center text-sm text-muted-foreground">
                      <Button variant="ghost" size="sm" className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Añadir receta
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Cena</h3>
                   <Card>
                    <CardHeader className="p-2">
                        <CardTitle className="text-xs">Ensalada de Pasta de Verano</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 pt-0 text-xs text-muted-foreground">
                        Una comida rápida y fácil.
                    </CardContent>
                   </Card>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
