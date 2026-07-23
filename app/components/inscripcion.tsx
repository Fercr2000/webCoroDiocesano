'use client';

import { useState } from 'react';

type TipoMiembro = 'coralista' | 'instrumentista';

const cuerdas = ['Soprano', 'Contralto', 'Tenor', 'Bajo', 'No lo sé'];

const instrumentos = [
  'Violín', 'Viola', 'Violonchelo', 'Contrabajo',
  'Flauta', 'Oboe', 'Clarinete', 'Fagot',
  'Trompa', 'Trombón', 'Trompeta', 'Percusión',
  'Otro',
];

const experienciaCoral = [
  'Ninguna',
  'Algo (parroquia, escuela…)',
  'Coro estable',
  'Coro profesional',
];

const lecturaMusical = [
  'No leo música',
  'Nociones básicas',
  'Leo con fluidez',
];

const nivelInstrumento = [
  'Aficionado',
  'Conservatorio (medio)',
  'Conservatorio (superior)',
  'Profesional',
];

export default function Inscription() {

  const [tipo, setTipo] = useState<TipoMiembro>('coralista');

  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [procedencia, setProcedencia] = useState('');

  const [cuerda, setCuerda] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [lectura, setLectura] = useState('');

  const [instrumento, setInstrumento] = useState('');
  const [otroInstrumento, setOtroInstrumento] = useState('');
  const [nivel, setNivel] = useState('');

  const [mensaje, setMensaje] = useState('');
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);

  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };

  // Mensaje de éxito
  if (enviado) {
    return (
      <section
        id="inscripcion"
        className="superficie-crema w-full py-32 md:py-40 overflow-hidden"
      >
        <div className="relative max-w-3xl mx-auto px-6 lg:px-12 text-center">

          <div className="flex justify-center mb-12">
            <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
              <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
              <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
              <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>

          <h2 className="font-serif text-5xl md:text-6xl text-stone-900 tracking-tight leading-[1.1] mb-8">
            Hemos recibido tu canto
          </h2>

          <p className="font-serif italic text-xl md:text-2xl text-stone-600 leading-relaxed">
            Gracias por sumarte. Pronto nos pondremos en contacto contigo
            <br className="hidden md:block" />
            para darte la bienvenida al Coro de la Diócesis de Jaén.
          </p>

        </div>
      </section>
    );
  }

  return (

    <section
      id="inscripcion"
      className="relative w-full bg-stone-50 py-32 md:py-40 overflow-hidden"
    >

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-900/30 to-transparent" />

      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-red-900/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-red-900/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-12">

        {/* CABECERA */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-px w-16 bg-red-800/60" />
          <span className="text-xs tracking-[0.4em] uppercase text-red-800 font-medium">
            Forma parte
          </span>
          <div className="h-px w-16 bg-red-800/60" />
        </div>

        <h2 className="font-serif text-5xl md:text-7xl text-stone-900 text-center tracking-tight leading-[1.1] mb-6">
          Tu voz, tu instrumento, su gloria
        </h2>

        <p className="font-serif italic text-xl md:text-2xl text-stone-500 text-center mb-16">
          Aquí empieza tu camino
        </p>

        <div className="flex justify-center mb-16">
          <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
            <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
            <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
            <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        {/* DESLIZADOR */}
        <div className="relative grid grid-cols-2 mb-16 border border-stone-300 rounded-full overflow-hidden bg-stone-100">

          <div
            className={`absolute inset-y-0 left-0 w-1/2 bg-gradient-to-br from-red-800 to-red-950 transition-transform duration-500 ease-out ${
              tipo === 'coralista' ? 'translate-x-0' : 'translate-x-full'
            }`}
          />

          <button
            type="button"
            onClick={() => setTipo('coralista')}
            className={`relative z-10 flex items-center justify-center gap-4 py-6 transition-colors duration-300 ${
              tipo === 'coralista' ? 'text-stone-50' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="flex-shrink-0">
              <ellipse cx="6" cy="17" rx="4" ry="3" fill="currentColor" />
              <line x1="10" y1="17" x2="10" y2="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 3 Q 18 6 18 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
            <span className="text-sm md:text-base tracking-[0.3em] uppercase font-medium">
              Coralista
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTipo('instrumentista')}
            className={`relative z-10 flex items-center justify-center gap-4 py-6 transition-colors duration-300 ${
              tipo === 'instrumentista' ? 'text-stone-50' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="flex-shrink-0">
              <line x1="2" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
              <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
              <line x1="2" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
              <path d="M11 2 C 14 4, 14 8, 11 11 C 8 14, 8 18, 11 20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
            <span className="text-sm md:text-base tracking-[0.3em] uppercase font-medium">
              Instrumentista
            </span>
          </button>

        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-10">

          {/* CAMPOS COMUNES */}
          <div className="flex items-center gap-4">
            <span className="text-xs tracking-[0.3em] uppercase text-red-800 font-medium">
              Tus datos
            </span>
            <div className="h-px flex-1 bg-stone-300" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Nombre" required>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className={inputClasses}
              />
            </Field>

            <Field label="Apellidos" required>
              <input
                type="text"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                required
                className={inputClasses}
              />
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Email" required>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClasses}
              />
            </Field>

            <Field label="Teléfono" required>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
                className={inputClasses}
              />
            </Field>
          </div>

          <Field label="Procedencia" hint="Opcional · Localidad o parroquia">
            <input
              type="text"
              value={procedencia}
              onChange={(e) => setProcedencia(e.target.value)}
              className={inputClasses}
            />
          </Field>

          {/* CAMPOS ESPECÍFICOS */}
          {tipo === 'coralista' && (
            <>
              <div className="flex items-center gap-4 pt-4">
                <span className="text-xs tracking-[0.3em] uppercase text-red-800 font-medium">
                  Tu voz
                </span>
                <div className="h-px flex-1 bg-stone-300" />
              </div>

              <Field label="Cuerda" required>
                <Select
                  value={cuerda}
                  onChange={(e) => setCuerda(e.target.value)}
                  required
                >
                  <option value="">— Selecciona —</option>
                  {cuerdas.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </Field>

              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Experiencia coral previa" hint="Opcional">
                  <Select
                    value={experiencia}
                    onChange={(e) => setExperiencia(e.target.value)}
                  >
                    <option value="">— Selecciona —</option>
                    {experienciaCoral.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </Select>
                </Field>

                <Field label="Lectura musical" hint="Opcional">
                  <Select
                    value={lectura}
                    onChange={(e) => setLectura(e.target.value)}
                  >
                    <option value="">— Selecciona —</option>
                    {lecturaMusical.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </Select>
                </Field>
              </div>
            </>
          )}

          {tipo === 'instrumentista' && (
            <>
              <div className="flex items-center gap-4 pt-4">
                <span className="text-xs tracking-[0.3em] uppercase text-red-800 font-medium">
                  Tu instrumento
                </span>
                <div className="h-px flex-1 bg-stone-300" />
              </div>

              <Field label="Instrumento" required>
                <Select
                  value={instrumento}
                  onChange={(e) => setInstrumento(e.target.value)}
                  required
                >
                  <option value="">— Selecciona —</option>
                  {instrumentos.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </Select>
              </Field>

              {instrumento === 'Otro' && (
                <Field label="Especifica el instrumento" required>
                  <input
                    type="text"
                    value={otroInstrumento}
                    onChange={(e) => setOtroInstrumento(e.target.value)}
                    required
                    className={inputClasses}
                  />
                </Field>
              )}

              <Field label="Nivel" hint="Opcional · Cómo te describirías como músico">
                <Select
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value)}
                >
                  <option value="">— Selecciona —</option>
                  {nivelInstrumento.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </Select>
              </Field>
            </>
          )}

          {/* CIERRE COMÚN */}
          <div className="flex items-center gap-4 pt-4">
            <span className="text-xs tracking-[0.3em] uppercase text-red-800 font-medium">
              Algo más
            </span>
            <div className="h-px flex-1 bg-stone-300" />
          </div>

          <Field label="Cuéntanos algo más" hint="Opcional · Motivación, disponibilidad, dudas…">
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={4}
              className={`${inputClasses} resize-none`}
            />
          </Field>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={aceptaPrivacidad}
              onChange={(e) => setAceptaPrivacidad(e.target.checked)}
              required
              className="mt-1 w-4 h-4 accent-red-800 cursor-pointer"
            />
            <span className="text-sm text-stone-600 group-hover:text-stone-800 transition-colors">
              He leído y acepto la política de privacidad. Mis datos se utilizarán únicamente
              para el proceso de inscripción al Coro de la Diócesis de Jaén.
            </span>
          </label>

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="group relative overflow-hidden bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-12 py-4 text-sm tracking-[0.3em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-900/60 transition-all duration-300 rounded-sm"
            >
              <span className="relative z-10">Enviar inscripción</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>

        </form>

      </div>
    </section>
  );
}

const inputClasses =
  'w-full bg-stone-50/50 border border-stone-300 rounded-sm py-3 px-4 text-stone-900 ' +
  'focus:outline-none focus:border-red-800 focus:ring-2 focus:ring-red-800/20 ' +
  'transition-all duration-200 placeholder:text-stone-400 ' +
  'hover:border-stone-400';

const selectClasses =
  inputClasses + ' appearance-none pr-12 cursor-pointer';

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs tracking-[0.2em] uppercase text-stone-700 font-medium">
          {label}
          {required && <span className="text-red-800 ml-1">·</span>}
        </span>
        {hint && (
          <span className="text-xs text-stone-400 italic">{hint}</span>
        )}
      </div>
      {children}
    </label>
  );
}

function Select({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={selectClasses}>
        {children}
      </select>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-red-800 pointer-events-none"
      >
        <path
          d="M3 5L7 9L11 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
