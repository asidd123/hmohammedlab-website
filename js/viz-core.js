/* Mohammed Lab — viz runtime.
   Shared, dependency-free engine for the research-page interactives.

   Contract:
   - Data modules assign  LabViz.data['<key>'] = {...}
   - Renderer modules call LabViz.register('<type>', fn)  where fn(container, data, LabViz)
   - projects.js emits placeholders:
        <div class="viz" data-viz="<type>" data-key="<key>">
          <div class="viz-fallback"> ...static image / text... </div>
        </div>
   - On scroll-into-view, the runtime mounts the matching renderer into a fresh .viz-live node
     and hides the fallback. FAIL-CLOSED: missing renderer/data, no <canvas>, a thrown renderer,
     or reduced-capability environments leave the static fallback in place — the page is never blank
     or broken, only quieter. Works identically from file:// and from a server (no fetch). */
(function () {
  "use strict";
  var LabViz = (window.LabViz = window.LabViz || {});
  LabViz.data = LabViz.data || {};
  LabViz.renderers = LabViz.renderers || {};
  LabViz.lazySrc = LabViz.lazySrc || {};
  LabViz.register = function (type, fn) { LabViz.renderers[type] = fn; };

  function mq(q) { return !!(window.matchMedia && window.matchMedia(q).matches); }
  LabViz.reducedMotion = mq("(prefers-reduced-motion: reduce)");
  LabViz.coarsePointer = mq("(pointer: coarse)");

  LabViz.esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };

  /* class palette derived from the site's design tokens */
  LabViz.palette = [
    "#0a6f66", "#7c6cf0", "#f472b6", "#2dd4bf", "#a78bfa",
    "#e0a33a", "#3a93c4", "#d2685f", "#6aa86a", "#9aa0ad"
  ];

  /* ---- shared tooltip singleton ---- */
  var tipEl = null;
  function ensureTip() {
    if (tipEl) return tipEl;
    tipEl = document.createElement("div");
    tipEl.className = "viz-tip";
    tipEl.setAttribute("role", "status");
    tipEl.style.display = "none";
    document.body.appendChild(tipEl);
    return tipEl;
  }
  LabViz.tip = {
    show: function (html, clientX, clientY) {
      var t = ensureTip();
      t.innerHTML = html;
      t.style.display = "block";
      var pad = 16, w = t.offsetWidth, h = t.offsetHeight;
      var left = clientX + pad, top = clientY + pad;
      if (left + w > window.innerWidth - 8) left = clientX - w - pad;
      if (top + h > window.innerHeight - 8) top = clientY - h - pad;
      t.style.left = Math.max(8, left) + "px";
      t.style.top = Math.max(8, top) + "px";
    },
    hide: function () { if (tipEl) tipEl.style.display = "none"; }
  };

  /* ---- DPR-aware canvas (cap 2, matching main.js) ---- */
  LabViz.canvas = function (parent, w, h) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var c = document.createElement("canvas");
    c.style.width = w + "px";
    c.style.height = h + "px";
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    var ctx = c.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    parent.appendChild(c);
    return { canvas: c, ctx: ctx, w: w, h: h, dpr: dpr };
  };

  /* requestAnimationFrame-throttled handler */
  LabViz.throttleRAF = function (fn) {
    var queued = false, lastArgs = null;
    return function () {
      lastArgs = arguments;
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; fn.apply(null, lastArgs); });
    };
  };

  /* ---- mount one placeholder ---- */
  function mount(el) {
    if (el.getAttribute("data-mounted")) return;
    var type = el.getAttribute("data-viz");
    var key = el.getAttribute("data-key");
    var fn = LabViz.renderers[type];
    var data = key ? LabViz.data[key] : null;
    var canCanvas = !!(document.createElement("canvas").getContext);
    if (!fn || !canCanvas) { el.setAttribute("data-mounted", "fallback"); return; }
    /* lazy-load data script on first scroll-into-view */
    if (!data && key && LabViz.lazySrc[key]) {
      var src = LabViz.lazySrc[key];
      delete LabViz.lazySrc[key];
      el.setAttribute("data-mounted", "pending");
      var s = document.createElement("script");
      s.src = src;
      s.onload = function () { el.removeAttribute("data-mounted"); mount(el); };
      s.onerror = function () { el.setAttribute("data-mounted", "fallback"); };
      document.head.appendChild(s);
      return;
    }
    if (!data) { el.setAttribute("data-mounted", "fallback"); return; }
    var live = document.createElement("div");
    live.className = "viz-live";
    el.appendChild(live); /* in the DOM first, so renderers can measure width */
    try {
      fn(live, data, LabViz);
      var fb = el.querySelector(".viz-fallback");
      if (fb) fb.style.display = "none";
      el.setAttribute("data-mounted", "live");
    } catch (e) {
      if (el.contains(live)) el.removeChild(live);
      if (window.console) console.warn("[LabViz] render failed for '" + key + "':", e);
      el.setAttribute("data-mounted", "error"); /* static fallback stays visible */
    }
  }
  LabViz.mount = mount;

  function sweep() {
    var nodes = [].slice.call(document.querySelectorAll(".viz[data-viz]"));
    if (!nodes.length) return;
    if (!("IntersectionObserver" in window)) { nodes.forEach(mount); return; }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) { io.unobserve(entries[i].target); mount(entries[i].target); }
      }
    }, { rootMargin: "140px 0px" });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* With defer, readyState is "interactive" (not "loading") when this runs, but
     DOMContentLoaded still fires after all deferred scripts complete — including
     projects.js which creates the .viz elements — so wait for it in all cases. */
  if (document.readyState === "complete") sweep();
  else document.addEventListener("DOMContentLoaded", sweep);
})();
