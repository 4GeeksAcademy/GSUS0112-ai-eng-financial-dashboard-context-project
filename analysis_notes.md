# Hallazgos de Ingeniería - Fase 2

Durante la revisión exhaustiva del código, he identificado las siguientes convenciones y patrones de riesgo que impactarán a futuros desarrolladores o agentes:

## 1. Backend (Python/FastAPI)
*   **Convención útil (Tipado estricto):** El backend hace un uso extensivo de Pydantic (`backend/app/routes.py`). Todas las entradas y salidas de las rutas (`MetricsFacets`, `TopCategoryItem`, etc.) están tipadas explícitamente. Esto es excelente para la autocompletación y generación de documentación (Swagger).
*   **Patrón de riesgo (Mocking estático e inyección nula):** Absolutamente todos los endpoints llaman directamente a `generate_mock_movements(seed=42)`. No existe una capa de acceso a datos (DAO/Repository) ni inyección de dependencias.
    *   *Riesgo:* Si se quiere conectar a una base de datos real, habrá que reescribir cada uno de los controladores. Además, al usar `seed=42`, los datos siempre son idénticos, lo que puede dar la falsa impresión de que los filtros no cambian en el tiempo real.
*   **Convención (Rutas síncronas):** Los endpoints están definidos con `def` normal, no `async def`. FastAPI ejecutará esto en un threadpool.

## 2. Frontend (React/Vite)
*   **Patrón de riesgo (Proxy atado a Docker):** En `frontend/vite.config.ts`, el proxy para la API apunta a `target: "http://backend:8000"`.
    *   *Riesgo:* Esto funciona perfecto si el frontend corre **dentro** del contenedor (vía docker-compose). Pero si un desarrollador corre `npm run dev` localmente en su máquina, las peticiones fallarán porque su sistema operativo no sabe qué es `backend`. 
*   **Convención (Alias de importación):** Se utiliza el patrón de alias `@/` para importar componentes y utilidades (configurado en `tsconfig.json` y `vite.config.ts`), por ejemplo: `import { KPIRow } from "@/components/dashboard/kpi-row";`.
*   **Convención (Carga de datos):** La arquitectura de fetching es muy primitiva. Se hace fetching de datos en `useEffect` con estados locales (`loading`, `error`, `data`) dentro de `App.tsx`. No se utilizan herramientas como React Query ni Redux.
