# Contrato de Datos — Frontend Specs

Este documento es el **contrato de datos oficial** entre el frontend y el backend (`backend/app/routes.py`) para las 3 funcionalidades especificadas en [api-types.ts](./api-types.ts), [param-types.ts](./param-types.ts) y [components.md](./components.md).

---

## 1. Rango de fechas y vista B2B/B2C

### Endpoints consumidos
- `GET /api/metrics/facets` — obtiene los valores disponibles para poblar los filtros (fechas límite, segmentos, categorías).

### Mapeo de Tipos TypeScript
| Dirección | Interface | Archivo |
|---|---|---|
| Petición (query params) | *(sin parámetros)* — este endpoint no acepta query params | — |
| Respuesta | `FacetsResponse` | [api-types.ts](./api-types.ts) |

> Nota: el filtro de fechas y segmento que el usuario configura (`DateRangeFilter` + `business_type`) no se envía a `/api/metrics/facets`; se envía a los endpoints de datos (`/api/metrics/summary`, `/api/metrics/categories/top`, etc.) como `start_date`/`end_date`/`business_type`.

### Valores válidos y restricciones
- `min_date` y `max_date` en la respuesta llegan en formato ISO `YYYY-MM-DD` (serialización de `date` de Pydantic).
- Al construir peticiones a otros endpoints con `DateRangeFilter`, `start_date` y `end_date` deben respetar el formato `YYYY-MM-DD` y estar dentro del rango `[facets.min_date, facets.max_date]`.
- `business_type` es opcional; los únicos valores válidos son `"B2B"` y `"B2C"` (ausencia = todos los segmentos).

### Casos límite (Edge Cases)
1. **Solo un extremo de fecha completado**: si el usuario llena únicamente `start_date`, el frontend debe enviar `end_date = facets.max_date` como valor efectivo (y viceversa). El backend no infiere el extremo faltante: si se omite un parámetro, lo trata como "sin límite en esa dirección", pero para consistencia con la UI (que muestra el rango real usado) el frontend debe enviarlo explícito.
2. **`facets` aún no ha cargado**: si el usuario interactúa con el filtro antes de que `/api/metrics/facets` responda, el frontend no debe enviar peticiones a los endpoints de datos hasta tener `min_date`/`max_date` (evita solicitudes con límites indefinidos). Los controles deben permanecer deshabilitados.
3. **`start_date` posterior a `end_date`**: el backend no valida este caso (simplemente filtrará con `>=` y `<=`, devolviendo una lista vacía). El frontend debe validar esto **antes** de enviar la petición y mostrar un error inline, evitando una llamada innecesaria.

---

## 2. Tabla de anomalías

### Endpoints consumidos
- `GET /api/metrics/alerts?threshold=X&group_by=Y&start_date=...&end_date=...&business_type=...`

### Mapeo de Tipos TypeScript
| Dirección | Interface | Archivo |
|---|---|---|
| Petición (query params) | `AlertsParams` | [param-types.ts](./param-types.ts) |
| Respuesta | `AlertsResponse` (`AlertEntry[]`) | [api-types.ts](./api-types.ts) |

### Valores válidos y restricciones
- `threshold`: número decimal que representa un ratio de incremento. El backend solo exige `threshold >= 0` (`Query(default=0.3, ge=0)`); **no impone un límite superior**. Se recomienda que el frontend restrinja la entrada del usuario al rango `[0.01, 1.0]` (1% a 100% de incremento) por usabilidad, aunque el backend técnicamente acepta valores mayores.
- `group_by`: debe ser uno de `"day" | "week" | "month"` (default `"month"`).
- `start_date` / `end_date`: formato `YYYY-MM-DD`, opcionales.
- `business_type`: opcional, `"B2B" | "B2C"`.

### Casos límite (Edge Cases)
1. **`threshold` igual a 0**: el backend acepta `threshold = 0`, lo que devolverá una alerta en prácticamente cualquier incremento positivo. El frontend debe advertir al usuario (ej. tooltip) que un umbral de 0 puede generar una lista extensa de "anomalías" poco significativas.
2. **Sin datos suficientes para calcular línea base**: si el rango filtrado produce un único período (o ninguno) en `summarize_movements`, `detect_outcome_alerts` no puede calcular `baseline_average` (necesita al menos un período histórico previo) y devolverá una lista vacía. El frontend debe enviar el rango tal cual y confiar en el **estado vacío explícito** de `AnomaliesTable` (ver [components.md](./components.md#2-tabla-de-anomalías)) para comunicarlo, en lugar de interpretarlo como error.
3. **Lista vacía por umbral alto**: si `alerts.length === 0` porque el `threshold` es muy exigente, el frontend debe mostrar el mensaje de estado vacío interpolando el valor de `params.threshold` enviado, para dejar claro que es relativo al umbral y no un fallo de carga.

---

## 3. Tabla comparativa B2B/B2C (Top Categorías)

### Endpoints consumidos
- `GET /api/metrics/categories/top?operation_type=X&limit=N&start_date=...&end_date=...&business_type=B2B`
- `GET /api/metrics/categories/top?operation_type=X&limit=N&start_date=...&end_date=...&business_type=B2C`

> Se requieren **dos llamadas independientes** (una por segmento) para alimentar los paneles paralelos de `TopCategoriesComparisonPanel`.

### Mapeo de Tipos TypeScript
| Dirección | Interface | Archivo |
|---|---|---|
| Petición (query params, una por panel) | `TopCategoriesParams` | [param-types.ts](./param-types.ts) |
| Respuesta (una por panel) | `TopCategoriesResponse` (`CategoryEntry[]`) | [api-types.ts](./api-types.ts) |

### Valores válidos y restricciones
- `operation_type`: obligatorio, `"income" | "outcome"` (el backend lo usa por defecto como `"outcome"`, pero el frontend debe enviarlo explícito para las dos llamadas paralelas).
- `limit`: entero entre `1` y `20` (`Query(ge=1, le=20)`), valor por defecto documentado en backend: `5`. El frontend debe validar este rango antes de enviar la petición para evitar un `422` de FastAPI.
- `business_type`: obligatorio en este flujo (uno de los dos paneles usa `"B2B"`, el otro `"B2C"`); a diferencia de otros endpoints, aquí no se omite porque cada panel representa un segmento fijo.
- `start_date` / `end_date`: formato `YYYY-MM-DD`, opcionales, deben ser iguales para ambos paneles (mismo período comparado).

### Casos límite (Edge Cases)
1. **`limit` fuera de rango**: si el usuario configura un valor de `limit` fuera de `[1, 20]` (ej. mediante manipulación de la URL o un input libre), el backend responde `422 Unprocessable Entity`. El frontend debe clamear/validar `limit` en el cliente antes de construir la petición, y nunca confiar solo en la validación del backend para la UX.
2. **Un panel sin categorías (`CategoryEntry[]` vacío)**: si para un segmento (ej. B2C) no existen movimientos del `operation_type` solicitado en el rango de fechas, `build_top_categories` devuelve una lista vacía solo para ese panel. El frontend debe mostrar el estado vacío **únicamente en el panel afectado**, sin ocultar ni afectar el panel opuesto que sí tiene datos (ver [components.md](./components.md#3-tabla-comparativa-b2b-vs-b2c-top-categorías)).
3. **Peticiones asíncronas desincronizadas**: como cada panel depende de una llamada HTTP independiente, es posible que respondan en momentos distintos o que una falle mientras la otra tiene éxito. El frontend debe manejar el estado de carga y error de forma independiente por panel (`isLoading.b2b` / `isLoading.b2c`), evitando que el fallo de un panel bloquee el renderizado del otro.
