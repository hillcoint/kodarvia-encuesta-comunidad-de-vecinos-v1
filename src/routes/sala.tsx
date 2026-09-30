import { createFileRoute } from "@tanstack/react-router";
import { RoomPage } from "../components/community-app";

export const Route = createFileRoute("/sala")({
  head: () => ({
    meta: [
      { title: "Convivir · Vista de sala" },
      { name: "description", content: "Vista simplificada de indicadores mensuales de satisfacción." },
    ],
  }),
  component: RoomPage,
});
