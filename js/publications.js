/* Mohammed Lab — publication data + list renderer.
   Lab-member names are wrapped in ** ** and rendered bold. */

(function () {
  "use strict";

  const PUBS = [
    /* ---- 2023 ---- */
    {
      year: 2023,
      title: "Clonal hematopoiesis related TET2 loss-of-function impedes IL1β-mediated epigenetic reprogramming in hematopoietic stem and progenitor cells",
      authors: "McClatchy J, **Strogantsev R**, Wolfe E, Lin HY, Mohammadhosseini M, Davis BA, Eden C, Goldman D, Fleming WH, Conley P, Wu G, Cimmino L, **Mohammed H**, Agarwal A",
      journal: "Nature Communications",
      url: "https://doi.org/10.1038/s41467-023-43697-y",
    },
    {
      year: 2023,
      title: "Allele-Specific Gene Regulation, Phenotypes, and Therapeutic Vulnerabilities in Estrogen Receptor Alpha–Mutant Endometrial Cancer",
      authors: "Blanchard Z, Rush CM, Arnesen S, Vahrenkamp JM, Rodriguez AC, Jarboe EA, Brown C, Chang MEK, Flory MR, **Mohammed H**, Modzelewska K, Lum DH, Gertz J",
      journal: "Molecular Cancer Research",
      url: "https://doi.org/10.1158/1541-7786.MCR-22-0848",
    },
    {
      year: 2023,
      title: "Multi-omic single-cell approach reveals transcriptional and epigenetic plasticity in breast cancer [abstract]",
      authors: "**Mohammed H**",
      journal: "Cancer Research (AACR Annual Meeting 2023 Proceedings)",
      note: "Abstract nr 91",
      url: null,
    },
    {
      year: 2023,
      title: "Low HER2 expression in normal breast epithelium enables dedifferentiation and malignant transformation via chromatin opening",
      authors: "Hayat A, Carter EP, King HW, **Ors A**, **Doe A**, Teijeiro SA, Charrot S, Godinho S, Cutillas P, **Mohammed H**, et al.",
      journal: "Disease Models & Mechanisms",
      url: "https://journals.biologists.com/dmm/article/16/2/dmm049894/286826/Low-HER2-expression-in-normal-breast-epithelium",
    },
    {
      year: 2023,
      title: "Asxl1 deletion disrupts MYC and RNA polymerase II function in granulocyte progenitors",
      authors: "Braun TP, Estabrook J, Schonrock Z, Curtiss BM, Darmusey L, Macaraeg J, Enright T, Coblentz C, Callahan R, Yashar W, et al.",
      journal: "Leukemia",
      url: "https://www.nature.com/articles/s41375-022-01792-x",
    },

    /* ---- 2022 ---- */
    {
      year: 2022,
      title: "Estrogen regulates divergent transcriptional and epigenetic cell states in breast cancer",
      authors: "**Ors A**, Chitsazan AD, **Doe AR**, **Mulqueen RM**, **Ak C**, **Wen Y**, **Haverlack S**, **Handu M**, Naldiga S, Saldivar JC, et al.",
      journal: "Nucleic Acids Research",
      url: "https://academic.oup.com/nar/article/50/20/11492/6786216",
    },
    {
      year: 2022,
      title: "A Distinct Chromatin State Drives Therapeutic Resistance in Invasive Lobular Breast Cancer",
      authors: "Nardone A, Qiu X, Spisak S, Nagy Z, Feiglin A, Feit A, Feit GC, Xie Y, Font-Tello A, Guarducci C, et al.",
      journal: "Cancer Research",
      url: "https://aacrjournals.org/cancerres/article/82/20/3673/709641/A-Distinct-Chromatin-State-Drives-Therapeutic",
    },

    /* ---- 2021 ---- */
    {
      year: 2021,
      title: "Development of 2-(5,6,7-Trifluoro-1H-Indol-3-yl)-quinoline-5-carboxamide as a Potent, Selective, and Orally Available Inhibitor of Human Androgen Receptor Targeting Its Binding Function-3 for the Treatment of Castration-Resistant Prostate Cancer",
      authors: "Leblanc E, Ban F, Cavga AD, Lawn S, Huang CCF, Mohan S, Chang MEK, Flory MR, Ghaidi F, Lingadahalli S, Chen G, Yu IPL, Morin H, Lallous N, Gleave ME, **Mohammed H**, Young RN, Rennie PS, Lack NA, Cherkasov A",
      journal: "Journal of Medicinal Chemistry",
      url: "https://pubs.acs.org/doi/abs/10.1021/acs.jmedchem.1c00681",
    },
    {
      year: 2021,
      title: "Development of an Androgen Receptor Inhibitor Targeting the N-Terminal Domain of Androgen Receptor for Treatment of Castration Resistant Prostate Cancer",
      authors: "Ban F, Leblanc E, Cavga AD, Huang CCF, Flory MR, Zhang F, Chang MEK, Morin H, Lallous N, Singh K, Gleave ME, **Mohammed H**, Rennie PS, Lack NA, Cherkasov A",
      journal: "Cancers",
      url: "https://www.mdpi.com/2072-6694/13/14/3488/htm",
    },

    /* ---- 2020 ---- */
    {
      year: 2020,
      title: "Proteogenomic analysis of Inhibitor of Differentiation 4 (ID4) in basal-like breast cancer",
      authors: "Baker LA, Holliday H, Roden D, Krisp C, Wu SZ, Junankar S, Serandour AA, **Mohammed H**, Nair R, Sankaranarayanan G, Law AMK, McFarland A, Simpson PT, Lakhani S, Dodson E, Selinger C, Anderson L, Samimi G, Hacker NF, Lim E, Ormandy CJ, Naylor MJ, Simpson K, Nikolic I, O'Toole S, Kaplan W, Cowley MJ, Carroll JS, Molloy M, Swarbrick A",
      journal: "Breast Cancer Research",
      url: "https://breast-cancer-research.biomedcentral.com/articles/10.1186/s13058-020-01306-6",
    },
    {
      year: 2020,
      title: "ERG-mediated coregulator complex formation maintains androgen receptor signaling in prostate cancer",
      authors: "Shah N, Kesten N, Font-Tello A, Chang MEK, Vadhi R, Lim K, Flory MR, Cejas P, **Mohammed H**, Long HW, Brown M",
      journal: "Cancer Research",
      url: "https://cancerres.aacrjournals.org/content/80/21/4612.short",
    },
    {
      year: 2020,
      title: "ASXL1 Directs Neutrophilic Differentiation via Modulation of MYC and RNA Polymerase II",
      authors: "Braun TP, Estabrook J, Coleman DJ, Schonrock Z, Smith BM, Enright T, Coblentz C, Callahan R, **Mohammed H**, Druker BJ, Lusardi T, Maxson JE",
      journal: "bioRxiv",
      url: "https://www.biorxiv.org/content/10.1101/2020.09.14.295295v1",
    },
    {
      year: 2020,
      title: "The regulatory role of activating transcription factor-2 (ATF2) in modulating tamoxifen resistance in estrogen-receptor positive breast cancer",
      authors: "Giannoudis A, Malki MI, **Mohammed H**, Rudraraju B, Menon S, Ali S, Carroll JS, Palmieri C",
      journal: "Cancer Research",
      url: "https://cancerres.aacrjournals.org/content/80/4_Supplement/P6-04-18",
    },

    /* ---- 2019 ---- */
    {
      year: 2019,
      title: "Multi-omics profiling of mouse gastrulation at single-cell resolution",
      authors: "Argelaguet R*, Clark S*, **Mohammed H***, Stapel C, Krueger C, Kapourani CA, Xiang Y, Hanna C, Smallwood S, Ibarra-Soria X, Buettner F, Sanguinetti G, Krueger F, Xie W, Rugg-Gunn P, Kelsey G, Dean W, Nichols J, Stegle O, Marioni J, Reik W",
      journal: "Nature",
      note: "*Co-first authors",
      url: "https://www.nature.com/articles/s41586-019-1825-8",
    },
    {
      year: 2019,
      title: "Polymer Modeling predicts chromosome reorganization in senescence",
      authors: "Chiang M, Michieletto D, Brackley CA, Rattanavirotkul N, **Mohammed H**, Marenduzzo D, Chandra T",
      journal: "Cell Reports",
      url: "https://www.cell.com/cell-reports/fulltext/S2211-1247(19)31093-9",
    },
    {
      year: 2019,
      title: "Transcriptional Heterogeneity in Naive and Primed Human Pluripotent Stem Cells at Single-Cell Resolution",
      authors: "Messmer T, von Meyenn F, Savino A, Santos F, **Mohammed H**, Lun ATL, Marioni JC, Reik W",
      journal: "Cell Reports",
      url: "https://www.sciencedirect.com/science/article/pii/S2211124718320746",
    },

    /* ---- 2018 ---- */
    {
      year: 2018,
      title: "TRPS1 regulates estrogen receptor binding and histone acetylation at enhancers",
      authors: "**Mohammed H***, Serandour A*, Miremadi A, Mulder K, Carroll J",
      journal: "Oncogene",
      note: "*Co-first authors",
      url: "https://www.nature.com/articles/s41388-018-0312-2",
    },
    {
      year: 2018,
      title: "Single cell transcriptome analysis of human, marmoset and mouse embryos reveals common and divergent features of preimplantation development",
      authors: "Boroviak T, Stirparo GG, Dietmann S, Hernando-Herraez I, **Mohammed H**, Reik W, Smith A, Sasaki E, Nichols J, Bertone P",
      journal: "Development",
      url: "https://journals.biologists.com/dev/article/145/21/dev167833/48530/Single-cell-transcriptome-analysis-of-human",
    },
    {
      year: 2018,
      title: "A reciprocal feedback between the PDZ binding kinase and androgen receptor drives prostate cancer",
      authors: "Warren AY, Massie CE, Watt K, Luko K, Orafidiya F, Selth LA, **Mohammed H**, Chohan B, Menon S, Baridi A, Zhao W, Escrui C, D'Santos C, Yang X, Taylor C, Qureshi A, Zecchini VR, Shaw GL, Dehm SM, Mills IG, Carroll JS, Tilley WD, McEwan IJ, Baniahmad A, Neal DE, Asim M",
      journal: "Oncogene",
      url: "https://www.nature.com/articles/s41388-018-0501-z",
    },
    {
      year: 2018,
      title: "A patient derived explant (PDE) model of hormone dependent cancer",
      authors: "Centenera MM, Hickey TE, Jindal S, Ryan NK, Ravindranathan P, **Mohammed H**, Robinson JL, Schiewer MJ, Ma S, Kapur P, Sutherland PD, Hoffmann CE, Roehrborn CG, Gomella LG, Carroll JS, Birrell SN, Knudsen KE, Raj GV, Butler LM, Tilley WD",
      journal: "Molecular Oncology",
      url: "https://febs.onlinelibrary.wiley.com/doi/10.1002/1878-0261.12354",
    },
    {
      year: 2018,
      title: "Genome scale oscillations in DNA methylation during exit from pluripotency",
      authors: "Rulands S, Lee HJ, Clark SJ, Angermueller C, Smallwood SA, Krueger F, **Mohammed H**, Dean W, Nichols J, Rugg-Gunn P, Kelsey G, Stegle O, Simons BD, Reik W",
      journal: "Cell Systems",
      url: "https://www.cell.com/cell-systems/fulltext/S2405-4712(18)30279-5",
    },

    /* ---- 2017 ---- */
    {
      year: 2017,
      title: "Single-Cell Landscape of Transcriptional Heterogeneity and Cell Fate Decisions during Mouse Early Gastrulation",
      authors: "**Mohammed H***, Hernando-Herraez I*, Savino A*, Scialdone A, Macauley I, Mulas C, Andrews S, Chandra T, Voet T, Srinivas S, Dean W, Nichols J, Marioni J, Reik W",
      journal: "Cell Reports",
      note: "*Co-first authors",
      url: "https://www.cell.com/cell-reports/fulltext/S2211-1247(17)30961-0",
    },
    {
      year: 2017,
      title: "The embryonic transcription factor SOX9 drives breast cancer endocrine resistance",
      authors: "Jeselsohn R, Cornwell M, Pun M, Buchwalter G, Nguyen M, Bango C, Huang Y, Kuang Y, Paweletz C, Fu X, Detre S, Dodson A, **Mohammed H**, Carroll J, Bowden M, Rao P, Long H, Li F, Dowsett M, Schiff R, Brown M",
      journal: "PNAS",
      url: "https://www.pnas.org/content/114/22/E4482.long",
    },

    /* ---- 2016 ---- */
    {
      year: 2016,
      title: "Rapid Immunoprecipitation and Mass Spectrometry of Endogenous Proteins (RIME)",
      authors: "**Mohammed H***, Taylor C, Brown G, Papachristou E, Carroll J, D'Santos C*",
      journal: "Nature Protocols",
      note: "*Co-corresponding authors",
      url: "https://www.nature.com/articles/nprot.2016.020",
    },
    {
      year: 2016,
      title: "Topoisomerase II beta interacts with cohesin and CTCF at topological domain borders",
      authors: "Uusküla-Reimand L, Hou H, Samavarchi-Tehrani P, Vietri Rudan M, Liang M, Medina-Rivera A, **Mohammed H**, Schmidt D, Schwalie P, Young EJ, Reimand J, Hadjur S, Gingras AC, Wilson MD",
      journal: "Genome Biology",
      url: "https://genomebiology.biomedcentral.com/articles/10.1186/s13059-016-1043-8",
    },
    {
      year: 2016,
      title: "Response and resistance to BET bromodomain inhibitors in triple negative breast cancer",
      authors: "Shu S, Lin C, He HH, Doherty E, Brown J, **Mohammed H**, D'Santos C, McKeown M, Ott C, Qi J, Ni M, Rao P, Duarte M, Chiang CM, Anders L, Young RA, Carroll J, Long H, Brown M, Liu SX, Meyer CA, Bradner JE, Polyak K",
      journal: "Nature",
      url: "https://www.nature.com/articles/nature16508",
    },
    {
      year: 2016,
      title: "Choline kinase alpha is a novel androgen receptor chaperone and prostate cancer therapeutic target",
      authors: "Asim M, Warren A, Selth L, Zecchini H, Baridi A, Menon S, Madhu B, Escrio C, Lyons S, Zecchini V, Shaw G, Hessenkemper W, Russell R, **Mohammed H**, Qureshi A, Sriranjan R, Stefanos N, Lynch AG, Grigorenko E, Lamb A, Stark R, Rennie P, Baniahmad A, Carroll J, Griffiths J, Tavaré S, McEwan I, Mills I, Tilley W, Neal D",
      journal: "Journal of the National Cancer Institute",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4849803/",
    },

    /* ---- 2015 ---- */
    {
      year: 2015,
      title: "Progesterone receptor redirects ERα chromatin binding in breast cancer to elicit good clinical outcome",
      authors: "**Mohammed H**, Russell A, Stark R, Rueda OM, Hickey TE, Menon S, Saadi A, Raj GV, Brown GD, D'Santos C, Robinson JLL, Perou CM, Serandour AA, Launchbury R, Stingl J, Caldas C, Tilley WD, Carroll JS",
      journal: "Nature",
      url: "https://www.nature.com/articles/nature14583",
    },
    {
      year: 2015,
      title: "RIME proteomics of Estrogen and Progesterone receptors in breast cancer",
      authors: "D'Santos C, Carroll JS, **Mohammed H***",
      journal: "Data in Brief",
      note: "*Corresponding author",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4589795/",
    },
    {
      year: 2015,
      title: "Fgf and Esrrb integrate epigenetic and transcriptional networks that regulate self-renewal of Trophoblast Stem Cells",
      authors: "Latos PA, Goncalves A, Oxley D, **Mohammed H**, Turro E, Hemberger M",
      journal: "Nature Communications",
      url: "https://www.nature.com/articles/ncomms8776",
    },

    /* ---- 2014 ---- */
    {
      year: 2014,
      title: "The Transcriptional co-repressor TLE3 suppresses basal signaling on a subset of estrogen receptor α target genes",
      authors: "Jangal M, Courture JP, Bianco S, Magnani L, **Mohammed H**, Gévry N",
      journal: "Nucleic Acids Research",
      url: "https://academic.oup.com/nar/article/42/18/11339/2434887",
    },
    {
      year: 2014,
      title: "The forkhead transcription factor FOXK2 acts as a chromatin targeting factor for the BAP1-containing histone deubiquitinase complex",
      authors: "Ji Z, **Mohammed H**, Webber A, Ridsdale J, Han N, Carroll JS, Sharrocks AD",
      journal: "Nucleic Acids Research",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4041447/",
    },

    /* ---- 2013 ---- */
    {
      year: 2013,
      title: "Endogenous purification reveals GREB1 as a Key Estrogen Receptor regulatory factor",
      authors: "**Mohammed H**, D'Santos C, Serandour AA, Ali HR, Brown GD, Atkins A, Rueda OM, Holmes KA, Theodorcou V, Zwart W, Robinson JLL, Saadi A, Ross-Innes CS, Chin SF, Menon S, Stingl J, Palmieri C, Caldas C, Carroll JS",
      journal: "Cell Reports",
      url: "https://www.cell.com/cell-reports/fulltext/S2211-1247(13)00017-X",
    },
    {
      year: 2013,
      title: "Approaches for assessing and discovering protein interactions in cancer",
      authors: "**Mohammed H**, Carroll JS",
      journal: "Molecular Cancer Research",
      url: "https://mcr.aacrjournals.org/content/11/11/1295",
    },

    /* ---- 2012 ---- */
    {
      year: 2012,
      title: "Inhibition of MT1-MMP activity using functional antibody fragments selected against its hemopexin domain",
      authors: "Basu B, Correa de Sampaio P, **Mohammed H**, Fogarasi M, Corrie P, Watkins NA, Smethurst PA, English WR, Ouwehand WH, Murphy G",
      journal: "International Journal of Biochemistry & Cell Biology",
      url: "https://pubmed.ncbi.nlm.nih.gov/22138224/",
    },

    /* ---- 2011 ---- */
    {
      year: 2011,
      title: "p21(WAF1) is component of a positive feedback loop that maintains the p53 transcriptional program",
      authors: "Pang LY, Scott M, Hayward RL, **Mohammed H**, Whitelaw CB, Smith GC, Hupp TR",
      journal: "Cell Cycle",
      url: "https://pubmed.ncbi.nlm.nih.gov/21368573/",
    },
  ];

  /* ----- render ----- */

  const listEl = document.getElementById("pub-list");
  const jumpEl = document.getElementById("year-jump");
  const searchEl = document.getElementById("pub-search");
  const emptyEl = document.getElementById("pub-empty");
  const countEl = document.getElementById("pub-count");
  if (!listEl) return;

  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const boldNames = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  const linkIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

  const years = [...new Set(PUBS.map((p) => p.year))].sort((a, b) => b - a);

  if (countEl) countEl.textContent = PUBS.length;

  if (jumpEl) {
    jumpEl.innerHTML = years
      .map((y) => `<a href="#y${y}">${y}</a>`)
      .join("");
  }

  function pubHTML(p) {
    const title = p.url
      ? `<a href="${p.url}" target="_blank" rel="noopener">${esc(p.title)}</a>`
      : esc(p.title);
    return `<article class="pub" data-search="${esc(
      (p.title + " " + p.authors + " " + p.journal + " " + p.year).toLowerCase()
    )}">
      <h3 class="pub-title">${title}</h3>
      <p class="pub-authors">${boldNames(p.authors)}</p>
      <div class="pub-foot">
        <span class="pub-journal">${esc(p.journal)} · ${p.year}</span>
        ${p.note ? `<span class="pub-note">${esc(p.note)}</span>` : ""}
        ${
          p.url
            ? `<a class="pub-link" href="${p.url}" target="_blank" rel="noopener">View paper ${linkIcon}</a>`
            : ""
        }
      </div>
    </article>`;
  }

  listEl.innerHTML = years
    .map(
      (y) => `<section class="pub-year-group" id="y${y}">
        <div class="pub-year-head"><h2>${y}</h2></div>
        ${PUBS.filter((p) => p.year === y).map(pubHTML).join("")}
      </section>`
    )
    .join("");

  /* ----- search filter ----- */
  if (searchEl) {
    searchEl.addEventListener("input", () => {
      const q = searchEl.value.trim().toLowerCase();
      let any = false;
      listEl.querySelectorAll(".pub").forEach((el) => {
        const hit = !q || el.dataset.search.includes(q);
        el.style.display = hit ? "" : "none";
        if (hit) any = true;
      });
      listEl.querySelectorAll(".pub-year-group").forEach((group) => {
        const visible = [...group.querySelectorAll(".pub")].some(
          (el) => el.style.display !== "none"
        );
        group.style.display = visible ? "" : "none";
      });
      if (emptyEl) emptyEl.style.display = any ? "none" : "block";
    });
  }
})();
