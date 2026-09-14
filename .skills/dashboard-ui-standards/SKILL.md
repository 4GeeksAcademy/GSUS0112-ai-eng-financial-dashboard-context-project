---
name: dashboard-ui-standards
description: Reglas estrictas para crear o modificar cualquier tarjeta, gráfico o widget en este dashboard financiero. Garantiza estados de carga estables, accesibilidad y consistencia visual.
---

# dashboard-ui-standards

Reglas estrictas para crear o modificar cualquier tarjeta, gráfico o widget del dashboard financiero.

## Contexto

Este dashboard presenta métricas financieras que deben seguir siendo comprensibles durante la carga de datos y después de renderizarse. Los estados de carga que no reservan espacio provocan **Cumulative Layout Shift (CLS)**: el contenido se mueve mientras el usuario intenta leerlo o interactuar con la página. Además, los lectores de pantalla necesitan recibir un estado de carga explícito y no deben anunciar iconos decorativos como si fueran contenido.

Estas reglas aplican a componentes React del frontend, incluidos KPI cards, gráficos, paneles de resumen, indicadores y cualquier widget visual nuevo o modificado.

## Instrucciones accionables

### 1. Estado de carga obligatorio

Todo componente visual debe aceptar un prop opcional `loading?: boolean`:

```tsx
interface WidgetProps {
  loading?: boolean
}
```

Cuando `loading` sea `true`, el componente debe retornar un estado de carga representativo. No se permite retornar `null`, un contenedor vacío ni un spinner básico como único indicador.

### 2. Usar `Skeleton`

El estado de carga debe utilizar el componente `Skeleton` existente:

```tsx
import { Skeleton } from '@/components/ui/skeleton'
```

El skeleton debe aproximar la estructura, las proporciones y la jerarquía visual del contenido final. Por ejemplo, una tarjeta con título, valor y texto auxiliar debe reservar espacio para los tres elementos.

### 3. Reservar espacio y evitar CLS

El contenedor principal del estado de carga debe tener una clase `min-h-[valor]` o un alto fijo equivalente al componente renderizado cuando está listo. La altura debe ser suficiente para que la sustitución del skeleton por el contenido real no desplace los elementos vecinos.

Usa una altura estable en ambos estados cuando sea razonable:

```tsx
<Card className="min-h-[420px]">
```

No uses alturas arbitrarias que hagan que el estado cargado crezca o se reduzca de forma visible.

### 4. Exponer el estado a tecnologías asistivas

El contenedor principal de carga debe incluir `aria-busy="true"` y un texto visualmente oculto con la clase `sr-only`:

```tsx
<Card aria-busy="true">
  <span className="sr-only">Cargando...</span>
</Card>
```

El texto oculto debe describir de forma breve el estado. Puede incluir el nombre del widget cuando aporte contexto, por ejemplo: `Cargando gráfico de ingresos...`.

### 5. Iconos decorativos

Todos los iconos que no aporten información independiente deben tener `aria-hidden="true"`:

```tsx
<TrendingUp aria-hidden="true" />
```

No añadas `aria-label` a un icono decorativo. Si un icono es el único contenido de un control interactivo, el control debe recibir un nombre accesible mediante `aria-label` o texto visualmente oculto, y el icono debe seguir teniendo `aria-hidden="true"`.

### 6. Consistencia y rendimiento

- Usa imports directos con el alias `@/` para módulos internos del frontend.
- Mantén la estructura del skeleton alineada con el componente final para evitar parpadeos y desplazamientos.
- Usa `React.lazy()` y `<Suspense>` para widgets pesados, como gráficos que incorporen librerías de visualización, cuando el code-splitting reduzca el bundle inicial.
- Cada fallback de `Suspense` debe reservar un espacio equivalente mediante `min-h-[valor]` o una altura fija.
- No añadas `memo`, `useMemo` o `useCallback` sin una ganancia medible; la optimización debe justificar su complejidad.
- Respeta `prefers-reduced-motion` en animaciones y transiciones del widget.
- No uses el color como único medio para comunicar estados, tendencias, errores o diferencias entre métricas.

## Criterios de aceptación

Antes de aprobar un componente visual, verifica:

- [ ] El componente acepta `loading?: boolean`.
- [ ] `loading={true}` muestra `Skeleton` y no `null`, un contenedor vacío ni un spinner básico aislado.
- [ ] El contenedor principal de carga tiene `min-h-[valor]` o un alto fijo equivalente al componente real.
- [ ] El estado de carga incluye `aria-busy="true"`.
- [ ] El estado de carga incluye `<span className="sr-only">Cargando...</span>` o una variante descriptiva equivalente.
- [ ] El skeleton representa las regiones principales del contenido final.
- [ ] Todos los iconos decorativos incluyen `aria-hidden="true"`.
- [ ] Los iconos que sean el único contenido de un control no sustituyen al nombre accesible del control.
- [ ] Los datos o estados no dependen únicamente del color.
- [ ] Las animaciones respetan `prefers-reduced-motion`.
- [ ] Los widgets pesados se cargan de forma diferida cuando el análisis del bundle lo justifica.
- [ ] El cambio pasa TypeScript, ESLint y el build de producción.

## Ejemplo de código

```tsx
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp } from 'lucide-react'

interface RevenueCardProps {
  value: string
  loading?: boolean
}

export function RevenueCard({ value, loading = false }: RevenueCardProps) {
  if (loading) {
    return (
      <Card className="min-h-[180px] border-border/60" aria-busy="true">
        <CardContent className="flex min-h-[180px] flex-col gap-4 p-6">
          <span className="sr-only">Cargando ingresos...</span>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28 motion-reduce:animate-none" />
            <Skeleton className="h-8 w-8 rounded-lg motion-reduce:animate-none" />
          </div>
          <Skeleton className="h-8 w-36 motion-reduce:animate-none" />
          <Skeleton className="h-3 w-44 motion-reduce:animate-none" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="min-h-[180px] border-border/60 transition-colors motion-reduce:transition-none">
      <CardContent className="flex min-h-[180px] flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Ingresos</span>
          <span className="rounded-lg bg-[var(--income-badge)] p-1.5">
            <TrendingUp
              size={16}
              className="text-[var(--income-badge-fg)]"
              aria-hidden="true"
            />
          </span>
        </div>
        <p className="text-3xl font-semibold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">Ingresos acumulados del periodo</p>
      </CardContent>
    </Card>
  )
}
```
