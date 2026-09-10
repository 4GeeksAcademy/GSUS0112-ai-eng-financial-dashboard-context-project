import type { OperationType, BusinessType } from "./api-types";

/**
 * Filtro base de rango de fechas, compartido por los distintos endpoints
 * de métricas que aceptan un período opcional.
 */
export interface DateRangeFilter {
  /** Fecha de inicio del rango a filtrar, en formato ISO (YYYY-MM-DD). Opcional. */
  start_date?: string;
  /** Fecha de fin del rango a filtrar, en formato ISO (YYYY-MM-DD). Opcional. */
  end_date?: string;
}

/** Parámetros de consulta para el endpoint de detección de anomalías (alertas). */
export interface AlertsParams extends DateRangeFilter {
  /** Umbral mínimo de incremento (ratio, p. ej. 0.3 equivale a 30%) para considerar una anomalía. */
  threshold: number;
  /** Segmento de negocio por el que filtrar las alertas ("B2B" o "B2C"). Opcional. */
  business_type?: BusinessType;
}

/** Parámetros de consulta para el endpoint de categorías con mayor monto acumulado. */
export interface TopCategoriesParams extends DateRangeFilter {
  /** Tipo de operación a considerar para el ranking de categorías (income u outcome). */
  operation_type: OperationType;
  /** Cantidad máxima de categorías a devolver en el resultado. */
  limit: number;
  /** Segmento de negocio por el que filtrar las categorías ("B2B" o "B2C"). Opcional. */
  business_type?: BusinessType;
}
