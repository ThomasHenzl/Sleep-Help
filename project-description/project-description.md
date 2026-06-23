# Projekt: Sleep-Help — vollständige Projektdokumentation

Kurzbeschreibung  
Sleep-Help ist ein kleines IoT‑System zur Erfassung und Visualisierung von Schlaf‑ und Vitaldaten einer Smartwatch. Die Smartwatch sendet Sensordaten (Puls, Körpertemperatur, Schrittzahl, Herzfrequenzverlauf, Sleep‑Tracker usw.) per WLAN an einen lokalen JSON‑Server. Eine Web‑Frontend zeigt die Daten live an, speichert Messverläufe und bietet Analyse‑/Visualisierungsfunktionen.

Ziele
- Echtzeit‑Anzeige von Sensordaten (Dashboard)
- Lokaler JSON‑Server als einfaches Backend (REST API, speichert in db.json)
- Speicherung und Versionierung der letzten Messungen (History)
- Dark/Light Theme, Geräte‑Tab mit Verbindung über WebSocket/HTTP/WebUSB
- Erweiterte Messungen: Herzfrequenzverlauf und Sleep‑Tracker‑Daten

Architektur (komponenten)
1. Smartwatch (Firmware)
   - Liest Sensoren (Puls, Herzfrequenz, Temperatur, Schritte, Bewegungssensor)
   - Sendet JSON‑Payloads per HTTP POST oder WebSocket an den JSON‑Server
   - Beispiel‑Payload:
     { "pulse":78, "temperature":36.5, "steps":4210, "heartRate": {...}, "sleep": {...} }

2. JSON‑Server / Backend (lokal auf PC)
   - Stellt REST‑API bereit (z. B. POST /api/readings, GET /api/latest, GET /api/history)
   - Speichert Daten in bootstrap/json/db.json oder in einer kleinen DB‑Datei
   - Optional: json-server oder Express‑Server mit Datei‑Storage
   - Konfigurierbar per bootstrap/json/config.json (z. B. maxHistoryEntries)

3. Website / Frontend
   - Statische Seite (bootstrap/index.html + css + js)
   - Holt Daten per fetch() (HTTP polling) oder WebSocket und zeigt sie in Gerätetab an
   - Speichert Verlauf lokal (localStorage) und bietet Export/Import
   - UI‑Features: Theme Toggle, Simulation, Verlaufstabelle, Visualisierungen (Bubbles, Night/Morning)

Datenmodell (Beispiele in db.json)
- deviceReadings: Einzelmessungen (timestamp, temp, pulse, humidity, battery)
- heartRate: Zeitreihen (timestamp, bpm, quality)
- sleepTracker: Schlafsitzungen (start, end, stages, avgHR, score)
- steps / calories / distance für Aktivitätsdaten

Wichtige API‑Endpunkte (Beispiel)
- POST /api/readings  — neue Messung senden (Smartwatch → Server)
- GET /api/latest     — letzte Messung (Frontend → Server)
- GET /api/history    — Messverlauf (Frontend → Server)
- POST /api/import    — optionaler Import von Messdaten (Admin)
- GET /api/config     — Konfiguration (z. B. maxEntries)

Laufzeit / Setup (minimal)
- JSON‑Server (mit npm json-server) oder einfacher Express‑Server:
  - db.json als Speicherdatei im Projektordner bootstrap/json/db.json
  - Server lokal starten (z. B. node server/index.js) auf Port 3000
- Smartwatch im gleichen WLAN -> sendet an http://<pc-ip>:3000/api/readings
- Frontend öffnet bootstrap/index.html (lokal oder über einfachen Webserver)

Frontend‑Verhalten
- Polling per fetch() oder WebSocket für Live‑Updates
- UI zeigt keine Werte, wenn keine Uhr verbunden ist (Verbindungsstatus sichtbar)
- Simulation ist nur aktiv, wenn mindestens eine Verbindung besteht (oder optional Admin‑Mode)
- Messungen werden lokal geloggt (localStorage) und können exportiert/importiert werden

Sicherheit & Hinweise
- Lokaler Einsatz: Achte auf CORS‑Konfiguration und Firewall‑Einstellungen
- Für produktive Nutzung Authentifizierung, HTTPS und Datenvalidierung ergänzen
- Datenschutz: persönliche Gesundheitsdaten sensibel behandeln und lokal speichern / verschlüsseln

Weiterentwicklung (nächste Schritte)
- Vollständige Express‑Backend‑Implementierung mit REST‑Validierung und Datei‑Logging
- WebSocket‑Server für Push‑Updates vom Gerät
- Detaillierte Visualisierungen für Herzfrequenzverläufe und Schlafphasen
- Mobile‑first UI‑Optimierung und Barrierefreiheit
- Optional: Datenexport zu CSV / Anonymisierung / Nutzerverwaltung

Kurzreferenz Dateistandorte (im Repo)
- bootstrap/index.html — Frontend‑Einstieg
- bootstrap/css/index.css, styles.css — Styles
- bootstrap/js/scripts.js — Frontend‑Logik (Tabs, Device‑Tab, Theme)
- bootstrap/json/db.json — Server‑Datenbank / Beispielinhalte
- bootstrap/json/config.json — Projektkonfiguration