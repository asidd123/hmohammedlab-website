/* Mohammed Lab shared behavior: nav, reveal-on-scroll */

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

})();
