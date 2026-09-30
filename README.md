# Gestión de Comunidades Convivir

Demo mobile-first de encuesta de satisfacción y panel de métricas para administración de propiedades y comunidades residenciales.

## URL pública

https://convivir-comunidad-vecinos-cg-v1.lovable.app/

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

También puede usarse:

```bash
npm install
npm run dev
```

## Rutas

- `/` y `/encuesta`: encuesta pública para residentes.
- `/admin`: dashboard, métricas, filtros y bandeja de respuestas.
- `/accesos`: generador de enlace parametrizado y previsualización QR.
- `/sala`: vista simplificada de indicadores del mes.

## Datos de demostración

La aplicación precarga 28 respuestas realistas de conjuntos residenciales de Cali, con servicios de ascensores, jardinería, seguridad, limpieza, reparaciones y atención administrativa.

Los datos se guardan en el navegador mediante localStorage:

- `convivir_respuestas_v1`: respuestas de encuestas.
- `convivir_alertas_v1`: registro de alertas críticas simuladas.

Cada respuesta contiene:

```text
id, fecha, edificio, servicio,
valoracionGeneral, tiempoRespuesta, tratoPersonal, valoracionServicio,
comentario, contacto, consentimiento, estado
```

Estados disponibles: `Pendiente`, `En atención`, `Resuelto`.

## Qué está simulado

- Las valoraciones de 1 o 2 estrellas registran una alerta y muestran un aviso visual de envío por WhatsApp/correo, pero no se conecta ningún servicio real.
- El botón de reseña de Google aparece únicamente para valoraciones de 4 o 5 estrellas y utiliza un enlace de demostración.
- El módulo de accesos genera el enlace parametrizado y una previsualización QR local.
- Los textos legales son marcadores provisionales. Kodarvia incorporará las cláusulas definitivas.

La lógica queda preparada para facilitar la integración posterior de backend, webhooks, correo y base de datos por parte de Kodarvia.

## Reiniciar los datos de ejemplo

Desde `/admin`, pulsar **Reiniciar demo**. Se restauran las 28 respuestas iniciales y se vacía el registro de alertas simuladas.

También puede hacerse manualmente eliminando las claves `convivir_respuestas_v1` y `convivir_alertas_v1` de localStorage y recargando la aplicación.

## Funcionalidad incluida

- Encuesta mobile-first de 6 pasos, una pregunta por pantalla.
- Selector de edificio y servicio, con soporte para parámetros recibidos mediante enlace.
- Consentimiento obligatorio antes del envío.
- Resultado dinámico según valoración.
- Alerta crítica simulada inmediata para 1-2 estrellas.
- Invitación a reseña pública únicamente para 4-5 estrellas.
- Panel con KPIs, distribución de estrellas y evolución temporal.
- Filtros por fecha, edificio y calificación sin recargar la página.
- Bandeja de respuestas con comentario completo y cambio de estado.
- Exportación de respuestas a CSV y JSON.
- Generador de enlaces parametrizados y previsualización QR.
- Vista de sala con métricas mensuales.

## Entorno de entrega

El proyecto está preparado para ejecutarse íntegramente en frontend con datos de demostración almacenados en localStorage. Kodarvia podrá sustituir posteriormente las simulaciones por los servicios definitivos de backend y notificaciones.
