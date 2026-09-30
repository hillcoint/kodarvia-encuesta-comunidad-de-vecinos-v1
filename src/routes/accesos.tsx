import { createFileRoute } from "@tanstack/react-router";
import { AccessPage } from "../components/community-app";

export const Route = createFileRoute("/accesos")({
  head: () => ({
    meta: [
      { title: "Convivir · Enlaces y QR" },
      { name: "description", content: "Generador de accesos parametrizados para encuestas." },
    ],
  }),
  component: AccessPage,
});
