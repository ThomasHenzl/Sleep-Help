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

/* --- Gerätedaten: WebSocket/WebUSB + Verlauf (localStorage) --- */
(function () {
  const STORAGE_KEY = 'sleep-help-device-history';
  const CONFIG_URL = 'json/config.json';
  let ws = null;
  let usbDevice = null;
  let simTimer = null;
  let deviceConnected = false;
  let maxEntries = 500;

  // lade maxEntries aus config.json falls verfügbar
  (async function loadConfig(){
    try {
      const res = await fetch(CONFIG_URL, { cache: "no-store" });
      if (res.ok) {
        const cfg = await res.json();
        maxEntries = (cfg?.deviceHistory?.maxEntries) || maxEntries;
      }
    } catch(e){ /* ignore */ }
  })();

  function setStatus(text, ok = true) {
    const el = document.getElementById('device-status');
    if (el) el.textContent = `Status: ${text}`;
    if (ok) el?.classList.remove('text-danger'); else el?.classList.add('text-danger');
  }

  function clearDeviceUI() {
    ['device-temp','device-pulse','device-hum','device-batt','device-ts'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (id === 'device-ts') el.textContent = '—';
      else if (id === 'device-temp') el.textContent = '— °C';
      else if (id === 'device-pulse') el.textContent = '— bpm';
      else if (id === 'device-hum') el.textContent = '— %';
      else if (id === 'device-batt') el.textContent = '— %';
    });
  }

  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) { return []; }
  }
  function saveHistory(arr) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch (e) { console.error(e); }
  }

  function pushMeasurement(rec) {
    // rec sollte { temp, pulse, hum, batt, ts }
    if (!rec || typeof rec !== 'object') return;
    const
    hist = loadHistory();
    hist.unshift(rec); // neu oben
    if (hist.length > maxEntries) hist.length = maxEntries;
    saveHistory(hist);
    renderHistory();
  }

  function renderHistory() {
    const body = document.getElementById('device-history-body');
    const countEl = document.getElementById('device-history-count');
    if (!body || !countEl) return;
    const hist = loadHistory();
    body.innerHTML = '';
    hist.slice(0, 200).forEach(item => {
      const tr = document.createElement('tr');
      const ts = item.ts ? new Date(item.ts).toLocaleString() : '-';
      tr.innerHTML = `<td class="align-middle small">${ts}</td>
                      <td class="align-middle">${item.temp!=null?item.temp.toFixed(1)+' °C':'—'}</td>
                      <td class="align-middle">${item.pulse!=null?Math.round(item.pulse)+' bpm':'—'}</td>
                      <td class="align-middle">${item.hum!=null?Math.round(item.hum)+' %':'—'}</td>
                      <td class="align-middle">${item.batt!=null?Math.round(item.batt)+' %':'—'}</td>`;
      body.appendChild(tr);
    });
    countEl.textContent = `Verlauf: ${hist.length}`;
  }

  function exportHistory() {
    const hist = loadHistory();
    const blob = new Blob([JSON.stringify({ exportedAt: Date.now(), history: hist }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `sleep-help-history-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function importHistoryFile(file) {
    if (!file) return;
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const data = JSON.parse(fr.result);
        const hist = Array.isArray(data) ? data : (Array.isArray(data.history) ? data.history : null);
        if (!hist) { setStatus('Import: ungültiges Format', false); return; }
        // einfacher Validierungsfilter
        const valid = hist.filter(h => h && h.ts);
        saveHistory(valid.slice(0, maxEntries));
        renderHistory();
        setStatus('Import erfolgreich');
      } catch (e) {
        console.error(e);
        setStatus('Import fehlgeschlagen', false);
      }
    };
    fr.readAsText(file);
  }

  function updateUI(data) {
    if (!deviceConnected) return;
    if (!data) return;
    if (data.temp != null && document.getElementById('device-temp')) document.getElementById('device-temp').textContent = `${data.temp.toFixed(1)} °C`;
    if (data.pulse != null && document.getElementById('device-pulse')) document.getElementById('device-pulse').textContent = `${Math.round(data.pulse)} bpm`;
    if (data.hum != null && document.getElementById('device-hum')) document.getElementById('device-hum').textContent = `${Math.round(data.hum)} %`;
    if (data.batt != null && document.getElementById('device-batt')) document.getElementById('device-batt').textContent = `${Math.round(data.batt)} %`;
    if (data.ts && document.getElementById('device-ts')) document.getElementById('device-ts').textContent = new Date(data.ts).toLocaleString();

    // Verlauf speichern (nur wenn verbunden)
    if (deviceConnected) {
      pushMeasurement({
        temp: data.temp != null ? Number(data.temp) : null,
        pulse: data.pulse != null ? Number(data.pulse) : null,
        hum: data.hum != null ? Number(data.hum) : null,
        batt: data.batt != null ? Number(data.batt) : null,
        ts: data.ts || Date.now()
      });
    }
  }

  /* WebSocket / WebUSB / Simulation (wie zuvor) */
  async function connectWebSocket(url) {
    try {
      if (ws) { ws.close(); ws = null; deviceConnected = false; }
      setStatus('verbinde...');
      ws = new WebSocket(url);
      ws.addEventListener('open', () => {
        deviceConnected = true;
        setStatus('verbunden');
        renderHistory();
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

  async function connectUSB() {
    if (!navigator.usb) {
      setStatus('WebUSB nicht verfügbar im Browser', false);
      return;
    }
    try {
      setStatus('USB: Gerät wählen...');
      usbDevice = await navigator.usb.requestDevice({ filters: [] });
      await usbDevice.open();
      if (usbDevice.configuration === null) await usbDevice.selectConfiguration(1);
      deviceConnected = true;
      setStatus(`USB: verbunden (${usbDevice.productName || usbDevice.vendorId})`);
      renderHistory();
    } catch (e) {
      console.error(e);
      deviceConnected = false;
      setStatus('USB-Verbindung abgebrochen', false);
      clearDeviceUI();
    }
  }

  function startSimulation() {
    if (!deviceConnected) { 
      setStatus('Simulation nur möglich, wenn eine Uhr verbunden ist', false);
      return;
    }
    stopSimulation();
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
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('device-ws-connect')?.addEventListener('click', () => {
      const url = (document.getElementById('device-ws-url') || {}).value || '';
      if (!url) { setStatus('Bitte WebSocket-URL eingeben', false); return; }
      connectWebSocket(url);
    });
    document.getElementById('device-usb-connect')?.addEventListener('click', () => connectUSB());
    document.getElementById('device-simulate')?.addEventListener('click', () => {
      if (!deviceConnected) { setStatus('Bitte zuerst Uhr verbinden (WLAN oder USB)', false); return; }
      if (simTimer) stopSimulation(); else startSimulation();
    });

    // Export / Import / Clear / Render initial
    document.getElementById('device-export')?.addEventListener('click', exportHistory);
    document.getElementById('device-import-btn')?.addEventListener('click', () => document.getElementById('device-import-file')?.click());
    document.getElementById('device-import-file')?.addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (f) importHistoryFile(f);
      e.target.value = '';
    });
    document.getElementById('device-history-clear')?.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      renderHistory();
      setStatus('Verlauf gelöscht');
      clearDeviceUI();
    });

    renderHistory();
    window.addEventListener('beforeunload', () => { if (ws) ws.close(); stopSimulation(); });
  });
})();