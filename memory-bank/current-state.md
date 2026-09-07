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
