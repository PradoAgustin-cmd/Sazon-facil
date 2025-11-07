
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Ajustes</h1>
        <p className="text-muted-foreground">
          Aquí podrás configurar la aplicación.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Notificaciones</h2>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <h3 className="font-medium">Notificaciones por correo</h3>
            <p className="text-sm text-muted-foreground">
              Recibe un correo cuando haya nuevas recetas que te puedan gustar.
            </p>
          </div>
          <Switch id="email-notifications" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Perfil</h2>
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Administrar perfil</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Modifica tu información personal y preferencias.
          </p>
          <Link href="/profile">
            <Button>Ir al perfil</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Preferencias de dieta</h2>
        <div className="rounded-lg border p-4 space-y-4">
          <div>
            <h3 className="font-medium">Restricciones alimentarias</h3>
            <p className="text-sm text-muted-foreground">
              Selecciona tus preferencias para filtrar recetas.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="vegetarian" />
              <Label htmlFor="vegetarian">Vegetariano</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="vegan" />
              <Label htmlFor="vegan">Vegano</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="gluten-free" />
              <Label htmlFor="gluten-free">Sin gluten</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="dairy-free" />
              <Label htmlFor="dairy-free">Sin lactosa</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
