'use client';

// Formulario para cambiar la contraseña. Fuera de la recuperación se pide la
// actual y se comprueba volviendo a iniciar sesión con ella antes de cambiarla.
// Mientras Supabase no esté configurado se avisa en lugar de fingir el cambio.

import { useState } from 'react';
import Link from 'next/link';
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import PantallaMiembros from '../../components/PantallaMiembros';
import { crearClienteNavegador } from '@/lib/supabase/client';
import { supabaseConfigurado } from '@/lib/supabase/config';

const MINIMO = 8;

// Puntuación de 0 a 4: longitud y variedad de caracteres.
function fortaleza(clave: string) {
  if (clave.length < MINIMO) return 0;
  let puntos = 1;
  if (clave.length >= 12) puntos++;
  if (/[a-z]/.test(clave) && /[A-Z]/.test(clave)) puntos++;
  if (/\d/.test(clave) && /[^A-Za-z0-9]/.test(clave)) puntos++;
  return puntos;
}

const NIVELES = ['Demasiado corta', 'Aceptable', 'Buena', 'Muy buena', 'Excelente'];

export default function CambiarContrasena({ recuperacion }: { recuperacion: boolean }) {

  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [repetir, setRepetir] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [hecho, setHecho] = useState(false);

  const puntos = fortaleza(nueva);
  const coinciden = repetir.length > 0 && nueva === repetir;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (nueva.length < MINIMO) return setError(`La contraseña nueva debe tener al menos ${MINIMO} caracteres.`);
    if (nueva !== repetir) return setError('Las dos contraseñas nuevas no coinciden.');
    if (!recuperacion && nueva === actual) return setError('La contraseña nueva debe ser distinta de la actual.');
    if (!supabaseConfigurado) return setError('El cambio de contraseña se activará al conectar Supabase.');

    setEnviando(true);
    const supabase = crearClienteNavegador();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email) {
      setEnviando(false);
      return setError('Tu sesión ha caducado. Vuelve a entrar en el área de miembros.');
    }

    if (!recuperacion) {
      const { error: errorActual } = await supabase.auth.signInWithPassword({ email: user.email, password: actual });
      if (errorActual) {
        setEnviando(false);
        return setError('La contraseña actual no es correcta.');
      }
    }

    const { error: errorCambio } = await supabase.auth.updateUser({ password: nueva });
    setEnviando(false);
    if (errorCambio) {
      return setError(errorCambio.code === 'same_password'
        ? 'La contraseña nueva debe ser distinta de la actual.'
        : 'No hemos podido cambiarla. Inténtalo de nuevo en unos minutos.');
    }
    setHecho(true);
  };

  const claseInput = 'w-full bg-white/70 border border-stone-300 rounded-sm py-3 pl-12 pr-12 text-stone-900 focus:outline-none focus:border-red-800 focus:ring-2 focus:ring-red-800/20 transition-all duration-200 placeholder:text-stone-400 hover:border-stone-400';

  const campo = (id: string, etiqueta: string, valor: string, cambiar: (v: string) => void, autoComplete: string, conOjo = false) => (
    <div>
      <label htmlFor={id} className="block mb-2">
        <span className="text-xs tracking-[0.2em] uppercase text-stone-700 font-medium">{etiqueta}</span>
      </label>
      <div className="relative">
        <Lock size={18} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-red-800/60 pointer-events-none" />
        <input
          id={id}
          type={mostrar ? 'text' : 'password'}
          value={valor}
          onChange={(e) => cambiar(e.target.value)}
          required
          autoComplete={autoComplete}
          placeholder="••••••••"
          className={claseInput}
        />
        {conOjo && (
          <button
            type="button"
            onClick={() => setMostrar(!mostrar)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-red-800 transition-colors"
            aria-label={mostrar ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}
          >
            {mostrar ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <PantallaMiembros
      eyebrowArte="Tu cuenta"
      linea1="Una llave nueva"
      linea2="para tu atril."
      texto="Elige una contraseña que solo conozcas tú. La necesitarás cada vez que entres al área de miembros."
      eyebrow={recuperacion ? 'Recuperar' : 'Contraseña'}
    >
      {!hecho ? (
        <>
          <h1 className="font-serif text-4xl md:text-5xl text-stone-900 tracking-tight leading-[1.1] mb-3">
            {recuperacion ? 'Elige tu contraseña' : 'Cambiar contraseña'}
          </h1>
          <p className="font-serif italic text-lg text-stone-600 mb-10">
            Al menos {MINIMO} caracteres; mejor si mezclas letras, números y símbolos
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {!recuperacion && campo('actual', 'Contraseña actual', actual, setActual, 'current-password', true)}

            <div>
              {campo('nueva', 'Contraseña nueva', nueva, setNueva, 'new-password', recuperacion)}
              {/* Indicador de fortaleza: cuatro tramos granate */}
              {nueva && (
                <div className="mt-3 animate-[fadeIn_0.3s_ease-out]">
                  <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className={`h-1 rounded-full transition-colors duration-300 ${n <= puntos ? 'bg-gradient-to-r from-red-800 to-red-950' : 'bg-stone-200'}`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs tracking-[0.2em] uppercase text-stone-500">{NIVELES[puntos]}</p>
                </div>
              )}
            </div>

            <div>
              {campo('repetir', 'Repite la nueva', repetir, setRepetir, 'new-password')}
              {repetir && (
                <p className={`mt-2 text-xs ${coinciden ? 'text-stone-500' : 'text-red-800'}`}>
                  {coinciden ? 'Coinciden.' : 'Todavía no coinciden.'}
                </p>
              )}
            </div>

            {error && (
              <div role="alert" className="bg-red-50 border border-red-200 px-4 py-3 rounded-sm">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="group relative overflow-hidden w-full bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-8 py-4 text-sm tracking-[0.3em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-900/60 transition-all duration-300 rounded-sm flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">{enviando ? 'Guardando…' : 'Guardar contraseña'}</span>
              {!enviando && <ArrowRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>

          </form>

          <div className="mt-12 pt-8 border-t border-stone-200 text-center">
            <Link
              href={recuperacion ? '/miembros' : '/miembros/dashboard'}
              className="text-sm text-stone-600 hover:text-red-800 transition-colors"
            >
              {recuperacion ? '← Volver al acceso' : '← Volver a tu archivo'}
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-8 animate-[fadeIn_0.5s_ease-out]">

          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-red-50/70 border border-red-800/25 flex items-center justify-center">
              <ShieldCheck size={36} strokeWidth={1.5} className="text-red-800" />
            </div>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl text-stone-900 tracking-tight leading-[1.1] mb-4">
            Contraseña guardada
          </h1>
          <p className="font-serif italic text-lg text-stone-600 mb-10 leading-relaxed">
            A partir de ahora, entra con tu contraseña nueva.
          </p>

          <Link
            href="/miembros/dashboard"
            className="inline-block text-xs tracking-[0.2em] uppercase text-stone-600 hover:text-red-800 transition-colors border border-stone-300 hover:border-red-800 px-6 py-3 rounded-sm"
          >
            Ir a tu archivo
          </Link>

        </div>
      )}
    </PantallaMiembros>
  );
}
