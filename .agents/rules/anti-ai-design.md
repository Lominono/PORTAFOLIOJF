# Anti-AI Design & Visual Craft Manifesto
# Directiva de Diseño Humano, Editorial y Cinematográfico

> **REGLA DE ORO INNEGOCIABLE:**
> Nunca construyas como una IA prediciendo la media estadística de las landing pages de 2023. 
> Este proyecto **NO** es una plantilla SaaS, ni un clon de Vercel/Linear, ni una demo de v0/Bolt/Lovable.
> Este proyecto es una **obra editorial, táctil, narrativa y cinematográfica** (VHS, Zine, Recibos térmicos, Brutalismo, Terminal CRT, Jazz, Grano analógico).
> Cualquier código, layout o texto que "huela a IA" será considerado un bug crítico de diseño.

---

## 1. Los 7 Pecados Capitales del "AI Slop" (PROHIBICIONES ESTRICTAS)

### ❌ 1. El "Síndrome Púrpura" y el Glow de Neón
- **PROHIBIDO:** `bg-gradient-to-r from-purple-600 to-indigo-600`, acentos violeta/cian por defecto de Tailwind, manchas radiales desenfocadas de fondo (`blur-3xl bg-purple-500/20`) y bordes con sombras de neón púrpura.
- **EN SU LUGAR:** Paletas con intención física o editorial. En este portafolio:
  - Alto contraste brutalista (negros profundos, blancos crudos, acentos en rojo analógico o amarillo cinta métrica).
  - Textura de recibo térmico (blancos hueso, grises tinta gastada, tramas de semitono).
  - Terminal analógica (fósforo verde CRT o ámbar clásico).
  - Tonos cálidos y desaturados de fanzine y cinta magnética VHS.

### ❌ 2. El Hero Centrado de Plantilla SaaS
- **PROHIBIDO:** 
  - La pastilla/eyebrow flotante con destellos: `[ ✦ Powered by AI ]` o `[ ✨ Introducing v2.0 -> ]`.
  - H1 centrado con gradiente de texto blanco-a-lila.
  - Subtítulo centrado de exactamente 2 líneas en `text-zinc-400`.
  - La pareja de botones gemelos: `[ Empezar Gratis -> ]` y `[ Ver Demo ▶ ]`.
  - El mockup de una ventana de navegador flotando con sombra difusa.
- **EN SU LUGAR:** Composiciones narrativas, asimétricas o de pantalla completa. Entradas cinematográficas con tipografía cinética (ej. *Fraunces* con ejes variables `opsz`, `SOFT`, `WONK`), visores analógicos, código de barras y elementos tangibles.

### ❌ 3. La "Santísima Trinidad" de Tarjetas (The 3-Column Grid)
- **PROHIBIDO:** Generar una cuadrícula de 3 columnas donde cada tarjeta tiene:
  - Un icono de Lucide en una cajita redondeada con fondo lila/azul (`p-3 bg-purple-500/10 rounded-xl`).
  - Un título de 3 palabras ("Rendimiento Ultra Rápido", "Seguridad Bancaria").
  - 2 líneas de texto de relleno genérico.
- **EN SU LUGAR:** Relato secuencial, composiciones de poster suizo, tickets con corte en zigzag (`SawtoothEdge`), fanzines recortados (`ZineScene`), listas cronológicas auténticas o layouts asimétricos con tensión visual.

### ❌ 4. Glassmorphism Perezoso y Esquinas de Burbuja (`rounded-2xl`)
- **PROHIBIDO:** Aplicar `backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl` a todo contenedor sin criterio. Es la mayor firma visual de las IAs.
- **EN SU LUGAR:** 
  - Geometría firme y rotunda: bordes rectos (`rounded-none` o `rounded-sm`), marcos fotográficos analógicos, bordes troquelados y dentados.
  - Materialidad real: textura de grano de película (`GrainOverlay`), scanlines CRT de tubo, aberración cromática controlada (`VHSScene`), código de barras vectorial (`Barcode`).

### ❌ 5. Animaciones Cliché ("Fade In Up" en Bucle)
- **PROHIBIDO:** Asignar a cada elemento `opacity: 0, y: 20 -> opacity: 1, y: 0` al entrar en viewport con duración de 0.5s. Es predecible y aburrido.
- **EN SU LUGAR:**
  - Coreografías orquestadas con GSAP y `ScrollTrigger` conectadas al scroll del usuario.
  - Tipografía viva con pesos variables que reaccionan al paso de la escena.
  - Glitches y micro-cortes analógicos con timings irregulares.
  - Respuestas hápticas y auditivas (`audioManager.play('click')`, obturador fotográfico).
  - Respeto absoluto y prioritario por `prefers-reduced-motion`.

### ❌ 6. Copywriting Artificial ("AI Speak" y el Tono ChatGPT)
- **VOCABULARIO ESTRICTAMENTE PROHIBIDO:**
  - *"Potencia tu...", "Revoluciona...", "Una solución integral...", "Sumérgete en...", "Lleva tus ideas al siguiente nivel...", "Impecable", "Inteligente y robusto", "Descubre el poder de..."*
  - En inglés: *"Streamline", "Supercharge", "Delve", "Unleash", "Leverage", "Game-changer", "Tailored"*.
- **ESTRUCTURAS RETÓRICAS PROHIBIDAS:**
  - La muletilla de antítesis: *"No es solo un portafolio, es una experiencia."*
  - La lista de dos puntos con adjetivos vacíos: *"Velocidad: Máxima. Diseño: Único. Código: Limpio."*
  - El abuso del guion largo (—) como pegamento de frases inconexas.
- **EN SU LUGAR:** Voz humana, concreta, imperfecta, técnica y honesta. Datos reales, anécdotas específicas ("18 años · Santander"), proyectos tangibles y opiniones claras.

### ❌ 7. Código Basura de IA ("Vibe Coding" descuidado)
- **PROHIBIDO:**
  - Monolitos de 500 líneas con arrays `features = [...]` inventados para rellenar espacio.
  - Botones muertos con `onClick={() => {}}` o links `href="#"`.
  - Comentarios obvios e inútiles (`// Render container`, `// Return JSX`).
  - Mezcla caótica de tokens y valores mágicos arbitrarios.
- **EN SU LUGAR:**
  - Código acorde a **Ponytail**: el código más corto, limpio y sin boilerplate innecesario.
  - Reutilización de los componentes y helpers ya existentes en `@/components/`.

---

## 2. Los Pilares de Identidad de ESTA Web (Qué SÍ Hacer)

1. **Es un Cortometraje Cinematográfico:** La web se lee como una película secuencial de escenas numeradas (Opening → Receipt → Brutalism → Terminal → VHS → Zine → Jazz → Obsessions → Credits).
2. **Textura Analógica y Materialidad:** El usuario debe sentir que toca papel térmico, escucha el crujido de un vinilo, ve el fósforo de un monitor CRT o sostiene un fanzine fotocopiado.
3. **Tipografía Expresiva:** Fuentes con alma (*Fraunces* con ejes variables, monospace crudo de terminal, titulares de peso masivo).
4. **Micro-Feedback Auditivo:** Sonidos mecánicos discretos integrados en la experiencia de navegación (`AudioManager`).
5. **Autenticidad Radical:** Cada palabra y cada píxel deben representar a una persona real, con nombre y apellido, pasiones específicas y criterio estético propio.

---

## 3. Checklist Rápido para Agentes e IAs

Antes de entregar cualquier cambio en este repositorio, hazte estas 5 preguntas:
1. ¿Esto parecería generado automáticamente por un prompt de v0 o Bolt? → **Si la respuesta es sí, rehazlo.**
2. ¿Tiene algún gradiente púrpura/índigo o tarjeta flotante con glassmorphism genérico? → **Elimínalo de inmediato.**
3. ¿El texto tiene palabras como "revolucionario", "integral", "potencia" o la fórmula "No es X, es Y"? → **Reescríbelo como hablaría una persona real.**
4. ¿Reutilicé la infraestructura existente (`AudioManager`, `GrainOverlay`, tipografías del proyecto, GSAP) en lugar de inventar dependencias nuevas?
5. ¿Cumple con la filosofía de senior developer perezoso y eficiente (`AGENTS.md` / `ponytail`)?
