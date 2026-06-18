/* Mohammed Lab — ER/PR figure renderer (Concept 2).
   Renders an optional schematic toggle (only if data.schematic is present) and/or a
   bench-to-trial timeline ending on the PIONEER result. */
(function () {
  "use strict";
  if (!window.LabViz) return;
  var L = window.LabViz, NS = "http://www.w3.org/2000/svg";

  L.register("erpr", function (container, data) {
    var wrap = document.createElement("div"); wrap.className = "erpr";

    if (data.schematic) {
      var state = "minus";
      var tg = document.createElement("div"); tg.className = "erpr-toggle";
      tg.setAttribute("role", "group"); tg.setAttribute("aria-label", "Progesterone receptor state");
      var bMinus = mkBtn(data.labelMinus || "ER alone"), bPlus = mkBtn(data.labelPlus || "ER + active PR");
      tg.appendChild(bMinus); tg.appendChild(bPlus); wrap.appendChild(tg);
      var schem = document.createElement("div"); schem.className = "erpr-schematic"; wrap.appendChild(schem);
      var W = 680, H = 156, base = H - 30;
      var svg = document.createElementNS(NS, "svg");
      svg.setAttribute("viewBox", "0 0 " + W + " " + H); svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", "Schematic: ER binding redistributes when PR is active.");
      schem.appendChild(svg);
      var axis = document.createElementNS(NS, "line");
      axis.setAttribute("x1", 20); axis.setAttribute("y1", base); axis.setAttribute("x2", W - 20); axis.setAttribute("y2", base);
      axis.setAttribute("stroke", "#d9d6cc"); axis.setAttribute("stroke-width", "1"); svg.appendChild(axis);
      var lab = document.createElementNS(NS, "text");
      lab.setAttribute("x", 20); lab.setAttribute("y", base + 18);
      lab.setAttribute("font-family", "IBM Plex Mono, monospace"); lab.setAttribute("font-size", "10"); lab.setAttribute("fill", "#5c6578");
      lab.textContent = "schematic — ER binding sites along chromatin"; svg.appendChild(lab);
      var peaks = [];
      var render = function () {
        peaks.forEach(function (p) { svg.removeChild(p); }); peaks = [];
        (data.schematic[state] || []).forEach(function (pk) {
          var x = 20 + pk.x * (W - 40), h = pk.h * (base - 24);
          var rect = document.createElementNS(NS, "rect");
          rect.setAttribute("x", x - 3); rect.setAttribute("y", base - h);
          rect.setAttribute("width", 6); rect.setAttribute("height", Math.max(1, h)); rect.setAttribute("rx", 2);
          var col = pk.kind === "gained" ? "#0a6f66" : pk.kind === "lost" ? "#f472b6" : "#7c6cf0";
          var faded = (pk.kind === "lost" && state === "plus") || (pk.kind === "gained" && state === "minus");
          rect.setAttribute("fill", col); rect.setAttribute("opacity", faded ? 0.16 : 0.9);
          svg.appendChild(rect); peaks.push(rect);
        });
      };
      var setState = function (s) {
        state = s; bMinus.setAttribute("aria-pressed", s === "minus" ? "true" : "false");
        bPlus.setAttribute("aria-pressed", s === "plus" ? "true" : "false"); render();
      };
      bMinus.addEventListener("click", function () { setState("minus"); });
      bPlus.addEventListener("click", function () { setState("plus"); });
      setState("minus");
      if (data.schematicLegend) { var sl = document.createElement("p"); sl.className = "viz-note"; sl.textContent = data.schematicLegend; wrap.appendChild(sl); }
    }

    if (data.timeline) {
      var tl = document.createElement("div"); tl.className = "erpr-timeline";
      data.timeline.forEach(function (st) {
        var d = document.createElement("div"); d.className = "erpr-step" + (st.result ? " is-result" : "");
        var h = '<span class="yr">' + L.esc(st.year) + "</span><h5>" + L.esc(st.title) + "</h5><p>" + L.esc(st.text) + "</p>";
        if (st.stat) h += '<div class="erpr-stat"><span class="v">' + L.esc(st.stat.v) + '</span><span class="l">' + L.esc(st.stat.l) + "</span></div>";
        d.innerHTML = h; tl.appendChild(d);
      });
      wrap.appendChild(tl);
    }

    container.appendChild(wrap);
    if (data.caption) {
      var capEl = document.createElement("p"); capEl.className = "viz-cap";
      var src = data.source ? (data.source.url
        ? ' <span class="viz-src">· <a href="' + L.esc(data.source.url) + '" target="_blank" rel="noopener">' + L.esc(data.source.label || data.source.url) + "</a></span>"
        : ' <span class="viz-src">· ' + L.esc(data.source.label || data.source) + "</span>") : "";
      capEl.innerHTML = L.esc(data.caption) + src + (data.updated ? '<span class="viz-stamp">Updated ' + L.esc(data.updated) + "</span>" : "");
      container.appendChild(capEl);
    }

    function mkBtn(t) { var b = document.createElement("button"); b.type = "button"; b.textContent = t; return b; }
  });
})();
