/* Taller Costa Brava — interacciones de la web */

(function () {
  "use strict";

  /* ----- Año dinámico en el footer ----- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----- Sombra del header al hacer scroll ----- */
  var header = document.getElementById("header");
  function onScroll() {
    if (window.scrollY > 10) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----- Menú móvil ----- */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.classList.toggle("active", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.classList.remove("active");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ----- Animaciones al hacer scroll ----- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("visible"); });
  }

  /* ----- Fecha mínima del formulario: hoy ----- */
  var fecha = document.getElementById("fecha");
  if (fecha) {
    var hoy = new Date();
    var iso = hoy.getFullYear() + "-" +
      String(hoy.getMonth() + 1).padStart(2, "0") + "-" +
      String(hoy.getDate()).padStart(2, "0");
    fecha.min = iso;
  }

  /* ----- Formulario de cita → WhatsApp ----- */
  var form = document.getElementById("form-cita");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = document.getElementById("nombre").value.trim();
      var telefono = document.getElementById("telefono").value.trim();
      var servicio = document.getElementById("servicio").value;
      var fechaVal = document.getElementById("fecha").value;
      var mensaje = document.getElementById("mensaje").value.trim();

      if (!nombre || !telefono || !servicio) {
        alert("Por favor, rellena al menos tu nombre, teléfono y el servicio que necesitas.");
        return;
      }

      var texto = "Hola Taller Costa Brava, quiero pedir cita.%0A" +
        "*Nombre:* " + encodeURIComponent(nombre) + "%0A" +
        "*Teléfono:* " + encodeURIComponent(telefono) + "%0A" +
        "*Servicio:* " + encodeURIComponent(servicio) + "%0A" +
        (fechaVal ? "*Fecha preferida:* " + encodeURIComponent(fechaVal) + "%0A" : "") +
        (mensaje ? "*Comentario:* " + encodeURIComponent(mensaje) : "");

      window.open("https://wa.me/34673210478?text=" + texto, "_blank", "noopener");
    });
  }

  /* ----- Indicador "abierto ahora / cerrado" según horario ----- */
  var openNow = document.getElementById("open-now");
  if (openNow) {
    var now = new Date();
    var day = now.getDay();            // 0 = domingo
    var mins = now.getHours() * 60 + now.getMinutes();
    var isOpen = false;

    if (day >= 1 && day <= 5) {
      isOpen = (mins >= 540 && mins < 780) || (mins >= 900 && mins < 1140); // 9-13 / 15-19
    } else if (day === 6) {
      isOpen = (mins >= 540 && mins < 780);                                // 9-13
    }

    openNow.textContent = isOpen
      ? "● Abiertos ahora mismo — ¡te esperamos!"
      : "● Cerrados ahora — pide cita y te confirmamos la hora.";
    openNow.classList.add(isOpen ? "open" : "closed");
  }
})();
