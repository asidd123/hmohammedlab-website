/* Mohammed Lab: publication list renderer.
   Publication data (PUBS) lives in js/publications-data.js, auto-generated
   by scripts/update_publications.py. Lab-member names are wrapped in
   ** ** and rendered bold. Technology / research-area tags come from the
   hand-curated js/publications-tags.js. */

(function () {
  "use strict";

  /* eslint-disable no-undef -- PUBS comes from publications-data.js, tag tables
     from publications-tags.js; both are loaded first */

  /* ----- render ----- */

  const listEl = document.getElementById("pub-list");
  const jumpEl = document.getElementById("year-jump");
  const searchEl = document.getElementById("pub-search");
  const filterEl = document.getElementById("pub-filter");
  const panelEl = document.getElementById("pub-filter-panel");
  const btnEl = document.getElementById("pub-filter-btn");
  const badgeEl = document.getElementById("pub-filter-badge");
  const activeEl = document.getElementById("pub-active");
  const emptyEl = document.getElementById("pub-empty");
  const countEl = document.getElementById("pub-count");
  const resultEl = document.getElementById("pub-result-count");
  if (!listEl) return;

  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const boldNames = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  const linkIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

  const closeIcon =
    '<svg class="pub-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>';

  const isAbstract = (p) =>
    /^\s*abstract\b/i.test(p.title) || /\[abstract\]/i.test(p.title) ||
    (p.note && /^\s*abstract\b/i.test(p.note));
  const papers = PUBS.filter((p) => !isAbstract(p));

  const years = [...new Set(papers.map((p) => p.year))].sort((a, b) => b - a);

  if (countEl) countEl.textContent = papers.length;

  /* ----- tagging ----- */

  const hasTags = typeof PUB_TAG_DEFS !== "undefined";
  const tagLabel = {};
  if (hasTags) PUB_TAG_DEFS.forEach((t) => (tagLabel[t.id] = t.label));

  /* Same shape as normalize_title() in scripts/update_publications.py: drop
     bracketed segments, then reduce everything else to single-spaced a-z0-9. */
  const normTitle = (t) =>
    (t || "")
      .replace(/\[.*?\]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const curated = {};
  if (hasTags) {
    Object.keys(PUB_TAGS_BY_TITLE).forEach((title) => {
      curated[normTitle(title)] = PUB_TAGS_BY_TITLE[title];
    });
  }

  function tagsFor(p) {
    if (!hasTags) return [];
    const explicit = curated[normTitle(p.title)];
    const ids = explicit
      ? explicit.slice()
      : Object.keys(PUB_TAG_RULES).filter((id) =>
          PUB_TAG_RULES[id].test((p.title + " " + (p.journal || "")).toLowerCase())
        );
    /* Keep the canonical vocabulary order regardless of how they were listed. */
    return PUB_TAG_DEFS.map((t) => t.id).filter((id) => ids.indexOf(id) !== -1);
  }

  papers.forEach((p) => {
    p._tags = tagsFor(p);
    p._search = (
      p.title + " " + p.authors + " " + p.journal + " " + p.year + " " +
      p._tags.map((id) => tagLabel[id]).join(" ")
    ).toLowerCase();
  });

  /* ----- publication cards ----- */

  function tagChips(p) {
    if (!p._tags.length) return "";
    return `<div class="pub-tags">${p._tags
      .map(
        (id) =>
          `<button type="button" class="pub-tag" data-tag="${id}" title="Filter by ${esc(
            tagLabel[id]
          )}">${esc(tagLabel[id])}</button>`
      )
      .join("")}</div>`;
  }

  function pubHTML(p) {
    const title = p.url
      ? `<a href="${p.url}" target="_blank" rel="noopener">${esc(p.title)}</a>`
      : esc(p.title);
    return `<article class="pub" data-tags="${p._tags.join(" ")}" data-search="${esc(
      p._search
    )}">
      <h3 class="pub-title">${title}</h3>
      <p class="pub-authors">${boldNames(p.authors)}</p>
      <div class="pub-foot">
        <span class="pub-journal">${p.journal ? esc(p.journal) + " · " : ""}${p.year}</span>
        ${p.note ? `<span class="pub-note">${esc(p.note)}</span>` : ""}
        ${
          p.url
            ? `<a class="pub-link" href="${p.url}" target="_blank" rel="noopener">View paper ${linkIcon}</a>`
            : ""
        }
      </div>
      ${tagChips(p)}
    </article>`;
  }

  listEl.innerHTML = years
    .map(
      (y) => `<section class="pub-year-group" id="y${y}">
        <div class="pub-year-head"><h2>${y}</h2></div>
        ${papers.filter((p) => p.year === y).map(pubHTML).join("")}
      </section>`
    )
    .join("");

  if (jumpEl) {
    jumpEl.innerHTML = years
      .map((y) => `<a href="#y${y}" data-year="${y}">${y}</a>`)
      .join("");
  }

  /* ----- filter dropdown ----- */

  const active = new Set();

  const usedTags = hasTags
    ? PUB_TAG_DEFS.filter((t) => papers.some((p) => p._tags.indexOf(t.id) !== -1))
    : [];

  if (!usedTags.length && filterEl) filterEl.hidden = true;

  if (panelEl && usedTags.length) {
    panelEl.innerHTML =
      `<div class="pub-panel-head">
         <span>Filter by technology or research area</span>
         <button type="button" class="pub-panel-reset" id="pub-clear" hidden>Reset</button>
       </div>` +
      PUB_TAG_GROUPS.map((g) => {
        const tags = usedTags.filter((t) => t.group === g.id);
        if (!tags.length) return "";
        return `<div class="pub-filter-group">
          <span class="pub-filter-label">${esc(g.label)}</span>
          <div class="pub-filter-tags">
            ${tags
              .map(
                (t) =>
                  `<button type="button" class="pub-chip" data-tag="${t.id}" aria-pressed="false">
                     ${esc(t.label)} <span class="pub-chip-n"></span>
                   </button>`
              )
              .join("")}
          </div>
        </div>`;
      }).join("");
  }

  const chips = panelEl ? [...panelEl.querySelectorAll(".pub-chip")] : [];
  const clearEl = document.getElementById("pub-clear");

  /* ----- open / close ----- */

  function setOpen(open) {
    if (!panelEl || !btnEl) return;
    panelEl.hidden = !open;
    btnEl.setAttribute("aria-expanded", open ? "true" : "false");
    btnEl.classList.toggle("is-open", open);
  }

  if (btnEl) {
    btnEl.addEventListener("click", (e) => {
      e.stopPropagation();
      setOpen(panelEl.hidden);
    });
  }
  if (panelEl) panelEl.addEventListener("click", (e) => e.stopPropagation());

  document.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !panelEl || panelEl.hidden) return;
    setOpen(false);
    if (btnEl) btnEl.focus();
  });

  /* ----- apply search + tag filters ----- */

  function apply() {
    const q = searchEl ? searchEl.value.trim().toLowerCase() : "";
    let shown = 0;

    listEl.querySelectorAll(".pub").forEach((el) => {
      const searchHit = !q || el.dataset.search.includes(q);
      const elTags = el.dataset.tags ? el.dataset.tags.split(" ") : [];
      const tagHit =
        !active.size || elTags.some((id) => active.has(id));
      const hit = searchHit && tagHit;
      el.hidden = !hit;
      if (hit) shown++;
    });

    listEl.querySelectorAll(".pub-year-group").forEach((group) => {
      const visible = [...group.querySelectorAll(".pub")].some((el) => !el.hidden);
      group.hidden = !visible;
      const link = jumpEl && jumpEl.querySelector(`[data-year="${group.id.slice(1)}"]`);
      if (link) link.classList.toggle("is-empty", !visible);
    });

    /* Chip counts reflect the current search box only, so the numbers stay
       stable as tags are toggled on and off (tag selection is an OR). */
    chips.forEach((chip) => {
      const id = chip.dataset.tag;
      const n = papers.filter(
        (p) => p._tags.indexOf(id) !== -1 && (!q || p._search.includes(q))
      ).length;
      const nEl = chip.querySelector(".pub-chip-n");
      if (nEl) nEl.textContent = n;
      chip.classList.toggle("is-muted", n === 0);
      const on = active.has(id);
      chip.classList.toggle("is-on", on);
      chip.setAttribute("aria-pressed", on ? "true" : "false");
    });

    listEl.querySelectorAll(".pub-tag").forEach((t) => {
      t.classList.toggle("is-on", active.has(t.dataset.tag));
    });

    /* Collapsed state still has to show what's on, so mirror the active tags
       as removable chips under the search bar. */
    if (activeEl) {
      const on = PUB_TAG_DEFS.filter((t) => active.has(t.id));
      activeEl.hidden = !on.length;
      activeEl.innerHTML = on.length
        ? `<span class="pub-active-label">Filtering by</span>` +
          on
            .map(
              (t) =>
                `<button type="button" class="pub-active-chip" data-tag="${t.id}" aria-label="Remove ${esc(
                  t.label
                )} filter">${esc(t.label)} ${closeIcon}</button>`
            )
            .join("") +
          `<button type="button" class="pub-active-clear" data-clear="1">Clear all</button>`
        : "";
    }

    if (badgeEl) {
      badgeEl.textContent = active.size;
      badgeEl.hidden = !active.size;
    }
    if (clearEl) clearEl.hidden = !active.size;
    if (emptyEl) emptyEl.style.display = shown ? "none" : "block";
    if (resultEl) {
      resultEl.textContent =
        shown === papers.length
          ? `${papers.length} publications`
          : `${shown} of ${papers.length} publications`;
    }
  }

  function toggle(id) {
    if (active.has(id)) active.delete(id);
    else active.add(id);
    apply();
  }

  chips.forEach((chip) =>
    chip.addEventListener("click", () => toggle(chip.dataset.tag))
  );

  listEl.addEventListener("click", (e) => {
    const t = e.target.closest(".pub-tag");
    if (!t) return;
    toggle(t.dataset.tag);
    if (filterEl) filterEl.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  if (activeEl) {
    activeEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-tag], [data-clear]");
      if (!btn) return;
      if (btn.dataset.clear) active.clear();
      else active.delete(btn.dataset.tag);
      apply();
    });
  }

  if (clearEl) {
    clearEl.addEventListener("click", () => {
      active.clear();
      apply();
    });
  }

  if (searchEl) searchEl.addEventListener("input", apply);

  apply();
})();
