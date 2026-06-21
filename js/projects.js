/* Mohammed Lab — current-work project cards (research.html #project-list).
   Mirrors the js/publications.js pattern: a hand-maintained data array + a client-side
   renderer, loaded via <script> (works from file://). The array is the source of truth
   for WHAT shows; the separately-cleared js/viz-data/* modules carry the interactive
   payloads. FAIL-CLOSED: a card renders only when cleared !== false; if nothing is
   cleared the whole section is hidden. Interactives are mounted by js/viz-core.js. */
(function () {
  "use strict";
  var listEl = document.getElementById("project-list");
  if (!listEl) return;

  var esc = function (s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };

  var PROJECTS = [
    {
      id: "rime-er", area: 1, status: "published", statusLabel: "Published method",
      cleared: true,
      title: "RIME: reading endogenous protein complexes",
      lede: "Most of what a transcription factor does, it does in company. RIME reads the estrogen-receptor complex directly from cells, by mass spectrometry.",
      body: [
        "<strong>RIME</strong> — rapid immunoprecipitation mass spectrometry of endogenous proteins — captures a protein and everything bound to it, directly from cells, without tags or over-expression. Cells are lightly cross-linked, the protein is pulled down with its own antibody, and its partners are identified by mass spectrometry. Run alongside ChIP-seq, it pairs a factor's interactome with where it binds the genome — and it works from primary tumour tissue, not only cell lines.",
        "We developed RIME while asking what the estrogen-receptor complex actually contains, and used it to identify GREB1 as a chromatin-bound ER co-activator. The maps below show several RIME experiments — ER with and without anti-estrogen, the progesterone receptor, and GREB1 — grouped by what each partner does. Switch the bait or condition above the map."
      ],
      blocks: [
        {
          kind: "steps",
          panelTitle: "How RIME works, in four steps",
          steps: [
            {
              icon: "cell",
              title: "Start with living cells",
              text: "We begin with cells or tumour tissue, kept as close to their natural state as possible — no engineered tags, no over-expression."
            },
            {
              icon: "snap",
              title: "Freeze the moment",
              text: "A brief, gentle chemical treatment locks proteins in place exactly as they were interacting — a snapshot of the cell at work."
            },
            {
              icon: "target",
              title: "Fish out one protein",
              text: "An antibody specific to one protein — say, the estrogen receptor — pulls it out, along with everything still attached to it."
            },
            {
              icon: "spectrum",
              title: "Read out the catch",
              text: "A mass spectrometer — an instrument that identifies proteins by weighing them — names every protein in that catch."
            }
          ],
          note: "The result is a parts list for that protein's working complex, read directly from real cells. The interactive map below turns that list into something you can explore."
        },
        {
          kind: "viz", type: "network", key: "rime-er",
          panelTitle: "RIME interactomes — choose a bait or condition, then highlight a class",
          fallback: '<p class="viz-note">The interactive interactome needs JavaScript. The reported interactors are listed in the paper.</p>'
        },
        {
          kind: "note",
          html: '<strong>Working with us.</strong> RIME is also offered commercially as a service (for example by <a href="https://www.activemotif.com/catalog/1077/rime" target="_blank" rel="noopener">Active Motif</a>). Our role is different: we collaborate — helping labs design the experiment, choose and validate antibodies, set the method up in their own hands, and read it against the matched binding data. If RIME fits a question you are working on, <a href="contact.html">get in touch</a>.'
        }
      ],
      leads: [{ name: "Hisham Mohammed", anchor: "hisham" }],
      methods: [{ label: "RIME", anchor: "tech-rime" }],
      refs: [
        { label: "Cell Reports 2013", url: "https://www.cell.com/cell-reports/fulltext/S2211-1247(13)00017-X" },
        { label: "Nature Protocols 2016", url: "https://www.nature.com/articles/nprot.2016.020" }
      ]
    },

    {
      id: "erpr-pioneer", area: 1, status: "published", statusLabel: "Published",
      cleared: true,
      title: "Progesterone reprograms the estrogen receptor",
      lede: "Activating the progesterone receptor changes where ER binds the genome — a mechanism that helped motivate a clinical trial.",
      body: [
        "Estrogen receptor does not act alone. We found that activating the progesterone receptor redirects <em>where</em> ER binds across the genome, shifting it toward a program associated with a more favourable outcome.",
        "That mechanism helped motivate the PIONEER window-of-opportunity trial, which added a progesterone-receptor agonist to standard endocrine therapy in early ER+ breast cancer and recently reported a clinical benefit. We describe the scientific lineage here; the trial itself was led by the Carroll group and collaborators."
      ],
      blocks: [
        {
          kind: "figure", img: "assets/viz/erpr-chipseq.png",
          alt: "ChIP-seq heatmaps of ER binding with and without progestin, showing ER sites that are lost, retained and gained.",
          panelTitle: "ER binding redistributes with progesterone (ChIP-seq)",
          caption: 'ER&alpha; ChIP-seq read density at binding sites, vehicle vs + progestin. Activating PR redirects ER — in T47D ~14,223 sites are gained, 99% overlapping a PR peak. Illustrative heatmap. <span class="viz-src">· Mohammed et al., Nature 2015</span>'
        },
        {
          kind: "viz", type: "volcano", key: "erpr-deg",
          panelTitle: "The gene program that changes — hover for the gene",
          fallback: '<p class="viz-note">The interactive volcano needs JavaScript. In brief: the proliferative program (MYC, cyclins) falls and PR-induced genes rise.</p>'
        },
        {
          kind: "viz", type: "erpr", key: "erpr",
          panelTitle: "From bench to trial",
          fallback: '<p class="viz-note">Mechanism (Nature 2015) &rarr; the PIONEER trial &rarr; clinical benefit (Nature Cancer 2026).</p>'
        }
      ],
      leads: [{ name: "Hisham Mohammed", anchor: "hisham" }],
      methods: [{ label: "RIME", anchor: "tech-rime" }],
      refs: [
        { label: "Nature 2015", url: "https://www.nature.com/articles/nature14583" },
        { label: "PIONEER — Nature Cancer 2026", url: "https://www.nature.com/articles/s43018-025-01087-x" }
      ]
    },

    {
      id: "spatial-evolution", area: 2, status: "preprint", statusLabel: "In preparation",
      cleared: true,
      title: "Tracking metastatic breast cancer as it evolves",
      lede: "Serial spatial transcriptomics across a patient's treatment course, to see how resistance is organised in tissue.",
      body: [
        "Metastatic tumours survive treatment by changing — and those changes are organised in space. With OHSU's SMMART program, we profiled <strong>345,000 cells across ten serial biopsies</strong> from four patients, following each tumour through its treatment course over as long as three and a half years.",
        "Combining topic modelling of cell states (TITAN) with spatial tissue domains (STAGATE) and copy-number ground truth, we find tumours reach resistance by different routes — losing luminal identity, locking on estrogen signalling, or, as in the patient shown here, partitioning into spatially separate, drug-refractory invasive nests. The map below is that patient's final biopsy, drawn from real cell shapes — colour it by cell type, by spatial domain (the estrogen-receptor–positive core grading out to invasive nests), or by a gene, and hover any cell."
      ],
      blocks: [
        {
          kind: "figure", img: "assets/viz/spatial-concept.png",
          alt: "Schematic: serial biopsies of a metastatic ER+ patient during therapy feed single-cell spatial mapping and clonal-evolution analysis.",
          panelTitle: "The idea — serial spatial tracking of tumour evolution",
          caption: "Serial biopsies through a patient&rsquo;s treatment, profiled cell-by-cell in space, to follow how the tumour evolves."
        },
        {
          kind: "viz", type: "cells", key: "cosmx-d-bx3",
          panelTitle: "Patient D, final biopsy (Bx3, liver) — real cell shapes",
          fallback: '<figure><img src="assets/viz/cosmx-d-bx3-fallback.png" alt="Spatial map of cells in Patient D\'s final biopsy, showing the cancer core and separate invasive nests." loading="lazy"><figcaption class="viz-cap">Patient D, final biopsy — spatial cell map (static fallback).</figcaption></figure>'
        }
      ],
      leads: [
        { name: "Aaron Doe", anchor: "doe" },
        { name: "Aysegul Ors", anchor: "ors" },
        { name: "Hisham Mohammed", anchor: "hisham" }
      ],
      methods: [{ label: "CosMx spatial transcriptomics" }, { label: "TITAN", anchor: "tech-titan" }],
      refs: [{ label: "Doe et al., manuscript in preparation" }]
    },

    {
      id: "nmt-epigenetics", area: 2, status: "preprint", statusLabel: "In preparation",
      cleared: true,
      title: "Single-cell epigenetics of breast cancer",
      lede: "Reading DNA methylation, chromatin accessibility and transcription from the same single cell — and now in spatial tissue.",
      body: [
        "<strong>scNMT-seq</strong> reads three layers of regulation — the transcriptome, DNA methylation and chromatin accessibility — from one single cell. Reading methylation this deeply lets us treat a cell's epigenome as both a record of its ancestry and a driver of its current state; the approach was demonstrated at depth in single-cell multi-omics of development (Argelaguet et al., Nature 2019).",
        "We are extending it to breast tumours and into spatial tissue. The figures below show per-clone DNA methylation across the genome in one sample, and spatial DNA methylation in a tumour section."
      ],
      blocks: [
        {
          kind: "figure", img: "assets/viz/fb3-tracks-fallback.png",
          alt: "Per-clone DNA methylation tracks across the genome for sample FB3.",
          panelTitle: "Per-clone methylation across the genome (sample FB3)",
          caption: 'DNA methylation per inferred clone (pseudobulk), sample FB3. An interactive, scrollable genome browser is in progress. <span class="viz-src">· Manuscript in preparation</span>'
        }
      ],
      moreLabel: "More: spatial methylation & single-cell scale",
      more: [
        {
          kind: "figure", img: "assets/viz/idc6-spatial-meth.png",
          alt: "Spatial DNA methylation across an IDC tumour section, IDC6, with one panel per clone.",
          panelTitle: "Spatial DNA methylation (IDC6)",
          caption: 'DNA methylation mapped across an invasive ductal carcinoma section (IDC6), by clone. <span class="viz-src">· Manuscript in preparation</span>'
        },
        {
          kind: "note",
          html: 'A single human cell carries roughly <strong>30 million CpG sites</strong>. A planned view will let you open one cell of a given type and see its methylation at that scale — built first on a small pilot so it stays responsive.'
        }
      ],
      leads: [
        { name: "Hisham Mohammed", anchor: "hisham" },
        { name: "Aysegul Ors", anchor: "ors" },
        { name: "Hugo Cros", anchor: "cros" }
      ],
      methods: [{ label: "scNMT-seq", anchor: "tech-scnmt" }],
      refs: [
        { label: "scNMT-seq — Nat Commun 2018", url: "https://www.nature.com/articles/s41467-018-03149-4" },
        { label: "Argelaguet et al., Nature 2019", url: "https://www.nature.com/articles/s41586-019-1825-8" }
      ]
    }
  ];

  function vizBlock(b) {
    return '<div class="viz-panel">' +
      (b.panelTitle ? '<div class="viz-panel-title">' + esc(b.panelTitle) + "</div>" : "") +
      '<div class="viz" data-viz="' + esc(b.type) + '" data-key="' + esc(b.key) + '">' +
      '<div class="viz-fallback">' + (b.fallback || "") + "</div></div></div>";
  }
  function figureBlock(b) {
    return '<div class="viz-panel">' +
      (b.panelTitle ? '<div class="viz-panel-title">' + esc(b.panelTitle) + "</div>" : "") +
      '<figure class="viz"><img src="' + esc(b.img) + '" alt="' + esc(b.alt || "") + '" loading="lazy">' +
      (b.caption ? '<figcaption class="viz-cap">' + b.caption + "</figcaption>" : "") + "</figure></div>";
  }
  function noteBlock(b) { return '<p class="viz-note">' + (b.html || esc(b.text)) + "</p>"; }

  var STEP_ICONS = {
    cell: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.6"/>',
    snap: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M3.5 9h17M9 3.5v5.5"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none"/>',
    spectrum: '<path d="M3 14h2.6l1.8 6 3.4-13 2.4 9.5L14.6 10l1.6 4H21"/>',
    arrow: '<polyline points="9 5 16 12 9 19"/>'
  };
  function stepIcon(name, cls) {
    if (!STEP_ICONS[name]) return "";
    return '<svg class="' + cls + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + STEP_ICONS[name] + "</svg>";
  }
  function stepsBlock(b) {
    var items = (b.steps || []).map(function (s, i) {
      var arrow = i > 0 ? stepIcon("arrow", "rime-step-arrow") : "";
      return arrow + '<div class="rime-step">' + stepIcon(s.icon, "rime-step-icon") +
        "<h5>" + esc(s.title) + "</h5><p>" + esc(s.text) + "</p></div>";
    }).join("");
    return '<div class="viz-panel">' +
      (b.panelTitle ? '<div class="viz-panel-title">' + esc(b.panelTitle) + "</div>" : "") +
      '<div class="rime-steps">' + items + "</div>" +
      (b.note ? '<p class="viz-note">' + esc(b.note) + "</p>" : "") + "</div>";
  }
  function renderBlocks(arr) {
    return (arr || []).map(function (b) {
      return b.kind === "figure" ? figureBlock(b) : b.kind === "note" ? noteBlock(b) : b.kind === "steps" ? stepsBlock(b) : vizBlock(b);
    }).join("");
  }

  function metaRow(p) {
    var parts = [];
    if (p.leads && p.leads.length) parts.push("<span><b>" + (p.leads.length > 1 ? "Leads" : "Lead") + "</b> " +
      p.leads.map(function (l) { return l.anchor ? '<a href="team.html#' + esc(l.anchor) + '">' + esc(l.name) + "</a>" : esc(l.name); }).join(", ") + "</span>");
    if (p.methods && p.methods.length) parts.push("<span><b>Methods</b> " +
      p.methods.map(function (m) { return m.anchor ? '<a href="research.html#' + esc(m.anchor) + '">' + esc(m.label) + "</a>" : esc(m.label); }).join(", ") + "</span>");
    if (p.refs && p.refs.length) parts.push("<span><b>Related</b> " +
      p.refs.map(function (r) { return r.url ? '<a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.label) + "</a>" : esc(r.label); }).join(" · ") + "</span>");
    return parts.length ? '<div class="project-meta">' + parts.join("") + "</div>" : "";
  }

  function cardHTML(p) {
    var areaNum = p.area === 1 ? "01" : "02";
    var areaLabel = p.area === 1 ? "Proteomics of transcription-factor complexes" : "Single-cell &amp; spatial multiomics";
    var body = p.body ? (Array.isArray(p.body) ? p.body.map(function (x) { return "<p>" + x + "</p>"; }).join("") : p.body) : "";
    var more = (p.more && p.more.length)
      ? '<details class="project-more"><summary>' + esc(p.moreLabel || "More from this project") + "</summary>" + renderBlocks(p.more) + "</details>"
      : "";
    return '<article class="project-card" id="proj-' + esc(p.id) + '">' +
      '<div class="project-head"><span class="project-area"><a href="research.html#area-' + areaNum + '">Area ' + areaNum + "</a> · " + areaLabel + "</span>" +
      '<span class="project-status project-status--' + esc(p.status) + '">' + esc(p.statusLabel || p.status) + "</span></div>" +
      "<h3>" + esc(p.title) + "</h3>" +
      (p.lede ? '<p class="project-lede">' + esc(p.lede) + "</p>" : "") +
      (body ? '<div class="project-body">' + body + "</div>" : "") +
      renderBlocks(p.blocks) + more + metaRow(p) +
      "</article>";
  }

  var cleared = PROJECTS.filter(function (p) { return p.cleared !== false; });
  if (!cleared.length) { var sec = document.getElementById("projects"); if (sec) sec.style.display = "none"; return; }
  listEl.innerHTML = cleared.map(cardHTML).join("");
})();
