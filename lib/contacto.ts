// Datos de contacto del coro (página de Contacto).
// ⚠️ Los teléfonos son de muestra: sustituir por los reales antes de publicar.

export const PERSONAS_CONTACTO = [
  {
    nombre: 'Fernando J. Camacho Rizquez',
    cargo: 'Director',
    telefono: '600 000 001',
  },
  {
    nombre: 'D. Idelfonso Rueda Jandula',
    cargo: 'Coordinador · Delegado de Coros',
    telefono: '600 000 002',
  },
];

export const EMAIL_CONTACTO = 'corodiocesano@diocesisdejaen.es';
export const INSTAGRAM = { usuario: '@corodeladiocesisdejaen', url: 'https://instagram.com/corodeladiocesisdejaen' };
export const SEDE = {
  nombre: 'Casa de la Iglesia · Seminario Diocesano',
  mapa: 'https://www.google.com/maps/search/?api=1&query=Casa+de+la+Iglesia+de+Ja%C3%A9n+Seminario+Diocesano',
};

// Enlace tel: con prefijo de España y sin espacios.
export const enlaceTelefono = (telefono: string) => `tel:+34${telefono.replace(/\s/g, '')}`;
