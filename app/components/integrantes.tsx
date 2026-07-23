import React from 'react';

const Integrantes = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl md:text-4xl text-stone-800 font-serif italic">El Coro y la Orquesta de la Diócesis de Jaén</h1>

      {/* Sección del coro */}
      <div className="flex flex-col justify-center items-start mb-16">
        <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-700">Tenores:</p>
        <ul className="list-disc ml-4">
          <li>Fernando J. Camacho Rizquez</li>
          <li>Juan Pérez García</li>
          <li>Maria Rodriguez Lopez</li>
        </ul>

        <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-700">Bajos:</p>
        <ul className="list-disc ml-4">
          <li>Antonio Gomez Sanchez</li>
          <li>Juan Carlos Lopez Rodriguez</li>
          <li>Maria Luisa Garcia Moreno</li>
        </ul>

        <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-700">Sopranos:</p>
        <ul className="list-disc ml-4">
          <li>Isabel Rodriguez Lopez</li>
          <li>Maria Jose Garcia Sanchez</li>
          <li>Juan Luis Perez Moreno</li>
        </ul>

        <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-700">Contraltos:</p>
        <ul className="list-disc ml-4">
          <li>Antonio Gomez Sanchez</li>
          <li>Juan Carlos Lopez Rodriguez</li>
          <li>Maria Luisa Garcia Moreno</li>
        </ul>
      </div>

      {/* Sección de la orquesta */}
      <div className="flex flex-col justify-center items-start mb-16">
        <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-700">Flautas:</p>
        <ul className="list-disc ml-4">
          <li>Juan Luis Perez Moreno</li>
          <li>Maria Jose Garcia Sanchez</li>
        </ul>

        <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-700">Oboes:</p>
        <ul className="list-disc ml-4">
          <li>Antonio Gomez Sanchez</li>
          <li>Juan Carlos Lopez Rodriguez</li>
        </ul>

        <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-700">Clarinetes:</p>
        <ul className="list-disc ml-4">
          <li>Maria Luisa Garcia Moreno</li>
          <li>Juan Luis Perez Moreno</li>
        </ul>

        <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-700">Fagot:</p>
        <ul className="list-disc ml-4">
          <li>Antonio Gomez Sanchez</li>
          <li>Juan Carlos Lopez Rodriguez</li>
        </ul>

        <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-700">Trompas:</p>
        <ul className="list-disc ml-4">
          <li>Maria Luisa Garcia Moreno</li>
          <li>Juan Luis Perez Moreno</li>
        </ul>

        <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-700">Trompetas:</p>
        <ul className="list-disc ml-4">
          <li>Antonio Gomez Sanchez</li>
          <li>Juan Carlos Lopez Rodriguez</li>
        </ul>

        <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-700">Trombon:</p>
        <ul className="list-disc ml-4">
          <li>Maria Luisa Garcia Moreno</li>
          <li>Juan Luis Perez Moreno</li>
        </ul>

        <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-700">Violin I:</p>
        <ul className="list-disc ml-4">
          <li>Antonio Gomez Sanchez</li>
          <li>Juan Carlos Lopez Rodriguez</li>
        </ul>

        <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-700">Violin II:</p>
        <ul className="list-disc ml-4">
          <li>Maria Luisa Garcia Moreno</li>
          <li>Juan Luis Perez Moreno</li>
        </ul>

        <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-700">Violas:</p>
        <ul className="list-disc ml-4">
          <li>Antonio Gomez Sanchez</li>
          <li>Juan Carlos Lopez Rodriguez</li>
        </ul>

        <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-700">Violonchelos:</p>
        <ul className="list-disc ml-4">
          <li>Maria Luisa Garcia Moreno</li>
          <li>Juan Luis Perez Moreno</li>
        </ul>

        {/* Sección de los integrantes comunes */}
        <div className="flex flex-col justify-center items-start mb-16">
          <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-700">Organistas:</p>
          <ul className="list-disc ml-4">
            <li>Antonio Gomez Sanchez</li>
            <li>Juan Carlos Lopez Rodriguez</li>
          </ul>

          <p className="font-serif text-xl md:text-2xl leading-relaxed text-stone-700">Director:</p>
          <ul className="list-disc ml-4">
            <li>Fernando J. Camacho Rizquez</li>
          </ul>
        </div>
      </div>

      {/* Arco superior */}
      <div className="flex justify-center mb-16">
        <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
          <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
          <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
          <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Arco inferior */}
      <div className="flex justify-center mb-16">
        <svg width="100" height="14" viewBox="0 0 100 14" fill="none" className="text-red-800/70">
          <line x1="0" y1="7" x2="42" y2="7" stroke="currentColor" strokeWidth="0.5" />
          <rect x="46" y="3" width="8" height="8" transform="rotate(45 50 7)" fill="currentColor" />
          <line x1="58" y1="7" x2="100" y2="7" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

    </div>
  );
};

export default Integrantes;
