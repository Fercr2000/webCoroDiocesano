// Envío de correos con Resend (API REST, sin dependencias). Solo en servidor:
// la clave RESEND_API_KEY nunca debe llegar al navegador.
// Mientras el dominio del coro no esté verificado en Resend, el remitente es
// onboarding@resend.dev y solo puede escribir al email de la propia cuenta.

import 'server-only';

export const correoConfigurado = Boolean(process.env.RESEND_API_KEY);

const DESTINO = process.env.CORREO_DESTINO || 'corodiocesano@diocesisdejaen.es';
const REMITENTE = process.env.CORREO_REMITENTE || 'Coro de la Diócesis de Jaén <onboarding@resend.dev>';

export type FilaCorreo = [etiqueta: string, valor: string];

const escapar = (texto: string) =>
  texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Tabla sencilla con los colores de la web; los clientes de correo solo entienden estilos en línea.
function plantillaHtml(titulo: string, filas: FilaCorreo[]) {
  const celdas = filas
    .filter(([, valor]) => valor)
    .map(([etiqueta, valor]) => `
      <tr>
        <td style="padding:10px 16px 10px 0;vertical-align:top;font:600 11px/1.6 sans-serif;letter-spacing:.15em;text-transform:uppercase;color:#991b1b;white-space:nowrap">${escapar(etiqueta)}</td>
        <td style="padding:10px 0;font:15px/1.6 sans-serif;color:#1c1917;white-space:pre-wrap">${escapar(valor)}</td>
      </tr>`)
    .join('');
  return `
    <div style="background:#fafaf9;padding:32px 16px">
      <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #e7e5e4;border-left:4px solid #991b1b;padding:28px">
        <p style="margin:0 0 6px;font:600 11px sans-serif;letter-spacing:.3em;text-transform:uppercase;color:#991b1b">Web del coro</p>
        <h1 style="margin:0 0 20px;font:400 26px Georgia,serif;color:#1c1917">${escapar(titulo)}</h1>
        <table style="border-collapse:collapse;width:100%">${celdas}</table>
        <p style="margin:24px 0 0;font:italic 13px sans-serif;color:#78716c">Responde a este correo para escribir directamente a quien lo envía.</p>
      </div>
    </div>`;
}

export async function enviarCorreo({ asunto, titulo, filas, responderA }: { asunto: string; titulo: string; filas: FilaCorreo[]; responderA: string }) {
  const respuesta = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: REMITENTE,
      to: [DESTINO],
      reply_to: responderA,
      subject: asunto,
      html: plantillaHtml(titulo, filas),
      text: filas.filter(([, v]) => v).map(([e, v]) => `${e}: ${v}`).join('\n'),
    }),
  });
  if (!respuesta.ok) {
    console.error('Resend rechazó el correo:', respuesta.status, await respuesta.text());
  }
  return respuesta.ok;
}
