// Datos de prueba del archivo musical, compartidos por el dashboard y las
// páginas de administración. Con Supabase desaparecen: vendrán de las tablas
// `usuarios`, `repertorios`, `partituras`, `audios`, `eventos` y sus tablas de unión.

import type { Repertorio, Partitura, Audio } from './archivo';
import type { Evento } from './calendario';
import type { Usuario } from './roles';
import type { Componente } from './formacion';

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
// y el plano de Componentes se vean como con el coro real.
export const usuariosPrueba: Usuario[] = [
  { id: '1', nombre: 'Fernando J. Camacho Rizquez', email: 'fernando@corodiocesano.es', rol: 'Director' },
  { id: '2', nombre: 'María García López', email: 'maria.garcia@email.com', rol: 'Soprano' },
  { id: '3', nombre: 'Lucía Martínez Ruiz', email: 'lucia.martinez@email.com', rol: 'Soprano' },
  { id: '4', nombre: 'Carmen Ortega Vílchez', email: 'carmen.ortega@email.com', rol: 'Contralto' },
  { id: '5', nombre: 'Javier Moreno Cruz', email: 'javier.moreno@email.com', rol: 'Tenor' },
  { id: '6', nombre: 'Antonio Jiménez Peña', email: 'antonio.jimenez@email.com', rol: 'Bajo' },
  { id: '7', nombre: 'Elena Torres Amate', email: 'elena.torres@email.com', rol: 'Violín 1' },
  { id: '8', nombre: 'Pablo Navarro Gil', email: 'pablo.navarro@email.com', rol: 'Violonchelo' },
  { id: '9', nombre: 'Rocío Castillo Mena', email: 'rocio.castillo@email.com', rol: 'Flauta' },
  { id: '10', nombre: 'Manuel Expósito Lara', email: 'manuel.exposito@email.com', rol: 'Trompeta' },
  { id: '11', nombre: 'Isabel Romero Quesada', email: 'isabel.romero@email.com', rol: 'Órgano' },
  { id: '12', nombre: 'Ana Belén Cruz Medina', email: 'ana.belen@email.com', rol: 'Soprano' },
  { id: '13', nombre: 'Paula Ruiz Herrera', email: 'paula.ruiz@email.com', rol: 'Soprano' },
  { id: '14', nombre: 'Inmaculada Gámez Ortiz', email: 'inmaculada.gamez@email.com', rol: 'Soprano' },
  { id: '15', nombre: 'Marta Cobo Sánchez', email: 'marta.cobo@email.com', rol: 'Soprano' },
  { id: '16', nombre: 'Teresa Ibáñez Luque', email: 'teresa.ibanez@email.com', rol: 'Soprano' },
  { id: '17', nombre: 'Sara Delgado Prieto', email: 'sara.delgado@email.com', rol: 'Soprano' },
  { id: '18', nombre: 'Rosario Molina Expósito', email: 'rosario.molina@email.com', rol: 'Contralto' },
  { id: '19', nombre: 'Pilar Aguilar Vera', email: 'pilar.aguilar@email.com', rol: 'Contralto' },
  { id: '20', nombre: 'Beatriz Lara Montes', email: 'beatriz.lara@email.com', rol: 'Contralto' },
  { id: '21', nombre: 'Julia Serrano Castro', email: 'julia.serrano@email.com', rol: 'Contralto' },
  { id: '22', nombre: 'Nuria Peña Rojas', email: 'nuria.pena@email.com', rol: 'Contralto' },
  { id: '23', nombre: 'Francisco Quesada Martos', email: 'francisco.quesada@email.com', rol: 'Tenor' },
  { id: '24', nombre: 'Alejandro Vílchez Rus', email: 'alejandro.vilchez@email.com', rol: 'Tenor' },
  { id: '25', nombre: 'David Cano Barranco', email: 'david.cano@email.com', rol: 'Tenor' },
  { id: '26', nombre: 'Miguel Ángel Ruiz Colmenero', email: 'miguel.angel@email.com', rol: 'Tenor' },
  { id: '27', nombre: 'José Luis Ortega Garrido', email: 'jose.luis@email.com', rol: 'Bajo' },
  { id: '28', nombre: 'Rafael Moral Cañada', email: 'rafael.moral@email.com', rol: 'Bajo' },
  { id: '29', nombre: 'Juan Carlos Liébana Soto', email: 'juan.carlos@email.com', rol: 'Bajo' },
  { id: '30', nombre: 'Ignacio Fuentes Parras', email: 'ignacio.fuentes@email.com', rol: 'Bajo' },
  { id: '31', nombre: 'Clara Montoro Jiménez', email: 'clara.montoro@email.com', rol: 'Violín 1' },
  { id: '32', nombre: 'Andrés Mena Carrasco', email: 'andres.mena@email.com', rol: 'Violín 1' },
  { id: '33', nombre: 'Laura Chica Pérez', email: 'laura.chica@email.com', rol: 'Violín 1' },
  { id: '34', nombre: 'Irene Galiano Ruiz', email: 'irene.galiano@email.com', rol: 'Violín 2' },
  { id: '35', nombre: 'Sergio Torres Valenzuela', email: 'sergio.torres@email.com', rol: 'Violín 2' },
  { id: '36', nombre: 'Noelia Higueras Cobo', email: 'noelia.higueras@email.com', rol: 'Violín 2' },
  { id: '37', nombre: 'Álvaro Pulido Navas', email: 'alvaro.pulido@email.com', rol: 'Viola' },
  { id: '38', nombre: 'Cristina Arjona López', email: 'cristina.arjona@email.com', rol: 'Viola' },
  { id: '39', nombre: 'Elena Bueno Contreras', email: 'elena.bueno@email.com', rol: 'Violonchelo' },
  { id: '40', nombre: 'Tomás Calahorro Gil', email: 'tomas.calahorro@email.com', rol: 'Contrabajo' },
  { id: '41', nombre: 'Lourdes Cárdenas Moya', email: 'lourdes.cardenas@email.com', rol: 'Flauta' },
  { id: '42', nombre: 'Gonzalo Espinosa Hidalgo', email: 'gonzalo.espinosa@email.com', rol: 'Oboe' },
  { id: '43', nombre: 'Patricia Anguita Real', email: 'patricia.anguita@email.com', rol: 'Clarinete' },
  { id: '44', nombre: 'Daniel Olmo Jurado', email: 'daniel.olmo@email.com', rol: 'Clarinete' },
  { id: '45', nombre: 'Víctor Sola Medina', email: 'victor.sola@email.com', rol: 'Fagot' },
  { id: '46', nombre: 'Jesús Martos Lechuga', email: 'jesus.martos@email.com', rol: 'Trompa' },
  { id: '47', nombre: 'Emilio Sánchez Cuesta', email: 'emilio.sanchez@email.com', rol: 'Trompa' },
  { id: '48', nombre: 'Roberto Vílchez Mora', email: 'roberto.vilchez@email.com', rol: 'Trompeta' },
  { id: '49', nombre: 'Luis Fernández Moreno', email: 'luis.fernandez@email.com', rol: 'Trombón' },
  { id: '50', nombre: 'Óscar Linares Peinado', email: 'oscar.linares@email.com', rol: 'Percusión' },
];

// Componentes de la página pública. De partida, los mismos miembros (sin
// email); el director añade o quita nombres desde Administración → Componentes.
export const componentesPrueba: Componente[] = usuariosPrueba.map(({ id, nombre, rol }) => ({ id: `c${id}`, nombre, rol }));
