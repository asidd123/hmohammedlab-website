/* Mohammed Lab — spatial cell-polygon renderer (Concept 3, CosMx Patient D Bx3).
   Whole-biopsy view drawn from real cell-segmentation polygons. Defaults to fit; scroll to
   zoom and drag to pan into the cell shapes. A "colour by" selector switches between cell type,
   spatial domain, and individual genes; hover a cell for its details. */
(function () {
  "use strict";
  if (!window.LabViz) return;
  var L = window.LabViz;

  function hex2rgb(h) { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function lerpStops(stops, t) {
    t = Math.max(0, Math.min(1, t)); var s = t * (stops.length - 1), i = Math.floor(s), f = s - i;
    if (i >= stops.length - 1) return stops[stops.length - 1];
    var a = hex2rgb(stops[i]), b = hex2rgb(stops[i + 1]);
    return "rgb(" + Math.round(a[0] + (b[0] - a[0]) * f) + "," + Math.round(a[1] + (b[1] - a[1]) * f) + "," + Math.round(a[2] + (b[2] - a[2]) * f) + ")";
  }

  L.register("cells", function (container, data) {
    container.classList.add("viz-cells");
    /* Cap at 580px so the square canvas fits on screen; CSS max-width matches */
    var W = Math.max(320, Math.min(container.clientWidth || 580, 580));
    var H = W; /* square canvas — shows the entire biopsy at z=1 */
    var sx = W / data.width, sy = H / data.height;
    var modes = data.modes, active = modes[0], activeClass = null, stops = data.geneColor;
    var z = 1, tx = 0, ty = 0;

    var cells = data.cells.map(function (c) {
      var pts = [], cxs = 0, cys = 0, n = c.g.length / 2;
      for (var i = 0; i < c.g.length; i += 2) { var X = c.g[i] * sx, Y = H - c.g[i + 1] * sy; pts.push(X, Y); cxs += X; cys += Y; }
      return { pts: pts, cx: cxs / n, cy: cys / n, t: c.t, d: c.d, e: c.e };
    });

    /* mode selector */
    var sel = document.createElement("div"); sel.className = "viz-select"; sel.setAttribute("role", "group"); sel.setAttribute("aria-label", "Colour cells by");
    var clab = document.createElement("span"); clab.className = "viz-select-label"; clab.textContent = "colour by:"; sel.appendChild(clab);
    var tabs = [];
    modes.forEach(function (m) {
      var b = document.createElement("button"); b.type = "button"; b.className = "viz-tab"; b.textContent = m.label; b.setAttribute("aria-pressed", m === active ? "true" : "false");
      b.addEventListener("click", function () { active = m; activeClass = null; tabs.forEach(function (t) { t.setAttribute("aria-pressed", "false"); }); b.setAttribute("aria-pressed", "true"); buildLegend(); draw(); });
      sel.appendChild(b); tabs.push(b);
    });
    container.appendChild(sel);
    var legend = document.createElement("div"); container.appendChild(legend);
    var hint = document.createElement("p"); hint.className = "viz-hint"; hint.textContent = "scroll to zoom · drag to pan · double-click to reset"; container.appendChild(hint);

    var stack = document.createElement("div"); stack.className = "cells-stack"; container.appendChild(stack);
    if (data.caption) container.appendChild(captionEl(L, data));
    var base = L.canvas(stack, W, H); base.canvas.className = "cells-base";
    var over = L.canvas(stack, W, H); over.canvas.className = "overlay";
    var ctx = base.ctx, octx = over.ctx, dpr = base.dpr;

    function fillFor(c) {
      if (active.type === "gene") return lerpStops(stops, c.e[active.gi]);
      if (active.key === "domain") return c.d >= 0 ? active.classes[c.d].color : "#e7e4db";
      return active.classes[c.t].color;
    }
    function classIdx(c) { return active.key === "domain" ? c.d : c.t; }
    function pathPoly(g, c) { g.beginPath(); g.moveTo(c.pts[0], c.pts[1]); for (var i = 2; i < c.pts.length; i += 2) g.lineTo(c.pts[i], c.pts[i + 1]); g.closePath(); }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      ctx.setTransform(dpr * z, 0, 0, dpr * z, dpr * tx, dpr * ty);
      var doStroke = z >= 2;
      for (var i = 0; i < cells.length; i++) {
        var c = cells[i], off = (activeClass != null && active.type === "cat" && classIdx(c) !== activeClass);
        ctx.globalAlpha = off ? 0.1 : 1; pathPoly(ctx, c); ctx.fillStyle = fillFor(c); ctx.fill();
        if (doStroke && !off) { ctx.lineWidth = 1.0 / z; ctx.strokeStyle = "rgba(0,0,0,0.85)"; ctx.stroke(); }
      }
      ctx.globalAlpha = 1;
    }
    function highlight(c) {
      octx.setTransform(dpr, 0, 0, dpr, 0, 0); octx.clearRect(0, 0, W, H);
      if (!c) return;
      octx.setTransform(dpr * z, 0, 0, dpr * z, dpr * tx, dpr * ty);
      pathPoly(octx, c); octx.lineWidth = 1.6 / z; octx.strokeStyle = "rgba(255,255,255,0.9)"; octx.stroke();
    }

    function buildLegend() {
      legend.innerHTML = "";
      if (active.type === "gene") {
        var g = document.createElement("div"); g.className = "viz-gradient";
        g.innerHTML = '<span class="gene">' + L.esc(active.label) + '</span><span class="lab">low</span><span class="bar" style="background:linear-gradient(90deg,' + stops.join(",") + ')"></span><span class="lab">high</span>';
        legend.appendChild(g);
      } else {
        var lg = document.createElement("div"); lg.className = "viz-legend";
        active.classes.forEach(function (cl, i) {
          var b = document.createElement("button"); b.className = "viz-chip"; b.type = "button"; b.setAttribute("aria-pressed", "false");
          b.innerHTML = '<span class="dot" style="background:' + cl.color + '"></span>' + L.esc(cl.label);
          b.addEventListener("click", function () {
            activeClass = (activeClass === i) ? null : i; lg.classList.toggle("has-active", activeClass != null);
            [].forEach.call(lg.querySelectorAll(".viz-chip"), function (x, j) { x.setAttribute("aria-pressed", j === activeClass ? "true" : "false"); }); draw();
          });
          lg.appendChild(b);
        });
        legend.appendChild(lg);
      }
    }
    buildLegend(); draw();

    /* zoom + pan */
    function clampPan() { var cw = W * z, ch = H * z; tx = Math.min(0, Math.max(W - cw, tx)); ty = Math.min(0, Math.max(H - ch, ty)); }
    function zoomAt(mx, my, f) { var nz = Math.max(1, Math.min(18, z * f)); tx = mx - (mx - tx) * nz / z; ty = my - (my - ty) * nz / z; z = nz; clampPan(); highlight(null); draw(); }
    base.canvas.addEventListener("wheel", function (ev) { ev.preventDefault(); var r = base.canvas.getBoundingClientRect(); zoomAt(ev.clientX - r.left, ev.clientY - r.top, ev.deltaY < 0 ? 1.18 : 1 / 1.18); }, { passive: false });
    base.canvas.addEventListener("dblclick", function () { z = 1; tx = 0; ty = 0; highlight(null); draw(); });

    var down = false, lx0 = 0, ly0 = 0, moved = false;
    base.canvas.addEventListener("mousedown", function (ev) { down = true; moved = false; lx0 = ev.clientX; ly0 = ev.clientY; base.canvas.style.cursor = "grabbing"; });
    window.addEventListener("mouseup", function () { down = false; base.canvas.style.cursor = ""; });

    /* centroid grid (base coords) for hover */
    var GS = 12, grid = {};
    cells.forEach(function (c, i) { var k = ((c.cx / GS) | 0) + "," + ((c.cy / GS) | 0); (grid[k] = grid[k] || []).push(i); });
    function typeLabel(c) { return modes[0].classes[c.t].label; }
    function domLabel(c) { return c.d >= 0 ? modes[1].classes[c.d].label : null; }

    var onMove = L.throttleRAF(function (clientX, clientY, lx, ly) {
      var bx = (lx - tx) / z, by = (ly - ty) / z, thr = 10 / z, bd = thr * thr;
      var gx = (bx / GS) | 0, gy = (by / GS) | 0, best = -1;
      for (var ax = -1; ax <= 1; ax++) for (var ay = -1; ay <= 1; ay++) {
        var arr = grid[(gx + ax) + "," + (gy + ay)]; if (!arr) continue;
        for (var j = 0; j < arr.length; j++) { var c = cells[arr[j]], dx = c.cx - bx, dy = c.cy - by, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = arr[j]; } }
      }
      if (best >= 0) {
        var c = cells[best]; highlight(c);
        var dl = domLabel(c), html = "<b>" + L.esc(typeLabel(c)) + "</b>";
        if (active.type === "gene") html = "<b>" + L.esc(active.label) + " " + c.e[active.gi].toFixed(2) + "</b><span class=\"t-sub\">relative expression</span><span class=\"t-sub\">" + L.esc(typeLabel(c)) + "</span>";
        if (dl) html += '<span class="t-sub">' + L.esc(dl) + "</span>";
        L.tip.show(html, clientX, clientY);
      } else { highlight(null); L.tip.hide(); }
    });
    base.canvas.addEventListener("mousemove", function (ev) {
      var r = base.canvas.getBoundingClientRect();
      if (down) {
        moved = true; tx += ev.clientX - lx0; ty += ev.clientY - ly0; lx0 = ev.clientX; ly0 = ev.clientY; clampPan(); highlight(null); L.tip.hide(); draw();
      } else { onMove(ev.clientX, ev.clientY, ev.clientX - r.left, ev.clientY - r.top); }
    });
    base.canvas.addEventListener("mouseleave", function () { highlight(null); L.tip.hide(); });
  });

  function captionEl(L, data) {
    var p = document.createElement("p"); p.className = "viz-cap";
    var src = data.source ? (data.source.url
      ? ' <span class="viz-src">· <a href="' + L.esc(data.source.url) + '" target="_blank" rel="noopener">' + L.esc(data.source.label || data.source.url) + "</a></span>"
      : ' <span class="viz-src">· ' + L.esc(data.source.label || data.source) + "</span>") : "";
    p.innerHTML = L.esc(data.caption) + src + (data.updated ? '<span class="viz-stamp">Updated ' + L.esc(data.updated) + "</span>" : "");
    return p;
  }
})();
