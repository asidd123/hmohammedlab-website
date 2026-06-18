/* Mohammed Lab — shared behavior: nav, reveal-on-scroll, hero helix animation */

(function () {
  "use strict";

  /* ----- mobile nav ----- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ----- reveal on scroll ----- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ----- expandable team bios ----- */
  document.querySelectorAll(".bio-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const bio = btn.previousElementSibling;
      const clamped = bio.classList.toggle("clamped");
      btn.textContent = clamped ? "Read more" : "Show less";
      btn.setAttribute("aria-expanded", clamped ? "false" : "true");
    });
  });

  /* ----- footer year ----- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----- hero DNA helix canvas ----- */
  const canvas = document.getElementById("helix");
  if (!canvas) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d");
  let w, h, dpr, raf;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", () => {
    resize();
    if (reduceMotion) draw(0); // setting canvas.width clears the bitmap; repaint the static frame
  });

  const TEAL = [45, 212, 191];
  const VIOLET = [167, 139, 250];
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  /* drifting background particles */
  const particles = Array.from({ length: 56 }, (_, i) => ({
    x: ((i * 173) % 100) / 100,
    y: ((i * 97) % 100) / 100,
    r: 0.8 + ((i * 31) % 10) / 6,
    vx: (((i * 13) % 10) - 5) / 28000,
    vy: (((i * 7) % 10) - 5) / 28000,
    c: i % 3 === 0 ? VIOLET : TEAL,
    a: 0.12 + ((i * 41) % 10) / 45,
  }));

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const time = reduceMotion ? 0 : t * 0.00045;

    /* particles */
    for (const p of particles) {
      p.x = (p.x + p.vx + 1) % 1;
      p.y = (p.y + p.vy + 1) % 1;
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
      ctx.fillStyle = rgba(p.c, p.a);
      ctx.fill();
    }

    /* double helix flowing across the hero */
    const cy = h * 0.56;
    const amp = Math.min(h * 0.16, 95);
    const wavelength = 230;
    const step = 7;

    for (let pass = 0; pass < 2; pass++) {
      ctx.beginPath();
      for (let x = -20; x <= w + 20; x += step) {
        const ph = time + (x / wavelength) * Math.PI * 2 + pass * Math.PI;
        const y = cy + Math.sin(ph) * amp;
        x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = rgba(pass === 0 ? TEAL : VIOLET, 0.34);
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }

    /* base-pair rungs + nodes, depth-faded by strand separation */
    for (let x = 0; x <= w; x += 26) {
      const ph = time + (x / wavelength) * Math.PI * 2;
      const y1 = cy + Math.sin(ph) * amp;
      const y2 = cy + Math.sin(ph + Math.PI) * amp;
      const depth = Math.abs(Math.sin(ph));
      ctx.beginPath();
      ctx.moveTo(x, y1);
      ctx.lineTo(x, y2);
      ctx.strokeStyle = rgba(TEAL, 0.05 + depth * 0.16);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y1, 1.7 + depth * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = rgba(TEAL, 0.25 + depth * 0.45);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y2, 1.7 + (1 - depth) * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = rgba(VIOLET, 0.25 + (1 - depth) * 0.45);
      ctx.fill();
    }

    if (!reduceMotion) raf = requestAnimationFrame(draw);
  }

  raf = requestAnimationFrame(draw);

  /* pause when hero is off-screen */
  if ("IntersectionObserver" in window && !reduceMotion) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(raf);
      }
    }).observe(canvas);
  }
})();
