'use client';

// Formulario para contar con el coro en una celebración (boda, funeral,
// fiesta patronal, concierto…). Mismo estilo que el de inscripción.
// No hay precios: cada caso se habla personalmente con quien lo solicita.
// Todavía no envía nada: al conectar el envío por email (Resend) se hará aquí.

import { useState } from 'react';
import { Field, inputClasses } from '../formulario';

export default function FormularioContratacion() {

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [entidad, setEntidad] = useState('');

  const [fecha, setFecha] = useState('');
  const [lugar, setLugar] = useState('');

  const [mensaje, setMensaje] = useState('');
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="text-center py-12 animate-[fadeIn_0.6s_ease-out]">
        <div className="flex justify-center mb-8">
          <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
            <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
            <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
            <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>
        <h3 className="font-serif text-4xl md:text-5xl text-stone-900 tracking-tight leading-[1.1] mb-6">
          Gracias por pensar en nosotros
        </h3>
        <p className="font-serif italic text-xl text-stone-600 leading-relaxed">
          Hemos recibido tu solicitud. Te llamaremos o escribiremos muy pronto
          <br className="hidden md:block" />
          para conocer los detalles de tu celebración.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 animate-[fadeIn_0.5s_ease-out]">

      {/* Sin precios: se habla con cada persona */}
      <p className="flex gap-3 text-sm text-stone-600 leading-relaxed bg-red-50/60 border border-red-800/15 rounded-sm p-4">
        <svg width="10" height="10" viewBox="0 0 10 10" className="flex-shrink-0 mt-1.5 text-red-800" aria-hidden="true">
          <rect x="2" y="2" width="6" height="6" transform="rotate(45 5 5)" fill="currentColor" />
        </svg>
        <span>
          Cuéntanos qué celebras y lo hablamos contigo personalmente. Cada celebración es distinta:
          el repertorio y las condiciones los acordamos juntos.
        </span>
      </p>

      {/* TUS DATOS */}
      <div className="flex items-center gap-4">
        <span className="text-xs tracking-[0.3em] uppercase text-red-800 font-medium">Tus datos</span>
        <div className="h-px flex-1 bg-stone-300" />
      </div>

      <Field label="Nombre y apellidos" required>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className={inputClasses} />
      </Field>

      <div className="grid md:grid-cols-2 gap-6">
        <Field label="Email" required>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClasses} />
        </Field>
        <Field label="Teléfono" required>
          <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} required className={inputClasses} />
        </Field>
      </div>

      <Field label="Parroquia, cofradía o entidad" hint="Opcional · Si lo pides en su nombre">
        <input type="text" value={entidad} onChange={(e) => setEntidad(e.target.value)} className={inputClasses} />
      </Field>

      {/* LA CELEBRACIÓN */}
      <div className="flex items-center gap-4 pt-4">
        <span className="text-xs tracking-[0.3em] uppercase text-red-800 font-medium">La celebración</span>
        <div className="h-px flex-1 bg-stone-300" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Field label="Fecha prevista" hint="Opcional · Si ya la sabes">
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputClasses} />
        </Field>
        <Field label="Lugar" required>
          <input type="text" value={lugar} onChange={(e) => setLugar(e.target.value)} placeholder="Iglesia y localidad" required className={inputClasses} />
        </Field>
      </div>

      {/* MENSAJE */}
      <div className="flex items-center gap-4 pt-4">
        <span className="text-xs tracking-[0.3em] uppercase text-red-800 font-medium">Tu mensaje</span>
        <div className="h-px flex-1 bg-stone-300" />
      </div>

      <Field label="Cuéntanos tu celebración" required hint="Qué celebras, horario, dudas…">
        <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} rows={5} required className={`${inputClasses} resize-none`} />
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
          para responder a esta solicitud.
        </span>
      </label>

      <div className="flex justify-center pt-6">
        <button
          type="submit"
          className="group relative overflow-hidden bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-12 py-4 text-sm tracking-[0.3em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-900/60 transition-all duration-300 rounded-sm"
        >
          <span className="relative z-10">Enviar solicitud</span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>
      </div>

    </form>
  );
}
