# Projekt: Sleep-Help — Projektbeschreibung (vollständiger Inhaltsüberblick)

## Kurzbeschreibung
Sleep-Help ist eine responsive, statische Website, die Informationen, Tipps und visuelle Hilfen zum Thema Schlafqualität bereitstellt. Die Projektstruktur ist bewusst schlank gehalten und nutzt HTML/CSS/JS (Bootstrap-CDN) für Layout und Interaktion.

## Ordnerstruktur (im Projektordner)
- bootstrap/
  - index.html — Startseite / Single‑Page-Layout mit Sidebar und Content-Bereich
  - assets/
    - favicon.ico — kleines Icon für Browser-Tab
  - css/
    - index.css — primäres Projektstylesheet (Theme, Layout, Sidebar, Karten, Typografie)
    - styles.css — zusätzliche oder ergänzende Styles (Feinabstimmungen, Erweiterungen)
  - js/
    - scripts.js — kleine Vanilla-JS-Skripte für Sidebar-Toggle, Tab‑Logik und UI-Interaktion

## Detaillierte Beschreibung der Dateien
- index.html
  - Enthält das HTML-Grundgerüst der Seite (doctype, meta, title).
  - Verlinkt Bootstrap via CDN sowie die lokalen CSS-Dateien.
  - Bietet die Sidebar-Navigation, einen Top-Navbar‑Platzhalter und den zentralen Content-Container (.container-fluid).
  - Bindet das lokale JS (js/scripts.js) am Seitenende.

- assets/favicon.ico
  - Favicon für Browser-Tabs / Lesezeichen. Liefert visuelle Identität im Browser.

- css/index.css
  - Hauptstylesheet: definiert Farben, Layout-Variablen, Sidebar-Verhalten, Lesespalte, Karten-Design, Typografie und Responsivität.
  - Enthält Regeln für das Verschieben/Einblenden der Sidebar und das Shiften des Inhaltsbereichs.

- css/styles.css
  - Ergänzende Styles (Utility-Klassen, Feinanpassungen, zusätzliche Komponenten oder thematische Erweiterungen).
  - Dient als Platz für Experimente, alternative Farbvarianten oder zukünftige Komponenten.

- js/scripts.js
  - Verwaltung des Sidebar-Toggles (Ein-/Ausblenden, lokale Speicherung des Zustands).
  - Brücke zwischen Sidebar-Links und Tab-Panes: setzt aktive Klassen und zeigt die zugehörigen Inhalte.
  - Enthält responsive Hilfslogik (z. B. Verhalten auf kleinen Bildschirmen).

## Zielgruppe
- Zielgruppe: Jugendliche und junge Erwachsene, Lehrkräfte und interessierte Laien.

## Ziel
- Dark/Light Mode
- Schlafumgebungs-Check
    - Interaktiver Raum-Check:
        - Temperatur
        - Licht 
        - Lärm
        - Matratze
    - Konkrete Optimierungsvorschläge
- Personalisierter Schlaf-Check
    - Kurzer interaktiver Fragebogen (Schlafdauer, Einschlafzeit, Stresslevel, Koffein etc.)
    - Sofortige Auswertung mit individueller Empfehlung
- Interaktive Nachtwelt(Darkmode)
    - Der Hintergrund ist ein Sternenhimmel und bewegt sich mit der Maus
- Mini-Entspannungs-Spiel im Browser
    - Gedanken-Bubbles platzen lassen
    - Atemspiel (Kreis vergrößert/verkleinert sich)#
- Interaktive Morgenwelt (Lightmode)
    - Sanfter Sonnenaufgang im Hintergrund
    - Wolken bewegen sich langsam
    - Vögel fliegen bei Mausbewegung