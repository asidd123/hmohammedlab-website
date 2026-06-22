/* Mohammed Lab — volcano renderer (Concept 2, ER/PR RNA).
   Canvas scatter of differential expression: x = log2 fold-change, y = -log10 p.
   A faint background cloud gives the volcano its shape; named genes are coloured by
   direction and are hoverable; a few top genes are labelled directly. */
(function () {
  "use strict";
  if (!window.LabViz) return;
  var L = window.LabViz;

  L.register("volcano", function (container, data) {
    var W = Math.max(300, Math.min(container.clientWidth || 680, 760));
    var H = Math.round(Math.min(520, Math.max(360, W * 0.62)));
    var genes = data.genes || [], bg = data.background || [];
    var ml = 54, mr = 16, mt = 18, mb = 46, pw = W - ml - mr, ph = H - mt - mb;
    var allL = genes.map(function (g) { return g.lfc; }).concat(bg.map(function (p) { return p[0]; }));
    var allN = genes.map(function (g) { return g.nlp; }).concat(bg.map(function (p) { return p[1]; }));
    var xm = Math.max(1, Math.ceil(Math.max.apply(null, allL.map(Math.abs))));
    var ym = Math.max(2, Math.ceil(Math.max.apply(null, allN)));
    var lfcT = (data.thresholds && data.thresholds.lfc) || 1;
    var nlpT = (data.thresholds && data.thresholds.nlp) || 1.3;
    var UP = "#8a2424", DOWN = "#2f5f8a", NS = "#b6ae9c";
    function X(l) { return ml + (l + xm) / (2 * xm) * pw; }
    function Y(n) { return mt + (1 - n / ym) * ph; }
    function colOf(g) { return (g.nlp < nlpT || Math.abs(g.lfc) < lfcT) ? NS : (g.lfc > 0 ? UP : DOWN); }

    var holder = document.createElement("div"); holder.className = "viz-volcano"; container.appendChild(holder);
    if (data.caption) container.appendChild(cap(L, data));
    var cv = L.canvas(holder, W, H), ctx = cv.ctx;

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "#cdc7b3"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ml, mt); ctx.lineTo(ml, mt + ph); ctx.lineTo(ml + pw, mt + ph); ctx.stroke();
      ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = "#cfccc2";
      [X(lfcT), X(-lfcT)].forEach(function (xx) { ctx.beginPath(); ctx.moveTo(xx, mt); ctx.lineTo(xx, mt + ph); ctx.stroke(); });
      ctx.beginPath(); ctx.moveTo(ml, Y(nlpT)); ctx.lineTo(ml + pw, Y(nlpT)); ctx.stroke(); ctx.restore();
      ctx.fillStyle = "rgba(120,125,140,0.26)";
      bg.forEach(function (p) { ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 1.6, 0, 6.2832); ctx.fill(); });
      genes.forEach(function (g) { ctx.fillStyle = colOf(g); ctx.globalAlpha = 0.92; ctx.beginPath(); ctx.arc(X(g.lfc), Y(g.nlp), 3.5, 0, 6.2832); ctx.fill(); });
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#1a1a17"; ctx.font = "600 10px 'IBM Plex Mono', monospace";
      (data.topLabels || []).forEach(function (name) {
        var g = genes.filter(function (x) { return x.gene === name; })[0]; if (!g) return;
        ctx.textAlign = g.lfc > 0 ? "left" : "right";
        ctx.fillText(g.gene, X(g.lfc) + (g.lfc > 0 ? 6 : -6), Y(g.nlp) - 5);
      });
      ctx.fillStyle = "#5c6578"; ctx.font = "11px Inter, sans-serif"; ctx.textAlign = "center";
      ctx.fillText(data.xlabel || "log2 fold change (with PR)", ml + pw / 2, H - 12);
      ctx.save(); ctx.translate(15, mt + ph / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = "center"; ctx.fillText(data.ylabel || "-log10 p", 0, 0); ctx.restore();
      ctx.font = "9px 'IBM Plex Mono', monospace"; ctx.fillStyle = "#8a8f9c"; ctx.textAlign = "center";
      [-xm, 0, xm].forEach(function (t) { ctx.fillText((t > 0 ? "+" : "") + t, X(t), mt + ph + 15); });
      ctx.textAlign = "left"; ctx.font = "10px Inter, sans-serif";
      ctx.fillStyle = UP; ctx.beginPath(); ctx.arc(ml + 10, mt + 8, 4, 0, 6.28); ctx.fill();
      ctx.fillStyle = "#5c6578"; ctx.fillText("up with PR", ml + 18, mt + 11);
      ctx.fillStyle = DOWN; ctx.beginPath(); ctx.arc(ml + 10, mt + 24, 4, 0, 6.28); ctx.fill();
      ctx.fillStyle = "#5c6578"; ctx.fillText("down with PR", ml + 18, mt + 27);
    }
    draw();

    var pos = genes.map(function (g) { return { g: g, x: X(g.lfc), y: Y(g.nlp) }; });
    var onMove = L.throttleRAF(function (cx, cy, lx, ly) {
      var best = null, bd = 110;
      for (var i = 0; i < pos.length; i++) { var dx = pos[i].x - lx, dy = pos[i].y - ly, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = pos[i]; } }
      if (best) {
        var g = best.g;
        L.tip.show("<b>" + L.esc(g.gene) + "</b><span class=\"t-sub\">" + (g.lfc > 0 ? "up" : "down") + " with PR · log2FC " + g.lfc.toFixed(2) + " · −log10p " + g.nlp.toFixed(1) + "</span>" + (g.role ? '<span class="t-sub">' + L.esc(g.role) + "</span>" : ""), cx, cy);
      } else L.tip.hide();
    });
    cv.canvas.addEventListener("mousemove", function (ev) { var r = cv.canvas.getBoundingClientRect(); onMove(ev.clientX, ev.clientY, ev.clientX - r.left, ev.clientY - r.top); });
    cv.canvas.addEventListener("mouseleave", function () { L.tip.hide(); });
  });

  function cap(L, data) {
    var p = document.createElement("p"); p.className = "viz-cap";
    var src = data.source ? (data.source.url
      ? ' <span class="viz-src">· <a href="' + L.esc(data.source.url) + '" target="_blank" rel="noopener">' + L.esc(data.source.label || data.source.url) + "</a></span>"
      : ' <span class="viz-src">· ' + L.esc(data.source.label || data.source) + "</span>") : "";
    p.innerHTML = L.esc(data.caption) + src + (data.updated ? '<span class="viz-stamp">Updated ' + L.esc(data.updated) + "</span>" : "");
    return p;
  }
})();
