'use client';

// Recuperar contraseña: Supabase envía un enlace al correo que lleva a
// /miembros/confirmar y, de ahí, a elegir una contraseña nueva.
// Mientras Supabase no esté configurado se avisa en lugar de fingir el envío.

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, MailCheck } from 'lucide-react';
import PantallaMiembros from '../../components/PantallaMiembros';
import { crearClienteNavegador } from '@/lib/supabase/client';
import { supabaseConfigurado } from '@/lib/supabase/config';

type Estado = 'listo' | 'enviando' | 'enviado' | 'no-configurado' | 'error';

export default function Recuperar({ caducado }: { caducado: boolean }) {

  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<Estado>('listo');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseConfigurado) {
      setEstado('no-configurado');
      return;
    }
    setEstado('enviando');
    const siguiente = encodeURIComponent('/miembros/cambiar-contrasena?recuperacion=1');
    const { error } = await crearClienteNavegador().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/miembros/confirmar?siguiente=${siguiente}`,
    });
    // Supabase no revela si el email existe: si no hay error, siempre "enviado".
    setEstado(error ? 'error' : 'enviado');
  };

  const enviando = estado === 'enviando';

  return (
    <PantallaMiembros
      eyebrowArte="Recuperar acceso"
      linea1="Te ayudamos"
      linea2="a volver."
      texto="Introduce tu email y te enviaremos las instrucciones para restablecer tu contraseña."
      eyebrow="Recuperar"
    >
      {estado !== 'enviado' ? (
        <>
          <h1 className="font-serif text-4xl md:text-5xl text-stone-900 tracking-tight leading-[1.1] mb-3">
            Restablecer contraseña
          </h1>

          <p className="font-serif italic text-lg text-stone-600 mb-10">
            Te enviaremos un enlace a tu correo
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label htmlFor="email" className="block mb-2">
                <span className="text-xs tracking-[0.2em] uppercase text-stone-700 font-medium">
                  Email asociado a tu cuenta
                </span>
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  strokeWidth={1.5}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-red-800/60 pointer-events-none"
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                  className="w-full bg-white/70 border border-stone-300 rounded-sm py-3 pl-12 pr-4 text-stone-900 focus:outline-none focus:border-red-800 focus:ring-2 focus:ring-red-800/20 transition-all duration-200 placeholder:text-stone-400 hover:border-stone-400"
                />
              </div>
            </div>

            {caducado && estado === 'listo' && (
              <div role="alert" className="bg-red-50 border border-red-200 px-4 py-3 rounded-sm">
                <p className="text-sm text-red-800">
                  El enlace ha caducado o ya se usó. Pide uno nuevo.
                </p>
              </div>
            )}
            {estado === 'no-configurado' && (
              <div role="alert" className="bg-red-50 border border-red-200 px-4 py-3 rounded-sm">
                <p className="text-sm text-red-800">
                  La recuperación por email aún no está activa. Mientras tanto, pide al director que te restablezca la contraseña.
                </p>
              </div>
            )}
            {estado === 'error' && (
              <div role="alert" className="bg-red-50 border border-red-200 px-4 py-3 rounded-sm">
                <p className="text-sm text-red-800">
                  No hemos podido enviar el enlace. Espera unos minutos y vuelve a intentarlo.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="group relative overflow-hidden w-full bg-gradient-to-br from-red-800 to-red-950 text-stone-50 px-8 py-4 text-sm tracking-[0.3em] uppercase font-medium shadow-lg hover:shadow-2xl hover:shadow-red-900/60 transition-all duration-300 rounded-sm flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {enviando ? 'Enviando…' : 'Enviar enlace de recuperación'}
              </span>
              {!enviando && (
                <ArrowRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />
              )}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>

          </form>

          <div className="mt-12 pt-8 border-t border-stone-200 text-center">
            <Link href="/miembros" className="text-sm text-stone-600 hover:text-red-800 transition-colors">
              ← Volver al acceso
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-8 animate-[fadeIn_0.5s_ease-out]">

          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-red-50/70 border border-red-800/25 flex items-center justify-center">
              <MailCheck size={36} strokeWidth={1.5} className="text-red-800" />
            </div>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl text-stone-900 tracking-tight leading-[1.1] mb-4">
            Revisa tu correo
          </h1>

          <p className="font-serif italic text-lg text-stone-600 mb-8 leading-relaxed">
            Si existe una cuenta asociada a <span className="text-stone-900 not-italic">{email}</span>,
            recibirás un correo con las instrucciones en los próximos minutos.
          </p>

          <p className="text-sm text-stone-500 mb-10 leading-relaxed">
            Revisa también tu carpeta de spam o correo no deseado.
          </p>

          <Link
            href="/miembros"
            className="inline-block text-xs tracking-[0.2em] uppercase text-stone-600 hover:text-red-800 transition-colors border border-stone-300 hover:border-red-800 px-6 py-3 rounded-sm"
          >
            Volver al acceso
          </Link>

        </div>
      )}
    </PantallaMiembros>
  );
}
