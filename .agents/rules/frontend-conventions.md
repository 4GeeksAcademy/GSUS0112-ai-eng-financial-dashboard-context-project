# Regla: Convenciones de Importación en Frontend

**Alcance:** Frontend (`/frontend`)
**Justificación:** Mantener consistencia, limpieza y legibilidad en cómo los componentes importan dependencias internas en el entorno de React + Vite.
**Regla:**
- NUNCA uses rutas relativas hacia atrás excesivas (ej. `../../components/ui/button.tsx`).
- SIEMPRE utiliza el alias de importación `@/` para referencias internas del código (ej. `import { KPIRow } from "@/components/dashboard/kpi-row"`). Esto está soportado por `tsconfig.json` y `vite.config.ts`.
