// Datos de prueba del archivo musical, compartidos por el dashboard y las
// páginas de administración. Con Supabase desaparecen: vendrán de las tablas
// `usuarios`, `componentes`, `obras`, `repertorios`, `partituras`, `audios`, `eventos` y sus tablas de unión.

import type { Repertorio, Partitura, Audio } from './archivo';
import type { Evento } from './calendario';
import type { Usuario } from './roles';
import type { Componente } from './formacion';
import type { Obra } from './catalogo';
import type { Album } from './galeria';

// Repertorios en el orden en que aparecen como filtros ("Todos" es virtual y no está aquí).
export const repertoriosPrueba: Repertorio[] = [
  { id: 'r1', nombre: 'Adviento' },
  { id: 'r2', nombre: 'Navidad' },
  { id: 'r3', nombre: 'Cuaresma' },
  { id: 'r4', nombre: 'Triduo Pascual' },
  { id: 'r5', nombre: 'Pascua' },
  { id: 'r6', nombre: 'Mariana' },
  { id: 'r7', nombre: 'Tiempo Ordinario' },
];

// Partituras de prueba. Cada una puede pertenecer a VARIOS repertorios
// (esto se notará al filtrar: una misma obra puede aparecer al pulsar
// "Adviento" o "Mariana" si está en ambos).
export const partiturasPrueba: Partitura[] = [
  {
    id: '1',
    titulo: 'Ave María',
    compositor: 'Tomás Luis de Victoria',
    repertorios: ['Mariana', 'Tiempo Ordinario'],
    enlaceDescarga: 'https://drive.google.com/file/d/EJEMPLO',
  },
  {
    id: '2',
    titulo: 'O Magnum Mysterium',
    compositor: 'Tomás Luis de Victoria',
    repertorios: ['Navidad'],
    enlaceDescarga: 'https://drive.google.com/file/d/EJEMPLO',
  },
  {
    id: '3',
    titulo: 'Adoramus Te, Christe',
    compositor: 'Giovanni Pierluigi da Palestrina',
    repertorios: ['Cuaresma', 'Triduo Pascual'],
    enlaceDescarga: 'https://drive.google.com/file/d/EJEMPLO',
  },
  {
    id: '4',
    titulo: 'Christus Factus Est',
    compositor: 'Anton Bruckner',
    repertorios: ['Triduo Pascual'],
    enlaceDescarga: 'https://drive.google.com/file/d/EJEMPLO',
  },
  {
    id: '5',
    titulo: 'Cantate Domino',
    compositor: 'Giuseppe Pitoni',
    repertorios: ['Tiempo Ordinario'],
    enlaceDescarga: 'https://drive.google.com/file/d/EJEMPLO',
  },
  {
    id: '6',
    titulo: 'Regina Caeli',
    compositor: 'Wolfgang Amadeus Mozart',
    repertorios: ['Pascua', 'Mariana'],
    enlaceDescarga: 'https://drive.google.com/file/d/EJEMPLO',
  },
  {
    id: '7',
    titulo: 'Veni Emmanuel',
    compositor: 'Anónimo · arr. Z. Randall Stroope',
    repertorios: ['Adviento'],
    enlaceDescarga: 'https://drive.google.com/file/d/EJEMPLO',
  },
  {
    id: '8',
    titulo: 'Stabat Mater',
    compositor: 'Giovanni Battista Pergolesi',
    repertorios: ['Cuaresma', 'Mariana'],
    enlaceDescarga: 'https://drive.google.com/file/d/EJEMPLO',
  },
];

export const audiosPrueba: Audio[] = [
  {
    id: '1',
    titulo: 'Ave María',
    compositor: 'Tomás Luis de Victoria',
    repertorios: ['Mariana', 'Tiempo Ordinario'],
    enlaceAudio: '/audio-prueba.mp3',
  },
  {
    id: '2',
    titulo: 'O Magnum Mysterium',
    compositor: 'Tomás Luis de Victoria',
    repertorios: ['Navidad'],
    enlaceAudio: '/audio-prueba.mp3',
  },
  {
    id: '3',
    titulo: 'Adoramus Te, Christe',
    compositor: 'Giovanni Pierluigi da Palestrina',
    repertorios: ['Cuaresma', 'Triduo Pascual'],
    enlaceAudio: '/audio-prueba.mp3',
  },
  {
    id: '4',
    titulo: 'Regina Caeli',
    compositor: 'Wolfgang Amadeus Mozart',
    repertorios: ['Pascua', 'Mariana'],
    enlaceAudio: '/audio-prueba.mp3',
  },
];

// Eventos de prueba alrededor de octubre 2026 – febrero 2027 (cruzan de año a
// propósito). Fechas reales del calendario litúrgico de ese curso.
const SEMINARIO = 'Casa de la Iglesia · Seminario Diocesano';
const CATEDRAL = 'S.I. Catedral de Jaén';

export const eventosPrueba: Evento[] = [
  { id: 'e1', tipo: 'ensayo', titulo: 'Ensayo semanal', fecha: '2026-10-15', horaInicio: '20:00', horaFin: '21:30', lugar: SEMINARIO, secciones: [], estado: 'confirmado' },
  { id: 'e2', tipo: 'celebracion', titulo: 'Misa de inicio de curso', fecha: '2026-10-18', horaInicio: '12:00', horaConvocatoria: '11:15', lugar: CATEDRAL, secciones: [], vestimenta: 'Túnica', estado: 'confirmado' },
  { id: 'e3', tipo: 'ensayo', titulo: 'Ensayo de voces', fecha: '2026-10-22', horaInicio: '20:00', horaFin: '21:30', lugar: SEMINARIO, secciones: ['Voces'], estado: 'confirmado' },
  { id: 'e4', tipo: 'ensayo', titulo: 'Ensayo semanal', fecha: '2026-10-29', horaInicio: '20:00', horaFin: '21:30', lugar: SEMINARIO, secciones: [], estado: 'confirmado' },
  { id: 'e5', tipo: 'ensayo', titulo: 'Ensayo de orquesta', fecha: '2026-11-05', horaInicio: '19:00', horaFin: '20:30', lugar: SEMINARIO, secciones: ['Cuerda', 'Viento'], notas: 'Traed atril propio.', estado: 'confirmado' },
  { id: 'e6', tipo: 'ensayo', titulo: 'Ensayo semanal', fecha: '2026-11-12', horaInicio: '20:00', horaFin: '21:30', lugar: SEMINARIO, secciones: [], estado: 'confirmado' },
  { id: 'e7', tipo: 'ensayo', titulo: 'Ensayo general', fecha: '2026-11-19', horaInicio: '20:00', horaFin: '22:00', lugar: CATEDRAL, secciones: [], notas: 'Ensayo en la propia Catedral para probar la acústica.', estado: 'confirmado' },
  { id: 'e8', tipo: 'celebracion', titulo: 'Solemnidad de Cristo Rey', fecha: '2026-11-22', horaInicio: '12:00', horaConvocatoria: '11:15', lugar: CATEDRAL, repertorioId: 'r7', secciones: [], vestimenta: 'Túnica', estado: 'confirmado' },
  { id: 'e9', tipo: 'ensayo', titulo: 'Ensayo de voces · Adviento', fecha: '2026-11-26', horaInicio: '20:00', horaFin: '21:30', lugar: SEMINARIO, repertorioId: 'r1', secciones: ['Voces'], estado: 'confirmado' },
  { id: 'e10', tipo: 'ensayo', titulo: 'Ensayo semanal', fecha: '2026-12-03', horaInicio: '20:00', horaFin: '21:30', lugar: SEMINARIO, secciones: [], estado: 'confirmado' },
  { id: 'e11', tipo: 'celebracion', titulo: 'Solemnidad de la Inmaculada', fecha: '2026-12-08', horaInicio: '12:00', horaConvocatoria: '11:15', lugar: 'Basílica de San Ildefonso', repertorioId: 'r6', secciones: [], vestimenta: 'Túnica', estado: 'confirmado' },
  { id: 'e12', tipo: 'ensayo', titulo: 'Ensayo semanal', fecha: '2026-12-10', horaInicio: '20:00', horaFin: '21:30', lugar: SEMINARIO, secciones: [], notas: 'Se suspende por el puente de la Inmaculada.', estado: 'cancelado' },
  { id: 'e13', tipo: 'ensayo', titulo: 'Ensayo general · Navidad', fecha: '2026-12-17', horaInicio: '19:30', horaFin: '22:00', lugar: CATEDRAL, repertorioId: 'r2', secciones: [], estado: 'confirmado' },
  { id: 'e14', tipo: 'celebracion', titulo: 'Concierto de Navidad', fecha: '2026-12-19', horaInicio: '20:00', horaFin: '21:30', horaConvocatoria: '19:00', lugar: CATEDRAL, repertorioId: 'r2', secciones: [], vestimenta: 'Negro', notas: 'Entrada libre hasta completar aforo.', estado: 'confirmado' },
  { id: 'e15', tipo: 'celebracion', titulo: 'Misa del Gallo', fecha: '2026-12-24', horaInicio: '23:30', horaConvocatoria: '22:45', lugar: CATEDRAL, repertorioId: 'r2', secciones: ['Voces', 'Otros', 'Dirección'], vestimenta: 'Túnica', estado: 'confirmado' },
  { id: 'e16', tipo: 'celebracion', titulo: 'Solemnidad de la Epifanía', fecha: '2027-01-06', horaInicio: '12:00', horaConvocatoria: '11:15', lugar: CATEDRAL, repertorioId: 'r2', secciones: [], vestimenta: 'Túnica', estado: 'confirmado' },
  { id: 'e17', tipo: 'ensayo', titulo: 'Ensayo semanal', fecha: '2027-01-14', horaInicio: '20:00', horaFin: '21:30', lugar: SEMINARIO, secciones: [], notas: 'Pendiente de nueva fecha.', estado: 'aplazado' },
  { id: 'e18', tipo: 'ensayo', titulo: 'Ensayo semanal', fecha: '2027-01-21', horaInicio: '20:00', horaFin: '21:30', lugar: SEMINARIO, secciones: [], estado: 'confirmado' },
  { id: 'e19', tipo: 'celebracion', titulo: 'Miércoles de Ceniza', fecha: '2027-02-10', horaInicio: '20:00', horaConvocatoria: '19:15', lugar: CATEDRAL, repertorioId: 'r3', secciones: [], vestimenta: 'Túnica', estado: 'confirmado' },
];

// Miembros de prueba: una formación completa para que la gestión de usuarios
// y el plano de Componentes se vean como con el coro real. Algunos tienen roles
// de gestión (el Director no los necesita: los tiene todos siempre).
export const usuariosPrueba: Usuario[] = [
  { id: '1', nombre: 'Fernando J. Camacho Rizquez', email: 'fernando@corodiocesano.es', rol: 'Director', gestion: [] },
  { id: '2', nombre: 'María García López', email: 'maria.garcia@email.com', rol: 'Soprano', gestion: ['galeria', 'portada'] },
  { id: '3', nombre: 'Lucía Martínez Ruiz', email: 'lucia.martinez@email.com', rol: 'Soprano', gestion: [] },
  { id: '4', nombre: 'Carmen Ortega Vílchez', email: 'carmen.ortega@email.com', rol: 'Contralto', gestion: ['secretaria', 'sobre-nosotros'] },
  { id: '5', nombre: 'Javier Moreno Cruz', email: 'javier.moreno@email.com', rol: 'Tenor', gestion: ['musica'] },
  { id: '6', nombre: 'Antonio Jiménez Peña', email: 'antonio.jimenez@email.com', rol: 'Bajo', gestion: [] },
  { id: '7', nombre: 'Elena Torres Amate', email: 'elena.torres@email.com', rol: 'Violín 1', gestion: ['agenda'] },
  { id: '8', nombre: 'Pablo Navarro Gil', email: 'pablo.navarro@email.com', rol: 'Violonchelo', gestion: [] },
  { id: '9', nombre: 'Rocío Castillo Mena', email: 'rocio.castillo@email.com', rol: 'Flauta', gestion: [] },
  { id: '10', nombre: 'Manuel Expósito Lara', email: 'manuel.exposito@email.com', rol: 'Trompeta', gestion: [] },
  { id: '11', nombre: 'Isabel Romero Quesada', email: 'isabel.romero@email.com', rol: 'Órgano', gestion: [] },
  { id: '12', nombre: 'Ana Belén Cruz Medina', email: 'ana.belen@email.com', rol: 'Soprano', gestion: [] },
  { id: '13', nombre: 'Paula Ruiz Herrera', email: 'paula.ruiz@email.com', rol: 'Soprano', gestion: [] },
  { id: '14', nombre: 'Inmaculada Gámez Ortiz', email: 'inmaculada.gamez@email.com', rol: 'Soprano', gestion: [] },
  { id: '15', nombre: 'Marta Cobo Sánchez', email: 'marta.cobo@email.com', rol: 'Soprano', gestion: [] },
  { id: '16', nombre: 'Teresa Ibáñez Luque', email: 'teresa.ibanez@email.com', rol: 'Soprano', gestion: [] },
  { id: '17', nombre: 'Sara Delgado Prieto', email: 'sara.delgado@email.com', rol: 'Soprano', gestion: [] },
  { id: '18', nombre: 'Rosario Molina Expósito', email: 'rosario.molina@email.com', rol: 'Contralto', gestion: [] },
  { id: '19', nombre: 'Pilar Aguilar Vera', email: 'pilar.aguilar@email.com', rol: 'Contralto', gestion: [] },
  { id: '20', nombre: 'Beatriz Lara Montes', email: 'beatriz.lara@email.com', rol: 'Contralto', gestion: [] },
  { id: '21', nombre: 'Julia Serrano Castro', email: 'julia.serrano@email.com', rol: 'Contralto', gestion: [] },
  { id: '22', nombre: 'Nuria Peña Rojas', email: 'nuria.pena@email.com', rol: 'Contralto', gestion: [] },
  { id: '23', nombre: 'Francisco Quesada Martos', email: 'francisco.quesada@email.com', rol: 'Tenor', gestion: [] },
  { id: '24', nombre: 'Alejandro Vílchez Rus', email: 'alejandro.vilchez@email.com', rol: 'Tenor', gestion: [] },
  { id: '25', nombre: 'David Cano Barranco', email: 'david.cano@email.com', rol: 'Tenor', gestion: [] },
  { id: '26', nombre: 'Miguel Ángel Ruiz Colmenero', email: 'miguel.angel@email.com', rol: 'Tenor', gestion: [] },
  { id: '27', nombre: 'José Luis Ortega Garrido', email: 'jose.luis@email.com', rol: 'Bajo', gestion: [] },
  { id: '28', nombre: 'Rafael Moral Cañada', email: 'rafael.moral@email.com', rol: 'Bajo', gestion: [] },
  { id: '29', nombre: 'Juan Carlos Liébana Soto', email: 'juan.carlos@email.com', rol: 'Bajo', gestion: [] },
  { id: '30', nombre: 'Ignacio Fuentes Parras', email: 'ignacio.fuentes@email.com', rol: 'Bajo', gestion: [] },
  { id: '31', nombre: 'Clara Montoro Jiménez', email: 'clara.montoro@email.com', rol: 'Violín 1', gestion: [] },
  { id: '32', nombre: 'Andrés Mena Carrasco', email: 'andres.mena@email.com', rol: 'Violín 1', gestion: [] },
  { id: '33', nombre: 'Laura Chica Pérez', email: 'laura.chica@email.com', rol: 'Violín 1', gestion: [] },
  { id: '34', nombre: 'Irene Galiano Ruiz', email: 'irene.galiano@email.com', rol: 'Violín 2', gestion: [] },
  { id: '35', nombre: 'Sergio Torres Valenzuela', email: 'sergio.torres@email.com', rol: 'Violín 2', gestion: [] },
  { id: '36', nombre: 'Noelia Higueras Cobo', email: 'noelia.higueras@email.com', rol: 'Violín 2', gestion: [] },
  { id: '37', nombre: 'Álvaro Pulido Navas', email: 'alvaro.pulido@email.com', rol: 'Viola', gestion: [] },
  { id: '38', nombre: 'Cristina Arjona López', email: 'cristina.arjona@email.com', rol: 'Viola', gestion: [] },
  { id: '39', nombre: 'Elena Bueno Contreras', email: 'elena.bueno@email.com', rol: 'Violonchelo', gestion: [] },
  { id: '40', nombre: 'Tomás Calahorro Gil', email: 'tomas.calahorro@email.com', rol: 'Contrabajo', gestion: [] },
  { id: '41', nombre: 'Lourdes Cárdenas Moya', email: 'lourdes.cardenas@email.com', rol: 'Flauta', gestion: [] },
  { id: '42', nombre: 'Gonzalo Espinosa Hidalgo', email: 'gonzalo.espinosa@email.com', rol: 'Oboe', gestion: [] },
  { id: '43', nombre: 'Patricia Anguita Real', email: 'patricia.anguita@email.com', rol: 'Clarinete', gestion: [] },
  { id: '44', nombre: 'Daniel Olmo Jurado', email: 'daniel.olmo@email.com', rol: 'Clarinete', gestion: [] },
  { id: '45', nombre: 'Víctor Sola Medina', email: 'victor.sola@email.com', rol: 'Fagot', gestion: [] },
  { id: '46', nombre: 'Jesús Martos Lechuga', email: 'jesus.martos@email.com', rol: 'Trompa', gestion: [] },
  { id: '47', nombre: 'Emilio Sánchez Cuesta', email: 'emilio.sanchez@email.com', rol: 'Trompa', gestion: [] },
  { id: '48', nombre: 'Roberto Vílchez Mora', email: 'roberto.vilchez@email.com', rol: 'Trompeta', gestion: [] },
  { id: '49', nombre: 'Luis Fernández Moreno', email: 'luis.fernandez@email.com', rol: 'Trombón', gestion: [] },
  { id: '50', nombre: 'Óscar Linares Peinado', email: 'oscar.linares@email.com', rol: 'Percusión', gestion: [] },
];

// Componentes de la página pública. De partida, los mismos miembros (sin
// email); el director añade o quita nombres desde Administración → Componentes.
export const componentesPrueba: Componente[] = usuariosPrueba.map(({ id, nombre, rol }) => ({ id: `c${id}`, nombre, rol }));

// Catálogo público de obras montadas (solo datos de catálogo).
export const obrasPrueba: Obra[] = [
  { id: 'o1', titulo: 'Misa de Angelis', compositor: 'Anónimo', fechas: 's. XV–XVI', tipo: 'Misa completa', epoca: 'Gregoriano', formacion: 'A capella', idioma: 'Latín' },
  { id: 'o2', titulo: 'Missa O magnum mysterium', compositor: 'Tomás Luis de Victoria', fechas: '1548–1611', tipo: 'Misa completa', epoca: 'Renacimiento', formacion: 'A capella', idioma: 'Latín' },
  { id: 'o3', titulo: 'Kyrie (Misa en sol)', compositor: 'Franz Schubert', fechas: '1797–1828', tipo: 'Kyrie', epoca: 'Romanticismo', formacion: 'Coro y orquesta', idioma: 'Griego' },
  { id: 'o4', titulo: 'Gloria (RV 589)', compositor: 'Antonio Vivaldi', fechas: '1678–1741', tipo: 'Gloria', epoca: 'Barroco', formacion: 'Coro y orquesta', idioma: 'Latín' },
  { id: 'o5', titulo: 'Credo III', compositor: 'Anónimo', fechas: 's. XVII', tipo: 'Credo', epoca: 'Gregoriano', formacion: 'A capella', idioma: 'Latín' },
  { id: 'o6', titulo: 'Sanctus (Misa de la Coronación)', compositor: 'Wolfgang Amadeus Mozart', fechas: '1756–1791', tipo: 'Sanctus', epoca: 'Clasicismo', formacion: 'Coro y orquesta', idioma: 'Latín' },
  { id: 'o7', titulo: 'Agnus Dei', compositor: 'Samuel Barber', fechas: '1910–1981', tipo: 'Agnus Dei', epoca: 'Siglo XX', formacion: 'A capella', idioma: 'Latín' },
  { id: 'o8', titulo: 'Aleluya de Pascua', compositor: 'Anónimo', fechas: 's. X', tipo: 'Aleluya', epoca: 'Gregoriano', formacion: 'A capella', idioma: 'Latín' },
  { id: 'o9', titulo: 'Aleluya (El Mesías)', compositor: 'Georg Friedrich Händel', fechas: '1685–1759', tipo: 'Aleluya', epoca: 'Barroco', formacion: 'Coro y orquesta', idioma: 'Otros' },
  { id: 'o10', titulo: 'El Señor es mi pastor (Salmo 22)', compositor: 'Joseph Gelineau', fechas: '1920–2008', tipo: 'Salmo', epoca: 'Siglo XX', formacion: 'Coro y órgano', idioma: 'Castellano' },
  { id: 'o11', titulo: 'Ave verum corpus', compositor: 'Wolfgang Amadeus Mozart', fechas: '1756–1791', tipo: 'Comunión', epoca: 'Clasicismo', formacion: 'Coro y órgano', idioma: 'Latín' },
  { id: 'o12', titulo: 'O sacrum convivium', compositor: 'Thomas Tallis', fechas: '1505–1585', tipo: 'Comunión', epoca: 'Renacimiento', formacion: 'A capella', idioma: 'Latín' },
  { id: 'o13', titulo: 'Ave Maria', compositor: 'Tomás Luis de Victoria', fechas: '1548–1611', tipo: 'Motete', epoca: 'Renacimiento', formacion: 'A capella', idioma: 'Latín' },
  { id: 'o14', titulo: 'O magnum mysterium', compositor: 'Tomás Luis de Victoria', fechas: '1548–1611', tipo: 'Motete', epoca: 'Renacimiento', formacion: 'A capella', idioma: 'Latín' },
  { id: 'o15', titulo: 'Sicut cervus', compositor: 'Giovanni Pierluigi da Palestrina', fechas: '1525–1594', tipo: 'Motete', epoca: 'Renacimiento', formacion: 'A capella', idioma: 'Latín' },
  { id: 'o16', titulo: 'Adoramus te, Christe', compositor: 'Giovanni Pierluigi da Palestrina', fechas: '1525–1594', tipo: 'Motete', epoca: 'Renacimiento', formacion: 'A capella', idioma: 'Latín' },
  { id: 'o17', titulo: 'Christus factus est', compositor: 'Anton Bruckner', fechas: '1824–1896', tipo: 'Motete', epoca: 'Romanticismo', formacion: 'A capella', idioma: 'Latín' },
  { id: 'o18', titulo: 'Ubi caritas', compositor: 'Ola Gjeilo', fechas: '1978', tipo: 'Motete', epoca: 'Siglo XXI', formacion: 'A capella', idioma: 'Latín' },
  { id: 'o19', titulo: 'Regina caeli', compositor: 'Wolfgang Amadeus Mozart', fechas: '1756–1791', tipo: 'Antífona mariana', epoca: 'Clasicismo', formacion: 'Coro y orquesta', idioma: 'Latín' },
  { id: 'o20', titulo: 'Salve Regina', compositor: 'Anónimo', fechas: 's. XI', tipo: 'Antífona mariana', epoca: 'Gregoriano', formacion: 'A capella', idioma: 'Latín' },
  { id: 'o21', titulo: 'Magnificat', compositor: 'Johann Pachelbel', fechas: '1653–1706', tipo: 'Magníficat', epoca: 'Barroco', formacion: 'Coro y órgano', idioma: 'Latín' },
  { id: 'o22', titulo: 'Stabat Mater', compositor: 'Giovanni Battista Pergolesi', fechas: '1710–1736', tipo: 'Himno', epoca: 'Barroco', formacion: 'Coro y orquesta', idioma: 'Latín' },
  { id: 'o23', titulo: 'Veni Creator Spiritus', compositor: 'Anónimo', fechas: 's. IX', tipo: 'Himno', epoca: 'Gregoriano', formacion: 'A capella', idioma: 'Latín' },
  { id: 'o24', titulo: 'Pueblo de reyes', compositor: 'Lucien Deiss', fechas: '1921–2007', tipo: 'Canto de entrada', epoca: 'Siglo XX', formacion: 'Coro y órgano', idioma: 'Castellano' },
  { id: 'o25', titulo: 'Pescador de hombres', compositor: 'Cesáreo Gabaráin', fechas: '1936–1991', tipo: 'Canto de comunión', epoca: 'Siglo XX', formacion: 'Coro y órgano', idioma: 'Castellano' },
  { id: 'o26', titulo: 'Veni, veni Emmanuel', compositor: 'Anónimo · arr. Z. Randall Stroope', fechas: 's. XV', tipo: 'Villancico', epoca: 'Siglo XXI', formacion: 'A capella', idioma: 'Latín' },
  { id: 'o27', titulo: 'Riu, riu, chiu', compositor: 'Anónimo (Cancionero de Upsala)', fechas: 's. XVI', tipo: 'Villancico', epoca: 'Renacimiento', formacion: 'A capella', idioma: 'Castellano' },
];

// Galería de prueba (curso 2026-2027). Las "fotos" son recortes de las
// imágenes del hero y de la Catedral hasta tener las fotos reales del coro.
export const albumesPrueba: Album[] = [
  {
    slug: 'misa-inicio-curso',
    titulo: 'Misa de inicio de curso',
    fecha: '2026-10-18',
    lugar: 'S.I. Catedral de Jaén',
    categoria: 'Celebraciones',
    eventoId: 'e2',
    descripcion: 'Nuestra primera gran celebración del curso: la Catedral llena y el coro estrenando repertorio.',
    fotos: [
      { id: 'misa-inicio-curso-1', src: '/sliderUnete.jpg', pie: 'El coro y la orquesta, al completo', proporcion: 'horizontal', encuadre: '50% 50%' },
      { id: 'misa-inicio-curso-2', src: '/sliderUnete.jpg', pie: 'La batuta marca la entrada', proporcion: 'vertical', encuadre: '50% 72%', zoom: 2.6 },
      { id: 'misa-inicio-curso-3', src: '/sliderUnete.jpg', pie: 'Tenores y bajos en la sillería', proporcion: 'horizontal', encuadre: '12% 45%', zoom: 2.2 },
      { id: 'misa-inicio-curso-4', src: '/sliderUnete.jpg', pie: 'Al fondo, la cruz del coro', proporcion: 'vertical', encuadre: '50% 18%', zoom: 2.6 },
      { id: 'misa-inicio-curso-5', src: '/sliderUnete.jpg', pie: 'Los violines, atentos al director', proporcion: 'cuadrada', encuadre: '28% 80%', zoom: 2.4 },
      { id: 'misa-inicio-curso-6', src: '/repertorioCatSlider.jpg', pie: 'La cúpula de la Catedral', proporcion: 'cuadrada', encuadre: '55% 25%', zoom: 1.6 },
      { id: 'misa-inicio-curso-7', src: '/sliderUnete.jpg', pie: 'Violonchelos en pleno pasaje', proporcion: 'vertical', encuadre: '72% 80%', zoom: 2.4 },
      { id: 'misa-inicio-curso-8', src: '/sliderUnete.jpg', pie: 'Las voces del lado de la epístola', proporcion: 'horizontal', encuadre: '88% 45%', zoom: 2.2 },
    ],
  },
  {
    slug: 'ensayos-octubre',
    titulo: 'Ensayos de octubre',
    fecha: '2026-10-15',
    lugar: 'Casa de la Iglesia · Seminario Diocesano',
    categoria: 'Ensayos',
    descripcion: 'Semanas de trabajo preparando la Misa de inicio de curso y las solemnidades de otoño.',
    fotos: [
      { id: 'ensayos-octubre-1', src: '/sliderUnete.jpg', pie: 'Los violines, atentos al director', proporcion: 'cuadrada', encuadre: '28% 80%', zoom: 2.4 },
      { id: 'ensayos-octubre-2', src: '/sliderUnete.jpg', pie: 'El arpa, entre la cuerda y el viento', proporcion: 'cuadrada', encuadre: '40% 55%', zoom: 3 },
      { id: 'ensayos-octubre-3', src: '/sliderUnete.jpg', pie: 'La batuta marca la entrada', proporcion: 'vertical', encuadre: '50% 72%', zoom: 2.6 },
      { id: 'ensayos-octubre-4', src: '/sliderUnete.jpg', pie: 'Violonchelos en pleno pasaje', proporcion: 'vertical', encuadre: '72% 80%', zoom: 2.4 },
      { id: 'ensayos-octubre-5', src: '/sliderUnete.jpg', pie: 'Las voces del lado de la epístola', proporcion: 'horizontal', encuadre: '88% 45%', zoom: 2.2 },
      { id: 'ensayos-octubre-6', src: '/repertorioCatSlider.jpg', pie: 'Columnas del crucero', proporcion: 'vertical', encuadre: '30% 60%', zoom: 1.8 },
    ],
  },
  {
    slug: 'convivencia-bienvenida',
    titulo: 'Convivencia de bienvenida',
    fecha: '2026-10-03',
    lugar: 'Casa de la Iglesia · Seminario Diocesano',
    categoria: 'Convivencias',
    descripcion: 'Una jornada para conocernos: oración, comida compartida y mucha música.',
    fotos: [
      { id: 'convivencia-bienvenida-1', src: '/sliderUnete.jpg', pie: 'Tenores y bajos en la sillería', proporcion: 'horizontal', encuadre: '12% 45%', zoom: 2.2 },
      { id: 'convivencia-bienvenida-2', src: '/repertorioCatSlider.jpg', pie: 'La tarde entra por las ventanas', proporcion: 'horizontal', encuadre: '80% 85%', zoom: 2.4 },
      { id: 'convivencia-bienvenida-3', src: '/sliderUnete.jpg', pie: 'Las voces del lado de la epístola', proporcion: 'horizontal', encuadre: '88% 45%', zoom: 2.2 },
      { id: 'convivencia-bienvenida-4', src: '/repertorioCatSlider.jpg', pie: 'Luz de la vidriera', proporcion: 'vertical', encuadre: '16% 92%', zoom: 3 },
      { id: 'convivencia-bienvenida-5', src: '/sliderUnete.jpg', pie: 'El arpa, entre la cuerda y el viento', proporcion: 'cuadrada', encuadre: '40% 55%', zoom: 3 },
    ],
  },
  {
    slug: 'concierto-presentacion',
    titulo: 'Concierto de presentación',
    fecha: '2026-09-26',
    lugar: 'S.I. Catedral de Jaén',
    categoria: 'Conciertos',
    descripcion: 'El Coro y Orquesta de la Diócesis se presenta ante la ciudad con un programa de música sacra.',
    fotos: [
      { id: 'concierto-presentacion-1', src: '/sliderRepertorio.jpg', pie: 'La fachada de la Catedral de Jaén', proporcion: 'horizontal', encuadre: '50% 60%', zoom: 1.15 },
      { id: 'concierto-presentacion-2', src: '/sliderUnete.jpg', pie: 'El coro y la orquesta, al completo', proporcion: 'horizontal', encuadre: '50% 50%' },
      { id: 'concierto-presentacion-3', src: '/sliderRepertorio.jpg', pie: 'Torre del evangelio', proporcion: 'vertical', encuadre: '25% 25%', zoom: 2.4 },
      { id: 'concierto-presentacion-4', src: '/sliderUnete.jpg', pie: 'La batuta marca la entrada', proporcion: 'vertical', encuadre: '50% 72%', zoom: 2.6 },
      { id: 'concierto-presentacion-5', src: '/repertorioCatSlider.jpg', pie: 'Bóvedas de la Catedral', proporcion: 'horizontal', encuadre: '50% 50%' },
      { id: 'concierto-presentacion-6', src: '/sliderRepertorio.jpg', pie: 'Torre de la epístola', proporcion: 'vertical', encuadre: '75% 25%', zoom: 2.4 },
      { id: 'concierto-presentacion-7', src: '/sliderRepertorio.jpg', pie: 'La portada principal', proporcion: 'cuadrada', encuadre: '50% 85%', zoom: 2.2 },
    ],
  },
  {
    slug: 'primeros-ensayos',
    titulo: 'Primeros ensayos',
    fecha: '2026-09-19',
    lugar: 'Casa de la Iglesia · Seminario Diocesano',
    categoria: 'Ensayos',
    descripcion: 'Así empezó todo: las primeras lecturas de partitura y los primeros acordes juntos.',
    fotos: [
      { id: 'primeros-ensayos-1', src: '/sliderUnete.jpg', pie: 'El arpa, entre la cuerda y el viento', proporcion: 'cuadrada', encuadre: '40% 55%', zoom: 3 },
      { id: 'primeros-ensayos-2', src: '/sliderUnete.jpg', pie: 'Tenores y bajos en la sillería', proporcion: 'horizontal', encuadre: '12% 45%', zoom: 2.2 },
      { id: 'primeros-ensayos-3', src: '/repertorioCatSlider.jpg', pie: 'Columnas del crucero', proporcion: 'vertical', encuadre: '30% 60%', zoom: 1.8 },
      { id: 'primeros-ensayos-4', src: '/sliderUnete.jpg', pie: 'Los violines, atentos al director', proporcion: 'cuadrada', encuadre: '28% 80%', zoom: 2.4 },
      { id: 'primeros-ensayos-5', src: '/sliderUnete.jpg', pie: 'Al fondo, la cruz del coro', proporcion: 'vertical', encuadre: '50% 18%', zoom: 2.6 },
    ],
  },
];
