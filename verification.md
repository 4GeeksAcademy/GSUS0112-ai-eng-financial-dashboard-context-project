# Verificación del Proyecto

## Resumen de Servicios

✅ **Frontend (Dashboard UI):**
- **Tecnología:** React 19 + TypeScript + Vite + Tailwind v4 + Recharts.
- **Entry point verificado:** `frontend/package.json` script `"dev": "vite"`.
- **Puerto verificado:** `5173` (según `docker-compose.yml`).

✅ **Backend (API):**
- **Tecnología:** Python + FastAPI.
- **Entry point verificado:** `backend/app/main.py`.
- **Puerto verificado:** `8000` (y `5678` para debug, según `docker-compose.yml`).

## Ejecución
✅ **Comando de inicio:** `docker-compose up --build` (levanta ambos servicios mapeando los volúmenes locales).
