# Guía de Investigación y Estándar de Diseño Anti-IA
## Por qué las IAs crean webs clónicas y cómo blindar este portafolio contra el "AI Slop"

Este documento recopila la investigación exhaustiva sobre los patrones, tics visuales y clichés de código que delatan a una web generada por Inteligencia Artificial (v0, Bolt, Lovable, Claude, ChatGPT, Cursor, etc.), y establece las normas inmutables para cualquier desarrollador o agente de IA que colabore en este proyecto.

---

## 1. La Causa Raíz: ¿Por qué las IAs diseñan igual?

El fenómeno conocido en la industria como **"AI Design Slop"** o el **"Mar de la Similitud" (Sea of Sameness)** no ocurre por casualidad, sino por la propia naturaleza matemática de los Modelos de Lenguaje (LLMs):

1. **La Trampa de la Media Estadística:** Los LLMs predicen el siguiente token más probable basado en miles de plantillas de landing pages de SaaS creadas entre 2021 y 2024. El resultado visual es la "media aritmética" de la web moderna: funcional, pulida, pero totalmente desprovista de alma, tensión o riesgo artístico.
2. **El Sesgo de los Valores por Defecto de Tailwind:** Gran parte del entrenamiento de frontend proviene de repositorios que usan Tailwind CSS. En Tailwind, `indigo-500` y `purple-600` eran los colores de acento por defecto en sus componentes prediseñados. Las IAs asumieron que el morado es sinónimo de "tecnología moderna".
3. **Ceguera Sensorial y Falta de Intención:** Una IA no siente el grano del papel, no escucha el obturador de una cámara réflex, ni entiende la nostalgia de una cinta VHS con estática analógica. Diseña desde la abstracción geométrica matemática (márgenes homogéneos, radios suaves, fondos oscuros asépticos).

---

## 2. Anatomía del "AI Slop": Los 6 Delatores que Hacen Notar que una Web es de IA

### A. Paleta de Color y Efectos de Iluminación
* **El "Problema Púrpura" (The Purple Gradient Trap):** El 80% de las interfaces de IA recurren al gradiente de `from-purple-600 to-indigo-600` o `from-cyan-400 to-violet-500` en títulos o botones.
* **El Foco Radial Difuminado (Ambient Blob):** Fondos negros (`bg-zinc-950` o `bg-slate-900`) con dos o tres manchas gigantes circulares y desenfocadas (`blur-3xl bg-purple-500/20`) flotando en las esquinas superiores.
* **Glassmorphism Perezoso:** Contenedores con `backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl` usados en cada sección (tarjetas, modales, barras de menú), creando un aspecto de "plástico translúcido espacial".

### B. Estructuras y Secciones Cliché
* **El Hero Centrado de Manual:**
  * Una pastilla o pill flotante arriba con un destello: `[ ✦ Potenciado por IA / v2.0 ya disponible -> ]`.
  * Un H1 gigante centrado con gradiente de texto que va de blanco puro a violeta o gris suave.
  * Un subtítulo de exactamente 2 líneas centrado en `text-zinc-400`.
  * Dos botones gemelos en fila centrada: Uno con gradiente brillante (`Empezar Ahora ->`) y otro transparente con borde (`Ver Demo ▶`).
  * Una captura de pantalla o mockup falso de dashboard flotando debajo con perspectiva isométrica.
* **La "Santísima Trinidad" de Features (3 Column Grid):**
  * Una cuadrícula fija de 3 tarjetas (o 2x3).
  * Cada tarjeta tiene: un icono de Lucide en una cajita redondeada con fondo lila suave (`p-3 bg-purple-500/10 rounded-xl`), un título de 3 palabras (*"Rendimiento Ultra Rápido"*) y 2 líneas de texto explicativo genérico.
* **El Bento Grid No Motivado:** Cuadrículas asimétricas con mini-widgets falsos (un interruptor que no hace nada, un gráfico de líneas sin datos reales, un contador aleatorio).
* **Prueba Social Plastificada:** Filas con logos ficticios monocromáticos al 40% de opacidad (Acme Corp, Apex, Nova) y círculos de 5 avatares superpuestos con "★ 4.9/5 de valoración".

### C. Tipografía
* **El Monocultivo Sans-Serif:** Uso obsesivo de *Inter*, *Roboto* o *Geist Sans* para todo: títulos, cuerpo, subtítulos, números, botones. Cero contraste de voz tipográfica.
* **Falta de Tensión Editorial:** No hay pesos extremos (100 vs 900), no hay serif con carácter histórico, ni fuentes mono con justificación funcional, ni tipografía variable viva.

### D. Microinteracciones y Movimiento
* **El "Fade In Up" Universal:** Cada componente entra al hacer scroll con el mismo efecto genérico: `opacity: 0, y: 20` transformándose a `opacity: 1, y: 0` en 0.5 segundos.
* **Hover-Lift Automático:** Todas las tarjetas responden igual al cursor: `hover:-translate-y-1 hover:shadow-lg hover:border-purple-500/40`.
* **Falta de Fricción:** Las animaciones son perfectamente suaves y predecibles; no hay cortes abruptos cinematográficos, desalineaciones deliberadas ni fallos analógicos controlados (glitches, scanlines).

### E. Copywriting y Voz ("AI-Speak")
* **El Diccionario ChatGPT:** Palabras que los humanos rara vez usan juntas pero que las IAs repiten sin cesar:
  * *Potencia, Revoluciona, Descubre el poder de, Solución integral, Impecable, Robusto, Sin esfuerzo, A la vanguardia, Eleva tu flujo de trabajo.*
  * En inglés: *Streamline, Supercharge, Delve, Unleash, Leverage, Game-changer, Tailored, Seamless.*
* **Fórmulas Retóricas Forzadas:**
  * La antítesis de venta: *"No es solo una web; es una experiencia que transforma tu visión."*
  * El resumen en dos puntos: *"Velocidad: Rendimiento al instante. Claridad: Métricas en tiempo real. Escalabilidad: Sin barreras."*
  * El exceso de guiones largos (—) para unir oraciones sin nexo natural.

### F. Vicios de Código Frontend ("Vibe Coding")
* **Monolitos Artificiales:** Archivos de 500 líneas donde la IA inventa arrays con datos ficticios para rellenar (`const features = [{ icon: Zap, title: "...", desc: "..." }]`).
* **Falsas Interactividades:** Botones con `onClick={() => {}}` o `href="#"`, formularios con `e.preventDefault()` que no validan ni envían nada.
* **Comentarios Obvios:** Comentar lo que el código hace en vez de por qué lo hace (`// Render button`, `// Main wrapper`).

---

## 3. Matriz Comparativa: "AI Slop" vs. El Portafolio de Juan Fe

| Dimensión | Cliché Típico de IA (AI Slop) | Estándar de ESTE Portafolio (Human Craft) |
| :--- | :--- | :--- |
| **Concepto Central** | Landing page SaaS genérica o plantilla de agencia. | **Cortometraje cinematográfico interactivo en 9 escenas cronológicas.** |
| **Paleta de Color** | Negros fríos con gradientes violeta/índigo y cian neón. | **Alto contraste brutalista, blancos hueso de ticket térmico, fósforo CRT, rojo analógico, sepia.** |
| **Textura** | Paneles de cristal borroso (`backdrop-blur-md`) asépticos. | **Grano de película cinematográfico (`GrainOverlay`), trama de semitono, scanlines VHS, papel rasgado.** |
| **Tipografía** | Inter / Roboto monocorde en todas las etiquetas. | **Fraunces con ejes variables (`opsz`, `SOFT`, `WONK`), tipografía cinética que respira, monospace de terminal.** |
| **Layout** | Hero centrado con badge `✦` + cuadrícula de 3 tarjetas. | **Escenas a pantalla completa, tickets dentados (`SawtoothEdge`), códigos de barras vectoriales, fanzine (`ZineScene`).** |
| **Sonido** | Silencio total o audio estridente de stock. | **Paisaje sonoro táctil y minimalista (`AudioManager`): clics de obturador, zumbido VHS, feedback mecánico.** |
| **Movimiento** | Fade-in suave de 20px en todas las secciones. | **GSAP ScrollTrigger orquestado, glitches de video con timing roto, aberración cromática, paralaje narrativo.** |
| **Copywriting** | Frases corporativas huecas ("Lleva tus ideas al siguiente nivel"). | **Voz en primera persona, directa, cruda, técnica y biográfica ("18 años · Santander · Desarrollador Creativo").** |

---

## 4. Mandamientos para Agentes de IA que Trabajen en esta Web

Si eres un modelo de lenguaje o agente autónomo (Antigravity, Claude, Cursor, Copilot, etc.) editando este repositorio:

1. **Respeta la Narrativa de Escenas:** Cada nueva adición debe pertenecer conceptualmente a una escena de la película o ser una transición orquestada. No agregues "secciones de landing page".
2. **Reutiliza la Infraestructura Existente:** Antes de escribir una sola línea nueva, consulta los componentes del proyecto:
   - `AudioManager.tsx` para feedback sonoro.
   - `GrainOverlay.tsx` para atmósfera visual.
   - `SawtoothEdge.tsx` y `ReceiptTicket.tsx` para estética de recibo/ticket.
   - `VHSScene.tsx` para efectos de glitch y retro-video.
   - `Fraunces` variable para tipografía que muta.
3. **Aplica el Principio Ponytail (`AGENTS.md`):** Escribe el código más simple y directo posible. Cero abstracciones no solicitadas, cero librerías pesadas añadidas al azar.
4. **Voz Humana Obligatoria:** Escribe textos concisos, con personalidad real, datos concretos y sin palabras de relleno corporativo de IA.
5. **Comprobación de Reducción de Movimiento:** Siempre respeta `prefers-reduced-motion` para garantizar accesibilidad en animaciones complejas de GSAP.
