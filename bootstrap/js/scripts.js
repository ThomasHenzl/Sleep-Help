/*!
 * Start Bootstrap - Simple Sidebar v6.0.6 (https://startbootstrap.com/template/simple-sidebar)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-simple-sidebar/blob/master/LICENSE)
 */
//
// Scripts
//

window.addEventListener("DOMContentLoaded", (event) => {
  // Toggle the side navigation
  const sidebarToggle = document.body.querySelector("#sidebarToggle");
  if (sidebarToggle) {
    // Uncomment Below to persist sidebar toggle between refreshes
    // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
    //     document.body.classList.toggle('sb-sidenav-toggled');
    // }
    sidebarToggle.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.toggle("sb-sidenav-toggled");
      localStorage.setItem(
        "sb|sidebar-toggle",
        document.body.classList.contains("sb-sidenav-toggled"),
      );
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

