// Responsables del coro: datos del tríptico de /sobre-nosotros/responsables y
// de la carta completa de cada uno. Textos de muestra hasta tener los
// definitivos. Sin `foto`, se muestra su inicial en un marco.

export interface Responsable {
  slug: string;
  cargo: string;          // "Delegado de Liturgia"
  firma: string;          // cargo completo bajo la firma de la carta
  nombre: string;
  foto?: string;
  cita: { texto: string; fuente: string };
  resumen: string;        // texto breve del tríptico
  carta: string[];        // párrafos de la carta completa
}

export const RESPONSABLES: Responsable[] = [
  {
    slug: 'delegado-liturgia',
    cargo: 'Delegado de Liturgia',
    firma: 'Delegado de Liturgia de la Diócesis de Jaén',
    nombre: 'D. Antonio Lara Polaina',
    cita: { texto: 'La música sacra es parte necesaria e integral de la liturgia solemne.', fuente: 'Sacrosanctum Concilium, 112' },
    resumen:
      'Acompaña al coro para que cada celebración sea oración antes que interpretación. Desde la Delegación de Liturgia vela por que el repertorio sirva al misterio que se celebra, respetando los tiempos litúrgicos y ayudando a que la asamblea entera pueda unirse al canto.',
    carta: [
      'Cuando el pueblo de Dios se reúne para celebrar, la música no es un adorno: es una forma de rezar. El canto ayuda a que la Palabra se escuche mejor, a que el silencio tenga hondura y a que la asamblea se sienta parte de lo que sucede en el altar.',
      'Por eso agradezco tanto el trabajo de este coro. Detrás de cada celebración hay una búsqueda paciente: elegir lo que conviene a cada tiempo litúrgico, cuidar los textos, respetar los momentos en que debe sonar la voz de todos. Ese discernimiento también es servicio.',
      'Os animo a seguir cantando con esa misma conciencia: que nadie salga de una misa recordando lo bien que sonó el coro, sino lo cerca que estuvo de Dios. Esa es la mejor señal de que la música ha cumplido su misión.',
    ],
  },
  {
    slug: 'director',
    cargo: 'Director',
    firma: 'Director del Coro de la Diócesis de Jaén',
    nombre: 'Fernando J. Camacho Rizquez',
    cita: { texto: 'Cantar es propio del que ama.', fuente: 'San Agustín' },
    resumen:
      'Dirige el Coro y Orquesta de la Diócesis con una convicción sencilla: la belleza también evangeliza. Prepara cada ensayo y cada celebración buscando que voces e instrumentos suenen como un solo cuerpo, al servicio de la Iglesia diocesana y de quienes rezan con nuestra música.',
    carta: [
      'En medio de tanto ruido, la música sacra sigue siendo uno de los pocos lugares donde el silencio tiene sentido. Donde una voz humana, sin amplificar, todavía puede conmover. Donde la belleza no se vende: se ofrece. Por eso seguimos cantándola, porque cada época la necesita a su manera, y la nuestra quizá más que ninguna.',
      'Y esa música pide tiempo. Detrás de cada nota que escuchas en una celebración hay semanas de ensayo, oído atento, oración compartida y la misma frase repetida hasta que respira. No es esfuerzo: es cuidado. «Cantar es propio del que ama», decía San Agustín, y el amor siempre se toma su tiempo.',
      'Si has llegado hasta aquí, quizá este sea tu sitio. Trae tu voz, tu instrumento, tu presencia: aquí encontrarás una familia que sirve cantando.',
    ],
  },
  {
    slug: 'delegado-coros',
    cargo: 'Delegado de Coros',
    firma: 'Delegado de Coros de la Diócesis de Jaén',
    nombre: 'D. Idelfonso Rueda Jandula',
    cita: { texto: 'Quien canta bien, ora dos veces.', fuente: 'Atribuido a San Agustín' },
    resumen:
      'Cuida la vida de los coros de la diócesis y tiende puentes entre ellos. Acompaña a cantores e instrumentistas en su formación y en su camino de fe, para que el servicio musical sea también una experiencia de comunidad y de familia.',
    carta: [
      'En nuestra diócesis hay muchas voces que cantan cada domingo: coros parroquiales, scholas, grupos de jóvenes, cantores que llevan toda una vida al servicio de su comunidad. Mi tarea es acompañarlos y ayudar a que ninguno se sienta solo.',
      'El Coro y Orquesta de la Diócesis tiene en ese camino un papel especial. No es un coro más: es un lugar de encuentro, de formación y de testimonio, donde quienes aman la música sacra pueden crecer juntos y compartir lo aprendido con sus parroquias.',
      'Os invito a vivirlo así, como una familia. Que cada ensayo sea también un rato de amistad y de fe, y que lo que aquí se siembra florezca después en tantos rincones de nuestra tierra de Jaén.',
    ],
  },
];

export const enlaceCarta = (r: Responsable) =>
  r.slug === 'director' ? '/sobre-nosotros/director' : `/sobre-nosotros/responsables/${r.slug}`;
