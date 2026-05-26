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

/* --- Gerätedaten: WebSocket (WLAN) + WebUSB (USB) + Simulation --- */
(function () {
  let ws = null;
  let usbDevice = null;
  let simTimer = null;
  let deviceConnected = false; // true wenn echte Verbindung aktiv

  function setStatus(text, ok = true) {
    const el = document.getElementById('device-status');
    if (el) el.textContent = `Status: ${text}`;
    if (ok) el?.classList.remove('text-danger'); else el?.classList.add('text-danger');
  }

  function clearDeviceUI() {
    const el = id => document.getElementById(id);
    if (el('device-temp')) el('device-temp').textContent = '— °C';
    if (el('device-pulse')) el('device-pulse').textContent = '— bpm';
    if (el('device-hum')) el('device-hum').textContent = '— %';
    if (el('device-batt')) el('device-batt').textContent = '— %';
    if (el('device-ts')) el('device-ts').textContent = '—';
  }

  function updateUI(data) {
    // nur aktualisieren, wenn echtes Gerät verbunden
    if (!deviceConnected) return;
    if (!data) return;
    if (data.temp != null && document.getElementById('device-temp')) document.getElementById('device-temp').textContent = `${data.temp.toFixed(1)} °C`;
    if (data.pulse != null && document.getElementById('device-pulse')) document.getElementById('device-pulse').textContent = `${Math.round(data.pulse)} bpm`;
    if (data.hum != null && document.getElementById('device-hum')) document.getElementById('device-hum').textContent = `${Math.round(data.hum)} %`;
    if (data.batt != null && document.getElementById('device-batt')) document.getElementById('device-batt').textContent = `${Math.round(data.batt)} %`;
    if (data.ts && document.getElementById('device-ts')) document.getElementById('device-ts').textContent = new Date(data.ts).toLocaleString();
  }

  // WebSocket Verbindung (für WLAN-Uhr / Device)
  async function connectWebSocket(url) {
    try {
      if (ws) { ws.close(); ws = null; deviceConnected = false; }
      setStatus('verbinde...');
      ws = new WebSocket(url);
      ws.addEventListener('open', () => {
        deviceConnected = true;
        setStatus('verbunden');
      });
      ws.addEventListener('message', (ev) => {
        try {
          const payload = JSON.parse(ev.data);
          updateUI(payload);
        } catch (e) {
          console.error('Ungültiges Gerätedaten‑Format', e);
        }
      });
      ws.addEventListener('close', () => {
        deviceConnected = false;
        setStatus('verbindung geschlossen', false);
        clearDeviceUI();
      });
      ws.addEventListener('error', () => {
        deviceConnected = false;
        setStatus('Verbindungsfehler', false);
      });
    } catch (err) {
      console.error(err);
      deviceConnected = false;
      setStatus('Fehler beim Verbinden', false);
    }
  }

  // WebUSB Beispiel (Browser-Unterstützung erforderlich)
  async function connectUSB() {
    if (!navigator.usb) {
      setStatus('WebUSB nicht verfügbar im Browser', false);
      return;
    }
    try {
      setStatus('USB: Gerät wählen...');
      usbDevice = await navigator.usb.requestDevice({ filters: [] }); // filter anpassen
      await usbDevice.open();
      if (usbDevice.configuration === null) await usbDevice.selectConfiguration(1);
      // Interface/Endpoint hier anpassen je nach Gerät
      // Beispiel: await usbDevice.claimInterface(0);
      deviceConnected = true;
      setStatus(`USB: verbunden (${usbDevice.productName || usbDevice.vendorId})`);
      // Lese-/Schreibrate implementieren je nach Gerät; hier nur Platzhalter
    } catch (e) {
      console.error(e);
      deviceConnected = false;
      setStatus('USB-Verbindung abgebrochen', false);
      clearDeviceUI();
    }
  }

  // Simulation: nur erlaubt wenn echtes Gerät verbunden ist
  function startSimulation() {
    if (!deviceConnected) {
      setStatus('Simulation nur möglich, wenn eine Uhr verbunden ist', false);
      return;
    }
    stopSimulation(); // sicherstellen, dass kein Timer doppelt läuft
    setStatus('Simulation läuft');
    simTimer = setInterval(() => {
      const now = Date.now();
      updateUI({
        temp: 18 + Math.random() * 6,
        pulse: 55 + Math.random() * 40,
        hum: 35 + Math.random() * 30,
        batt: 40 + Math.random() * 60,
        ts: now
      });
    }, 1500);
  }
  function stopSimulation() {
    if (simTimer) { clearInterval(simTimer); simTimer = null; }
    setStatus('Simulation gestoppt');
    // NICHT deviceConnected auf false setzen oder UI leeren — echte Verbindung bleibt bestehen
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('device-ws-connect')?.addEventListener('click', () => {
      const url = (document.getElementById('device-ws-url') || {}).value || '';
      if (!url) { setStatus('Bitte WebSocket-URL eingeben', false); return; }
      connectWebSocket(url);
    });
    document.getElementById('device-usb-connect')?.addEventListener('click', () => {
      connectUSB();
    });
    document.getElementById('device-simulate')?.addEventListener('click', () => {
      if (!deviceConnected) {
        setStatus('Bitte zuerst Uhr verbinden (WLAN oder USB)', false);
        return;
      }
      if (simTimer) { stopSimulation(); } else startSimulation();
    });

    // sauber schließen beim Tabwechsel / Seite verlassen
    window.addEventListener('beforeunload', () => { if (ws) ws.close(); stopSimulation(); });
  });
})();