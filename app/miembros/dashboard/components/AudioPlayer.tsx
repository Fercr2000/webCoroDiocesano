'use client';

import { useState, useRef } from 'react';
import { Play, Pause, Music, Download } from 'lucide-react';

interface AudioCardProps {
  titulo: string;
  compositor: string;
  categoria: string;
  enlaceAudio: string;
}

export default function AudioCard({ titulo, compositor, categoria, enlaceAudio }: AudioCardProps) {

  // Estado del reproductor
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Referencia al elemento <audio> HTML para controlarlo
  const audioRef = useRef<HTMLAudioElement>(null);

  // ============= FUNCIONES DEL REPRODUCTOR =============

  // Alternar entre play y pause
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Cuando el navegador termina de cargar el audio, sabemos la duración
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Mientras se reproduce, vamos actualizando el progreso
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  // Cuando termina la reproducción, volvemos al inicio
  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  // Permite saltar a un punto de la pista al hacer click en la barra
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const newTime = percent * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percent * 100);
  };

  // Formatea segundos a "mm:ss"
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (

    <div className="group relative bg-gradient-to-b from-stone-50 to-stone-100 border border-stone-200 rounded-sm overflow-hidden hover:shadow-xl hover:shadow-red-900/10 hover:border-red-800/30 transition-all duration-300">

      {/* Banda lateral izquierda */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-800 to-red-950 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Esquina decorativa superior derecha */}
      <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-red-800/20 pointer-events-none" />

      <div className="p-6 pl-7">

        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <Music size={12} strokeWidth={1.5} className="text-red-800/70 flex-shrink-0" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-red-800/80 font-medium">
            Audio
          </span>
          {categoria && (
            <>
              <span className="text-stone-300">·</span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-stone-500 font-medium">
                {categoria}
              </span>
            </>
          )}
        </div>

        {/* Título */}
        <h3 className="font-serif text-2xl text-stone-900 tracking-tight leading-tight mb-2">
          {titulo}
        </h3>

        {/* Compositor */}
        <p className="font-serif italic text-stone-600 mb-6">
          {compositor}
        </p>

        {/* ============= REPRODUCTOR ============= */}
        <div className="space-y-3">

          {/* FILA: Botón play + barra de progreso + descarga */}
          <div className="flex items-center gap-3">

            {/* Botón play/pause grande */}
            <button
              onClick={togglePlay}
              className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-red-800 to-red-950 text-stone-50 flex items-center justify-center hover:shadow-lg hover:shadow-red-900/40 transition-all duration-300 group/play"
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? (
                <Pause size={18} strokeWidth={2} fill="currentColor" />
              ) : (
                <Play size={18} strokeWidth={2} fill="currentColor" className="ml-0.5" />
              )}
            </button>

            {/* Barra de progreso clicable */}
            <div className="flex-1">

              {/* Tiempos arriba */}
              <div className="flex justify-between text-[10px] tracking-wider text-stone-500 mb-1.5 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Barra */}
              <div
                onClick={handleSeek}
                className="relative h-1.5 bg-stone-200 rounded-full cursor-pointer overflow-hidden group/bar"
              >
                {/* Progreso */}
                <div
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-800 to-red-600 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Botón descargar (icono solo) */}
            <a
              href={enlaceAudio}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-10 h-10 rounded-full border border-stone-300 hover:border-red-800 text-stone-600 hover:text-red-800 flex items-center justify-center transition-colors duration-300"
              aria-label="Descargar audio"
            >
              <Download size={16} strokeWidth={1.5} />
            </a>

          </div>

          {/* Elemento <audio> HTML (oculto, lo controlamos con JS) */}
          <audio
            ref={audioRef}
            src={enlaceAudio}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            preload="metadata"
          />

        </div>

      </div>

    </div>
  );
}