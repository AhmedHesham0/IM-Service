// IM Service Center — shared front-end behavior
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "201003253641"; // international format, no leading 0 / +

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  var scrim = document.querySelector(".nav-scrim");
  var navClose = document.querySelector(".nav-close");

  function openNav() {
    nav && nav.classList.add("is-open");
    scrim && scrim.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeNav() {
    nav && nav.classList.remove("is-open");
    scrim && scrim.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  toggle && toggle.addEventListener("click", function () {
    nav && nav.classList.contains("is-open") ? closeNav() : openNav();
  });
  scrim && scrim.addEventListener("click", closeNav);
  navClose && navClose.addEventListener("click", closeNav);
  document.querySelectorAll(".main-nav a").forEach(function (a) {
    a.addEventListener("click", closeNav);
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector(".site-header");
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Back to top ---------- */
  var topBtn = document.querySelector(".top-float");
  function onScrollTop() {
    if (!topBtn) return;
    topBtn.classList.toggle("show", window.scrollY > 480);
  }
  onScrollTop();
  window.addEventListener("scroll", onScrollTop, { passive: true });
  topBtn && topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Mark active nav link ---------- */
  var path = window.location.pathname.replace(/\/index\.html$/, "/");
  document.querySelectorAll(".main-nav a[href]").forEach(function (a) {
    var href = a.getAttribute("href");
    if (!href) return;
    var normalized = href.replace(/\/index\.html$/, "/");
    if (normalized === path || (path === "/" && normalized === "index.html")) {
      a.classList.add("active");
    }
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Count-up stats ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = el.getAttribute("data-decimals") ? parseInt(el.getAttribute("data-decimals"), 10) : 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var start = null;

    function toArabicDigits(str) {
      var map = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"];
      return str.replace(/[0-9]/g, function (d) { return map[+d]; });
    }

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = (target * eased).toFixed(decimals);
      el.textContent = toArabicDigits(value) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Skill bars ---------- */
  var skillBars = document.querySelectorAll(".skill-bar");
  if ("IntersectionObserver" in window && skillBars.length) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var pct = entry.target.getAttribute("data-pct") || "0";
          entry.target.style.width = pct + "%";
          sio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    skillBars.forEach(function (el) { sio.observe(el); });
  }

  /* ---------- Testimonials carousel ---------- */
  var testiWrap = document.querySelector(".testi-wrap");
  if (testiWrap) {
    var slides = testiWrap.querySelectorAll(".testi-slide");
    var track = testiWrap.querySelector(".testi-slides");
    var dotsWrap = testiWrap.querySelector(".testi-nav");
    var prevBtn = testiWrap.querySelector(".testi-arrow.prev");
    var nextBtn = testiWrap.querySelector(".testi-arrow.next");
    var index = 0;
    var timer = null;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "testi-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", "شهادة رقم " + (i + 1));
      dot.addEventListener("click", function () { goTo(i); restart(); });
      dotsWrap && dotsWrap.appendChild(dot);
    });

    function render() {
      // .testi-slides is forced direction:ltr so physical translate math stays standard
      track.style.transform = "translateX(" + (-index * 100) + "%)";
      dotsWrap && dotsWrap.querySelectorAll(".testi-dot").forEach(function (d, i) {
        d.classList.toggle("active", i === index);
      });
    }
    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }
    function restart() {
      clearInterval(timer);
      timer = setInterval(next, 5500);
    }
    nextBtn && nextBtn.addEventListener("click", function () { next(); restart(); });
    prevBtn && prevBtn.addEventListener("click", function () { prev(); restart(); });
    testiWrap.addEventListener("mouseenter", function () { clearInterval(timer); });
    testiWrap.addEventListener("mouseleave", restart);
    render();
    restart();
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q && q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      item.closest(".faq-list").querySelectorAll(".faq-item.open").forEach(function (openItem) {
        openItem.classList.remove("open");
        openItem.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---------- FAQ category tabs ---------- */
  var faqTabs = document.querySelectorAll(".faq-tab");
  if (faqTabs.length) {
    faqTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        faqTabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
        var group = tab.getAttribute("data-group");
        document.querySelectorAll("[data-faq-group]").forEach(function (el) {
          el.style.display = (group === "all" || el.getAttribute("data-faq-group") === group) ? "" : "none";
        });
      });
    });
  }

  /* ---------- Forms: validate + hand off to WhatsApp ---------- */
  function buildWaLink(text) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
  }

  document.querySelectorAll("form[data-wa-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (field) {
        var wrap = field.closest(".field");
        var ok = field.value.trim().length > 0 && (field.type !== "email" || /^\S+@\S+\.\S+$/.test(field.value));
        if (wrap) wrap.classList.toggle("has-error", !ok);
        if (!ok) valid = false;
      });
      if (!valid) return;

      var parts = [];
      form.querySelectorAll("[name]").forEach(function (field) {
        var value = field.value.trim();
        if (!value) return;
        var label = field.getAttribute("data-label") || field.name;
        parts.push(label + ": " + value);
      });
      var message = form.getAttribute("data-wa-title") + "\n" + parts.join("\n");
      var success = form.parentElement.querySelector(".form-success");
      success && success.classList.add("show");
      window.open(buildWaLink(message), "_blank", "noopener");
      form.reset();
      setTimeout(function () {
        success && success.classList.remove("show");
      }, 8000);
    });

    form.querySelectorAll("[required]").forEach(function (field) {
      field.addEventListener("input", function () {
        var wrap = field.closest(".field");
        wrap && wrap.classList.remove("has-error");
      });
    });
  });

  /* ---------- Loyalty points lookup (static demo) ---------- */
  var pointsForm = document.querySelector("[data-points-form]");
  if (pointsForm) {
    pointsForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = pointsForm.querySelector("input");
      var result = document.querySelector("[data-points-result]");
      var phone = input.value.trim();
      if (!phone) return;
      if (result) {
        result.style.display = "block";
        result.innerHTML =
          "لعرض رصيدك الفعلي من النقاط، تواصل معنا مباشرة على واتساب وسيقوم فريقنا بإرسال رصيدك فورًا.";
      }
      window.open(
        buildWaLink("مرحبًا، أرغب في الاستعلام عن رصيد نقاط الولاء الخاص برقم: " + phone),
        "_blank",
        "noopener"
      );
    });
  }
})();
