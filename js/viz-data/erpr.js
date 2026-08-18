/* Mohammed Lab: ER/PR bench-to-trial timeline (Concept 2).
   The schematic was replaced by a real static ChIP-seq figure + an RNA volcano on the
   card; this dataset now carries the translational timeline ending on the PIONEER result. */
(function () {
  var L = (window.LabViz = window.LabViz || {}); L.data = L.data || {};
  L.data["erpr"] = {
    timeline: [
      { year: "2015", title: "Mechanism", text: "RIME and ChIP-seq show progesterone receptor associates with ER and redirects its binding across the genome.", icon: "flask" },
      { year: "2015", title: "Better outcome", text: "The PR-directed binding program marks ER+ tumours with a more favourable clinical course.", icon: "trend" },
      { year: "2017 →", title: "PIONEER trial", text: "A window-of-opportunity trial adds a PR agonist (megestrol) to letrozole in early ER+ breast cancer.", icon: "clipboard" },
      { year: "2026", title: "Clinical benefit", text: "PIONEER meets its endpoint: adding the PR agonist further lowers tumour proliferation.", icon: "heart", result: true, stat: { v: "↓ Ki67", l: "megestrol + letrozole vs letrozole (P = 0.013)" } }
    ],
    caption: "From mechanism to clinic: progesterone-receptor activity redirects ER binding (Nature 2015), and the PIONEER trial it informed later showed a clinical benefit.",
    source: { label: "Mohammed et al., Nature 2015; PIONEER, Baird et al., Nature Cancer 2026", url: "https://www.nature.com/articles/nature14583" },
    updated: "Jun 2026"
  };
})();
