# Estado Actual del Proyecto

## Estado General: Prototipo / Mock

El proyecto es totalmente funcional a nivel de interfaz de usuario, pero **carece de una conexión real a una base de datos**. Actualmente opera como un prototipo o entorno de prueba.

### Qué funciona
1. **Interfaz Gráfica:** El frontend levanta exitosamente, muestra los gráficos y se comunica con el backend usando `/api/...`.
2. **Lógica de la API:** El backend levanta sus rutas y calcula correctamente facetas, métricas top, comparaciones y agregaciones.
3. **Despliegue Local:** Docker Compose orquesta sin problemas ambos servicios asegurando la interconexión.

### Deuda Técnica y Limitaciones (Importante para Agentes Futuros)
- **Persistencia Nula:** No hay ninguna base de datos configurada ni ORMs. 
- **Datos Estáticos Fijos:** La función `generate_mock_movements(seed=42)` del backend usa una semilla constante. Las gráficas siempre se verán exactamente igual en cada recarga de página, a menos que se cambien los parámetros estáticos.
- **Ausencia de Gestión de Estado Global:** El frontend realiza llamadas crudas con `fetch` en bloques `useEffect`. Sería recomendable migrar a React Query (TanStack Query) en el futuro para manejo de caché y reintentos automáticos.

## Actualización de Estado: 2026-09-14

- Se aplicó la skill comunitaria `accessibility`: los iconos decorativos usan `aria-hidden="true"` y los estados de carga de las tarjetas exponen `aria-busy="true"` junto con texto `sr-only`.
- Se aplicó `vercel-react-best-practices`: las tarjetas KPI reservan altura con clases `min-h` para prevenir **Cumulative Layout Shift (CLS)** y respetan `prefers-reduced-motion`.
- Se eligió la skill `react-performance` de `affaan-m/ecc` para resolver la advertencia de bundles de Vite. `IncomeOutcomeChart` y `ProfitPercentChart` se cargan con `React.lazy()` y `<Suspense>`, reduciendo el chunk inicial por debajo de `500 kB`.
- Se creó `.skills/dashboard-ui-standards/SKILL.md` como estándar interno para futuras tarjetas, gráficos y widgets del dashboard.
- Las validaciones recientes de TypeScript, ESLint y build de producción pasan correctamente.
