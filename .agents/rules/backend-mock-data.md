# Regla: Datos Mockeados en Backend

**Alcance:** Backend (`/backend`)
**Justificación:** El backend actualmente no está conectado a ninguna base de datos y debe generar reportes fijos para mantener consistentes las visualizaciones del frontend.
**Regla:** 
- NUNCA intentes instalar ORMs (SQLAlchemy, Prisma) ni intentes conectar a una base de datos como PostgreSQL o SQLite.
- Todos los endpoints de métricas en `backend/app/routes.py` DEBEN generar su data usando la función `generate_mock_movements(seed=42)`. Mantén el `seed=42` estricto para no romper expectativas del UI.
