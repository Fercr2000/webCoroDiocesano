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
