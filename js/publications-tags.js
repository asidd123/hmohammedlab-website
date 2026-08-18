/* Mohammed Lab: technology / research-area tags for the publications page.

   This file is hand-curated and is NOT touched by scripts/update_publications.py,
   so it survives regeneration of js/publications-data.js.

   Adding a new paper?
     1. Preferred: add its exact title to TAGS_BY_TITLE below with the tag ids it
        should carry. Titles are matched loosely (case, punctuation and bracketed
        segments are ignored), so paste the title as it appears in the data file.
     2. Anything not listed falls back to the keyword rules in TAG_RULES, which
        match against title + journal. The fallback is a safety net for freshly
        auto-imported papers, not a substitute for curation.

   Papers with no tags simply show no chips and appear only under "All". */

/* Ordered tag vocabulary. `group` drives which filter row a tag renders in. */
const PUB_TAG_DEFS = [
  { id: "rime",          label: "RIME & proteomics",          group: "technology" },
  { id: "multiome",      label: "Single-cell multiomics",     group: "technology" },
  { id: "scrna",         label: "Single-cell transcriptomics", group: "technology" },
  { id: "spatial",       label: "Spatial profiling",          group: "technology" },
  { id: "methylation",   label: "DNA methylation",            group: "technology" },
  { id: "chromatin",     label: "Chromatin & transcription",  group: "technology" },
  { id: "computational", label: "Computational methods",      group: "technology" },

  { id: "hormone",     label: "Hormone receptor signaling", group: "area" },
  { id: "breast",      label: "Breast cancer",              group: "area" },
  { id: "prostate",    label: "Prostate cancer",            group: "area" },
  { id: "blood",       label: "Blood & leukemia",           group: "area" },
  { id: "development", label: "Development & stem cells",   group: "area" },
];

const PUB_TAG_GROUPS = [
  { id: "technology", label: "Technology" },
  { id: "area", label: "Research area" },
];

/* Curated assignments, keyed by paper title. */
const PUB_TAGS_BY_TITLE = {
  "Robust and generalizable CNV detection for single-cell sequencing assays":
    ["computational"],
  "Serial Spatial Transcriptomics Reveal Divergent Routes to Therapy Resistance in Metastatic Breast Cancer":
    ["spatial", "breast"],
  "CHD8 interacts with BCL11A to induce oncogenic transcription in triple negative breast cancer":
    ["chromatin", "breast"],
  "JAK2 signalling to HNRNPA1 represses retrotransposon activity in haematopoietic stem cells":
    ["chromatin", "blood"],
  "Methylation dynamics in the decades preceding acute myeloid leukaemia":
    ["methylation", "computational", "blood"],
  "Progesterone receptor-dependent downregulation of MHC class I promotes tumor immune evasion and growth in breast cancer":
    ["hormone", "breast"],
  "Single-cell RNA sequencing reveals different cellular states in malignant cells and the tumor microenvironment in primary and metastatic ER-positive breast cancer":
    ["scrna", "hormone", "breast"],
  "Targeting the CD74 signaling axis suppresses inflammation and rescues defective hematopoiesis in RUNX1–familial platelet disorder":
    ["scrna", "blood"],
  "Novel FOXM1 inhibitor STL001 sensitizes human cancers to a broad-spectrum of cancer therapies":
    ["chromatin"],
  "Single-cell RNA sequencing reveals immunosuppressive pathways associated with metastatic breast cancer":
    ["scrna", "breast"],
  "Allele-specific gene regulation, phenotypes, and therapeutic vulnerabilities in estrogen receptor alpha mutant endometrial cancer":
    ["chromatin", "hormone"],
  "Clonal hematopoiesis related TET2 loss-of-function impedes IL1β-mediated epigenetic reprogramming in hematopoietic stem and progenitor cells":
    ["methylation", "chromatin", "blood"],
  "Low HER2 expression in normal breast epithelium enables dedifferentiation and malignant transformation via chromatin opening":
    ["chromatin", "breast"],
  "A Distinct Chromatin State Drives Therapeutic Resistance in Invasive Lobular Breast Cancer":
    ["chromatin", "hormone", "breast"],
  "Asxl1 Deletion Disrupts MYC and RNA Polymerase II Function in Granulocyte Progenitors":
    ["chromatin", "blood"],
  "Estrogen regulates divergent transcriptional and epigenetic cell states in breast cancer":
    ["multiome", "computational", "hormone", "breast"],
  "Development of 2-(5,6,7-Trifluoro-1H-Indol-3-yl)-quinoline-5-carboxamide as a Potent, Selective, and Orally Available Inhibitor of Human Androgen Receptor Targeting Its Binding Function-3 for the Treatment of Castration-Resistant Prostate Cancer":
    ["hormone", "prostate"],
  "Development of an Androgen Receptor Inhibitor Targeting the N-Terminal Domain of Androgen Receptor for Treatment of Castration Resistant Prostate Cancer":
    ["hormone", "prostate"],
  "Activating transcription factor-2 (ATF2) is a key determinant of resistance to endocrine treatment in an in vitro model of breast cancer":
    ["chromatin", "hormone", "breast"],
  "ERG-Mediated Coregulator Complex Formation Maintains Androgen Receptor Signaling in Prostate Cancer":
    ["rime", "chromatin", "hormone", "prostate"],
  "Proteogenomic analysis of Inhibitor of Differentiation 4 (ID4) in basal-like breast cancer":
    ["rime", "breast"],
  "Multi-omics profiling of mouse gastrulation at single cell resolution":
    ["multiome", "methylation", "development"],
  "Polymer Modeling Predicts Chromosome Reorganization in Senescence":
    ["computational", "chromatin"],
  "Single cell multi-omics profiling reveals a hierarchical epigenetic landscape during mammalian germ layer specification":
    ["multiome", "methylation", "development"],
  "Transcriptional Heterogeneity in Naive and Primed Human Pluripotent Stem Cells at Single-Cell Resolution":
    ["scrna", "development"],
  "A patient‐derived explant (PDE) model of hormone‐dependent cancer":
    ["hormone", "breast", "prostate"],
  "A reciprocal feedback between the PDZ binding kinase and androgen receptor drives prostate cancer":
    ["rime", "hormone", "prostate"],
  "Genome-Scale Oscillations in DNA Methylation during Exit from Pluripotency":
    ["methylation", "computational", "development"],
  "Lamina and Heterochromatin Direct Chromosome Organisation in Senescence and Progeria":
    ["computational", "chromatin"],
  "Single cell transcriptome analysis of human, marmoset and mouse embryos reveals common and divergent features of preimplantation development":
    ["scrna", "development"],
  "TRPS1 regulates estrogen-receptor binding and histone acetylation at enhancers":
    ["rime", "chromatin", "hormone", "breast"],
  "A non-catalytic role of TET3 promotes open chromatin and enhances global transcription":
    ["methylation", "chromatin", "development"],
  "Embryonic transcription factor SOX9 drives breast cancer endocrine resistance":
    ["chromatin", "hormone", "breast"],
  "Single-Cell Landscape of Transcriptional Heterogeneity and Cell Fate Decisions during Mouse Early Gastrulation":
    ["scrna", "development"],
  "Rapid immunoprecipitation mass spectrometry of endogenous proteins (RIME) for analysis of chromatin complexes":
    ["rime", "chromatin"],
  "Response and resistance to BET bromodomain inhibitors in triple negative breast cancer":
    ["rime", "chromatin", "breast"],
  "Topoisomerase II beta interacts with cohesin and CTCF at topological domain borders":
    ["chromatin"],
  "Choline Kinase Alpha as an Androgen Receptor Chaperone and Prostate Cancer Therapeutic Target":
    ["rime", "hormone", "prostate"],
  "Fgf and Esrrb integrate epigenetic and transcriptional networks that regulate self-renewal of trophoblast stem cells":
    ["chromatin", "development"],
  "Progesterone receptor modulates estrogen receptor-α action in breast cancer":
    ["rime", "chromatin", "hormone", "breast"],
  "RIME proteomics of estrogen and progesterone receptors in breast cancer":
    ["rime", "hormone", "breast"],
  "The forkhead transcription factor FOXK2 acts as a chromatin targeting factor for the BAP1-containing histone deubiquitinase complex":
    ["rime", "chromatin"],
  "The transcriptional co-repressor TLE3 suppresses basal signaling on a subset of estrogen receptor α target genes":
    ["chromatin", "hormone", "breast"],
  "Approaches for assessing and discovering protein interactions in cancer":
    ["rime"],
  "Endogenous purification reveals GREB1 as a key Estrogen Receptor regulatory factor":
    ["rime", "chromatin", "hormone", "breast"],
  "p21WAF1 is component of a positive feedback loop that maintains the p53 transcriptional program":
    ["chromatin"],
  /* Predates the lab's current directions; intentionally untagged. */
  "Inhibition of MT1-MMP activity using functional antibody fragments selected against its hemopexin domain":
    [],
};

/* Keyword fallback for papers absent from TAGS_BY_TITLE. Matched against
   "<title> <journal>" lowercased. Deliberately conservative. */
const PUB_TAG_RULES = {
  rime: /\brime\b|immunoprecipitation mass spec|mass spectrometry|proteomic|interactome|protein complex|protein interaction|coregulator complex/,
  multiome: /multi-?om|nmt-?seq|multiomic/,
  scrna: /single[- ]cell rna|scrna|single cell transcriptome|single-?cell transcriptom/,
  spatial: /\bspatial\b/,
  methylation: /methylat|\btet[23]\b|bisulfite|epigenetic clock/,
  chromatin: /chromatin|histone|enhancer|transcription factor|chip-?seq|atac|nucleosome|heterochromatin|epigenetic|cohesin|ctcf|topological domain/,
  computational: /model(?:ing|ling)|algorithm|machine learning|topic (?:model|inference)|computational|\bcnv detection\b|inference/,
  hormone: /estrogen|oestrogen|androgen|progesterone|endocrine|hormone|\bER-?positive\b|\bERα\b|receptor alpha/,
  breast: /breast|mammary|triple negative|\bher2\b/,
  prostate: /prostate|castration/,
  blood: /leukaem|leukem|h[ae]matopoie|myeloid|granulocyte|platelet|clonal h[ae]matopoiesis|stem and progenitor cell/,
  development: /gastrulation|embryo|pluripoten|stem cell|germ layer|trophoblast|preimplantation|development/,
};
