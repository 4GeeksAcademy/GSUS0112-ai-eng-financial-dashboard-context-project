# Regla: Entorno de Ejecución

**Alcance:** DevOps / Entorno Local
**Justificación:** El archivo `frontend/vite.config.ts` utiliza un proxy inverso hacia `/api` que apunta explícitamente al hostname `backend`.
**Regla:**
- NUNCA intentes ejecutar el frontend o backend por separado localmente (ej. usando `npm run dev` o `uvicorn` directo en consola).
- SIEMPRE levanta el entorno utilizando `docker-compose up`. Esto garantiza que los contenedores existan en la misma red y el frontend pueda encontrar la API.
