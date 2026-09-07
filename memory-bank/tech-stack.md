# Stack Tecnológico

El proyecto está estructurado como un monorepo que separa frontend y backend, orquestados en contenedores.

## Frontend (Dashboard UI)
- **Framework:** React 19 + TypeScript.
- **Bundler:** Vite.
- **Estilos:** Tailwind CSS v4.
- **Gráficos:** Recharts (`^3.8.1`).
- **Iconos:** Lucide React.
- **Testing:** Vitest (configurado pero sin cobertura implementada de forma agresiva aún).
- **Componentes:** Adopta convenciones de diseño similares a `shadcn/ui` (class-variance-authority, clsx, tailwind-merge).

## Backend (API Financiera)
- **Framework:** FastAPI (Python).
- **Servidor:** Uvicorn (con soporte para estándar HTTP).
- **Validación/Tipado:** Pydantic (usado nativamente a través de FastAPI).
- **Testing:** Pytest + pytest-cov.
- **Depuración:** debugpy (expuesto en puerto 5678).

## Infraestructura y DevOps
- **Contenedorización:** Docker & Docker Compose (`docker-compose.yml`).
- **Comunicación:** El frontend se comunica con el backend a través de un Proxy configurado en Vite (`target: "http://backend:8000"`).
