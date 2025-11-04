
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Recipe } from '@/lib/types';

interface ShoppingListDialogProps {
  children: React.ReactNode;
  mealPlan: Record<string, Record<string, Recipe | null>>;
}

export function ShoppingListDialog({ children, mealPlan }: ShoppingListDialogProps) {
  const shoppingList = Object.values(mealPlan).reduce((acc, day) => {
    Object.values(day).forEach((meal) => {
      if (meal) {
        meal.ingredients.forEach((ingredient) => {
          const existingIngredient = acc.find((i) => i.item === ingredient.item);
          if (existingIngredient) {
            // Note: This is a simple string concatenation. A more robust solution
            // would be to parse and add quantities, but that's complex.
            existingIngredient.amount += `, ${ingredient.amount}`;
          } else {
            acc.push({ ...ingredient });
          }
        });
      }
    });
    return acc;
  }, [] as { item: string; amount: string }[]);

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.text('Lista de Compras', 10, 10);
    shoppingList.forEach((ingredient, index) => {
      doc.text(`${ingredient.item}: ${ingredient.amount}`, 10, 20 + index * 10);
    });
    doc.save('lista-de-compras.pdf');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lista de Compras</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {shoppingList.length > 0 ? (
            <ul className="space-y-2">
              {shoppingList.map((ingredient) => (
                <li key={ingredient.item} className="flex justify-between">
                  <span>{ingredient.item}</span>
                  <span>{ingredient.amount}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground">
              No hay recetas seleccionadas.
            </p>
          )}
        </div>
        {shoppingList.length > 0 && (
          <Button onClick={handleDownloadPdf}>Descargar como PDF</Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
