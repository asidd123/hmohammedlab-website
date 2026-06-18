/* Mohammed Lab — interactome network renderer (Concept 1, RIME).
   Supports a gallery of datasets (baits / conditions): a selector switches the active
   RIME experiment; a precomputed radial layout (no physics, no animation) draws it.
   Hover a node for its role; click a class chip to highlight that functional class. */
(function () {
  "use strict";
  if (!window.LabViz) return;
  var L = window.LabViz, NS = "http://www.w3.org/2000/svg";

  L.register("network", function (container, data) {
    var classes = data.classes;
    var datasets = data.datasets ? data.datasets : [{
      key: "_", label: "", center: data.center, nodes: data.nodes,
      caption: data.caption, source: data.source, ariaLabel: data.ariaLabel
    }];
    var colorOf = {};
    classes.forEach(function (c, i) { colorOf[c.key] = c.color || L.palette[i % L.palette.length]; });

    var activeKey = null;          /* class filter */
    var active = datasets[0];      /* current dataset */
    var nodeEls = [], edgeEls = [], curWrap = null, tabs = [];

    /* ---- dataset selector (baits / conditions) ---- */
    if (datasets.length > 1) {
      var sel = document.createElement("div"); sel.className = "viz-select";
      sel.setAttribute("role", "group"); sel.setAttribute("aria-label", "RIME bait or condition");
      datasets.forEach(function (ds) {
        var b = document.createElement("button"); b.type = "button"; b.className = "viz-tab";
        b.textContent = ds.label; b.setAttribute("aria-pressed", ds === active ? "true" : "false");
        b.addEventListener("click", function () {
          active = ds; activeKey = null;
          tabs.forEach(function (t) { t.setAttribute("aria-pressed", "false"); });
          b.setAttribute("aria-pressed", "true");
          renderActive();
        });
        sel.appendChild(b); tabs.push(b);
      });
      container.appendChild(sel);
    }

    /* ---- class-filter legend (shared across datasets) ---- */
    var legend = document.createElement("div"); legend.className = "viz-legend";
    var chips = [];
    classes.forEach(function (c) {
      var b = document.createElement("button"); b.className = "viz-chip"; b.type = "button"; b.dataset.key = c.key; b.setAttribute("aria-pressed", "false");
      b.innerHTML = '<span class="dot" style="background:' + colorOf[c.key] + '"></span>' + L.esc(c.label);
      b.addEventListener("click", function () { activeKey = (activeKey === c.key) ? null : c.key; applyFilter(); });
      legend.appendChild(b); chips.push(b);
    });
    var resetB = document.createElement("button");
    resetB.className = "viz-chip viz-chip--reset"; resetB.type = "button"; resetB.textContent = "Show all";
    resetB.addEventListener("click", function () { activeKey = null; applyFilter(); });
    legend.appendChild(resetB);
    container.appendChild(legend);

    var netHolder = document.createElement("div"); container.appendChild(netHolder);
    var capHolder = document.createElement("div"); container.appendChild(capHolder);

    function applyFilter() {
      if (curWrap) curWrap.classList.toggle("dimmed", !!activeKey);
      legend.classList.toggle("has-active", !!activeKey);
      nodeEls.forEach(function (o) { o.g.classList.toggle("off", !!activeKey && o.cls !== activeKey); });
      edgeEls.forEach(function (o) { o.classList.toggle("off", !!activeKey && o.cls !== activeKey); });
      chips.forEach(function (ch) { ch.setAttribute("aria-pressed", ch.dataset.key === activeKey ? "true" : "false"); });
    }

    function buildNetwork(ds) {
      var W = Math.max(320, Math.min(netHolder.clientWidth || 680, 760));
      var H = Math.round(Math.min(560, Math.max(430, W * 0.8)));
      var cx = W / 2, cy = H / 2, nodes = ds.nodes, total = nodes.length || 1;
      var ringR = Math.min(W, H) * 0.36, ringR2 = ringR * 0.64;
      var present = classes.filter(function (c) { return nodes.some(function (n) { return n.cls === c.key; }); });
      var gap = 0.16, angle = -Math.PI / 2, positioned = [];
      present.forEach(function (c) {
        var items = nodes.filter(function (n) { return n.cls === c.key; });
        var span = (items.length / total) * (Math.PI * 2 - gap * present.length);
        var a0 = angle + gap / 2, n = items.length;
        items.forEach(function (it, idx) {
          var t = n === 1 ? 0.5 : idx / (n - 1), a = a0 + t * span, r = (idx % 2 === 0) ? ringR : ringR2;
          positioned.push({ node: it, cls: c.key, color: colorOf[c.key], x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
        });
        angle += span + gap;
      });

      var wrap = document.createElement("div"); wrap.className = "viz-network";
      var svg = document.createElementNS(NS, "svg");
      svg.setAttribute("viewBox", "0 0 " + W + " " + H); svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", ds.ariaLabel || ("Interactome of " + (ds.center ? ds.center.label : "the protein") + " grouped by functional class."));

      nodeEls = []; edgeEls = [];
      positioned.forEach(function (p) {
        var path = document.createElementNS(NS, "path");
        var mx = (cx + p.x) / 2, my = (cy + p.y) / 2 - 16;
        path.setAttribute("d", "M" + cx + "," + cy + " Q" + mx + "," + my + " " + p.x + "," + p.y);
        path.setAttribute("class", "viz-net-edge"); path.setAttribute("fill", "none");
        path.setAttribute("stroke", p.color); path.setAttribute("stroke-opacity", "0.26"); path.setAttribute("stroke-width", "1.1");
        path.cls = p.cls; svg.appendChild(path); edgeEls.push(path);
      });
      positioned.forEach(function (p) {
        var baseR = p.node.novel ? 7 : 5.5;
        var g = document.createElementNS(NS, "g"); g.setAttribute("class", "viz-net-node");
        var hit = document.createElementNS(NS, "circle");
        hit.setAttribute("cx", p.x); hit.setAttribute("cy", p.y); hit.setAttribute("r", 13); hit.setAttribute("fill", "transparent");
        g.appendChild(hit);
        var c = document.createElementNS(NS, "circle");
        c.setAttribute("cx", p.x); c.setAttribute("cy", p.y); c.setAttribute("r", baseR); c.setAttribute("fill", p.color);
        if (p.node.novel) { c.setAttribute("stroke", "#fff"); c.setAttribute("stroke-width", "1.6"); }
        g.appendChild(c);
        var t = document.createElementNS(NS, "text"); t.setAttribute("class", "viz-net-label");
        t.setAttribute("x", p.x); t.setAttribute("y", p.y - (p.node.novel ? 11 : 9)); t.setAttribute("text-anchor", "middle");
        t.textContent = p.node.id; g.appendChild(t);
        function rst() { c.setAttribute("r", baseR); if (p.node.novel) { c.setAttribute("stroke", "#fff"); c.setAttribute("stroke-width", "1.6"); } else { c.removeAttribute("stroke"); c.removeAttribute("stroke-width"); } }
        g.addEventListener("mouseenter", function () { c.setAttribute("r", baseR + 3); c.setAttribute("stroke", "#0a0f1e"); c.setAttribute("stroke-width", "1.8"); });
        g.addEventListener("mousemove", function (ev) {
          var cls = classes.filter(function (cc) { return cc.key === p.cls; })[0];
          L.tip.show("<b>" + L.esc(p.node.id) + "</b>" +
            (p.node.name ? '<span class="t-sub">' + L.esc(p.node.name) + "</span>" : "") +
            '<span class="t-sub">' + L.esc(cls ? cls.label : "") + (p.node.novel ? " · highlighted" : "") + "</span>" +
            (p.node.role ? '<span class="t-sub">' + L.esc(p.node.role) + "</span>" : ""), ev.clientX, ev.clientY);
        });
        g.addEventListener("mouseleave", function () { rst(); L.tip.hide(); });
        g.cls = p.cls; svg.appendChild(g); nodeEls.push({ g: g, cls: p.cls });
      });

      var cg = document.createElementNS(NS, "g"); cg.setAttribute("class", "viz-net-center");
      var cc = document.createElementNS(NS, "circle"); cc.setAttribute("cx", cx); cc.setAttribute("cy", cy); cc.setAttribute("r", 27); cg.appendChild(cc);
      var ct = document.createElementNS(NS, "text"); ct.setAttribute("x", cx); ct.setAttribute("y", cy);
      ct.textContent = ds.center ? ds.center.id : "ER"; cg.appendChild(ct);
      svg.appendChild(cg);

      wrap.appendChild(svg); curWrap = wrap; netHolder.appendChild(wrap);
    }

    function captionEl(ds) {
      var p = document.createElement("p"); p.className = "viz-cap";
      var src = ds.source ? (ds.source.url
        ? ' <span class="viz-src">· <a href="' + L.esc(ds.source.url) + '" target="_blank" rel="noopener">' + L.esc(ds.source.label || ds.source.url) + "</a></span>"
        : ' <span class="viz-src">· ' + L.esc(ds.source.label || ds.source) + "</span>") : "";
      p.innerHTML = L.esc(ds.caption) + src + (data.updated ? '<span class="viz-stamp">Updated ' + L.esc(data.updated) + "</span>" : "");
      return p;
    }

    function renderActive() {
      netHolder.innerHTML = ""; capHolder.innerHTML = "";
      buildNetwork(active);
      applyFilter();
      if (active.caption) capHolder.appendChild(captionEl(active));
    }

    renderActive();
  });
})();
