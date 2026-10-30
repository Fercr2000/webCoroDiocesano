-- =====================================================================
-- Coro y Orquesta de la Diócesis de Jaén — esquema inicial de Supabase
-- =====================================================================
-- Cómo aplicarlo: Supabase → SQL Editor → pegar este archivo → Run.
-- Después, crear al Director (ver el final del archivo).
--
-- Principios:
--  · Toda tabla tiene RLS activado: sin una regla que lo permita, no se lee
--    ni se escribe nada.
--  · Lo público (catálogo, componentes, galería, celebraciones, textos de
--    la web) se puede leer sin sesión; el resto solo con sesión.
--  · Escribir exige el ROL DE GESTIÓN del área (lib/gestion.ts). El Director
--    los tiene todos y es el único que reparte roles.
--  · Cada cambio en el contenido editable queda en `historial` (deshacer).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1. USUARIOS Y ROLES DE GESTIÓN
-- ---------------------------------------------------------------------

-- Ficha de cada miembro. El acceso (email + contraseña) lo gestiona
-- Supabase Auth en auth.users; aquí van sus datos y su rol musical.
create table public.usuarios (
  id          uuid primary key references auth.users (id) on delete cascade,
  nombre      text not null,
  email       text not null unique,
  rol         text not null check (rol in (
                'Soprano', 'Contralto', 'Tenor', 'Bajo',
                'Violín 1', 'Violín 2', 'Viola', 'Violonchelo', 'Contrabajo',
                'Flauta', 'Oboe', 'Clarinete', 'Fagot', 'Trompa', 'Trompeta', 'Trombón',
                'Percusión', 'Órgano',
                'Director')),
  created_at  timestamptz not null default now()
);

-- Roles de gestión acumulables (una fila por rol). El Director no necesita
-- filas: los tiene todos por ser Director.
create table public.permisos (
  usuario_id  uuid not null references public.usuarios (id) on delete cascade,
  rol_gestion text not null check (rol_gestion in (
                'portada', 'sobre-nosotros', 'galeria', 'agenda', 'musica', 'secretaria')),
  primary key (usuario_id, rol_gestion)
);

-- Funciones de ayuda para las reglas. SECURITY DEFINER: consultan usuarios y
-- permisos sin depender de las propias reglas de esas tablas (evita bucles).
create or replace function public.es_miembro() returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.usuarios where id = auth.uid());
$$;

create or replace function public.es_director() returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.usuarios where id = auth.uid() and rol = 'Director');
$$;

create or replace function public.tiene_rol(r text) returns boolean
  language sql stable security definer set search_path = public as $$
  select public.es_director()
      or exists (select 1 from public.permisos where usuario_id = auth.uid() and rol_gestion = r);
$$;

create or replace function public.tiene_algun_rol() returns boolean
  language sql stable security definer set search_path = public as $$
  select public.es_director()
      or exists (select 1 from public.permisos where usuario_id = auth.uid());
$$;

create or replace function public.mi_rol() returns text
  language sql stable security definer set search_path = public as $$
  select rol from public.usuarios where id = auth.uid();
$$;

alter table public.usuarios enable row level security;
alter table public.permisos enable row level security;

-- Cada uno ve su ficha; Secretaría ve y gestiona todas.
create policy "usuarios: ver la propia o secretaría" on public.usuarios
  for select using (id = auth.uid() or public.tiene_rol('secretaria'));
-- Altas, cambios y bajas: Secretaría, pero solo el Director puede crear o
-- modificar a un Director (nadie se nombra Director a sí mismo).
create policy "usuarios: alta por secretaría" on public.usuarios
  for insert with check (public.tiene_rol('secretaria') and (rol <> 'Director' or public.es_director()));
create policy "usuarios: cambios por secretaría" on public.usuarios
  for update using (public.tiene_rol('secretaria') and (rol <> 'Director' or public.es_director()))
  with check (rol <> 'Director' or public.es_director());
create policy "usuarios: bajas por secretaría" on public.usuarios
  for delete using (public.tiene_rol('secretaria') and rol <> 'Director');

-- Cada uno ve sus roles; el Director ve y reparte todos.
create policy "permisos: ver los propios o director" on public.permisos
  for select using (usuario_id = auth.uid() or public.es_director());
create policy "permisos: solo el director los reparte" on public.permisos
  for all using (public.es_director()) with check (public.es_director());

-- ---------------------------------------------------------------------
-- 2. HISTORIAL DE CAMBIOS (para "Deshacer" y saber quién cambió qué)
-- ---------------------------------------------------------------------

create table public.historial (
  id          bigint generated always as identity primary key,
  tabla       text not null,
  registro    text,
  accion      text not null check (accion in ('INSERT', 'UPDATE', 'DELETE')),
  anterior    jsonb,
  nuevo       jsonb,
  usuario_id  uuid default auth.uid(),
  created_at  timestamptz not null default now()
);
alter table public.historial enable row level security;
create policy "historial: lo ve el director" on public.historial
  for select using (public.es_director());

create or replace function public.registrar_historial() returns trigger
  language plpgsql security definer set search_path = public as $$
declare
  fila jsonb := coalesce(to_jsonb(new), to_jsonb(old));
begin
  insert into public.historial (tabla, registro, accion, anterior, nuevo)
  values (
    tg_table_name,
    coalesce(fila ->> 'id', fila ->> 'clave', fila ->> 'slug'),
    tg_op,
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end
  );
  return coalesce(new, old);
end;
$$;

-- Marca de "última modificación" para las tablas de contenido.
create or replace function public.tocar_actualizado() returns trigger
  language plpgsql as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- 3. CONTENIDO EDITABLE DE LA WEB
-- ---------------------------------------------------------------------

-- Textos sueltos por clave ('inicio.hero.titulo', 'contacto.telefono.director'…).
-- Si una clave no existe, la web usa el texto por defecto del código.
create table public.contenido (
  clave       text primary key,
  valor       jsonb not null,
  area        text not null check (area in (
                'portada', 'sobre-nosotros', 'galeria', 'agenda', 'musica', 'secretaria')),
  updated_at  timestamptz not null default now(),
  updated_by  uuid
);

-- Diapositivas del hero.
create table public.hero_diapositivas (
  id              uuid primary key default gen_random_uuid(),
  orden           int not null default 0,
  imagen          text not null,            -- ruta en el bucket 'publico'
  titulo          text not null,
  subtitulo       text,
  boton1_texto    text,
  boton1_enlace   text,
  boton2_texto    text,
  boton2_enlace   text,
  updated_at      timestamptz not null default now(),
  updated_by      uuid
);

-- Responsables (tríptico) y sus cartas.
create table public.responsables (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  orden        int not null default 0,
  cargo        text not null,
  firma        text not null,
  nombre       text not null,
  foto         text,
  cita_texto   text,
  cita_fuente  text,
  resumen      text not null,
  carta        text[] not null default '{}',   -- un elemento por párrafo
  updated_at   timestamptz not null default now(),
  updated_by   uuid
);

-- Componentes de la página pública (lista propia, independiente de las cuentas).
create table public.componentes (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  rol         text not null,
  created_at  timestamptz not null default now()
);

-- Catálogo público de obras montadas.
create table public.obras (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  compositor  text not null,
  fechas      text,
  tipo        text not null,
  epoca       text not null,
  formacion   text not null,
  idioma      text not null,
  created_at  timestamptz not null default now()
);

-- Galería.
create table public.albumes (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  titulo       text not null,
  fecha        date not null,
  lugar        text not null,
  categoria    text not null check (categoria in ('Celebraciones', 'Conciertos', 'Ensayos', 'Convivencias')),
  descripcion  text not null default '',
  evento_id    uuid,
  created_at   timestamptz not null default now()
);

create table public.fotos (
  id          uuid primary key default gen_random_uuid(),
  album_id    uuid not null references public.albumes (id) on delete cascade,
  orden       int not null default 0,
  ruta        text not null,               -- WebP ~2000 px en el bucket 'publico'
  miniatura   text,                        -- WebP ~400 px
  pie         text not null default '',
  proporcion  text not null default 'horizontal' check (proporcion in ('vertical', 'horizontal', 'cuadrada')),
  created_at  timestamptz not null default now()
);

-- Lectura pública; escritura con el rol del área.
alter table public.contenido enable row level security;
alter table public.hero_diapositivas enable row level security;
alter table public.responsables enable row level security;
alter table public.componentes enable row level security;
alter table public.obras enable row level security;
alter table public.albumes enable row level security;
alter table public.fotos enable row level security;

create policy "contenido: lectura pública" on public.contenido for select using (true);
create policy "contenido: escribe quien tiene el rol del área" on public.contenido
  for all using (public.tiene_rol(area)) with check (public.tiene_rol(area));

create policy "hero: lectura pública" on public.hero_diapositivas for select using (true);
create policy "hero: escribe portada" on public.hero_diapositivas
  for all using (public.tiene_rol('portada')) with check (public.tiene_rol('portada'));

create policy "responsables: lectura pública" on public.responsables for select using (true);
create policy "responsables: escribe sobre nosotros" on public.responsables
  for all using (public.tiene_rol('sobre-nosotros')) with check (public.tiene_rol('sobre-nosotros'));

create policy "componentes: lectura pública" on public.componentes for select using (true);
create policy "componentes: escribe sobre nosotros" on public.componentes
  for all using (public.tiene_rol('sobre-nosotros')) with check (public.tiene_rol('sobre-nosotros'));

create policy "obras: lectura pública" on public.obras for select using (true);
create policy "obras: escribe música" on public.obras
  for all using (public.tiene_rol('musica')) with check (public.tiene_rol('musica'));

create policy "albumes: lectura pública" on public.albumes for select using (true);
create policy "albumes: escribe galería" on public.albumes
  for all using (public.tiene_rol('galeria')) with check (public.tiene_rol('galeria'));

create policy "fotos: lectura pública" on public.fotos for select using (true);
create policy "fotos: escribe galería" on public.fotos
  for all using (public.tiene_rol('galeria')) with check (public.tiene_rol('galeria'));

-- ---------------------------------------------------------------------
-- 4. CALENDARIO
-- ---------------------------------------------------------------------

create table public.eventos (
  id                 uuid primary key default gen_random_uuid(),
  tipo               text not null check (tipo in ('celebracion', 'formacion', 'convivencia', 'ensayo')),
  titulo             text not null,
  fecha              date not null,
  hora_inicio        time not null,
  hora_fin           time,
  hora_convocatoria  time,             -- interno
  lugar              text not null,
  repertorio_id      uuid,             -- interno
  secciones          text[] not null default '{}',   -- interno; vacío = tutti
  vestimenta         text,             -- interno
  notas              text,             -- interno
  estado             text not null default 'confirmado' check (estado in ('confirmado', 'aplazado', 'cancelado')),
  created_at         timestamptz not null default now(),
  check (hora_fin is null or hora_fin > hora_inicio),
  check (hora_convocatoria is null or hora_convocatoria <= hora_inicio)
);
create index eventos_fecha on public.eventos (fecha);

alter table public.eventos enable row level security;
-- La tabla completa (con datos internos) solo la leen los miembros.
create policy "eventos: leen los miembros" on public.eventos for select using (public.es_miembro());
create policy "eventos: escribe agenda" on public.eventos
  for all using (public.tiene_rol('agenda')) with check (public.tiene_rol('agenda'));

-- Vista pública: sin hora de convocatoria, secciones, vestimenta ni notas, y
-- sin ensayos. Se ejecuta con los permisos de su dueño, así el público puede
-- leerla aunque no pueda leer la tabla.
create view public.eventos_publicos as
  select id, tipo, titulo, fecha, hora_inicio, hora_fin, lugar, estado
  from public.eventos
  where tipo in ('celebracion', 'formacion', 'convivencia');
grant select on public.eventos_publicos to anon, authenticated;

-- ---------------------------------------------------------------------
-- 5. ARCHIVO DE MIEMBROS (partituras, audios y repertorios litúrgicos)
-- ---------------------------------------------------------------------

create table public.repertorios (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null unique check (lower(nombre) <> 'todos'),   -- «Todos» es virtual
  orden       int not null default 0,
  created_at  timestamptz not null default now()
);

create table public.partituras (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  compositor  text not null,
  rol         text not null,                 -- cuerda o instrumento al que va dirigida
  archivo     text not null,                 -- ruta en el bucket privado 'archivo'
  created_at  timestamptz not null default now()
);

create table public.audios (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  compositor  text not null,
  rol         text not null,
  archivo     text not null,
  created_at  timestamptz not null default now()
);

create table public.partitura_repertorio (
  partitura_id   uuid references public.partituras (id) on delete cascade,
  repertorio_id  uuid references public.repertorios (id) on delete cascade,
  primary key (partitura_id, repertorio_id)
);

create table public.audio_repertorio (
  audio_id       uuid references public.audios (id) on delete cascade,
  repertorio_id  uuid references public.repertorios (id) on delete cascade,
  primary key (audio_id, repertorio_id)
);

alter table public.repertorios enable row level security;
alter table public.partituras enable row level security;
alter table public.audios enable row level security;
alter table public.partitura_repertorio enable row level security;
alter table public.audio_repertorio enable row level security;

create policy "repertorios: leen los miembros" on public.repertorios for select using (public.es_miembro());
create policy "repertorios: escribe música" on public.repertorios
  for all using (public.tiene_rol('musica')) with check (public.tiene_rol('musica'));

-- Cada miembro ve lo de su cuerda; Música y el Director, todo.
create policy "partituras: las de mi cuerda" on public.partituras
  for select using (rol = public.mi_rol() or public.tiene_rol('musica'));
create policy "partituras: escribe música" on public.partituras
  for all using (public.tiene_rol('musica')) with check (public.tiene_rol('musica'));

create policy "audios: los de mi cuerda" on public.audios
  for select using (rol = public.mi_rol() or public.tiene_rol('musica'));
create policy "audios: escribe música" on public.audios
  for all using (public.tiene_rol('musica')) with check (public.tiene_rol('musica'));

create policy "partitura_repertorio: leen los miembros" on public.partitura_repertorio for select using (public.es_miembro());
create policy "partitura_repertorio: escribe música" on public.partitura_repertorio
  for all using (public.tiene_rol('musica')) with check (public.tiene_rol('musica'));
create policy "audio_repertorio: leen los miembros" on public.audio_repertorio for select using (public.es_miembro());
create policy "audio_repertorio: escribe música" on public.audio_repertorio
  for all using (public.tiene_rol('musica')) with check (public.tiene_rol('musica'));

-- ---------------------------------------------------------------------
-- 6. DISPARADORES: última modificación e historial
-- ---------------------------------------------------------------------

create trigger contenido_actualizado before update on public.contenido
  for each row execute function public.tocar_actualizado();
create trigger hero_actualizado before update on public.hero_diapositivas
  for each row execute function public.tocar_actualizado();
create trigger responsables_actualizado before update on public.responsables
  for each row execute function public.tocar_actualizado();

create trigger contenido_historial after insert or update or delete on public.contenido
  for each row execute function public.registrar_historial();
create trigger hero_historial after insert or update or delete on public.hero_diapositivas
  for each row execute function public.registrar_historial();
create trigger responsables_historial after insert or update or delete on public.responsables
  for each row execute function public.registrar_historial();
create trigger componentes_historial after insert or update or delete on public.componentes
  for each row execute function public.registrar_historial();
create trigger obras_historial after insert or update or delete on public.obras
  for each row execute function public.registrar_historial();
create trigger eventos_historial after insert or update or delete on public.eventos
  for each row execute function public.registrar_historial();
create trigger albumes_historial after insert or update or delete on public.albumes
  for each row execute function public.registrar_historial();

-- ---------------------------------------------------------------------
-- 7. ALMACENAMIENTO DE ARCHIVOS (Supabase Storage)
-- ---------------------------------------------------------------------
-- 'publico': fotos de la web (hero, galería, responsables). Lectura libre.
-- 'archivo': partituras y audios. Privado: solo miembros con sesión.

insert into storage.buckets (id, name, public) values ('publico', 'publico', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('archivo', 'archivo', false)
  on conflict (id) do nothing;

create policy "publico: suben quienes gestionan" on storage.objects
  for insert with check (bucket_id = 'publico' and public.tiene_algun_rol());
create policy "publico: cambian quienes gestionan" on storage.objects
  for update using (bucket_id = 'publico' and public.tiene_algun_rol());
create policy "publico: borran quienes gestionan" on storage.objects
  for delete using (bucket_id = 'publico' and public.tiene_algun_rol());

create policy "archivo: leen los miembros" on storage.objects
  for select using (bucket_id = 'archivo' and public.es_miembro());
create policy "archivo: sube música" on storage.objects
  for insert with check (bucket_id = 'archivo' and public.tiene_rol('musica'));
create policy "archivo: cambia música" on storage.objects
  for update using (bucket_id = 'archivo' and public.tiene_rol('musica'));
create policy "archivo: borra música" on storage.objects
  for delete using (bucket_id = 'archivo' and public.tiene_rol('musica'));

-- ---------------------------------------------------------------------
-- 8. PRIMER DIRECTOR (hacer una sola vez, a mano)
-- ---------------------------------------------------------------------
-- 1) Supabase → Authentication → Users → "Add user": email y contraseña del Director.
-- 2) Copiar su "User UID" y ejecutar (cambiando los valores):
--
--   insert into public.usuarios (id, nombre, email, rol)
--   values ('UID-DEL-DIRECTOR', 'Fernando J. Camacho Rizquez', 'su@email.es', 'Director');
--
-- A partir de ahí, el resto de cuentas se crean desde el panel de la web.
