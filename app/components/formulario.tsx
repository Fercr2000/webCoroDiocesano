// Piezas de formulario compartidas (inscripción pública y modales de admin),
// para que todos los campos de la web tengan el mismo aspecto.

export const inputClasses =
  'w-full bg-stone-50/50 border border-stone-300 rounded-sm py-3 px-4 text-stone-900 ' +
  'focus:outline-none focus:border-red-800 focus:ring-2 focus:ring-red-800/20 ' +
  'transition-all duration-200 placeholder:text-stone-400 ' +
  'hover:border-stone-400';

const selectClasses =
  inputClasses + ' appearance-none pr-12 cursor-pointer';

export function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
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
      {error && (
        <span className="block mt-2 text-xs text-red-800">{error}</span>
      )}
    </label>
  );
}

export function Select({
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

// ============= CIERRE DE LOS FORMULARIOS PÚBLICOS =============

// Trampa para bots: un campo invisible que una persona nunca rellena.
export function CampoTrampa({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
      <label>
        Web
        <input type="text" name="web" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

export function AceptoPrivacidad({ checked, onChange, finalidad }: { checked: boolean; onChange: (v: boolean) => void; finalidad: string }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required
        className="mt-1 w-4 h-4 accent-red-800 cursor-pointer"
      />
      <span className="text-sm text-stone-600 group-hover:text-stone-800 transition-colors">
        He leído y acepto la{' '}
        <a href="/privacidad" target="_blank" rel="noopener" className="text-red-800 underline decoration-red-800/30 underline-offset-2 hover:decoration-red-800">
          política de privacidad
        </a>
        . Mis datos se utilizarán únicamente {finalidad}.
      </span>
    </label>
  );
}

export type EstadoEnvio = 'listo' | 'enviando' | 'enviado' | 'no-configurado' | 'invalido' | 'error';

const CORREO_CORO = 'corodiocesano@diocesisdejaen.es';

// Botón de envío y, debajo, el aviso si algo ha fallado. Si el envío aún no
// está configurado se dice claramente y se ofrece escribir al correo del coro.
export function BotonEnviar({ texto, estado }: { texto: string; estado: EstadoEnvio }) {
  const enviando = estado === 'enviando';
  const avisos: Partial<Record<EstadoEnvio, React.ReactNode>> = {
    'no-configurado': <>El envío desde la web aún no está activo. Mientras tanto, escríbenos a <a href={`mailto:${CORREO_CORO}`} className="underline underline-offset-2">{CORREO_CORO}</a>.</>,
    invalido: <>Revisa los campos obligatorios y que el email esté bien escrito.</>,
    error: <>No hemos podido enviarlo. Inténtalo de nuevo en unos minutos o escríbenos a <a href={`mailto:${CORREO_CORO}`} className="underline underline-offset-2">{CORREO_CORO}</a>.</>,
  };

  return (
    <div className="pt-6">
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={enviando}
          className="group relative overflow-hidden bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-12 py-4 text-sm tracking-[0.3em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-900/60 transition-all duration-300 rounded-sm disabled:opacity-70 disabled:cursor-wait"
        >
          <span className="relative z-10">{enviando ? 'Enviando…' : texto}</span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>
      </div>
      {avisos[estado] && (
        <p role="alert" className="mt-6 text-sm text-center text-red-900 leading-relaxed bg-red-50/60 border border-red-800/15 rounded-sm p-4 animate-[fadeIn_0.4s_ease-out]">
          {avisos[estado]}
        </p>
      )}
    </div>
  );
}
