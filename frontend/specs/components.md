# Especificación de Componentes React — Dashboard Financiero

Este documento define los componentes React a construir para las 3 funcionalidades principales del dashboard, basados en los contratos de tipos definidos en [api-types.ts](../specs/api-types.ts) y [param-types.ts](../specs/param-types.ts).

---

## 1. Filtro de Rango de Fechas y Vista B2B/B2C

### Nombre del Componente
`DateRangeAndViewFilter`

### Props

| Prop | Tipo | Origen | Descripción |
|---|---|---|---|
| `facets` | `FacetsResponse` | `api-types.ts` | Valores disponibles para poblar los límites de fecha y las opciones de segmento de negocio. |
| `value` | `DateRangeFilter & { business_type?: BusinessType }` | `param-types.ts` / `api-types.ts` | Valor actual seleccionado por el usuario (fechas y segmento). |
| `onChange` | `(value: DateRangeFilter & { business_type?: BusinessType }) => void` | — | Callback invocado cuando el usuario modifica el filtro. |
| `isLoading` | `boolean` | — | Indica si `facets` aún se está cargando, para deshabilitar los inputs. |

### Renderizado Condicional y Reglas

1. **Filtro de fechas**:
   - Los límites de los selectores de fecha (`min`/`max` de los inputs) deben poblarse a partir de `facets.min_date` y `facets.max_date` (`FacetsResponse`), y deben mostrarse como texto de ayuda bajo los inputs (ej. "Datos disponibles: 2025-01-01 a 2025-12-31").
   - Si el usuario **solo** completa `start_date` (deja `end_date` vacío), el componente debe enviar la petición usando `end_date = facets.max_date` como valor efectivo (es decir, "desde la fecha indicada hasta el final de los datos disponibles").
   - Si el usuario **solo** completa `end_date` (deja `start_date` vacío), el componente debe enviar la petición usando `start_date = facets.min_date` como valor efectivo (es decir, "desde el inicio de los datos disponibles hasta la fecha indicada").
   - Si ambos campos están vacíos, no se aplica filtro de fecha (se solicita el rango completo).
   - Si `start_date` es posterior a `end_date`, el componente debe mostrar un mensaje de validación inline y no disparar `onChange`.

2. **Vista B2B/B2C**:
   - Se debe renderizar un selector (tabs o toggle) con las opciones disponibles en `facets.business_types`, más una opción "Todos" que corresponde a `business_type: undefined`.
   - Mientras `isLoading` sea `true`, el selector y los inputs de fecha deben mostrarse deshabilitados (no ocultos) con un estado de skeleton/placeholder.

---

## 2. Tabla de Anomalías

### Nombre del Componente
`AnomaliesTable`

### Props

| Prop | Tipo | Origen | Descripción |
|---|---|---|---|
| `alerts` | `AlertsResponse` | `api-types.ts` | Lista de anomalías (`AlertEntry[]`) a renderizar en la tabla. |
| `params` | `AlertsParams` | `param-types.ts` | Parámetros de consulta actuales, usados para mostrar el `threshold` vigente en el mensaje de estado vacío. |
| `isLoading` | `boolean` | — | Indica si la petición de alertas está en curso. |
| `error` | `string \| null` | — | Mensaje de error a mostrar si la petición falló. |

### Renderizado Condicional y Reglas

1. **Estado de carga**: mientras `isLoading` sea `true`, se muestra un skeleton de filas en lugar de la tabla o del mensaje vacío.
2. **Estado de error**: si `error` no es `null`, se muestra un mensaje de error en lugar de la tabla, con opción de reintentar.
3. **Estado vacío (¡EXPLÍCITO!)**: si `alerts.length === 0` (y no hay carga ni error en curso), la tabla **NO debe desaparecer ni renderizar `null`**. Debe mostrarse el contenedor de la tabla (encabezados incluidos) junto con un mensaje claro dentro del cuerpo de la tabla, por ejemplo:
   > "No se detectaron anomalías para el umbral actual de `{params.threshold * 100}%` de incremento. Prueba a reducir el umbral para ver más resultados."
   El mensaje debe interpolar dinámicamente el valor de `params.threshold` (proveniente de `AlertsParams`), para dejar explícito que la ausencia de resultados es relativa al umbral configurado y no un fallo de carga.
4. **Estado con datos**: si `alerts.length > 0`, se renderiza una fila por cada `AlertEntry`, mostrando `period`, `outcome_total`, `baseline_average` e `increase_ratio` (formateado como porcentaje).

---

## 3. Tabla Comparativa B2B vs B2C (Top Categorías)

### Nombre del Componente
`TopCategoriesComparisonPanel`

### Props

| Prop | Tipo | Origen | Descripción |
|---|---|---|---|
| `b2bCategories` | `TopCategoriesResponse` | `api-types.ts` | Lista de top-5 categorías (`CategoryEntry[]`) para el segmento B2B. |
| `b2cCategories` | `TopCategoriesResponse` | `api-types.ts` | Lista de top-5 categorías (`CategoryEntry[]`) para el segmento B2C. |
| `params` | `Omit<TopCategoriesParams, "business_type">` | `param-types.ts` | Parámetros comunes de consulta (rango de fechas, `operation_type`, `limit`) aplicados a ambos paneles. |
| `isLoading` | `{ b2b: boolean; b2c: boolean }` | — | Estado de carga independiente por panel. |

### Renderizado Condicional y Reglas

1. **Paneles en paralelo**: el componente renderiza **dos paneles lado a lado** (uno para B2B, uno para B2C), cada uno alimentado de forma independiente por `b2bCategories` y `b2cCategories` respectivamente. Cada panel gestiona su propio estado de carga según `isLoading.b2b` / `isLoading.b2c`, de modo que un panel puede mostrar datos mientras el otro sigue cargando.
2. **Estado de carga por panel**: mientras el respectivo flag de `isLoading` sea `true`, el panel muestra un skeleton de lista/tabla, sin afectar al panel opuesto.
3. **Estado vacío por panel (¡EXPLÍCITO!)**: si la lista de categorías de un panel (`b2bCategories` o `b2cCategories`) tiene longitud `0` (y no está en carga), ese panel específico debe mostrar un mensaje del tipo:
   > "No hay datos de categorías de {operation_type} para el segmento B2B/B2C en el rango de fechas seleccionado."
   El panel opuesto debe seguir renderizando normalmente sus datos si los tiene; el estado vacío es **independiente por panel**, nunca oculta ni afecta el panel con datos.
4. **Datos presentes**: cuando la lista de un panel tiene elementos, se renderiza como tabla/lista ordenada de mayor a menor `total_amount`, mostrando `category` y `total_amount` (formateado como moneda) para cada `CategoryEntry`.
