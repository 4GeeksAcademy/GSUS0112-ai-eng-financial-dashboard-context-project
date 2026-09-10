/**
 * Tipos de dominio compartidos, alineados con los `Literal` de `backend/app/routes.py`.
 */

/** Tipo de operación financiera registrada en un movimiento. */
export type OperationType = "income" | "outcome";

/** Categoría contable asociada a un movimiento financiero. */
export type Category =
  | "suppliers"
  | "sales"
  | "operational"
  | "administrative"
  | "others";

/** Segmento de negocio del movimiento: empresa a empresa o empresa a consumidor. */
export type BusinessType = "B2B" | "B2C";

// ---------------------------------------------------------------------------
// 1. Rango de fechas y vista B2B/B2C -> GET /api/metrics/facets
// ---------------------------------------------------------------------------

/**
 * Representa los valores disponibles para poblar los filtros del dashboard
 * (tipos de operación, segmentos de negocio, categorías y rango de fechas),
 * calculados a partir de todos los movimientos existentes.
 */
export interface FacetsResponse {
  /** Lista de tipos de operación presentes en los datos (p. ej. "income", "outcome"). */
  operation_types: OperationType[];
  /** Lista de segmentos de negocio presentes en los datos ("B2B", "B2C"). */
  business_types: BusinessType[];
  /** Lista de categorías contables presentes en los datos. */
  categories: Category[];
  /** Fecha más antigua registrada entre todos los movimientos, en formato ISO (YYYY-MM-DD). */
  min_date: string;
  /** Fecha más reciente registrada entre todos los movimientos, en formato ISO (YYYY-MM-DD). */
  max_date: string;
}

// ---------------------------------------------------------------------------
// 2. Tabla de anomalías -> GET /api/metrics/alerts
// ---------------------------------------------------------------------------

/**
 * Anomalía detectada en un período cuando el total de egresos supera
 * el promedio histórico en más del umbral configurado.
 */
export interface AlertEntry {
  /** Período al que corresponde la alerta (formato depende de `group_by`: día, semana o mes). */
  period: string;
  /** Suma total de egresos ("outcome") registrados en el período. */
  outcome_total: number;
  /** Promedio de egresos de los períodos anteriores, usado como línea base de comparación. */
  baseline_average: number;
  /** Proporción de incremento respecto a la línea base (p. ej. 0.35 equivale a un aumento del 35%). */
  increase_ratio: number;
}

/** Colección de anomalías detectadas para la tabla de alertas del dashboard. */
export type AlertsResponse = AlertEntry[];

// ---------------------------------------------------------------------------
// 3. Tabla comparativa B2B/B2C -> GET /api/metrics/categories/top
// ---------------------------------------------------------------------------

/** Categoría con su monto total acumulado, usada en la tabla comparativa por segmento. */
export interface CategoryEntry {
  /** Categoría contable a la que pertenece el total acumulado. */
  category: Category;
  /** Tipo de operación al que corresponde el total (income u outcome). */
  operation_type: OperationType;
  /** Monto total acumulado para esta categoría y tipo de operación. */
  total_amount: number;
}

/** Listado de las categorías con mayor monto acumulado, ordenadas de mayor a menor. */
export type TopCategoriesResponse = CategoryEntry[];
