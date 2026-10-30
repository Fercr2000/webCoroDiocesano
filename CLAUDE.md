# Coro de la Diócesis de Jaén — Contexto del Proyecto

Este documento resume el estado, decisiones y estilo del proyecto para que cualquier agente pueda continuar el desarrollo con coherencia.

---

## 1. Contexto general

Web institucional del **Coro y Orquesta de la Diócesis de Jaén**. La lidera **Fernando J. Camacho Rizquez**, que es tanto el director del coro como el desarrollador.

Tiene dos partes bien diferenciadas:

- **Sitio público:** información sobre el coro, palabras del director, formulario de inscripción, calendario, repertorio.
- **Área de miembros privada:** login para coralistas e instrumentistas, donde cada rol accede a sus propias partituras y audios. El director tiene un panel de administración adicional.

El objetivo institucional: sustituir la gestión actual con Google Drive/emails por una plataforma más profesional, personalizada y estéticamente cuidada.

---

## 2. Stack técnico

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS (v4, `@import "tailwindcss"` en globals.css)
- **Iconos:** `lucide-react` y `react-icons`
- **Base de datos y auth (pendiente):** Supabase (`@supabase/supabase-js` y `@supabase/ssr` ya instalados)
- **Almacenamiento de archivos (pendiente):** Google Drive con enlaces compartidos, gestionado desde admin
- **Repositorio:** GitHub privado
- **Hosting:** Vercel (plan Hobby, gratuito). Cada push a `main` despliega producción. La web está protegida con contraseña mientras se desarrolla (ver §12).
- **Sistema operativo actual del dev:** Fedora Workstation (antes Windows)

Node.js 20+ requerido.

---

## 3. Estructura de carpetas

```
proxy.ts                             ← antes "middleware": protección con contraseña (Basic Auth) de toda la web (excepto /api/latido)
vercel.json                          ← cron: llama a /api/latido cada 5 días para que Supabase no se pause
.env.example                         ← todas las variables de entorno, documentadas (copiar a .env.local)
supabase/migrations/                 ← esquema SQL completo con RLS y buckets (validado en Postgres local, ver §8)
lib/
├── supabase/                        ← config.ts (supabaseConfigurado), client.ts, server.ts, admin.ts (service_role, solo servidor)
├── correo.ts                        ← envío con Resend por API REST (solo servidor)
├── roles.ts                         ← 18 roles agrupados, tipos Rol/GrupoRol/Usuario, generarContrasena()
├── archivo.ts                       ← tipos Repertorio/Partitura/Audio y REPERTORIO_TODOS (filtro virtual)
├── datosPrueba.ts                   ← usuarios (50, formación completa), repertorios, partituras, audios y eventos de prueba
├── formacion.ts                     ← tipo Componente y secciones del escenario: roles, grupo, posición (+ orden móvil)
├── fechas.ts                        ← aritmética de fechas 'AAAA-MM-DD' en hora local (ver §12)
├── calendario.ts                    ← tipo Evento, convocatorias por sección y exportación .ics
├── responsables.ts                  ← responsables: cargo, nombre, cita, resumen y carta completa
├── catalogo.ts                      ← obras del catálogo público: tipos, épocas, formaciones, idiomas y agrupar()
├── gestion.ts                       ← roles de gestión, rolesEfectivos(), puedeGestionar(), puedeAsignarRoles()
├── galeria.ts                       ← álbumes y fotos de la galería: categorías, proporciones
└── contacto.ts                      ← teléfonos (de muestra), email, Instagram y sede

app/
├── layout.tsx                       ← layout raíz (sin Header/Footer, solo <html><body>)
├── globals.css                      ← Tailwind + textura editorial + animaciones (ver §4)
├── favicon.ico
│
├── components/                      ← componentes reutilizables
│   ├── header.tsx                   ← header de cristal, condensa al scroll, menú móvil, dropdown accesible
│   ├── footer.tsx                   ← footer en tinta cálida, iconos rojos
│   ├── hero.tsx                     ← slider de 2 slides con Ken Burns, viñeta y chevron
│   ├── about.tsx                    ← sección "Quiénes somos"
│   ├── palabrasObispo.tsx           ← inicio: palabras del Obispo (antes, del director; las del director están en /sobre-nosotros/director)
│   ├── inicio/                      ← ProximaCelebracionInicio, Descubre y FormaParte (secciones de la home)
│   ├── FormularioInscripcion.tsx    ← formulario coralista/instrumentista (inicio y contacto)
│   ├── contacto/                    ← SelectorFormulario (unirme/contar) y FormularioContratacion
│   ├── formulario.tsx               ← Field, Select e inputClasses compartidos (inscripción + modales admin)
│   ├── Reveal.tsx                   ← fade-up al entrar en el viewport (envuelve secciones de la home)
│   ├── Proximamente.tsx             ← placeholder "en construcción" con el sistema de diseño (prop `volver`)
│   ├── FondoGranateMiembros.tsx     ← fondo de la columna granate del login/recuperar
│   ├── PentagramaOla.tsx            ← pentagrama ondulado animado; `conNotas` añade figuras que viajan (cartel y login)
│   ├── FondoNotas.tsx               ← notas que flotan despacio de fondo: secciones claras de inicio, Próximamente (sobre nosotros, contacto…), componentes y calendario. `soloLaterales` en páginas de texto
│   ├── componentes/
│   │   ├── Escenario.tsx            ← plano de la formación: un punto por miembro + "programa de mano" (prop `edicion` en admin)
│   │   └── IconoSeccion.tsx         ← icono de línea por sección (corcheas, violín, timbales, teclado, batuta…)
│   ├── catalogo/                    ← Catalogo.tsx (índice agrupado) y SelectorAgrupacion.tsx (desplegable)
│   ├── sobreNosotros/               ← PilaresGiratorios, Temas y Cifras (interactivos de /sobre-nosotros)
│   ├── galeria/                     ← Galeria, CarpetaAlbum, VisorAlbum, VisorFoto y FotoRecortada
│   ├── responsables/
│   │   ├── FotoResponsable.tsx      ← foto cuadrada con marco (o inicial si no hay foto), tono granate o claro
│   │   └── CartaResponsable.tsx     ← carta completa de un responsable (composición de "Palabras del director")
│   └── calendario/                  ← calendario compartido por la web pública y el área de miembros
│       ├── Calendario.tsx           ← cartel + agenda por meses + pasadas; solo celebraciones (prop `modo`)
│       ├── CartelProximaCelebracion.tsx ← panel granate: cuenta atrás + pie con pentagrama que sale de la catedral
│       ├── CatedralJaen.tsx         ← fachada de la Catedral de Jaén a línea (SVG, currentColor, prop `trazo`)
│       ├── BandaProximaCelebracion.tsx  ← versión compacta del cartel (dashboard y admin)
│       ├── EventoAgenda.tsx         ← celebración = tarjeta destacada; ensayo = fila sobria
│       ├── useHoy.ts                ← fecha de hoy del navegador (useSyncExternalStore)
│       └── descargarIcs.ts          ← "Añadir a mi agenda"
│
├── (sitio)/                         ← route group, incluye Header y Footer
│   ├── layout.tsx
│   ├── page.tsx                     ← home (ver §6 "Inicio")
│   ├── calendario/page.tsx          ← calendario público: SOLO celebraciones, sin datos internos
│   ├── contacto/page.tsx            ← formularios (unirse / contar con el coro) + teléfonos y datos
│   ├── repertorio/                  ← redirige a /sobre-nosotros/repertorio
│   └── sobre-nosotros/
│       ├── componentes/page.tsx     ← plano del escenario con los componentes (nombre completo)
│       └── (+ índice "Sobre nosotros", director, responsables, repertorio; esencia redirige al índice)
│
└── miembros/                        ← área privada (SIN Header/Footer del sitio público)
    ├── layout.tsx                   ← layout mínimo
    ├── page.tsx                     ← login (mock: admin/admin)
    ├── recuperar/                   ← recuperar contraseña (Supabase si está configurado; si no, aviso honesto)
    ├── confirmar/route.ts           ← destino del enlace del email: canjea el código y redirige (?siguiente=)
    ├── cambiar-contrasena/          ← cambiar contraseña (pide la actual) o elegirla tras recuperar (?recuperacion=1)
    └── dashboard/
        ├── page.tsx                 ← archivo personal + banda granate; si rol === 'Director' muestra AdminSection. Acepta ?repertorio=Nombre
        ├── calendario/page.tsx      ← calendario de miembros: celebraciones con convocatoria, vestimenta y enlace al repertorio
        ├── components/
        │   ├── DashboardHeader.tsx  ← cabecera del área privada con saludo
        │   ├── FileCard.tsx         ← tarjeta de partitura
        │   ├── AudioPlayer.tsx      ← exporta AudioCard (tarjeta de audio con reproductor)
        │   ├── AdminSection.tsx     ← bloque "Administración": tarjetas filtradas por roles de gestión
        │   ├── Modal.tsx            ← modal base + BotonPrincipal/BotonSecundario
        │   └── ConfirmDialog.tsx    ← confirmación genérica (usuarios y repertorios)
        └── admin/
            ├── usuarios/
            │   ├── page.tsx         ← gestión de usuarios, CRUD completo EN MEMORIA
            │   └── components/
            │       ├── UserCard.tsx
            │       ├── CreateUserModal.tsx   ← crear y editar (si recibe `usuario`)
            │       └── PasswordDialog.tsx    ← muestra la contraseña generada una sola vez
            ├── componentes/page.tsx ← mismo plano en modo edición: añadir y quitar nombres por sección
            ├── catalogo/            ← catálogo público de obras EN MEMORIA (page + ObraModal)
            ├── archivos/page.tsx    ← placeholder Proximamente
            ├── calendario/
            │   ├── page.tsx         ← gestión de eventos EN MEMORIA (crear, editar, duplicar +7 días, eliminar)
            │   └── components/      ← EventoAdminFila, EventoModal
            └── repertorios/
                ├── page.tsx         ← CRUD de repertorios EN MEMORIA, con orden
                └── components/RepertorioFila.tsx ← fila numerada: renombrar en línea, subir/bajar, eliminar

public/
├── LogoCoroDiocesano.png            ← logo horizontal con texto
├── LogotipoContornoBlanco.png       ← logo blanco solo
├── FotoDirectrorPalabras.png        ← foto del director
├── SantoRostroCoro.png              ← escudo del coro (no usado actualmente)
├── sliderUnete.png / sliderRepertorio.png ← imágenes del hero
└── (otros recursos varios)
```

**Importante:** la carpeta `(sitio)` con paréntesis literales es un **Route Group** de Next.js. Permite que el Header/Footer solo se aplique al sitio público, no al área de miembros. Al navegar a `/`, se sirve `(sitio)/page.tsx` sin que `sitio` aparezca en la URL.

---

## 4. Paleta y sistema de diseño

### Colores base

| Uso | Clase Tailwind |
|---|---|
| Granate principal (botones, acentos) | `from-red-800 to-red-950` (gradiente diagonal) |
| Granate hover | `hover:shadow-red-900/40` |
| Fondos de sección | Clases de textura editorial `.superficie-clara` / `.superficie-crema` (ver abajo) |
| Header (sitio y dashboard) | Cristal: `bg-white/70 backdrop-blur-xl` + halo granate radial |
| Texto principal | `text-stone-900` |
| Texto secundario | `text-stone-600`, `text-stone-500` |
| Bordes | `border-stone-200`, `border-stone-300` |
| Fondo oscuro (footer, login left) | `from-black via-stone-900 to-stone-950` o `from-red-800 to-red-950` |

### Superficies (textura editorial, en `globals.css`)

Desde el rediseño de julio de 2026 **ya no se usan fondos crema/ámbar**: todo es blanco limpio con grano de papel.

- `.superficie-clara` → blanco `#fcfcfb` + grano fino.
- `.superficie-crema` / `.superficie-crema-honda` → mismo blanco + halo granate muy tenue desde la esquina superior izquierda (pese al nombre, no son crema). Se alternan con la anterior para diferenciar secciones.
- `.capa-grano` → `<div>` suelto para texturizar imágenes o fondos granate.
- El contenido sobre estas superficies necesita `relative z-10` (el grano va en `::before`).

### Movimiento

- **Fondo de notas** (`<FondoNotas />`, dentro de una sección `relative`) en todas las páginas claras salvo el hero y el área privada general. En páginas con texto centrado usar `soloLaterales`.
- **Anchos de página (sin márgenes laterales excesivos):** contenedores `max-w-7xl` en las páginas anchas (inicio, sobre nosotros, componentes, galería, contacto, responsables, cartas), `max-w-6xl` en repertorio y catálogo, `max-w-5xl` en calendario. Las notas `soloLaterales` se pegan a los bordes para quedarse en el margen. Solo se dejan estrechos los textos puros (`Proximamente`) y el cierre "Forma parte".

- Animaciones con nombre: `.kenburns` (hero), `.respira` (foco de luz), `.pentagrama-ola`, `.chevron-cue`, y `@keyframes fadeIn` (se usa con `animate-[fadeIn_...]`).
- `<Reveal>` para secciones que aparecen al hacer scroll.
- **Siempre respetar `prefers-reduced-motion`** (en CSS o con `motion-reduce:` de Tailwind).
- Foco visible granate para teclado ya definido globalmente en enlaces y botones.

### Tipografía

- **Titulares:** `font-serif` grande (`text-5xl` a `text-7xl`), tracking-tight, leading tight.
- **Subtítulos:** `font-serif italic` un tono menor.
- **Eyebrows:** `text-xs tracking-[0.4em] uppercase` en granate, con líneas decorativas a los lados.
- **Cuerpo:** por defecto sans-serif (Geist), `text-base` a `text-lg`.

### Patrón repetido de sección

Casi todas las secciones siguen este patrón:

```
[línea decorativa] EYEBROW [línea decorativa]
                          
        TITULAR GRANDE (serif)
        
      Subtítulo cursiva
      
      [ornamento SVG rombo entre líneas]
      
      Contenido...
```

Ejemplo de ornamento:

```jsx
<svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
  <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
  <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
  <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
</svg>
```

### Botón signature (usado en todas partes)

```jsx
<button className="group relative overflow-hidden bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-8 py-4 text-sm tracking-[0.3em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-900/60 transition-all duration-300 rounded-sm">
  <span className="relative z-10">Texto</span>
  {/* Brillo deslizante al hacer hover */}
  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
</button>
```

### Capitular granate

Usada en:
- Primer párrafo de "Palabras del director".
- Primera letra del nombre del usuario en el saludo del dashboard.
- Primera letra del nombre en las tarjetas de usuarios.

Ejemplo con `first-letter`:
```jsx
<p className="first-letter:font-serif first-letter:text-6xl first-letter:font-medium first-letter:text-red-900 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none">
  En medio de tanto ruido...
</p>
```

O manualmente para nombres:
```jsx
<span className="font-serif text-5xl text-red-800 font-medium leading-none">
  {nombre.charAt(0)}
</span>
<span className="text-3xl font-medium">{nombre.slice(1)}</span>
```

### Deslizador tipo cápsula (Partituras/Audios, Coralista/Instrumentista)

Contenedor `rounded-full` con dos botones al lado. Fondo granate se desliza con `translate-x-full` según cuál está activo. Usado en el formulario de inscripción y en el dashboard.

### Chips redondeados

Para los repertorios. Activo con degradado granate y brillo deslizante. Inactivo con fondo claro y borde. Se usan `rounded-full`.

### Tarjetas (partituras, audios, usuarios)

Todas siguen esta anatomía:

- Fondo `bg-gradient-to-b from-white to-stone-100`.
- Borde `border-stone-200/80`, en hover `border-red-800/30`.
- Sombra en hover `hover:shadow-xl hover:shadow-red-900/10` y elevación `hover:-translate-y-0.5`.
- **Banda lateral izquierda granate** (`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950`, `opacity-60` que pasa a 100 en hover).
- Si una tarjeta lleva un botón con brillo dentro, el botón usa `group/btn` para no chocar con el `group` de la tarjeta.
- **Esquina decorativa** superior derecha con dos líneas granate en ángulo (`w-4 h-4 border-t border-r border-red-800/20`).

---

## 5. Modelo de datos (previsto para Supabase)

### Roles

**17 roles + 1 admin:**

- **Vocales (4):** Soprano, Contralto, Tenor, Bajo
- **Cuerda (5):** Violín 1, Violín 2, Viola, Violonchelo, Contrabajo
- **Viento (7):** Flauta, Oboe, Clarinete, Fagot, Trompa, Trompeta, Trombón
- **Otros (2):** Percusión, Órgano
- **Dirección (1):** Director ← permisos de admin

### Tablas planificadas

```sql
usuarios (
  id UUID PK,
  nombre TEXT,
  email TEXT UNIQUE,
  rol TEXT,             -- uno de los 18 roles
  created_at TIMESTAMP,
  -- auth se gestiona en auth.users de Supabase
)

partituras (
  id UUID PK,
  titulo TEXT,
  compositor TEXT,
  rol TEXT,             -- a qué cuerda/instrumento pertenece
  enlace_drive TEXT,
  created_at TIMESTAMP,
)

audios (
  id UUID PK,
  titulo TEXT,
  compositor TEXT,
  rol TEXT,
  enlace_audio TEXT,
  created_at TIMESTAMP,
)

repertorios (
  id UUID PK,
  nombre TEXT UNIQUE,   -- "Adviento", "Cuaresma", etc. ("Todos" está reservado)
  orden INTEGER,        -- posición en los chips de filtro
  created_at TIMESTAMP,
)

partitura_repertorio (   -- N:N
  partitura_id UUID FK,
  repertorio_id UUID FK,
  PRIMARY KEY (partitura_id, repertorio_id)
)

eventos (
  id UUID PK,
  tipo TEXT,                -- 'ensayo' | 'celebracion'
  titulo TEXT,
  fecha DATE,               -- llega al frontend como 'AAAA-MM-DD'
  hora_inicio TIME,
  hora_fin TIME NULL,
  hora_convocatoria TIME NULL,
  lugar TEXT,
  repertorio_id UUID FK NULL,
  secciones TEXT[],         -- grupos convocados; vacío = tutti
  vestimenta TEXT NULL,
  notas TEXT NULL,
  estado TEXT,              -- 'confirmado' | 'aplazado' | 'cancelado'
  created_at TIMESTAMP,
)
-- RLS: el público (anon) solo puede leer tipo = 'celebracion' y sin columnas internas
-- (mejor con una vista `celebraciones_publicas`); los miembros leen todo; solo el Director escribe.

audio_repertorio (       -- N:N
  audio_id UUID FK,
  repertorio_id UUID FK,
  PRIMARY KEY (audio_id, repertorio_id)
)
```

**Nota clave:** una misma obra puede estar en varios repertorios (ej. "Ave María" en "Mariana" y "Tiempo Ordinario"). La relación N:N ya está implementada en el frontend con arrays `repertorios: string[]`.

### Repertorios iniciales

`Todos` (virtual, no en BD), `Adviento`, `Navidad`, `Cuaresma`, `Triduo Pascual`, `Pascua`, `Mariana`, `Tiempo Ordinario`.

El director podrá crear/renombrar/eliminar repertorios desde el panel.

---

## 6. Decisiones tomadas

Estas son las decisiones cerradas que no hay que rediscutir:

### UX de acceso

- **Sin registro público.** Las cuentas SOLO las crea el director desde el panel de admin.
- **Login por email + contraseña.** No hay social login (por ahora).
- **Recuperar contraseña:** por email con enlace de Supabase → `/miembros/confirmar` → `/miembros/cambiar-contrasena?recuperacion=1`.
- **Contraseña inicial:** al crear un usuario, el director genera una contraseña manual (con botón "Generar automáticamente" que crea una aleatoria). La contraseña se muestra en pantalla al director, que la copia y la entrega personalmente al miembro. Migración futura a enviar por email.

### UX del dashboard

- **Pestañas separadas** Partituras / Audios (deslizador granate).
- **Reproductor integrado** para audios (no descarga externa).
- **Metadatos:** título, compositor, repertorio(s). Sin fecha de subida.
- **Buscador** que filtra por título y compositor (case-insensitive).
- **Chips de repertorios** como filtros combinables con el buscador.
- **Todo visible sin paginación** (para <200 archivos por rol, viable).
- **Estado vacío contextual** (mensaje distinto según sea por búsqueda, filtro o falta de contenido).
- **Saludo con capitular granate** en el nombre del usuario + rol en eyebrow debajo.
- **Contador de resultados** dinámico bajo los filtros.

### Calendario

- **Dos tipos de evento:** *ensayo* y *celebración* (no "actuación": el coro sirve en la liturgia).
- **Tipos de evento visibles: Celebración, Formación y Convivencia** (`TIPOS_VISIBLES` en `lib/calendario.ts`), en el calendario público, el de miembros y el panel. Cada tipo tiene su aspecto (celebración destacada con capital y banda granate; formación con banda piedra oscura y birrete; convivencia con velo granate suave y manos) y hay filtros por tipo. El **ensayo** sigue en el modelo pero oculto: para mostrarlo, añadirlo a `TIPOS_VISIBLES`. El cartel granate y la banda del dashboard siguen siendo solo para la próxima **celebración**.
- **Público vs. miembros:** el público no ve hora de convocatoria, vestimenta, notas ni secciones.
- **Panel granate "Próxima celebración"** con cuenta atrás (solo celebraciones confirmadas). Título SIN capital. Al pie, como detalle: catedral pequeña (100px) abajo a la derecha de la que sale el pentagrama hacia la izquierda; por él viajan, despacio (48s), notas inclinadas y variadas (4 semicorcheas, corcheas, negras, blanca, silencios). Sin botón "Cómo llegar"; solo "Añadir a mi agenda".
- **Solo vista Agenda** (agrupada por mes y año). La vista de mes se descartó.
- **Capital en los títulos de la agenda:** en línea (no flotante), alineada por abajo con el resto del texto y sobresaliendo por arriba.
- **Convocatoria por secciones** (grupos de rol). El Director está convocado a todo. Si la sección del miembro no está convocada, el evento lo indica.
- **Estados:** aplazado/cancelado se marcan (etiqueta + tachado), no se borran.
- **Enlace al repertorio:** el evento lleva a `/miembros/dashboard?repertorio=Nombre`, que abre el archivo ya filtrado.

### Componentes (`/sobre-nosotros/componentes`)

- **Plano del escenario visto desde arriba** según el esquema de la formación: coro en gradas al fondo (Tenores, Bajos, Sopranos, Contraltos), órgano y percusión en las esquinas, viento en el arco exterior, cuerda en el interior y Director delante. Sin rótulo "Público".
- **Fondo:** solo notas que flotan despacio (`.nota-flota`) por TODO el ancho de la página, más densas en los laterales. Se probó un esbozo del coro de la Catedral y se descartó: no añadir ilustraciones de fondo.
- **Frase:** "Conoce a los miembros de esta gran familia".
- **Un punto por componente** en cada sección (se ve el tamaño real de cada cuerda; al pasar el ratón, el nombre).
- **Al pulsar:** la sección se ilumina, el resto se atenúa, sus puntos se encienden en cascada y debajo se abre un "programa de mano" (pestaña apuntando a la sección) con los nombres entrando uno a uno. Esc o la X cierran.
- **Lista propia de componentes** (tabla `componentes`: nombre + rol), separada de las cuentas de usuario, para poder incluir a alguien sin cuenta. El Director la gestiona en `/miembros/dashboard/admin/componentes` con el mismo plano: pulsa una sección y añade o quita nombres (quitar pide confirmación).
- **Nombre completo** tal como se escribe. Sin campo de consentimiento en la web: el director lo registra en documentación interna.
- **Privacidad técnica:** la página es pública y al cliente solo llegan `id`, `nombre` y `rol`; nunca el email.
- **Estilo de las piezas:** coro y Director en granate pleno; TODA la orquesta (cuerda, viento, órgano, percusión) como las tarjetas: blanco con banda granate. Cada pieza lleva un icono de su instrumento junto al nombre y el efecto hover del menú (texto granate + subrayado que crece).
- **Móvil:** la formación se lee por filas (fondo → público) y el programa se abre bajo la fila pulsada.
- Las secciones y posiciones se editan en `lib/formacion.ts`; cada rol cae solo en su sección.

### Sobre nosotros (`/sobre-nosotros`, absorbe la antigua "Esencia")

- `/sobre-nosotros/esencia` redirige (308) aquí. En el menú, la entrada se llama "Quiénes somos" y solo se marca activa en esta página exacta.
- **Bloques alternos con capital granate** (texto a izquierda/derecha por turnos) y, al otro lado, un panel decorativo con numeral romano y una frase (granate o claro). Entran desde su lado (`Reveal desde`).
- **Interactivos:** "Lo que nos mueve" (4 pilares en tarjetas que se voltean al pulsarlas: `PilaresGiratorios`), "Más allá de la música" (riel de 4 temas clicables: Valores, Cómo acceder —pasos + botón al formulario—, Ministerio —música en la liturgia, cita SC 112— y Familia: `Temas`) y "En cifras" (componentes, obras y celebraciones; suben al entrar en pantalla: `Cifras`).
- **Sin historia ni línea del tiempo:** es el primer año del coro. Bajo los temas, botón "Ver la galería" → `/sobre-nosotros/galeria` (placeholder, también en el menú).
- Cierre granate con invitación (inscripción y componentes) y pentagrama con notas.
- Todos los textos, años e hitos son de muestra (mockup).

### Inicio (`/`)

- **Orden:** Hero → Próxima celebración (el `CartelProximaCelebracion` completo, con catedral y pentagrama con notas) → Quiénes somos (breve, titular "Una voz de la Iglesia de Jaén" para no repetir el lema del hero, botón "Conoce más") → **Palabras de nuestro Obispo, Mons. Sebastián Chico Martínez** (`palabrasObispo.tsx`: misma composición que tenía la del director; textos de prueba lorem ipsum y marcador "S" en lugar de foto) → **Forma parte** (cierre granate con pentagrama y dos botones a `/contacto?motivo=unirme|contar`) → **Descubre** (4 tarjetas con foto: Componentes, Repertorio, Galería, Calendario), al final por decisión de Fernando.
- **El formulario de inscripción ya no está en la home**: vive en Contacto. `?motivo=` preselecciona la opción (la página de Contacto es dinámica por eso).
- El hero se pausa al pasar el ratón o enfocarlo y no rota con "reducir movimiento".

### Contacto (`/contacto`)

- **Dos formularios, elegidos con dos tarjetas grandes FUERA de la tarjeta del formulario** ("¿Qué te trae por aquí?"; la elegida en granate con un pico hacia el formulario), para no confundirse con el deslizador coralista/instrumentista de dentro: "Quiero unirme" (el mismo `FormularioInscripcion` del inicio: coralista/instrumentista) y "Contar con vosotros" (`FormularioContratacion`: datos, entidad, fecha prevista y lugar; **sin tipo de celebración ni formación**, no se ofrecen esas opciones). **Ambos con mensaje**; en el de contratación es obligatorio.
- **Sin precios ni tarifas**: una nota aclara que todo se habla con cada persona.
- **Panel granate "Llámanos"** con los teléfonos del Director y del Coordinador (Delegado de Coros), enlaces `tel:` y pentagrama con notas; debajo, email, Instagram y sede. En móvil, el panel de teléfonos va primero.
- ⚠️ **Teléfonos de muestra** (600 000 001/002) en `lib/contacto.ts`: sustituir por los reales. Los formularios envían por Resend en cuanto haya `RESEND_API_KEY`.

### Galería (`/sobre-nosotros/galeria`)

- **Carpetas (álbumes) como montones de fotos impresas** (marco blanco, giradas) que se abren en abanico al pasar el ratón; con categoría, título, fecha, lugar y nº de fotos. Agrupadas por mes, de la más reciente a la más antigua.
- **Filtro por tipo de momento:** Celebraciones, Conciertos, Ensayos, Convivencias (chips con contador; vacíos desactivados).
- **Álbum abierto:** hoja que sube (`animate-[subir]`) con título, texto del álbum y fotos en mosaico (`columns-*`) que entran en cascada. **Sin fecha, lugar ni enlace al calendario dentro del álbum** (decisión de Fernando).
- **Visor a pantalla completa:** acercamiento (`animate-[acercar]`), flechas, ← → Esc, deslizar con el dedo, contador, pie y miniaturas.
- Álbum y visor se montan con `createPortal` en `<body>`: dentro de la página (capa `z-10`) la cabecera los tapaba.
- Fotos de muestra = recortes (`encuadre` + `zoom`) de las imágenes del hero y de la Catedral; `FotoRecortada` pide la imagen más grande según el zoom para que no se vea borrosa. Datos en `lib/galeria.ts` y `albumesPrueba`.

### Responsables (`/sobre-nosotros/responsables`, antes "Directiva")

- **Tríptico de tres calles IGUALES, sin jerarquía, las tres en granate** (mismo fondo que el cartel del calendario): Delegado de Liturgia (D. Antonio Lara Polaina) · Director (Fernando J. Camacho Rizquez, en el centro solo por composición) · Delegado de Coros (D. Idelfonso Rueda Jandula, grafía tal como la dio Fernando; pendiente confirmar "Ildefonso"/"Jándula").
- **Fotos cuadradas con el marco de "Palabras del director"** (esquinas + marco exterior fino), NO en arco. De momento sin fotos: marcador con la inicial en serif (también la del Director).
- Cita breve, ornamento y resumen con la capital de "Palabras del director". **Las tres calles tienen "Leer la carta completa"**, alineado abajo.
- **Cartas completas** con la composición de "Palabras del director" (`CartaResponsable`): la del Director en `/sobre-nosotros/director`; las de los delegados en `/sobre-nosotros/responsables/[slug]` (estáticas, `dynamicParams = false`).
- Datos y textos (de muestra) en `lib/responsables.ts`. Mismo tamaño de calle, foto y texto en las tres; laterales entran desde los lados (`<Reveal desde="izquierda|derecha">`); en móvil, mismo orden que en escritorio.

### Repertorio público (`/sobre-nosotros/repertorio`)

- **Catálogo de obras montadas**, solo de consulta: título, autor (y fechas), tipo, época, formación e idioma. **Nada de audios, partituras ni repertorios litúrgicos** (eso es del área de miembros).
- Estilo índice de programa impreso: cabecera serif por grupo y, en cada obra, título y autor unidos por línea de puntos, con etiquetas de catálogo debajo.
- **Desplegable "Agrupar por"** (`SelectorAgrupacion`, accesible con teclado): Tipo de obra (familias: Ordinario de la misa, Propio de la misa, Motetes y antífonas, Himnos y cantos, Navidad), Autor (los "Anónimo…" juntos al final), Época (cronológica), Formación, Idioma y Título A–Z. Más buscador e índice para saltar a cada grupo.
- `/repertorio` redirige (308) aquí. Lo gestiona el director en `/miembros/dashboard/admin/catalogo` (crear, editar, quitar). Datos en `lib/catalogo.ts` (tipos y `agrupar`) y `obrasPrueba`.

### Gestión de contenido y roles de gestión (decidido)

- **Gestor de contenido a medida dentro del panel, sobre Supabase** (se descartaron Payload, Sanity/Contentful y Decap/Tina: segundo panel, otros usuarios, fotos en git o límites del plan gratuito).
- **Edición con formularios en el panel** (no edición sobre la página) y **sin revisión**: lo que se guarda se publica al momento (regenerando solo la página afectada).
- **Roles de gestión** (`lib/gestion.ts`), independientes del rol musical y **acumulables** (una persona puede tener varios):
  - Portada e inicio · Sobre nosotros · Galería · Agenda · Música · Secretaría.
  - **El Director tiene siempre todos** y es **el único que da o quita roles** (`puedeAsignarRoles`). Secretaría gestiona cuentas, pero no reparte roles.
  - En el dashboard, cada persona solo ve las tarjetas de sus roles (`AdminSection` recibe `roles`). En Supabase: tabla `permisos (usuario_id, rol)` y RLS que lo compruebe en cada escritura.
- **Contenido editable:** textos sueltos en una tabla clave → valor (el texto actual del código queda como valor por defecto) y colecciones en sus tablas. **Historial de cambios** con "Deshacer" previsto.
- **Fotos:** comprimir en el navegador al subir (WebP ~2000 px ~250 KB + miniatura ~40 KB) y servirlas desde Supabase Storage sin el optimizador de Vercel (el plan Hobby tiene cupo mensual y se bloquea 30 días si se supera). 1 GB gratis ≈ 4.000 fotos.

### UX del director

- **Detección de rol:** si `rol === 'Director'`, se muestra la sección de Administración arriba del dashboard.
- **10 tarjetas de admin**, cada una de un rol de gestión: Portada e inicio, Textos y responsables, Componentes, Galería, Calendario, Catálogo, Repertorios, Archivos, Usuarios y Contacto. Pendientes (Próximamente): Portada, Textos y responsables, Galería, Archivos y Contacto.
- **Modales para acciones:** crear/editar usuario, confirmar eliminación, mostrar contraseña generada.
- **Filtros por sección (grupos de rol)** en la gestión de usuarios: Todos, Voces, Cuerda, Viento, Otros, Dirección.

### Backend

- **Supabase** para auth + base de datos.
- **Autenticación:** Supabase Auth con email + contraseña (gratis en el plan Free).
- **Identificación del Director:** por la columna `rol` de la tabla `usuarios` (`rol = 'Director'`), **nunca por un email fijo en el código**. Así puede haber más de un director o traspasar el cargo sin tocar código. El primer Director se crea a mano desde el panel de Supabase.
- **Comprobación de rol en dos capas:** `proxy.ts` (redirige si no hay sesión o si no es Director en `/admin`) y políticas RLS en Supabase (aunque alguien salte la interfaz, la base de datos no le deja leer ni escribir lo que no debe).
- **Crear usuarios desde el panel** requiere `auth.admin.createUser`, que necesita la clave `service_role`: solo en el servidor (Server Action o Route Handler), jamás en el cliente ni con prefijo `NEXT_PUBLIC_`.
- **Google Drive** para almacenar los PDFs de partituras y MP3s de audios. Los enlaces se guardan en Supabase.
- **Cron job en Vercel** (`vercel.json`, cada 5 días) que llama a `/api/latido` y hace una consulta a Supabase para que no se pause por inactividad (plan gratis). Protegido con `CRON_SECRET`.
- **Envío de formularios:** acción de servidor `app/acciones/formularios.ts` → Resend (`lib/correo.ts`). Revalida en servidor, campo trampa `web` contra bots, `reply_to` = email de quien escribe. Sin `RESEND_API_KEY` responde `no-configurado` y el formulario lo dice y ofrece el email del coro (nunca un éxito falso).
- **Degradación honesta:** todo lo que depende de Supabase o Resend comprueba si está configurado (`supabaseConfigurado`, `correoConfigurado`) y, si no, avisa al usuario en vez de simular que funciona.
- **Sin tarjeta de crédito** asociada a Supabase, garantiza cero cobro imprevisto.

---

## 7. Estado actual — qué está hecho

### Sitio público (`/`)

- [x] Header con menú desplegable "Sobre nosotros" (Quiénes somos, Director, Componentes, Responsables, Repertorio) y botón "Área de miembros" que lleva al login.
- [x] Hero con slider de 2 slides, botones contextuales por slide, indicadores, cambio automático cada 6s.
- [x] Sección "Quiénes somos" con titular en dos partes ("Servir cantando / Cantar sirviendo") y cita destacada.
- [x] "Palabras del director" con foto vertical, capitular granate, tres párrafos, cita de San Agustín, firma.
- [x] Formulario de inscripción con deslizador Coralista/Instrumentista y campos dinámicos. **Sin envío real todavía.**
- [x] Footer con degradado negro vertical, 3 contactos (email, Instagram, sede en Google Maps), copyright y créditos.

### Área de miembros

- [x] `/miembros` — Login con arte tipográfico en el lado izquierdo (cascada "Tu atril, tu archivo, tu música."), formulario a la derecha, aviso de "las cuentas las crea el admin". **Autenticación NO conectada:** mock en el que `admin` / `admin` abre el dashboard.
- [x] `/miembros/recuperar` — Recuperar contraseña con arte parecido ("Te ayudamos a volver."). **No envía email real.**
- [x] `/miembros/dashboard` — Dashboard con:
  - Cabecera con logo, saludo (capitular granate + rol), botones "Contraseña" y "Cerrar sesión".
  - Deslizador Partituras/Audios.
  - Buscador con lupa y botón X para limpiar.
  - Chips de repertorios (con "Todos" activo por defecto).
  - Grid de tarjetas de archivos.
  - Estados vacíos contextuales.
  - **Detección de rol Director:** si es Director, muestra encima la sección "Administración" con 3 tarjetas.
- [x] `/miembros/dashboard/admin/usuarios` — Gestión de usuarios con CRUD completo funcionando **en memoria** (se reinicia al recargar):
  - Listado de tarjetas con nombre (capitular), email, rol · sección y 3 acciones (Editar, Contraseña, Eliminar).
  - La propia cuenta del director lleva la etiqueta "Tu cuenta" y no se puede eliminar.
  - Buscador por nombre/email y chips por sección con contador (Todos, Voces, Cuerda, Viento, Otros, Dirección).
  - Modal para crear (con contraseña inicial y botón "Generar") y para editar (sin contraseña). Valida email y duplicados.
  - Confirmación antes de eliminar y antes de restablecer contraseña.
  - Diálogo que muestra la contraseña generada una sola vez, con botón "Copiar datos" (usuario + contraseña).
- [x] `/miembros/dashboard/admin/repertorios` — CRUD de repertorios **en memoria**:
  - Lista numerada: su orden es el orden de los chips de filtro en el dashboard. Flechas para subir/bajar.
  - "Todos" aparece fijo arriba como fila bloqueada (es virtual, no se guarda).
  - Añadir desde un campo superior; renombrar en la propia fila (Enter guarda, Esc cancela).
  - Valida vacío, duplicados (sin distinguir mayúsculas) y el nombre reservado «Todos».
  - Cada fila muestra cuántas partituras y audios contiene. Eliminar pide confirmación y aclara que las obras no se borran.
  - Los cambios no llegan al dashboard hasta conectar Supabase (cada página tiene su propio estado).
- [x] `/miembros/dashboard/admin/calendario` — gestión de eventos **en memoria**: listado por mes, filtros, crear/editar (modal con fecha nativa, horas de llegada/inicio/fin, convocatoria por secciones, repertorio, vestimenta, notas, estado), duplicar (propone la misma cita +7 días) y eliminar.
- [x] `/calendario` (público) y `/miembros/dashboard/calendario` — solo celebraciones: cartel granate con cuenta atrás y pie musical (catedral + pentagrama con notas); agenda por meses; pasadas plegadas; "Añadir a mi agenda" (.ics). El lugar se muestra como texto (sin enlace a mapas).
- [x] Dashboard: banda granate con la próxima celebración (enlaza al calendario).
- [x] `/miembros/dashboard/admin/archivos` — placeholder Proximamente.
- [x] Páginas públicas del menú (calendario, contacto, repertorio, sobre-nosotros/*) — placeholders Proximamente, sin 404.

### Infraestructura

- [x] Repositorio en GitHub subido (privado).
- [x] Estructura de route groups `(sitio)` funcionando.
- [x] Dependencias instaladas: `lucide-react`, `react-icons`, `@supabase/supabase-js`, `@supabase/ssr`.
- [x] Proyecto migrado de Windows a Fedora Workstation.
- [x] Desplegado en Vercel (Hobby), protegido con contraseña vía `proxy.ts`.
- [x] `npm run build`, `tsc` y `eslint` pasan sin errores.
- [x] Preparado para Supabase sin credenciales: clientes en `lib/supabase/`, esquema SQL con RLS validado, `.env.example`, cron de latido.
- [x] Páginas legales `/aviso-legal`, `/privacidad`, `/cookies` (plantilla `app/components/legal/PaginaLegal.tsx`). **Borrador**: los datos `[entre corchetes]` (NIF, domicilio, plazos…) se resaltan y debe revisarlo la Diócesis. Enlazadas desde el footer y desde las casillas de privacidad.
- [x] Formularios de inscripción y contratación conectados a Resend (falta la clave, ver §8).
- [x] `/miembros/cambiar-contrasena` y recuperar contraseña conectados a Supabase Auth (se activan al poner las claves).

---

## 8. Estado actual — qué falta

### Alto (necesario para MVP funcional)

- [ ] **Configurar Supabase**: cuenta, proyecto (región UE), obtener URL, `anon` y `service_role` (Project Settings → API).
- [ ] **Crear `.env.local`** copiando `.env.example` y rellenando; las mismas variables en Vercel.
- [ ] **Ejecutar** `supabase/migrations/20261030000000_esquema_inicial.sql` en el SQL Editor y dar de alta al primer Director (instrucciones al final del archivo).
- [ ] **Auth → URL Configuration:** Site URL = la de Vercel y añadir `…/miembros/confirmar` a las Redirect URLs (si no, el enlace de recuperar no funciona).
- [ ] **Resend:** crear la cuenta **con el email del coro** (con el remitente de pruebas `onboarding@resend.dev` solo se puede escribir al email de la propia cuenta) y poner `RESEND_API_KEY`. Para remitente propio hay que verificar un dominio (DNS).
- [ ] **Conectar login real** en `app/miembros/page.tsx`. Buscar comentario `// La autenticación se activará al conectar Supabase.`
- [ ] **Conectar CRUD de usuarios** en `app/miembros/dashboard/admin/usuarios/page.tsx`. La interfaz ya está hecha: sustituir `usuariosPrueba` y las funciones `crearUsuario` / `editarUsuario` / `eliminarUsuario` / `restablecerContrasena` por llamadas a Supabase (Server Actions con `service_role`).
- [ ] **Protección de rutas en `proxy.ts`** (en Next 16 el antiguo `middleware.ts` se llama `proxy.ts` y ya existe): que `/miembros/dashboard/**` requiera sesión activa y que `/miembros/dashboard/admin/**` requiera rol Director. Mantener la Basic Auth actual mientras siga en desarrollo.
- [ ] **Crear página** `/miembros/dashboard/admin/archivos` — subir/editar partituras y audios, asignarlas a un rol y a repertorios.
- [ ] **Conectar repertorios** a Supabase: la tabla necesita una columna `orden INTEGER` (el orden de los filtros lo decide el director). Al borrar un repertorio, borrar en cascada sus filas de `partitura_repertorio` / `audio_repertorio`, nunca las obras.
- [ ] **Cargar partituras y audios reales** en el dashboard según el rol del usuario logueado.

### Medio (ampliaciones importantes)

- [ ] Migrar de contraseña manual a envío por email al crear usuario.

### Bajo (mejoras futuras)

- [x] `/sobre-nosotros/componentes` — plano del escenario con un punto por miembro, iconos, marco del coro de la Catedral y programa de mano animado (datos de prueba).
- [x] `/miembros/dashboard/admin/componentes` — gestión de componentes sobre el plano, **en memoria**.
- [x] `/sobre-nosotros/responsables` — tríptico de responsables (textos de muestra; faltan fotos de los delegados).
- [x] `/sobre-nosotros/director` y `/sobre-nosotros/responsables/[slug]` — cartas completas (textos de muestra).
- [x] `/sobre-nosotros/repertorio` — catálogo público agrupable + gestión en admin (en memoria).
- [x] `/sobre-nosotros` — página completa con bloques, pilares, temas y cifras (textos de muestra).
- [x] `/sobre-nosotros/galeria` — galería con carpetas, filtros, mosaico y visor (fotos de muestra).
- [ ] Gestión de la galería desde el panel del director (crear álbumes y subir fotos).
- [ ] **Conectar calendario** a Supabase (tabla `eventos`, ver §5). Hoy el admin, el calendario de miembros y el público tienen cada uno su copia en memoria.
- [x] `/contacto` — formularios de unirse y de contratación + teléfonos (de muestra).
- [ ] Apertura pública: quitar la protección con contraseña (borrar `ACCESO_USUARIO`/`ACCESO_CLAVE` en Vercel) y, si procede, dominio propio.
- [ ] Modo oscuro (evaluar si aporta).
- [ ] Paginación si el volumen de archivos crece mucho (>200 por rol).

---

## 9. Cómo trabajar en el proyecto

### Arrancar el servidor de desarrollo

```bash
npm run dev
```

Abre `http://localhost:3000`.

### Rutas de prueba clave

- `/` — home
- `/miembros` — login
- `/miembros/recuperar` — recuperar contraseña
- `/miembros` — login de prueba con `admin` / `admin`
- `/miembros/dashboard` — dashboard (por defecto `usuarioPrueba.rol = 'Director'` en `app/miembros/dashboard/page.tsx`; con otro rol y `gestion: ['galeria', 'agenda']` se ve como un gestor con esos roles; con `gestion: []`, como un miembro sin administración)
- `/miembros/dashboard/admin/usuarios` — gestión de usuarios

### Cómo cambiar el rol de prueba

En `app/miembros/dashboard/page.tsx` está la constante:

```ts
const usuarioPrueba = {
  nombre: 'Fernando',
  rol: 'Director', // Cambia a 'Tenor', 'Soprano'... para ver la vista sin panel de administración
};
```

Al cambiarlo:
- Como **Director:** aparece la sección "Administración" arriba con las 3 tarjetas.
- Como cualquier otro rol: solo se ve el archivo de partituras/audios.

Cuando Supabase esté conectado, esto vendrá del usuario logueado.

### Comprobar antes de subir

`npm run dev` no comprueba tipos ni lint. Antes de hacer push a `main` (que despliega en Vercel):

```bash
npx tsc --noEmit && npx eslint app lib proxy.ts && npm run build
```

### Commits

Sigue el flujo: `git add .` → `git commit -m "..."` → `git push`. Ramas: `main` (producción, despliega en Vercel) y ramas `feature/...` para trabajo en curso.

Los mensajes de commit han sido descriptivos en castellano (ej. "Añado gestión de usuarios en admin").

---

## 10. Guía de estilo para código nuevo

### Al crear un componente

- Empezar con `'use client'` **solo si necesita interactividad** (estados, eventos, hooks). Los componentes puramente visuales se dejan como Server Components.
- Comentarios en **castellano**, breves, explicando el "por qué" no el "qué".
- Nombres de props y estados descriptivos y en castellano donde tenga sentido (`nombre`, `email`, `rol`, `busqueda`, `tipoActivo`).
- Los eventos siguen convención React: `onClick`, `onChange`, `onSubmit`.

### Al añadir una página

- Si es pública, va dentro de `(sitio)/` para heredar Header y Footer.
- Si es privada, va dentro de `miembros/` para NO tener Header/Footer del sitio público.
- Siempre respetar la estructura de cabecera de sección: eyebrow, titular, subtítulo cursiva, ornamento.

### Al maquetar

- Preferir Tailwind sobre CSS custom.
- Alturas y espaciados generosos (`py-16`, `mb-12`, etc.). El diseño respira.
- Usar la paleta granate + crema. Nunca introducir colores nuevos sin razón.
- Los botones importantes llevan el efecto brillo deslizante y sombra granate.
- Las tarjetas llevan banda lateral granate y esquina decorativa.
- Móvil primero: siempre pensar en cómo se ve en pantallas pequeñas.

### Al añadir iconos

- Preferir `lucide-react` (más consistente con el resto del proyecto).
- Tamaños habituales: `size={14}` (pequeño), `size={18}` (medio), `size={24}` (grande), `size={36}` (footer, hero).
- Grosor: `strokeWidth={1.5}` para elegancia (más fino que el default).

---

## 11. Convenciones importantes

### Textos y voz

- **Voz institucional pero cálida.** Ni frío ni cursi.
- **Referencia religiosa presente pero no invasiva.** El coro es diocesano, es su identidad, pero se evita saturar de terminología litúrgica.
- **Latín en repertorio y citas** (Ave María, O Magnum Mysterium, San Agustín) se usa con naturalidad.
- **Verbo "servir"** aparece con frecuencia: "servir cantando", "al servicio de la Iglesia".
- **Tono de Fernando (director):** cercano, culto, apasionado por la música sacra. Ejemplo en "Palabras del director".

### Frases signature

- *"Servir cantando, cantar sirviendo"* — lema del coro, aparece en hero, footer.
- *"Tu voz, tu instrumento, su gloria"* — usado en formulario de inscripción.
- *"Tu atril, tu archivo, tu música."* — usado en el login.
- *"Cantadle un cántico nuevo, tocad con maestría"* (Salmo 33, 3) — cita recurrente.
- *"Cantar es propio del que ama"* (San Agustín) — cita en Palabras del Director.

### Espacios de nombres

- El director es siempre **Fernando J. Camacho Rizquez** (nombre completo en firmas, "Fernando" en saludos).
- La sede es **Casa de la Iglesia · Seminario Diocesano** (Jaén).
- Email de contacto oficial: `corodiocesano@diocesisdejaen.es`.
- Instagram: `@corodeladiocesisdejaen`.

---

## 12. Aspectos técnicos peculiares

### Next.js 16: leer la documentación local

`AGENTS.md` avisa: esta versión tiene cambios incompatibles con lo que puede recordar un modelo. Antes de usar una API, consultar `node_modules/next/dist/docs/`. Ejemplo ya encontrado: `middleware.ts` pasa a llamarse **`proxy.ts`** (función exportada `proxy`) y corre en runtime Node.js por defecto.

### Protección con contraseña (`proxy.ts`)

- HTTP Basic Auth sobre toda la web, activa **solo si existen** las variables de entorno `ACCESO_USUARIO` y `ACCESO_CLAVE`.
- En local no están definidas, así que `npm run dev` no pide nada.
- En Vercel están en *Settings → Environment Variables* (Production y Preview). Cambiar un valor exige *Redeploy*.
- Mientras está activa añade `X-Robots-Tag: noindex, nofollow`.
- Para abrir la web al público: borrar las dos variables y redesplegar.

### Fechas y calendario (¡cuidado!)

- Las fechas se manejan como texto `'AAAA-MM-DD'`. **Nunca** `new Date('AAAA-MM-DD')`: lo interpreta en UTC y puede dar el día anterior. Usar siempre las funciones de `lib/fechas.ts` (construyen en hora local con `new Date(año, mes, día)`).
- `diasEntre` calcula en UTC para que los cambios de hora no descuadren la cuenta atrás.
- "Hoy" se obtiene con `useHoy()` (navegador). Si se calculara al prerenderizar, la web quedaría congelada en el día del despliegue.
- Semana española: lunes = 0. Meses de 0 a 11.
- Probado: día de la semana de 2024 a 2032, bisiestos (2028 sí, 2100 no, 2000 sí), cruces de año y cambios de hora, en zonas Madrid/Nueva York/Auckland.
- El .ics usa horas "flotantes" (hora local del móvil) y, sin hora de fin, dura 90 min (cruza medianoche bien: Misa del Gallo 23:30 → 01:00).

### `useSearchParams` y Suspense

Una página cliente que use `useSearchParams` debe envolverse en `<Suspense>` o `next build` falla. Ver el dashboard como ejemplo.

### Turbopack y lockfiles

En algún momento hubo problemas con **lockfiles duplicados** por tener el proyecto anidado en dos carpetas. Ahora resuelto. Si vuelve a aparecer el warning "detected multiple lockfiles", buscar `package-lock.json` fuera del proyecto y borrarlos.

### Route groups y layouts

- `app/layout.tsx` (raíz): SOLO `<html><body>{children}</body></html>` con fuentes. NUNCA meter Header o Footer aquí.
- `app/(sitio)/layout.tsx`: Header + children + Footer. Para páginas públicas.
- `app/miembros/layout.tsx`: mínimo, un `<div>` wrapper. Anula el header/footer del sitio.

Si en el futuro se añade otra sección privada, seguir el patrón de `miembros`.

### Imágenes

- Todas las imágenes en `public/`, sin subcarpetas. Las fotos se usan en **JPG** (`sliderUnete.jpg`, `sliderRepertorio.jpg`, `repertorioCatSlider.jpg`, `FotoDirectrorPalabras.jpg`, ~0,1-0,7 MB); los PNG originales (4-6 MB) se conservan pero no se usan.
- Cada página pública declara `metadata` (título y descripción); el layout raíz añade "· Coro de la Diócesis de Jaén" con `title.template`.
- Se usan con `<Image>` de Next.js. Siempre con `alt` descriptivo y `sizes` cuando toque.
- Los logos son sensibles a mayúsculas/minúsculas. Nombres exactos:
  - `LogoCoroDiocesano.png`
  - `LogotipoContornoBlanco.png` (con "n" final antes de "Blanco")
  - `FotoDirectrorPalabras.png` (ojo, tiene una "r" duplicada por error histórico, mantenerlo así hasta renombrar el archivo)
  - `SantoRostroCoro.png`

---

## 13. Consideraciones importantes al continuar

### Sobre Supabase

- El plan gratuito **pausa el proyecto tras 7 días sin actividad**. Se resolverá con cron job en Vercel (ver pendientes).
- **NUNCA asociar tarjeta de crédito** al proyecto. Garantía de cero coste.
- La clave `service_role` NO se usa en el cliente. En el cliente solo `anon`, con prefijo `NEXT_PUBLIC_`. La `service_role` solo en código de servidor (para crear usuarios desde el panel) y sin prefijo `NEXT_PUBLIC_`.

### Sobre el diseño

- No introducir librerías de componentes (shadcn/ui, Material, etc.). El diseño es artesanal y esa es su identidad.
- No cambiar la paleta granate + crema sin discusión.
- Los ornamentos rombo aparecen en TODAS las secciones. Es una firma visual.

### Sobre el contenido

- El director/dev es la misma persona: cuidado con la voz en primera persona. En "Palabras del director" firma él, pero en el UI general se usa segunda persona ("tu archivo", "tu música").
- Los textos legales son un **borrador** con datos `[entre corchetes]` por confirmar (titular, NIF, domicilio, DPD, plazos, consentimiento de menores). Antes de abrir la web al público, que los revise la Diócesis. Si se añade analítica o vídeos de terceros, revisar `/cookies` (harían falta banner y consentimiento).

---

## 14. Contacto y créditos

- **Director del coro y desarrollador:** Fernando J. Camacho Rizquez
- **Repositorio:** https://github.com/[tu-usuario]/coro-diocesano-jaen
- **Nombre del proyecto en local:** `webCoroDiocesano`

---

## Recomendación al retomar

1. Empieza por **conectar Supabase** — es la clave que desbloquea todo lo demás.
2. Sigue con la **protección de rutas en `proxy.ts`** (sesión + rol Director).
3. Luego **CRUD real de usuarios**: la interfaz ya está hecha, solo hay que cambiar la capa de datos.
4. Después **subida de archivos y gestión de repertorios**.
5. Al final, **despliegue en Vercel + cron job**.

Cada paso puede subirse a GitHub como su propio commit para tener versionado limpio.

Éxito y a cantar.