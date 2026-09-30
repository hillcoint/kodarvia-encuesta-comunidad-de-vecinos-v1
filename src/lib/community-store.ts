export type EstadoRespuesta = "Pendiente" | "En atención" | "Resuelto";

export type Respuesta = {
  id: string;
  fecha: string;
  edificio: string;
  servicio: string;
  valoracionGeneral: number;
  tiempoRespuesta: number;
  tratoPersonal: number;
  valoracionServicio: number;
  comentario: string;
  contacto?: string;
  consentimiento: boolean;
  estado: EstadoRespuesta;
};

export type AlertaSimulada = {
  id: string;
  respuestaId: string;
  fecha: string;
  canal: "WhatsApp/correo";
  mensaje: string;
};

export const EDIFICIOS = [
  "Torres del Refugio",
  "Parque Residencial Normandía",
  "Conjunto Altos de Granada",
  "Reserva de San Fernando",
  "Bosques de Pance",
];

export const SERVICIOS = [
  "Mantenimiento de ascensores",
  "Jardinería",
  "Seguridad perimetral",
  "Limpieza de áreas comunes",
  "Reparaciones",
  "Atención administrativa",
];

const RESPUESTAS_KEY = "convivir_respuestas_v1";
const ALERTAS_KEY = "convivir_alertas_v1";

const rawSeed: Array<[
  string,
  string,
  string,
  number,
  number,
  number,
  number,
  string,
  EstadoRespuesta,
  string?
]> = [
  ["2026-09-30T09:18:00-05:00", "Torres del Refugio", "Mantenimiento de ascensores", 5, 5, 5, 5, "El técnico llegó a la hora acordada y dejó el ascensor funcionando perfectamente.", "Resuelto", "Carolina M. · carolina@example.com"],
  ["2026-09-29T17:05:00-05:00", "Parque Residencial Normandía", "Limpieza de áreas comunes", 4, 4, 5, 4, "La zona social quedó muy bien. Gracias por atender la solicitud tan rápido.", "Resuelto"],
  ["2026-09-29T11:32:00-05:00", "Conjunto Altos de Granada", "Seguridad perimetral", 2, 2, 4, 2, "La puerta peatonal sigue fallando y anoche quedó abierta durante varios minutos.", "En atención", "Andrés P. · 300 555 0182"],
  ["2026-09-28T15:44:00-05:00", "Reserva de San Fernando", "Jardinería", 5, 4, 5, 5, "Muy buen trabajo en los jardines de la entrada. Se nota el cambio.", "Resuelto"],
  ["2026-09-28T08:20:00-05:00", "Bosques de Pance", "Atención administrativa", 3, 3, 4, 3, "La atención fue amable, aunque tardaron varios días en responder el correo.", "Pendiente"],
  ["2026-09-27T18:11:00-05:00", "Torres del Refugio", "Reparaciones", 1, 1, 3, 1, "La filtración del parqueadero continúa y ya ha afectado dos puestos.", "En atención", "Diana R. · 315 555 1024"],
  ["2026-09-27T10:02:00-05:00", "Parque Residencial Normandía", "Mantenimiento de ascensores", 4, 5, 4, 4, "Buen servicio y comunicación clara sobre el mantenimiento preventivo.", "Resuelto"],
  ["2026-09-26T16:36:00-05:00", "Conjunto Altos de Granada", "Limpieza de áreas comunes", 5, 5, 5, 5, "Excelente la limpieza del salón comunal después del evento del sábado.", "Resuelto"],
  ["2026-09-25T13:50:00-05:00", "Reserva de San Fernando", "Seguridad perimetral", 4, 3, 5, 4, "El guarda fue muy atento y resolvió la novedad del visitante sin inconvenientes.", "Resuelto"],
  ["2026-09-24T09:27:00-05:00", "Bosques de Pance", "Jardinería", 2, 2, 4, 2, "Hay ramas acumuladas desde hace varios días junto al bloque C.", "Pendiente", "Felipe G. · felipe@example.com"],
  ["2026-09-23T19:02:00-05:00", "Torres del Refugio", "Atención administrativa", 5, 5, 5, 5, "Me ayudaron con el certificado de paz y salvo el mismo día. Excelente atención.", "Resuelto"],
  ["2026-09-23T08:41:00-05:00", "Parque Residencial Normandía", "Reparaciones", 3, 4, 4, 3, "La reparación quedó hecha, pero faltó limpiar mejor la zona al terminar.", "Resuelto"],
  ["2026-09-22T14:18:00-05:00", "Conjunto Altos de Granada", "Mantenimiento de ascensores", 5, 5, 5, 4, "Rápidos y profesionales. Informaron a los residentes antes de iniciar.", "Resuelto"],
  ["2026-09-21T17:33:00-05:00", "Reserva de San Fernando", "Limpieza de áreas comunes", 4, 4, 5, 4, "Todo correcto en pasillos y ascensores. Se agradece la constancia.", "Resuelto"],
  ["2026-09-20T12:12:00-05:00", "Bosques de Pance", "Seguridad perimetral", 1, 2, 2, 1, "No hubo control adecuado del ingreso de un proveedor y nadie supo dar razón.", "En atención", "Marcela T. · 301 555 1177"],
  ["2026-09-19T09:58:00-05:00", "Torres del Refugio", "Jardinería", 4, 4, 5, 4, "Las zonas verdes quedaron ordenadas y podaron los arbustos que tapaban la señalización.", "Resuelto"],
  ["2026-09-18T18:22:00-05:00", "Parque Residencial Normandía", "Atención administrativa", 5, 4, 5, 5, "La administradora explicó claramente el proceso para reservar el salón social.", "Resuelto"],
  ["2026-09-17T11:17:00-05:00", "Conjunto Altos de Granada", "Reparaciones", 2, 2, 3, 2, "La luminaria del sótano volvió a fallar dos días después de la reparación.", "Pendiente"],
  ["2026-09-16T16:05:00-05:00", "Reserva de San Fernando", "Mantenimiento de ascensores", 4, 4, 4, 4, "El mantenimiento tomó lo previsto y no hubo molestias adicionales.", "Resuelto"],
  ["2026-09-15T08:49:00-05:00", "Bosques de Pance", "Limpieza de áreas comunes", 5, 5, 5, 5, "Muy buena limpieza de la piscina y baños de la zona común.", "Resuelto"],
  ["2026-09-14T15:39:00-05:00", "Torres del Refugio", "Seguridad perimetral", 3, 3, 4, 3, "La atención fue correcta, pero el registro de visitantes se está demorando demasiado.", "Pendiente"],
  ["2026-09-13T10:26:00-05:00", "Parque Residencial Normandía", "Jardinería", 5, 4, 5, 5, "Quedó muy bonita la entrada principal y recogieron todos los residuos de poda.", "Resuelto"],
  ["2026-09-12T18:14:00-05:00", "Conjunto Altos de Granada", "Atención administrativa", 4, 4, 5, 4, "Respondieron bien mi consulta sobre la cuota extraordinaria.", "Resuelto"],
  ["2026-09-11T09:06:00-05:00", "Reserva de San Fernando", "Reparaciones", 1, 1, 2, 1, "El daño de la bomba de agua tardó demasiado en atenderse y hubo cortes durante la mañana.", "Resuelto", "Julián C. · 312 555 8821"],
  ["2026-09-10T14:46:00-05:00", "Bosques de Pance", "Mantenimiento de ascensores", 4, 4, 5, 4, "Servicio correcto y sin retrasos. Buen trato del técnico.", "Resuelto"],
  ["2026-09-09T17:21:00-05:00", "Torres del Refugio", "Limpieza de áreas comunes", 5, 5, 5, 5, "Los pasillos y la recepción se mantienen impecables. Muchas gracias.", "Resuelto"],
  ["2026-09-08T11:09:00-05:00", "Parque Residencial Normandía", "Seguridad perimetral", 2, 3, 3, 2, "El citófono de la portería lleva varios días con problemas de audio.", "En atención"],
  ["2026-09-07T08:37:00-05:00", "Conjunto Altos de Granada", "Jardinería", 4, 4, 4, 5, "Buen trabajo de poda y riego en las zonas interiores.", "Resuelto"],
];

export const seedResponses = (): Respuesta[] =>
  rawSeed.map((row, index) => ({
    id: `R-${String(index + 1).padStart(3, "0")}`,
    fecha: row[0],
    edificio: row[1],
    servicio: row[2],
    valoracionGeneral: row[3],
    tiempoRespuesta: row[4],
    tratoPersonal: row[5],
    valoracionServicio: row[6],
    comentario: row[7],
    estado: row[8],
    contacto: row[9],
    consentimiento: true,
  }));

const isBrowser = () => typeof window !== "undefined";

export function readResponses(): Respuesta[] {
  if (!isBrowser()) return seedResponses();
  const stored = window.localStorage.getItem(RESPUESTAS_KEY);
  if (!stored) {
    const seeded = seedResponses();
    window.localStorage.setItem(RESPUESTAS_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(stored) as Respuesta[];
  } catch {
    return seedResponses();
  }
}

export function writeResponses(responses: Respuesta[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(RESPUESTAS_KEY, JSON.stringify(responses));
  window.dispatchEvent(new Event("convivir-data-changed"));
}

export function addResponse(response: Respuesta) {
  const responses = readResponses();
  writeResponses([response, ...responses]);
}

export function updateResponseState(id: string, estado: EstadoRespuesta) {
  writeResponses(readResponses().map((item) => (item.id === id ? { ...item, estado } : item)));
}

export function readAlerts(): AlertaSimulada[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(window.localStorage.getItem(ALERTAS_KEY) || "[]") as AlertaSimulada[];
  } catch {
    return [];
  }
}

export function pushAlert(respuesta: Respuesta) {
  if (!isBrowser()) return;
  const alert: AlertaSimulada = {
    id: `A-${Date.now()}`,
    respuestaId: respuesta.id,
    fecha: respuesta.fecha,
    canal: "WhatsApp/correo",
    mensaje: `Valoración crítica (${respuesta.valoracionGeneral}/5) en ${respuesta.edificio} · ${respuesta.servicio}`,
  };
  window.localStorage.setItem(ALERTAS_KEY, JSON.stringify([alert, ...readAlerts()]));
}

export function resetDemoData() {
  if (!isBrowser()) return seedResponses();
  const seeded = seedResponses();
  window.localStorage.setItem(RESPUESTAS_KEY, JSON.stringify(seeded));
  window.localStorage.setItem(ALERTAS_KEY, "[]");
  window.dispatchEvent(new Event("convivir-data-changed"));
  return seeded;
}

export function exportResponses(responses: Respuesta[], format: "csv" | "json") {
  if (!isBrowser()) return;
  const filename = `convivir-respuestas-${new Date().toISOString().slice(0, 10)}.${format}`;
  let content = "";
  let type = "application/json;charset=utf-8";

  if (format === "json") {
    content = JSON.stringify(responses, null, 2);
  } else {
    type = "text/csv;charset=utf-8";
    const headers = [
      "id",
      "fecha",
      "edificio",
      "servicio",
      "valoracionGeneral",
      "tiempoRespuesta",
      "tratoPersonal",
      "valoracionServicio",
      "comentario",
      "contacto",
      "consentimiento",
      "estado",
    ];
    const escape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    content = [headers.join(","), ...responses.map((r) => headers.map((h) => escape(r[h as keyof Respuesta])).join(","))].join("\n");
  }

  const blob = new Blob([content], { type });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(href);
}
