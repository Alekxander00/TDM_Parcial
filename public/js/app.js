// public/js/app.js
// Script genérico para proyectos HTML/CSS/JS tradicionales.
// Diseñado para funcionar en index.html y no romper si se incluye en prueba.html.

(function () {
  'use strict';

  /* -----------------------
     Helpers: $ y $$
     -----------------------
     $  -> document.querySelector
     $$ -> document.querySelectorAll -> Array
     Usamos estos atajos para no repetir código.
  */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* -----------------------
     Texto seguro para salida
     -----------------------
     Convierte objetos a JSON legible o fallback a String.
  */
  function safeText(obj) {
    try { return JSON.stringify(obj, null, 2); } catch { return String(obj); }
  }

  /* -----------------------
     Navegación por botones con data-link
     -----------------------
     En tu index.html los botones tienen data-link="/" etc.
     Este bloque los transforma en enlaces con recarga.
  */
  function attachNavButtons() {
    const navBtns = $$('[data-link]'); // Selecciona todos los botones que tengan data-link
    navBtns.forEach(btn => {
      btn.addEventListener('click', (ev) => {
        const href = btn.getAttribute('data-link');
        if (!href) return;
        // redirige a la ruta indicada; provoca recarga normal
        window.location.href = href.endsWith(".html") ? href : `${href}.html`;
      });
      // accesibilidad: permitir activar con Enter cuando el botón tenga focus
      btn.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') btn.click();
      });
    });
  }

  /* -----------------------
     Botón que consulta /api/status
     -----------------------
     En tu plantilla servidor ya tiene /api/status; este bloque
     añade el comportamiento al botón con id="btn-test-status" si existe.
  */
  function attachStatusButton() {
    const btn = $('#btn-test-status');      // puede no existir en prueba.html
    const out = $('#status-output');        // area donde mostramos el resultado
    if (!btn) return;

    btn.addEventListener('click', async () => {
      btn.disabled = true;
      if (out) out.textContent = 'Cargando...';
      try {
        const res = await fetch('/api/status');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const j = await res.json();
        if (out) out.textContent = safeText(j);
      } catch (err) {
        if (out) out.textContent = 'Error: ' + err.message;
      } finally {
        btn.disabled = false;
      }
    });
  }

  /* -----------------------
     Formulario que hace POST a /api/echo
     -----------------------
     Si agregas en una de tus páginas:
     <form id="contact-form"> ... </form>
     este bloque enviará los datos a /api/echo y mostrará respuesta.
  */
  function attachEchoForm() {
    const form = $('#contact-form'); // si no existe, no hace nada
    const out = $('#contact-result');
    if (!form) return;

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      const data = Object.fromEntries(new FormData(form).entries());

      try {
        const res = await fetch('/api/echo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const j = await res.json();
        if (out) out.textContent = 'Enviado. Respuesta: ' + safeText(j);
        form.reset();
      } catch (err) {
        if (out) out.textContent = 'Error al enviar: ' + err.message;
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* -----------------------
     Botones demo: data-action="alert"
     -----------------------
     Permite crear botones pequeños para pruebas:
     <button data-action="alert" data-message="Hola">Click</button>
  */
  function attachDemoButtons() {
    const demoBtns = $$('[data-action="alert"]');
    demoBtns.forEach(b => {
      b.addEventListener('click', () => {
        const msg = b.getAttribute('data-message') || 'Acción ejecutada';
        alert(msg);
      });
    });
  }

  /* -----------------------
     Inicialización
     -----------------------
     Llama a todos los attachers; solo los que correspondan si existen
  */
  function init() {
    attachNavButtons();
    attachStatusButton();
    attachEchoForm();
    attachDemoButtons();
  }

  // Ejecutar init cuando el DOM está listo (defer ya ayuda, pero lo hacemos por seguridad)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
