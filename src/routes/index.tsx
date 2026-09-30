import { createFileRoute } from "@tanstack/react-router";
import { SurveyPage } from "../components/community-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Convivir · Encuesta de satisfacción" },
      { name: "description", content: "Valora la atención y los servicios de tu comunidad en menos de un minuto." },
      { property: "og:title", content: "Convivir · Encuesta de satisfacción" },
      { property: "og:description", content: "Tu opinión nos ayuda a mejorar cada servicio de la comunidad." },
    ],
  }),
  component: SurveyPage,
});
