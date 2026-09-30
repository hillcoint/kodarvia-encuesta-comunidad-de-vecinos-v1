import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "../components/community-app";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Convivir · Panel administrativo" },
      { name: "description", content: "Panel de métricas y seguimiento de satisfacción de residentes." },
    ],
  }),
  component: AdminPage,
});
