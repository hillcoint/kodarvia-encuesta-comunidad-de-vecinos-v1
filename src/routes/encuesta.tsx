import { createFileRoute } from "@tanstack/react-router";
import { SurveyPage } from "../components/community-app";

export const Route = createFileRoute("/encuesta")({
  head: () => ({
    meta: [
      { title: "Convivir · Encuesta" },
      { name: "description", content: "Encuesta rápida de satisfacción para residentes." },
    ],
  }),
  component: SurveyPage,
});
