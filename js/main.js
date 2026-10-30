/* Taller Costa Brava — interacciones de la web */
(function () {
  "use strict";

  var TZ = "Europe/Madrid";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================================================
     Utilidades de fecha/hora en horario de Madrid
     (el indicador de "abierto" no debe depender del reloj
     del visitante: alguien conectado desde otro país vería
     un estado equivocado)
     ========================================================= */
  var DAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  var DAY_NAME = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

  // Franjas de apertura en minutos desde medianoche
  var SCHEDULE = {
    0: [],
    1: [[540, 780], [900, 1140]],
    2: [[540, 780], [900, 1140]],
    3: [[540, 780], [900, 1140]],
    4: [[540, 780], [900, 1140]],
    5: [[540, 780], [900, 1140]],
    6: [[540, 780]]
  };

  function hhmm(mins) {
    var h = Math.floor(mins / 60);
    var m = mins % 60;
    return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
  }

  function madridNow() {
    try {
      var fmt = new Intl.DateTimeFormat("en-GB", {
        timeZone: TZ, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
      });
      var parts = fmt.formatToParts(new Date());
      var get = function (type) {
        for (var i = 0; i < parts.length; i++) if (parts[i].type === type) return parts[i].value;
        return null;
      };
      var day = DAY_INDEX[get("weekday")];
      var hour = parseInt(get("hour"), 10) % 24;
      var minute = parseInt(get("minute"), 10);
      if (typeof day === "number" && !isNaN(hour) && !isNaN(minute)) {
        return { day: day, mins: hour * 60 + minute };
      }
    } catch (e) { /* navegador sin soporte de zonas horarias */ }
    var d = new Date();
    return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
  }

  function isOpenAt(day, mins) {
    var slots = SCHEDULE[day] || [];
    for (var i = 0; i < slots.length; i++) {
      if (mins >= slots[i][0] && mins < slots[i][1]) return slots[i];
    }
    return null;
  }

  function nextOpening(day, mins) {
    for (var d = 0; d < 8; d++) {
      var dayIdx = (day + d) % 7;
      var slots = SCHEDULE[dayIdx] || [];
      for (var i = 0; i < slots.length; i++) {
        if (d === 0 && slots[i][0] <= mins) continue;
        var when = d === 0 ? "hoy" : (d === 1 ? "mañana" : "el " + DAY_NAME[dayIdx]);
        return when + " a las " + hhmm(slots[i][0]);
      }
    }
    return null;
  }

  /* ----- Año del footer ----- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(madridYear());

  function madridYear() {
    try {
      return parseInt(new Intl.DateTimeFormat("en-GB", { timeZone: TZ, year: "numeric" }).format(new Date()), 10);
    } catch (e) { return new Date().getFullYear(); }
  }

  /* ----- Sombra del header al hacer scroll ----- */
  var header = document.getElementById("header");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 10) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ----- Menú móvil ----- */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  if (burger && nav) {
    var setMenu = function (open) {
      nav.classList.toggle("open", open);
      burger.classList.toggle("active", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    };
    burger.addEventListener("click", function () {
      setMenu(!nav.classList.contains("open"));
    });
    Array.prototype.forEach.call(nav.querySelectorAll("a"), function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        setMenu(false);
        burger.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("open")) return;
      if (header && header.contains(e.target)) return;
      setMenu(false);
    });
    // Si se pasa a escritorio con el menú abierto, se cierra
    var desktopQuery = window.matchMedia("(min-width: 861px)");
    var onChange = function (mq) { if (mq.matches) setMenu(false); };
    if (desktopQuery.addEventListener) desktopQuery.addEventListener("change", onChange);
    else if (desktopQuery.addListener) desktopQuery.addListener(onChange);
  }

  /* ----- Animaciones de aparición ----- */
  var revealEls = document.querySelectorAll(".reveal");
  var showAll = function () {
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add("visible"); });
  };
  if (reduceMotion || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    Array.prototype.forEach.call(revealEls, function (el) { io.observe(el); });
    // Red de seguridad: el contenido nunca debe quedarse invisible
    window.setTimeout(showAll, 4000);
  }

  /* ----- Formulario de cita → WhatsApp ----- */
  var form = document.getElementById("form-cita");
  if (form) {
    var status = document.getElementById("form-status");
    var get = function (id) { return document.getElementById(id); };

    // Fecha mínima: hoy en Madrid
    var fecha = get("fecha");
    if (fecha) {
      try {
        fecha.min = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
      } catch (e) {
        var hoy = new Date();
        fecha.min = hoy.getFullYear() + "-" +
          String(hoy.getMonth() + 1).padStart(2, "0") + "-" +
          String(hoy.getDate()).padStart(2, "0");
      }
    }

    var setError = function (input, message) {
      var box = get("error-" + input.id);
      if (message) {
        input.setAttribute("aria-invalid", "true");
        if (box) box.textContent = message;
      } else {
        input.removeAttribute("aria-invalid");
        if (box) box.textContent = "";
      }
    };

    var checks = [
      {
        id: "nombre",
        test: function (v) { return v.length >= 2; },
        message: "Escribe tu nombre para que sepamos quién eres."
      },
      {
        id: "telefono",
        test: function (v) { return /^[+0-9][0-9\s().-]{6,}$/.test(v); },
        message: "Necesitamos un teléfono válido (mínimo 7 dígitos)."
      },
      {
        id: "servicio",
        test: function (v) { return v !== ""; },
        message: "Elige el servicio que necesitas."
      }
    ];

    // Al corregir un campo, se limpia su error
    Array.prototype.forEach.call(checks, function (check) {
      var el = get(check.id);
      if (!el) return;
      var clear = function () { if (el.getAttribute("aria-invalid") === "true") setError(el, ""); };
      el.addEventListener("input", clear);
      el.addEventListener("change", clear);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstInvalid = null;

      Array.prototype.forEach.call(checks, function (check) {
        var el = get(check.id);
        if (!el) return;
        var value = (el.value || "").trim();
        var ok = check.test(value);
        setError(el, ok ? "" : check.message);
        if (!ok && !firstInvalid) firstInvalid = el;
      });

      if (firstInvalid) {
        if (status) status.textContent = "Revisa los campos marcados antes de enviar.";
        firstInvalid.focus();
        return;
      }

      var nombre = get("nombre").value.trim();
      var telefono = get("telefono").value.trim();
      var servicio = get("servicio").value;
      var fechaVal = fecha ? fecha.value : "";
      var mensaje = get("mensaje").value.trim();

      var lineas = [
        "Hola Taller Costa Brava, quiero pedir cita.",
        "*Nombre:* " + nombre,
        "*Teléfono:* " + telefono,
        "*Servicio:* " + servicio
      ];
      if (fechaVal) lineas.push("*Fecha preferida:* " + fechaVal);
      if (mensaje) lineas.push("*Comentario:* " + mensaje);

      var url = "https://wa.me/34673210478?text=" + encodeURIComponent(lineas.join("\n"));
      var win = window.open(url, "_blank", "noopener");

      if (status) {
        status.textContent = win
          ? "Abriendo WhatsApp con tu solicitud…"
          : "No hemos podido abrir WhatsApp. Escríbenos al 673 21 04 78.";
      }
    });
  }

  /* ----- Indicador "abierto ahora / cerrado" ----- */
  var openNow = document.getElementById("open-now");
  if (openNow) {
    var now = madridNow();
    var slot = isOpenAt(now.day, now.mins);
    if (slot) {
      openNow.textContent = "● Abiertos ahora · hasta las " + hhmm(slot[1]);
      openNow.classList.add("open");
    } else {
      var next = nextOpening(now.day, now.mins);
      openNow.textContent = "● Cerrado ahora · abre " + (next || "próximamente");
      openNow.classList.add("closed");
    }
  }

  /* ----- Mapa de Google con consentimiento ----- */
  var mapBox = document.getElementById("map-box");
  var mapLoad = document.getElementById("map-load");
  if (mapBox && mapLoad) {
    mapLoad.addEventListener("click", function () {
      var src = mapBox.getAttribute("data-map-src");
      if (!src) return;
      var iframe = document.createElement("iframe");
      iframe.title = "Mapa de ubicación de Taller Costa Brava";
      iframe.src = src;
      iframe.loading = "lazy";
      iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
      iframe.setAttribute("allowfullscreen", "");
      mapBox.textContent = "";
      mapBox.appendChild(iframe);
    });
  }
})();
