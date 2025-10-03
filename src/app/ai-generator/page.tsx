import { GeneratorForm } from '@/components/ai/generator-form';

export default function AiGeneratorPage() {
  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Generador de Recetas con IA
          </h1>
          <p className="mt-2 text-muted-foreground">
            ¿Sin ideas? Deja que nuestro chef de IA cree una receta única para ti.
          </p>
        </div>
        <GeneratorForm />
      </div>
    </main>
  );
}
