/*!
* Start Bootstrap - Simple Sidebar v6.0.6 (https://startbootstrap.com/template/simple-sidebar)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-simple-sidebar/blob/master/LICENSE)
*/
// 
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});

// Einfacher Loader: lädt die <main> (oder <body>) von einer Seite per fetch und ersetzt #content-area.
// Anfängerfreundlich, keine Frameworks.

(function () {
  const content = document.getElementById('content-area');
  if (!content) return;

  async function loadPage(url, push = true) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const text = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      // Versuche zuerst <main>, sonst <body>
      const source = doc.querySelector('main') || doc.body;
      content.innerHTML = source.innerHTML;

      // Titel anpassen, wenn vorhanden
      const newTitle = doc.querySelector('title');
      if (newTitle) document.title = newTitle.textContent;

      if (push) history.pushState({ url }, '', url);
    } catch (err) {
      content.innerHTML = '<div class="p-4"><h2>Fehler</h2><p>Seite konnte nicht geladen werden.</p></div>';
      console.error('loadPage error:', err);
    }
  }

  // Links mit Klasse .ajax-link behandeln
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a.ajax-link');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    e.preventDefault();
    loadPage(href, true);
  });

  // Browser-Zurück/Vorwärts unterstützen
  window.addEventListener('popstate', function (e) {
    const url = e.state && e.state.url;
    if (url) loadPage(url, false);
  });

  // Optional: beim ersten Laden eine bestimmte Seite zeigen (z.B. foods-relaxion)
  // Kommentiere aus, wenn du die Index-Inhalte behalten willst.
  // loadPage('../pages/foods-relaxion.html', true);
})();

// ...existing code...
(function () {
  const content = document.getElementById('content-area');
  if (!content) return;

  async function loadPage(url, push = true) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const text = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      // --- Styles übernehmen (externe CSS + inline <style>) ---
      // Basis-URL der geladenen Seite, damit relative hrefs korrekt aufgelöst werden
      const baseUrl = res.url;

      // Kopiere <link rel="stylesheet"> (nur, wenn noch nicht vorhanden)
      doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const absHref = new URL(href, baseUrl).href;
        const already = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
                             .some(l => l.href === absHref);
        if (!already) {
          const newLink = document.createElement('link');
          newLink.rel = 'stylesheet';
          newLink.href = absHref;
          document.head.appendChild(newLink);
        }
      });

      // Kopiere <style> (nur, wenn derselbe Inhalt noch nicht existiert)
      doc.querySelectorAll('style').forEach(style => {
        const css = style.textContent || '';
        const exists = Array.from(document.querySelectorAll('style'))
                            .some(s => (s.textContent || '') === css);
        if (!exists) {
          const newStyle = document.createElement('style');
          newStyle.textContent = css;
          document.head.appendChild(newStyle);
        }
      });
      // --- Ende Styles übernehmen ---

      // Inhalt einsetzen (main bevorzugen, fallback body)
      const source = doc.querySelector('main') || doc.body;
      content.innerHTML = source.innerHTML;

      // Titel anpassen, wenn vorhanden
      const newTitle = doc.querySelector('title');
      if (newTitle) document.title = newTitle.textContent;

      if (push) history.pushState({ url }, '', url);
    } catch (err) {
      content.innerHTML = '<div class="p-4"><h2>Fehler</h2><p>Seite konnte nicht geladen werden.</p></div>';
      console.error('loadPage error:', err);
    }
  }

  // Links mit Klasse .ajax-link behandeln
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a.ajax-link');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    e.preventDefault();
    loadPage(href, true);
  });

  // Browser-Zurück/Vorwärts unterstützen
  window.addEventListener('popstate', function (e) {
    const url = e.state && e.state.url;
    if (url) loadPage(url, false);
  });
})();

(function () {
  const content = document.getElementById('content-area');
  if (!content) return;

  async function loadPage(url, push = true) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const text = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      // Styles übernehmen (externe CSS + inline <style>)
      const baseUrl = res.url;
      doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const absHref = new URL(href, baseUrl).href;
        const already = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
                             .some(l => l.href === absHref);
        if (!already) {
          const newLink = document.createElement('link');
          newLink.rel = 'stylesheet';
          newLink.href = absHref;
          document.head.appendChild(newLink);
        }
      });
      doc.querySelectorAll('style').forEach(style => {
        const css = style.textContent || '';
        const exists = Array.from(document.querySelectorAll('style'))
                            .some(s => (s.textContent || '') === css);
        if (!exists) {
          const newStyle = document.createElement('style');
          newStyle.textContent = css;
          document.head.appendChild(newStyle);
        }
      });

      // Inhalt einsetzen (main bevorzugen, fallback body)
      const source = doc.querySelector('main') || doc.body;
      content.innerHTML = source.innerHTML;

      // Titel anpassen, wenn vorhanden
      const newTitle = doc.querySelector('title');
      if (newTitle) document.title = newTitle.textContent;

      if (push) history.pushState({ url }, '', url);
    } catch (err) {
      content.innerHTML = '<div class="p-4"><h2>Fehler</h2><p>Seite konnte nicht geladen werden.</p></div>';
      console.error('loadPage error:', err);
    }
  }

  // Links mit Klasse .ajax-link behandeln
  document.addEventListener('click', function (e) {
    const a = e.target.closest('a.ajax-link');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    e.preventDefault();
    loadPage(href, true);
  });

  // Browser-Zurück/Vorwärts unterstützen
  window.addEventListener('popstate', function (e) {
    const url = e.state && e.state.url;
    if (url) loadPage(url, false);
  });

  // ----- Initiale Seite laden: Sleep Optimizer -----
  // Lädt nur automatisch, wenn index (Start) aufgerufen wird.
  const defaultPage = '../pages/sleep-optimizer.html';
  const path = window.location.pathname.toLowerCase();
  if (path.endsWith('index.html') || path.endsWith('/') || path.endsWith('\\')) {
    loadPage(defaultPage, true);
  }
})();
const switcher = document.getElementById("modeSwitcher");

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
  document.body.classList.add('dark');
  switcher.textContent = "🌙"; // Dark Mode
} else {
  switcher.textContent = "☀️"; // Light Mode
}

switcher.addEventListener("click", () => {
  // Start Animation
  switcher.style.transform = "scale(0.8) rotate(90deg)";
  switcher.style.opacity = "0.6";

  setTimeout(() => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      switcher.textContent = "🌙"; // Dark Mode
    } else {
      switcher.textContent = "☀️"; // Light Mode
    }

    // Save theme preference
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');

    // Zurück zur normalen Position
    switcher.style.transform = "scale(1) rotate(0deg)";
    switcher.style.opacity = "1";
  }, 250);
});