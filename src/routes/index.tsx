import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kodarvia - Comunidad de Vecinos" },
      { name: "description", content: "Proyecto base de Kodarvia - Comunidad de Vecinos." },
      { property: "og:title", content: "Kodarvia - Comunidad de Vecinos" },
      { property: "og:description", content: "Proyecto base de Kodarvia - Comunidad de Vecinos." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Comunidad de Vecinos
        </h1>
        <p className="mt-3 text-lg text-muted-foreground sm:text-xl">Proyecto base</p>
        <p className="mt-6 text-sm text-muted-foreground">Aplicación en construcción</p>
      </div>
    </main>
  );
}
