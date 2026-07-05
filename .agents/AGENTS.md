# Mi Cassa - Project Rules & Custom Skills

Estas reglas definen el comportamiento de los agentes de IA (como Antigravity) al trabajar en el proyecto "Mi Cassa". Deben ser seguidas estrictamente en todas las interacciones.

## 1. Diseño Premium (UI/UX)
* **Estética Moderna:** El diseño debe sentirse extremadamente premium. Usa mejores prácticas modernas: colores vibrantes, modo oscuro armonioso, glassmorphism (desenfoque de fondo, bordes semitransparentes) y animaciones dinámicas.
* **Micro-interacciones:** Implementa transiciones suaves al abrir modales, hacer hover en tarjetas, o navegar. Nada debe aparecer o desaparecer bruscamente (usa framer-motion o Tailwind/CSS transitions).
* **Tipografía y Espaciado:** Usa fuentes modernas (como Inter, Roboto o Outfit). Aprovecha el espacio en blanco (whitespace) para que la interfaz respire. Evita colores genéricos y utiliza paletas de colores basadas en HSL.
* **Evita el diseño "básico":** El resultado visual nunca debe verse como un producto mínimo viable. Cada componente debe tener el más alto estándar de calidad.

## 2. Rendimiento Extremo (Performance)
* **Next/Image Obligatorio:** Nunca uses la etiqueta estándar `<img>`. Usa siempre `<Image>` de Next.js con carga diferida (`lazy loading`), placeholders adecuados y los formatos más óptimos para que las imágenes de propiedades carguen de inmediato.
* **Carga Diferida de Componentes:** Utiliza `next/dynamic` para componentes pesados que no son inmediatamente visibles en el renderizado inicial o que dependen de bibliotecas grandes.
* **Optimización de React (Re-renders):** Usa estrictamente `useMemo` y `useCallback` en componentes interactivos complejos, como tablas, listas largas y el Kanban de prospectos, para evitar re-renderizados innecesarios.
* **Virtualización:** Si las listas de propiedades o tableros crecen exponencialmente, evalúa implementar virtualización (windowing) para mantener la fluidez en el navegador.

## 3. Integración de Plugins Activos
* **modern-web-guidance-plugin:** Mantén siempre la mentalidad de desarrollo web moderno (SSR, RSC, Server Actions).
* **chrome-devtools-plugin:** De ser necesario durante tareas de debugging, apóyate en el devtools para depurar problemas visuales o cuellos de botella de red (ej. demoras al cargar imágenes).

## 4. Arquitectura de App Router (Next.js 13+)
* **Server Components (RSC) por defecto:** Mantenemos los componentes asíncronos y libres de lógica de estado a menos que sea estrictamente necesario.
* **Separación de interactividad:** Añadimos `"use client"` únicamente en las hojas del árbol de componentes donde hay manejadores de eventos o hooks de estado.

## 5. Estandarización de Tailwind y UI (21st.dev Style)
* **Utilidad `cn`:** Todos los componentes UI dinámicos deben usar `clsx` y `tailwind-merge` para componer clases evitando conflictos.
* **Componentes "Crafted":** Favorecemos diseños manuales tipo Aceternity, Magic UI y Shadcn, incorporando animaciones suaves con Framer Motion en lugar de librerías planas prefabricadas.
