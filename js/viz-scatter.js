/* Mohammed Lab — spatial scatter renderer (Concept 3, CosMx Patient D Bx3).
   Canvas point-cloud of real cell centroids colored by class; hover reveals the
   class; click a legend chip to isolate it. Capped + de-identified pilot data. */
(function () {
  "use strict";
  if (!window.LabViz) return;
  var L = window.LabViz;

  L.register("scatter", function (container, data) {
    var W = Math.max(300, Math.min(container.clientWidth || 680, 760));
    var dw = data.width || 1, dh = data.height || 1;
    var H = Math.round(Math.max(300, Math.min(880, W * (dh / dw))));
    var classes = data.classes, pts = data.points;
    var colorOf = classes.map(function (c, i) { return c.color || L.palette[i % L.palette.length]; });

    var wrap = document.createElement("div"); wrap.className = "viz-scatter";
    var legend = document.createElement("div"); legend.className = "viz-legend";
    var activeIdx = null, chips = [];
    classes.forEach(function (c, i) {
      var b = document.createElement("button"); b.className = "viz-chip"; b.type = "button"; b.setAttribute("aria-pressed", "false");
      b.innerHTML = '<span class="dot" style="background:' + colorOf[i] + '"></span>' + L.esc(c.label);
      b.addEventListener("click", function () { activeIdx = (activeIdx === i) ? null : i; updateLegend(); draw(); });
      legend.appendChild(b); chips.push(b);
    });
    var reset = document.createElement("button"); reset.className = "viz-chip viz-chip--reset"; reset.type = "button"; reset.textContent = "Show all";
    reset.addEventListener("click", function () { activeIdx = null; updateLegend(); draw(); });
    legend.appendChild(reset);
    function updateLegend() {
      legend.classList.toggle("has-active", activeIdx != null);
      chips.forEach(function (ch, i) { ch.setAttribute("aria-pressed", i === activeIdx ? "true" : "false"); });
    }
    wrap.appendChild(legend);

    var holder = document.createElement("div"); wrap.appendChild(holder);
    container.appendChild(wrap);
    if (data.caption) container.appendChild(captionEl(L, data));

    var cv = L.canvas(holder, W, H), ctx = cv.ctx;
    var pad = 8, sx = (W - 2 * pad) / dw, sy = (H - 2 * pad) / dh;
    function px(x) { return pad + x * sx; }
    function py(y) { return pad + (dh - y) * sy; }  /* flip y to read like tissue */
    var r = pts.length > 2500 ? 1.9 : (pts.length > 1200 ? 2.2 : 2.6);

    var cell = 14, grid = {};
    for (var i = 0; i < pts.length; i++) {
      var gx = Math.floor(px(pts[i][0]) / cell), gy = Math.floor(py(pts[i][1]) / cell);
      var k = gx + "," + gy; (grid[k] = grid[k] || []).push(i);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i], on = (activeIdx == null || p[2] === activeIdx);
        ctx.globalAlpha = on ? 0.82 : 0.07;
        ctx.fillStyle = colorOf[p[2]] || "#999";
        ctx.beginPath(); ctx.arc(px(p[0]), py(p[1]), on ? r : r * 0.8, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    draw();

    var onMove = L.throttleRAF(function (clientX, clientY, lx, ly) {
      var gx = Math.floor(lx / cell), gy = Math.floor(ly / cell), best = -1, bd = 64;
      for (var ax = -1; ax <= 1; ax++) for (var ay = -1; ay <= 1; ay++) {
        var arr = grid[(gx + ax) + "," + (gy + ay)]; if (!arr) continue;
        for (var j = 0; j < arr.length; j++) {
          var idx = arr[j], p = pts[idx];
          if (activeIdx != null && p[2] !== activeIdx) continue;
          var ddx = px(p[0]) - lx, ddy = py(p[1]) - ly, d = ddx * ddx + ddy * ddy;
          if (d < bd) { bd = d; best = idx; }
        }
      }
      if (best >= 0) {
        var c = classes[pts[best][2]];
        L.tip.show("<b>" + L.esc(c ? c.label : "") + "</b>" + (data.hoverNote ? '<span class="t-sub">' + L.esc(data.hoverNote) + "</span>" : ""), clientX, clientY);
      } else L.tip.hide();
    });
    cv.canvas.addEventListener("mousemove", function (ev) {
      var rect = cv.canvas.getBoundingClientRect();
      onMove(ev.clientX, ev.clientY, ev.clientX - rect.left, ev.clientY - rect.top);
    });
    cv.canvas.addEventListener("mouseleave", function () { L.tip.hide(); });
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
