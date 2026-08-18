/* Mohammed Lab: click-to-expand lightbox for static research figures.
   Delegated on document so it works for cards projects.js renders after load.
   Targets only the non-interactive figure images (figure.viz / .viz-fallback);
   the canvas/svg interactives are untouched. */
(function () {
  "use strict";

  var overlay, img, closeBtn, lastFocused;

  function ensureOverlay() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Expanded figure");

    img = document.createElement("img");
    overlay.appendChild(img);

    closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "lightbox-close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", close);
    overlay.appendChild(closeBtn);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });

    document.body.appendChild(overlay);
  }

  function open(src, alt) {
    ensureOverlay();
    img.src = src;
    img.alt = alt || "";
    lastFocused = document.activeElement;
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeydown);
    closeBtn.focus();
  }

  function close() {
    if (!overlay || !overlay.classList.contains("is-open")) return;
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === "Escape") close();
  }

  document.addEventListener("click", function (e) {
    var target = e.target.closest && e.target.closest("figure.viz img, .viz-fallback img");
    if (!target) return;
    open(target.currentSrc || target.src, target.alt);
  });
})();
