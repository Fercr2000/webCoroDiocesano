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
- **Hosting futuro:** Vercel
- **Sistema operativo actual del dev:** Fedora Workstation (antes Windows)

Node.js 20+ requerido.

---

## 3. Estructura de carpetas

```
app/
├── layout.tsx                       ← layout raíz (sin Header/Footer, solo <html><body>)
├── globals.css                      ← Tailwind + animación @keyframes fadeIn
├── favicon.ico
│
├── components/                      ← componentes reutilizables del sitio público
│   ├── header.tsx                   ← header con menú desplegable "Sobre nosotros"
│   ├── footer.tsx                   ← footer con degradado negro, iconos rojos
│   ├── hero.tsx                     ← slider de 2 slides con fade automático
│   ├── about.tsx                    ← sección "Quiénes somos"
│   ├── palabrasDirector.tsx         ← carta del director con foto y capitular
│   └── inscripcion.tsx              ← formulario coralista/instrumentista
│
├── (sitio)/                         ← route group, incluye Header y Footer
│   ├── layout.tsx                   ← envuelve las páginas públicas con Header + Footer
│   └── page.tsx                     ← home
│
└── miembros/                        ← área privada (SIN Header/Footer del sitio público)
    ├── layout.tsx                   ← layout mínimo que anula el header
    ├── page.tsx                     ← login
    ├── recuperar/
    │   └── page.tsx                 ← recuperar contraseña
    └── dashboard/
        ├── page.tsx                 ← dashboard principal (detecta rol Director)
        ├── components/
        │   ├── DashboardHeader.tsx  ← cabecera del área privada con saludo
        │   ├── FileCard.tsx         ← tarjeta de partitura
        │   ├── AudioCard.tsx        ← tarjeta de audio con reproductor
        │   └── AdminSection.tsx     ← sección de admin (3 tarjetas)
        └── admin/
            └── usuarios/
                ├── page.tsx         ← gestión de usuarios (CRUD completo, funcional en memoria)
                └── components/
                    ├── UserCard.tsx
                    ├── CreateUserModal.tsx
                    └── ConfirmDialog.tsx

public/
├── LogoCoroDiocesano.png            ← logo horizontal con texto
├── LogotipoContornoBlanco.png       ← logo blanco solo
├── FotoDirectrorPalabras.png        ← foto del director
├── SantoRostroCoro.png              ← escudo del coro (no usado actualmente)
├── slide-1.jpg / slide-2.jpg        ← imágenes del hero
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
| Crema cálido (fondos del header y secciones) | `from-stone-50 via-amber-50 to-stone-100` |
| Fondo secundario | `bg-stone-50`, `bg-stone-100` |
| Texto principal | `text-stone-900` |
| Texto secundario | `text-stone-600`, `text-stone-500` |
| Bordes | `border-stone-200`, `border-stone-300` |
| Fondo oscuro (footer, login left) | `from-black via-stone-900 to-stone-950` o `from-red-800 to-red-950` |

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

- Fondo `bg-gradient-to-b from-stone-50 to-stone-100`.
- Borde `border-stone-200`, en hover `border-red-800/30`.
- Sombra en hover `hover:shadow-red-900/10`.
- **Banda lateral izquierda granate** (`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950`).
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
  nombre TEXT,          -- "Adviento", "Cuaresma", etc.
  created_at TIMESTAMP,
)

partitura_repertorio (   -- N:N
  partitura_id UUID FK,
  repertorio_id UUID FK,
  PRIMARY KEY (partitura_id, repertorio_id)
)

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
- **Recuperar contraseña:** por email con enlace de reset (cuando esté Supabase).
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

### UX del director

- **Detección de rol:** si `rol === 'Director'`, se muestra la sección de Administración arriba del dashboard.
- **3 sub-páginas de admin:** Usuarios, Archivos, Repertorios (cada una en su ruta).
- **Modales para acciones:** crear/editar usuario, confirmar eliminación, mostrar contraseña generada.
- **Filtros por sección (grupos de rol)** en la gestión de usuarios: Todos, Voces, Cuerda, Viento, Otros, Dirección.

### Backend

- **Supabase** para auth + base de datos.
- **Google Drive** para almacenar los PDFs de partituras y MP3s de audios. Los enlaces se guardan en Supabase.
- **Cron job en Vercel** cada 6 días para hacer ping a Supabase y evitar que se pause por inactividad (plan gratis).
- **Sin tarjeta de crédito** asociada a Supabase, garantiza cero cobro imprevisto.

---

## 7. Estado actual — qué está hecho

### Sitio público (`/`)

- [x] Header con menú desplegable "Sobre nosotros" (Esencia, Director, Componentes, Directiva, Repertorio) y botón "Área de miembros" que lleva al login.
- [x] Hero con slider de 2 slides, botones contextuales por slide, indicadores, cambio automático cada 6s.
- [x] Sección "Quiénes somos" con titular en dos partes ("Servir cantando / Cantar sirviendo") y cita destacada.
- [x] "Palabras del director" con foto vertical, capitular granate, tres párrafos, cita de San Agustín, firma.
- [x] Formulario de inscripción con deslizador Coralista/Instrumentista y campos dinámicos. **Sin envío real todavía.**
- [x] Footer con degradado negro vertical, 3 contactos (email, Instagram, sede en Google Maps), copyright y créditos.

### Área de miembros

- [x] `/miembros` — Login con arte tipográfico en el lado izquierdo (cascada "Tu atril, tu archivo, tu música."), formulario a la derecha, aviso de "las cuentas las crea el admin". **Autenticación NO conectada.**
- [x] `/miembros/recuperar` — Recuperar contraseña con arte parecido ("Te ayudamos a volver."). **No envía email real.**
- [x] `/miembros/dashboard` — Dashboard con:
  - Cabecera con logo, saludo (capitular granate + rol), botones "Contraseña" y "Cerrar sesión".
  - Deslizador Partituras/Audios.
  - Buscador con lupa y botón X para limpiar.
  - Chips de repertorios (con "Todos" activo por defecto).
  - Grid de tarjetas de archivos.
  - Estados vacíos contextuales.
  - **Detección de rol Director:** si es Director, muestra encima la sección "Administración" con 3 tarjetas.
- [x] `/miembros/dashboard/admin/usuarios` — Gestión de usuarios con CRUD completo funcionando **en memoria** (aún no persiste):
  - Listado de tarjetas con nombre, email, rol y 3 acciones.
  - Buscador y filtro por grupos de rol.
  - Modal para crear usuario (con generador de contraseña).
  - Modal para editar usuario.
  - Diálogo de confirmación al eliminar.
  - Diálogo informativo tras crear/resetear (muestra contraseña generada).

### Infraestructura

- [x] Repositorio en GitHub subido (privado).
- [x] Estructura de route groups `(sitio)` funcionando.
- [x] Dependencias instaladas: `lucide-react`, `react-icons`, `@supabase/supabase-js`, `@supabase/ssr`.
- [x] Proyecto migrado de Windows a Fedora Workstation.

---

## 8. Estado actual — qué falta

### Alto (necesario para MVP funcional)

- [ ] **Configurar Supabase**: cuenta, proyecto, obtener URL y ANON KEY.
- [ ] **Crear `.env.local`** con:
  ```
  NEXT_PUBLIC_SUPABASE_URL=...
  NEXT_PUBLIC_SUPABASE_ANON_KEY=...
  ```
- [ ] **Crear archivos** `lib/supabase/client.ts` y `lib/supabase/server.ts` (código ya diseñado en conversaciones previas, buscar en el historial si es necesario).
- [ ] **Crear las tablas en Supabase** según el modelo de datos de la sección 5.
- [ ] **Conectar login real** en `app/miembros/page.tsx`. Buscar comentario `// La autenticación se activará al conectar Supabase.`
- [ ] **Conectar recuperar contraseña** en `app/miembros/recuperar/page.tsx`.
- [ ] **Conectar CRUD de usuarios** en `app/miembros/dashboard/admin/usuarios/page.tsx`. Reemplazar los datos hardcodeados por consultas a Supabase.
- [ ] **Middleware de protección de rutas:** que `/miembros/dashboard/**` requiera sesión activa y que `/miembros/dashboard/admin/**` requiera rol Director.
- [ ] **Crear página** `/miembros/dashboard/admin/archivos` — subir/editar partituras y audios, asignarlas a un rol y a repertorios.
- [ ] **Crear página** `/miembros/dashboard/admin/repertorios` — CRUD de repertorios.
- [ ] **Cargar partituras y audios reales** en el dashboard según el rol del usuario logueado.

### Medio (ampliaciones importantes)

- [ ] Conectar envío real del formulario de inscripción al email `corodiocesano@diocesisdejaen.es` (con Resend o similar).
- [ ] Página `/miembros/cambiar-contrasena` (referenciada desde el header del dashboard).
- [ ] Cron job en Vercel para ping semanal a Supabase.
- [ ] Migrar de contraseña manual a envío por email al crear usuario.

### Bajo (mejoras futuras)

- [ ] Páginas del submenú "Sobre nosotros": Esencia, Director, Componentes, Directiva, Repertorio.
- [ ] Página `/calendario` (calendario público).
- [ ] Página `/calendario` interno en el área de miembros.
- [ ] Página `/repertorio` (repertorio público).
- [ ] Página `/contacto`.
- [ ] Despliegue final en Vercel.
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
- `/miembros/dashboard` — dashboard (para probar como Director, verifica que `usuarioPrueba.rol = 'Director'` en `app/miembros/dashboard/page.tsx`; cámbialo a 'Tenor', 'Soprano', etc. para ver la vista sin panel admin)
- `/miembros/dashboard/admin/usuarios` — gestión de usuarios

### Cómo cambiar el rol de prueba

En `app/miembros/dashboard/page.tsx` está la constante:

```ts
const usuarioPrueba = {
  nombre: 'Fernando',
  rol: 'Director', // Cambia a 'Tenor', 'Soprano', etc.
};
```

Al cambiarlo:
- Como **Director:** aparece la sección "Administración" arriba con las 3 tarjetas.
- Como cualquier otro rol: solo se ve el archivo de partituras/audios.

Cuando Supabase esté conectado, esto vendrá del usuario logueado.

### Commits

Sigue el flujo: `git add .` → `git commit -m "..."` → `git push`.

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

### Turbopack y lockfiles

En algún momento hubo problemas con **lockfiles duplicados** por tener el proyecto anidado en dos carpetas. Ahora resuelto. Si vuelve a aparecer el warning "detected multiple lockfiles", buscar `package-lock.json` fuera del proyecto y borrarlos.

### Route groups y layouts

- `app/layout.tsx` (raíz): SOLO `<html><body>{children}</body></html>` con fuentes. NUNCA meter Header o Footer aquí.
- `app/(sitio)/layout.tsx`: Header + children + Footer. Para páginas públicas.
- `app/miembros/layout.tsx`: mínimo, un `<div>` wrapper. Anula el header/footer del sitio.

Si en el futuro se añade otra sección privada, seguir el patrón de `miembros`.

### Imágenes

- Todas las imágenes en `public/`, sin subcarpetas.
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
- La clave `service_role` NO se usa en el cliente. Solo `anon` y con `NEXT_PUBLIC_` prefix.

### Sobre el diseño

- No introducir librerías de componentes (shadcn/ui, Material, etc.). El diseño es artesanal y esa es su identidad.
- No cambiar la paleta granate + crema sin discusión.
- Los ornamentos rombo aparecen en TODAS las secciones. Es una firma visual.

### Sobre el contenido

- El director/dev es la misma persona: cuidado con la voz en primera persona. En "Palabras del director" firma él, pero en el UI general se usa segunda persona ("tu archivo", "tu música").
- Los textos legales (privacidad, uso de datos) son placeholder. Antes de despliegue real hace falta redactar términos serios (probablemente con asesoría de la Diócesis).

---

## 14. Contacto y créditos

- **Director del coro y desarrollador:** Fernando J. Camacho Rizquez
- **Repositorio:** https://github.com/[tu-usuario]/coro-diocesano-jaen
- **Nombre del proyecto en local:** `webCoroDiocesano`

---

## Recomendación al retomar

1. Empieza por **conectar Supabase** — es la clave que desbloquea todo lo demás.
2. Sigue con **middleware de protección de rutas**.
3. Luego **CRUD real de usuarios** (reemplazando el mock in-memory).
4. Después **subida de archivos y gestión de repertorios**.
5. Al final, **despliegue en Vercel + cron job**.

Cada paso puede subirse a GitHub como su propio commit para tener versionado limpio.

Éxito y a cantar.