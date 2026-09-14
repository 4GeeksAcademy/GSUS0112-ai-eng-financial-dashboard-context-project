# Progreso del Proyecto

## Sesión 2026-09-14

### Actualizaciones completadas

1. **Accesibilidad**
   - Se cargó y aplicó la skill comunitaria `accessibility`.
   - Se añadió `aria-hidden="true"` a los iconos decorativos de `dashboard-header.tsx` y `kpi-card.tsx` para evitar anuncios redundantes en lectores de pantalla.
   - Se añadió `aria-busy="true"` a los estados de carga de las tarjetas KPI.
   - Se incorporó texto `sr-only` para comunicar el estado de carga sin alterar la presentación visual.

2. **Buenas prácticas de React**
   - Se aplicó la skill `vercel-react-best-practices`.
   - Se añadieron clases `min-h` en las tarjetas KPI para reservar espacio durante la carga y prevenir **Cumulative Layout Shift (CLS)**.
   - Se añadieron variantes `motion-reduce` para respetar las preferencias de reducción de movimiento.

3. **Optimización del bundle**
   - Se exploró el ecosistema de skills de rendimiento y se eligió `react-performance` de `affaan-m/ecc`.
   - Se implementó `React.lazy()` para cargar de forma diferida `IncomeOutcomeChart` y `ProfitPercentChart`.
   - Se añadieron límites `<Suspense>` con fallbacks de carga que reservan altura para evitar desplazamientos visuales.
   - El warning de Vite por bundles superiores a `500 kB` quedó resuelto: el chunk inicial pasó a `188.34 kB` y `LineChart` se generó como chunk diferido de `342.29 kB`.

4. **Estandarización interna**
   - Se creó la skill interna `.skills/dashboard-ui-standards/SKILL.md`.
   - La skill documenta los requisitos para futuras tarjetas, gráficos y widgets: prop `loading?: boolean`, uso de `Skeleton`, altura estable, `aria-busy`, texto `sr-only`, `aria-hidden` en iconos decorativos, `Suspense` para widgets pesados y criterios de aceptación.

### Estado actual

- El frontend React/Vite compila correctamente con code-splitting para los gráficos.
- ESLint y TypeScript pasan después de los cambios.
- Las mejoras de accesibilidad y estabilidad visual están aplicadas en los componentes auditados.
- El proyecto continúa siendo un prototipo/mock con datos generados en backend y sin persistencia real.

### Pendientes conocidos

- Mantener la skill `dashboard-ui-standards` como referencia al crear o modificar widgets del dashboard.
- Considerar una solución de fetching con caché, como React Query/TanStack Query, para sustituir gradualmente el `fetch` dentro de `useEffect`.
- Ejecutar auditorías renderizadas con Lighthouse o axe cuando el entorno de navegador esté disponible.
