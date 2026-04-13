/*!
 * Start Bootstrap - Simple Sidebar v6.0.6 (https://startbootstrap.com/template/simple-sidebar)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-simple-sidebar/blob/master/LICENSE)
 */
//
// Scripts
//

window.addEventListener("DOMContentLoaded", (event) => {
  // Toggle the side navigation (falls #sidebarToggle vorhanden)
  const sidebarToggle = document.body.querySelector("#sidebarToggle");
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", (event) => {
      event.preventDefault();
      document.getElementById("wrapper").classList.toggle("toggled");
    });
  }

  // Sidebar links -> Tabs
  const sidebarItems = document.querySelectorAll("#sidebar-items .list-group-item");
  const panes = document.querySelectorAll("#tab-content .tab-pane");
  function showPane(id) {
    panes.forEach(p => {
      if (p.id === id) {
        p.hidden = false;
        p.classList.add("active");
      } else {
        p.hidden = true;
        p.classList.remove("active");
      }
    });
  }
  sidebarItems.forEach(item => {
    item.addEventListener("click", (e) => {
      const tgt = item.getAttribute("data-target");
      if (tgt && tgt.startsWith("#")) {
        showPane(tgt.replace('#',''));
        // mark active in sidebar
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        // close sidebar on small screens
        if (window.innerWidth < 768) document.getElementById("wrapper").classList.add("toggled");
      }
    });
  });
  // activate first pane if present
  if (sidebarItems.length && sidebarItems[0].getAttribute("data-target")) {
    sidebarItems[0].click();
  }

  // Schlaf-Check: Logik
  const btn = document.getElementById("check-run");
  const reset = document.getElementById("check-reset");
  if (btn) {
    btn.addEventListener("click", () => {
      const hours = parseInt(document.getElementById("q-sleep-hours").value, 10);
      const fall = parseInt(document.getElementById("q-fall-asleep").value, 10);
      const nl = parseInt(document.getElementById("q-noise-light").value, 10);
      const mat = parseInt(document.getElementById("q-mattress").value, 10);
      const caf = parseInt(document.getElementById("q-caffeine").value, 10);
      const stress = parseInt(document.getElementById("q-stress").value, 10);

      // einfacher Score (höher = besser)
      const score = hours + fall + (2 - nl) + mat + (2 - caf) + stress;
      const resultEl = document.getElementById("check-result");
      let advice = [];

      // Schlafdauer
      if (hours <= 1) advice.push("Versuche 7–9 Stunden Schlaf zu erreichen; feste Schlafzeiten helfen.");
      else if (hours === 2) advice.push("Etwas wenig Schlaf — kurze Abendroutine und früheres Zubettgehen prüfen.");
      else if (hours === 3) advice.push("Gute Schlafdauer. Achte auf Regelmäßigkeit.");

      // Einschlafen
      if (fall <= 1) advice.push("Einschlafschwierigkeiten: reduziere Bildschirmzeit 60 min vor dem Schlafen, probiere Atemübungen.");
      // Lärm / Licht
      if (nl === 0) advice.push("Starker Licht-/Lärmpegel: Ohrstöpsel, Verdunkelungsvorhänge oder leise Geräte helfen.");
      // Matratze
      if (mat <= 1) advice.push("Matratze nicht ideal: ergonomische Anpassung oder Beratung probieren.");
      // Koffein
      if (caf === 0) advice.push("Koffein häufig am Abend: vermeide es ab 14–16 Uhr.");
      // Stress
      if (stress <= 1) advice.push("Hoher Stress abends: kurzes Journaling oder Entspannungsübung vor dem Schlafen.");

      // Priorisierte Tipps (max 5)
      const final = advice.slice(0,5);
      let html = `<strong>Ergebnis:</strong> Score ${score} / 15<br/><ul>`;
      final.forEach(t => html += `<li>${t}</li>`);
      html += "</ul>";
      if (advice.length === 0) html += "<p>Sieht gut aus — weiter so!</p>";
      resultEl.innerHTML = html;
      resultEl.scrollIntoView({behavior:'smooth', block:'nearest'});
    });
  }
  if (reset) {
    reset.addEventListener("click", () => {
      document.querySelectorAll('#tab-questionnaire select').forEach(s => s.selectedIndex = 0);
      document.getElementById('check-result').innerHTML = '';
    });
  }
});

// Sidebar toggle + Sidebar -> Tab bridge

(function () {
  const wrapper = document.getElementById("wrapper");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebarItems = document.querySelectorAll(
    "#sidebar-items .list-group-item",
  );
  const panes = document.querySelectorAll("#tab-content .tab-pane");

  // Sidebar ein/ausblenden (responsive)
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", function (e) {
      e.preventDefault();
      wrapper.classList.toggle("toggled");
      // body lock für mobile
      if (window.innerWidth < 768) {
        document.body.classList.toggle("showing-sidebar");
      }
    });
  }

  // Hilfsfunktion: set active pane
  function showPane(targetId) {
    panes.forEach((p) => {
      if (p.id === targetId) {
        p.classList.add("active");
        p.removeAttribute("hidden");
      } else {
        p.classList.remove("active");
        p.setAttribute("hidden", "");
      }
    });
  }

  // Sidebar links -> zeige die richtige Pane
  sidebarItems.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      // set active styling
      sidebarItems.forEach((i) => i.classList.remove("active"));
      link.classList.add("active");

      const target = link.getAttribute("data-target");
      if (target) {
        showPane(target);
      }

      // auf mobilen Geräten Sidebar nach Klick schließen
      if (window.innerWidth < 768) {
        wrapper.classList.remove("toggled");
        document.body.classList.remove("showing-sidebar");
      }
    });
  });

  // Initial: aktiviere ersten Link / Pane
  if (sidebarItems.length > 0) {
    sidebarItems[0].classList.add("active");
    const tgt = sidebarItems[0].getAttribute("data-target");
    if (tgt) showPane(tgt);
  }
})();

