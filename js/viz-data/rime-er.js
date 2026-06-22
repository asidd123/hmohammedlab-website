/* Mohammed Lab — RIME interactomes (Concept 1).
   A small, curated, illustrative gallery of endogenous RIME experiments — different baits
   and conditions — drawn from the lab's RIME work (Mohammed et al., Cell Reports 2013;
   Nature 2015). Functional classes are shared; each dataset is one bait/condition. Not the
   full mass-spectrometry hit lists — enough to convey what RIME reveals. */
(function () {
  var L = (window.LabViz = window.LabViz || {}); L.data = L.data || {};

  var CR2013 = { label: "Mohammed et al., Cell Reports 2013", url: "https://www.cell.com/cell-reports/fulltext/S2211-1247(13)00017-X" };
  var NAT2015 = { label: "Mohammed et al., Nature 2015", url: "https://www.nature.com/articles/nature14583" };

  L.data["rime-er"] = {
    classes: [
      { key: "tf",    label: "Pioneer / transcription factors", color: "#7a3b69" },
      { key: "coact", label: "Coactivators",                    color: "#8a2424" },
      { key: "corep", label: "Corepressors",                    color: "#2f5f8a" },
      { key: "chrom", label: "Chromatin remodellers",           color: "#3a93c4" },
      { key: "kin",   label: "Kinases / chaperones",            color: "#e0a33a" }
    ],
    updated: "Jun 2026",
    datasets: [
      {
        key: "er-estrogen", label: "ER · estrogen",
        center: { id: "ER", label: "Estrogen receptor (ESR1)" },
        caption: "ER with estrogen — the receptor assembles its activating complex: pioneer factors, p160 coactivators (SRC-1/2/3), p300/CBP and GREB1.",
        source: CR2013,
        nodes: [
          { id: "FOXA1", name: "Forkhead box A1", cls: "tf", role: "Pioneer factor; opens chromatin for ER" },
          { id: "GATA3", name: "GATA-binding factor 3", cls: "tf", role: "Luminal TF co-binding ER enhancers" },
          { id: "TFAP2C", name: "AP-2 gamma", cls: "tf", role: "TF co-occupying ER sites" },
          { id: "PGR", name: "Progesterone receptor", cls: "tf", role: "Associates with ER (see PR bait)" },
          { id: "NR2F2", name: "COUP-TFII", cls: "tf", role: "Nuclear-receptor co-factor", novel: true },
          { id: "KLF4", name: "Kruppel-like factor 4", cls: "tf", role: "TF at ER enhancers", novel: true },
          { id: "RARA", name: "Retinoic acid receptor a", cls: "tf", role: "Nuclear-receptor crosstalk" },
          { id: "GREB1", name: "Growth regulation by estrogen 1", cls: "coact", role: "Chromatin-bound ER co-activator", novel: true },
          { id: "NCOA3", name: "SRC-3 / AIB1", cls: "coact", role: "p160 coactivator" },
          { id: "NCOA1", name: "SRC-1", cls: "coact", role: "p160 coactivator" },
          { id: "NCOA2", name: "SRC-2 / GRIP1", cls: "coact", role: "p160 coactivator" },
          { id: "EP300", name: "p300", cls: "coact", role: "Histone acetyltransferase" },
          { id: "CREBBP", name: "CBP", cls: "coact", role: "Histone acetyltransferase" },
          { id: "CARM1", name: "CARM1", cls: "coact", role: "Arginine methyltransferase coactivator" },
          { id: "MED1", name: "Mediator subunit 1", cls: "coact", role: "Bridges ER to RNA Pol II" },
          { id: "DDX5", name: "p68 RNA helicase", cls: "coact", role: "ER coactivator" },
          { id: "DDX17", name: "p72 RNA helicase", cls: "coact", role: "ER coactivator" },
          { id: "NRIP1", name: "RIP140", cls: "corep", role: "Attenuating co-factor" },
          { id: "KDM1A", name: "LSD1", cls: "chrom", role: "Histone demethylase" },
          { id: "CHD4", name: "NuRD ATPase", cls: "chrom", role: "Chromatin remodeller" },
          { id: "SMARCA4", name: "BRG1", cls: "chrom", role: "SWI/SNF ATPase" },
          { id: "HDAC1", name: "Histone deacetylase 1", cls: "chrom", role: "Deacetylase" },
          { id: "HSP90AA1", name: "HSP90", cls: "kin", role: "Chaperone stabilising ER" },
          { id: "CDK7", name: "CDK7 / TFIIH", cls: "kin", role: "Phosphorylates ER (Ser118)" },
          { id: "HSPA8", name: "HSC70", cls: "kin", role: "Chaperone" }
        ]
      },
      {
        key: "er-anti", label: "ER · anti-estrogen",
        center: { id: "ER", label: "Estrogen receptor (ESR1)" },
        caption: "ER with an anti-estrogen (e.g. tamoxifen) — coactivators fall away and ER instead recruits corepressors (NCoR/SMRT, RIP140) and the NuRD complex: the switch that silences its targets.",
        source: CR2013,
        nodes: [
          { id: "FOXA1", name: "Forkhead box A1", cls: "tf", role: "Pioneer factor still marking ER sites" },
          { id: "GATA3", name: "GATA-binding factor 3", cls: "tf", role: "Luminal TF" },
          { id: "TFAP2C", name: "AP-2 gamma", cls: "tf", role: "TF at ER sites" },
          { id: "NCOR1", name: "N-CoR", cls: "corep", role: "Nuclear-receptor corepressor" },
          { id: "NCOR2", name: "SMRT", cls: "corep", role: "Nuclear-receptor corepressor" },
          { id: "NRIP1", name: "RIP140", cls: "corep", role: "Ligand-dependent corepressor" },
          { id: "LCOR", name: "Ligand-dependent corepressor", cls: "corep", role: "Attenuates ER transcription" },
          { id: "PHB2", name: "REA", cls: "corep", role: "Repressor of ER activity" },
          { id: "HDAC1", name: "Histone deacetylase 1", cls: "corep", role: "Deacetylase in repressive complex" },
          { id: "HDAC2", name: "Histone deacetylase 2", cls: "corep", role: "Deacetylase in repressive complex" },
          { id: "KDM1A", name: "LSD1", cls: "chrom", role: "Histone demethylase (CoREST/NuRD)" },
          { id: "CHD4", name: "NuRD ATPase", cls: "chrom", role: "NuRD remodeller" },
          { id: "MTA1", name: "MTA1", cls: "chrom", role: "NuRD scaffold" },
          { id: "MTA2", name: "MTA2", cls: "chrom", role: "NuRD scaffold" },
          { id: "GATAD2B", name: "GATAD2B", cls: "chrom", role: "NuRD subunit" },
          { id: "ARID1A", name: "ARID1A", cls: "chrom", role: "SWI/SNF subunit" },
          { id: "HSP90AA1", name: "HSP90", cls: "kin", role: "Chaperone stabilising ER" }
        ]
      },
      {
        key: "pr", label: "PR · progesterone",
        center: { id: "PR", label: "Progesterone receptor (PGR)" },
        caption: "Progesterone receptor co-purifies ER itself (ESR1) along with shared pioneer factors and coactivators — the molecular basis for PR redirecting ER across the genome (Nature 2015).",
        source: NAT2015,
        nodes: [
          { id: "ESR1", name: "Estrogen receptor", cls: "tf", role: "The crosstalk partner pulled down by PR", novel: true },
          { id: "FOXA1", name: "Forkhead box A1", cls: "tf", role: "Shared pioneer factor" },
          { id: "GATA3", name: "GATA-binding factor 3", cls: "tf", role: "Shared luminal TF" },
          { id: "NR2F2", name: "COUP-TFII", cls: "tf", role: "Nuclear-receptor co-factor" },
          { id: "NCOA3", name: "SRC-3 / AIB1", cls: "coact", role: "p160 coactivator" },
          { id: "NCOA1", name: "SRC-1", cls: "coact", role: "p160 coactivator" },
          { id: "EP300", name: "p300", cls: "coact", role: "Histone acetyltransferase" },
          { id: "CREBBP", name: "CBP", cls: "coact", role: "Histone acetyltransferase" },
          { id: "MED1", name: "Mediator subunit 1", cls: "coact", role: "Bridges to RNA Pol II" },
          { id: "GREB1", name: "GREB1", cls: "coact", role: "Shared chromatin co-activator" },
          { id: "NRIP1", name: "RIP140", cls: "corep", role: "Attenuating co-factor" },
          { id: "NCOR1", name: "N-CoR", cls: "corep", role: "Nuclear-receptor corepressor" },
          { id: "KDM1A", name: "LSD1", cls: "chrom", role: "Histone demethylase" },
          { id: "CHD4", name: "NuRD ATPase", cls: "chrom", role: "Chromatin remodeller" },
          { id: "SMARCA4", name: "BRG1", cls: "chrom", role: "SWI/SNF ATPase" },
          { id: "HSP90AA1", name: "HSP90", cls: "kin", role: "Chaperone" },
          { id: "HSPA8", name: "HSC70", cls: "kin", role: "Chaperone" }
        ]
      },
      {
        key: "greb1", label: "GREB1",
        center: { id: "GREB1", label: "GREB1" },
        caption: "Reciprocally, pulling on GREB1 co-purifies ER and shared coactivators — confirming GREB1 sits inside the ER complex rather than alongside it.",
        source: CR2013,
        nodes: [
          { id: "ESR1", name: "Estrogen receptor", cls: "tf", role: "Pulled down by GREB1", novel: true },
          { id: "FOXA1", name: "Forkhead box A1", cls: "tf", role: "Shared pioneer factor" },
          { id: "GATA3", name: "GATA-binding factor 3", cls: "tf", role: "Shared luminal TF" },
          { id: "NCOA3", name: "SRC-3 / AIB1", cls: "coact", role: "p160 coactivator" },
          { id: "NCOA1", name: "SRC-1", cls: "coact", role: "p160 coactivator" },
          { id: "EP300", name: "p300", cls: "coact", role: "Histone acetyltransferase" },
          { id: "CREBBP", name: "CBP", cls: "coact", role: "Histone acetyltransferase" },
          { id: "KDM1A", name: "LSD1", cls: "chrom", role: "Histone demethylase" },
          { id: "CHD4", name: "NuRD ATPase", cls: "chrom", role: "Chromatin remodeller" },
          { id: "HSP90AA1", name: "HSP90", cls: "kin", role: "Chaperone" }
        ]
      }
    ]
  };
})();
