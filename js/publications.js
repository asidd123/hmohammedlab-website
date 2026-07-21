/* Mohammed Lab — publication list renderer.
   Publication data (PUBS) lives in js/publications-data.js, auto-generated
   by scripts/update_publications.py. Lab-member names are wrapped in
   ** ** and rendered bold. */

(function () {
  "use strict";

  /* eslint-disable no-undef -- PUBS comes from publications-data.js, loaded first */

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
        <span class="pub-journal">${p.journal ? esc(p.journal) + " · " : ""}${p.year}</span>
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
