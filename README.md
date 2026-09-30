# Gestión de Comunidades Convivir

Demo mobile-first de encuesta de satisfacción y panel de métricas para administración de propiedades y comunidades residenciales.

## Stack

- React 19
- TanStack Start / Router
- Tailwind CSS 4
- Recharts
- localStorage
- Lovable

No utiliza backend, Supabase ni servicios externos para almacenar o enviar datos.

## Arranque local

```bash
bun install
bun run dev
```

También puede usarse `npm install` + `npm run dev`.

## Rutas

- `/` y `/encuesta`: encuesta pública para residentes.
- `/admin`: dashboard, métricas, filtros y bandeja de respuestas.
- `/accesos`: generador de enlace parametrizado y previsualización QR.
- `/sala`: vista simplificada de indicadores del mes.

## Datos de demostración

La aplicación precarga 28 respuestas realistas de conjuntos residenciales de Cali, con servicios de ascensores, jardinería, seguridad, limpieza, reparaciones y atención administrativa.

Los datos se guardan en el navegador:

- `convivir_respuestas_v1`: respuestas de encuestas.
- `convivir_alertas_v1`: registro de alertas críticas simuladas.

Una respuesta contiene:

```text
id, fecha, edificio, servicio,
valoracionGeneral, tiempoRespuesta, tratoPersonal, valoracionServicio,
comentario, contacto, consentimiento, estado
```

Estados disponibles: `Pendiente`, `En atención`, `Resuelto`.

## Qué está simulado

- Las valoraciones de 1 o 2 estrellas registran una alerta y muestran el aviso visual de envío por WhatsApp/correo, pero no se conecta ningún servicio real.
- El botón de reseña de Google aparece únicamente para valoraciones de 4 o 5 estrellas y usa un enlace de demostración.
- El módulo de accesos genera el enlace parametrizado y una previsualización QR local; Kodarvia puede sustituir el render del QR por el componente definitivo al integrar producción.
- Los textos legales son marcadores provisionales. Kodarvia incorporará las cláusulas definitivas.

La lógica queda separada del backend para facilitar la integración posterior de webhooks, correo y base de datos.

## Reiniciar los datos

Desde `/admin`, pulsar **Reiniciar demo**. Se restauran las 28 respuestas iniciales y se vacía el registro de alertas simuladas.

También puede hacerse manualmente desde las herramientas del navegador eliminando las claves `convivir_respuestas_v1` y `convivir_alertas_v1` de localStorage y recargando la aplicación.

## Funcionalidad incluida

- Encuesta de 6 pasos, una pregunta por pantalla.
- Consentimiento obligatorio antes del envío.
- Resultado dinámico para valoraciones bajas, neutras y positivas.
- Alerta crítica simulada inmediata para 1-2 estrellas.
- Invitación a reseña únicamente para 4-5 estrellas.
- Panel con KPIs, distribución de estrellas y evolución temporal.
- Filtros por fecha, edificio y calificación sin recarga.
- Bandeja de respuestas, comentario completo y cambio de estado.
- Exportación completa a CSV y JSON.
- Generador de enlaces parametrizados y QR visual.
- Vista de sala con métricas mensuales.

## URL pública

Se añadirá aquí la URL de previsualización publicada en Lovable antes de la entrega final a Kodarvia.
