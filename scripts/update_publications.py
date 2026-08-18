#!/usr/bin/env python3
"""Regenerate js/publications-data.js from Hisham Mohammed's Semantic Scholar
record, with hand-curated corrections layered on from pub_overrides.json.

Usage: python3 scripts/update_publications.py
"""

import json
import re
import time
import urllib.request
import urllib.error
from pathlib import Path

# Semantic Scholar has split Hisham Mohammed's identity across several author
# profiles over time (common-name disambiguation drift). Each ID below has
# been manually verified to be genuinely his work (cross-checked against known
# collaborators/lab members). New papers occasionally land under yet another
# not-yet-seen ID. If a paper goes missing, check for a new author ID by DOI via
# https://api.semanticscholar.org/graph/v1/paper/DOI:<doi>?fields=authors
# and add it here.
AUTHOR_IDS = ["143970758", "2322812173", "2343538374", "2165146385"]
API_URL = (
    "https://api.semanticscholar.org/graph/v1/author/{author_id}/papers"
    "?fields=title,year,venue,authors,externalIds&offset={offset}&limit=100"
)
PREPRINT_VENUES = {"biorxiv", "medrxiv", "research square", "ssrn", "arxiv", "chemrxiv"}

ROOT = Path(__file__).resolve().parent.parent
ROSTER_PATH = ROOT / "scripts" / "lab_roster.json"
OVERRIDES_PATH = ROOT / "scripts" / "pub_overrides.json"
OUTPUT_PATH = ROOT / "js" / "publications-data.js"
TAGS_PATH = ROOT / "js" / "publications-tags.js"


def fetch_json(url, retries=5):
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.load(resp)
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < retries - 1:
                time.sleep(5 * (attempt + 1))
                continue
            raise


def fetch_papers():
    papers = []
    for i, author_id in enumerate(AUTHOR_IDS):
        if i:
            time.sleep(1)
        offset = 0
        while True:
            url = API_URL.format(author_id=author_id, offset=offset)
            payload = fetch_json(url)
            papers.extend(payload.get("data", []))
            if not payload.get("next"):
                break
            offset = payload["next"]
            time.sleep(1)
    return papers


def normalize_title(title):
    t = re.sub(r"\[.*?\]", "", title or "")
    t = re.sub(r"[^a-z0-9]+", " ", t.lower())
    return t.strip()


def initials_and_last(author_name):
    tokens = [t for t in re.split(r"\s+", author_name.strip()) if t]
    if not tokens:
        return None, None
    last = re.sub(r"[^A-Za-z'-]", "", tokens[-1])
    initials = "".join(tok[0].upper() for tok in tokens[:-1] if tok[0].isalpha())
    return last, initials


def build_author_string(api_authors, roster, name_fixes):
    fixes_lower = {k.lower(): v for k, v in name_fixes.items()}
    parts = []
    for a in api_authors:
        last, initials = initials_and_last(a.get("name", ""))
        if not last:
            continue
        last = fixes_lower.get(last.lower(), last)
        formatted = f"{last} {initials}".strip()
        key = (last.lower(), initials[0].lower() if initials else "")
        if key in roster:
            formatted = f"**{formatted}**"
        parts.append(formatted)
    return ", ".join(parts)


def load_roster():
    entries = json.loads(ROSTER_PATH.read_text())
    return {(e["last"].lower(), e["first"][0].lower()) for e in entries}


def load_overrides():
    return json.loads(OVERRIDES_PATH.read_text())


def paper_score(p):
    """Higher is better when choosing among same-titled duplicates:
    a published-venue DOI beats a preprint-server DOI beats no DOI."""
    has_doi = bool(p.get("externalIds", {}).get("DOI"))
    is_preprint = (p.get("venue") or "").strip().lower() in PREPRINT_VENUES
    if has_doi and not is_preprint:
        return 2
    if has_doi:
        return 1
    return 0


def dedupe(papers):
    by_title = {}
    for p in papers:
        key = normalize_title(p.get("title"))
        if not key:
            continue
        existing = by_title.get(key)
        if existing is None or paper_score(p) > paper_score(existing):
            by_title[key] = p
    return list(by_title.values())


def build_entries(papers, roster, overrides):
    patches = {
        normalize_title(p["match_title"]): p for p in overrides.get("patches", [])
    }
    excluded = {normalize_title(t) for t in overrides.get("exclude_titles", [])}

    entries = []
    for p in papers:
        title = p.get("title") or ""
        norm = normalize_title(title)
        if not norm or norm in excluded:
            continue
        if p.get("year") is None:
            continue

        patch = patches.get(norm, {})
        authors = patch.get("authors") or build_author_string(
            p.get("authors", []), roster, overrides.get("name_fixes", {})
        )
        if not authors:
            continue

        doi = p.get("externalIds", {}).get("DOI")
        entry = {
            "year": p["year"],
            "title": title,
            "authors": authors,
            "journal": patch.get("journal") or p.get("venue") or "",
            "url": patch.get("url") or (f"https://doi.org/{doi}" if doi else None),
        }
        note = patch.get("note")
        if note:
            entry["note"] = note
        entries.append(entry)

    for extra in overrides.get("extra", []):
        entries.append(extra)

    entries.sort(key=lambda e: (-e["year"], e["title"]))
    return entries


def js_string(value):
    return json.dumps(value, ensure_ascii=False)


def render_js(entries):
    lines = [
        "/* AUTO-GENERATED by scripts/update_publications.py. Do not edit by hand.",
        "   Source: Semantic Scholar authors " + ", ".join(AUTHOR_IDS) + " + scripts/pub_overrides.json.",
        "   Regenerate: python3 scripts/update_publications.py */",
        "",
        "const PUBS = [",
    ]
    for e in entries:
        lines.append("  {")
        lines.append(f"    year: {e['year']},")
        lines.append(f"    title: {js_string(e['title'])},")
        lines.append(f"    authors: {js_string(e['authors'])},")
        lines.append(f"    journal: {js_string(e['journal'])},")
        if e.get("note"):
            lines.append(f"    note: {js_string(e['note'])},")
        lines.append(f"    url: {js_string(e['url']) if e.get('url') else 'null'},")
        lines.append("  },")
    lines.append("];")
    lines.append("")
    return "\n".join(lines)


def report_untagged(entries):
    """js/publications-tags.js is hand-curated and this script never edits it,
    so flag new papers that would fall through to its keyword heuristics."""
    if not TAGS_PATH.exists():
        return
    src = TAGS_PATH.read_text()
    try:
        block = src.split("const PUB_TAGS_BY_TITLE = {", 1)[1].split("\n};", 1)[0]
    except IndexError:
        return
    tagged = {
        normalize_title(json.loads('"%s"' % m))
        for m in re.findall(r'\n  "((?:[^"\\]|\\.)*)":', block)
    }
    def is_abstract(e):
        # Mirrors isAbstract() in js/publications.js; these never render.
        title, note = e["title"], e.get("note") or ""
        return bool(
            re.match(r"\s*abstract\b", title, re.I)
            or re.search(r"\[abstract\]", title, re.I)
            or re.match(r"\s*abstract\b", note, re.I)
        )

    missing = [
        e["title"]
        for e in entries
        if not is_abstract(e) and normalize_title(e["title"]) not in tagged
    ]
    if missing:
        print(f"\n{len(missing)} publication(s) have no curated tag in {TAGS_PATH.name}:")
        for t in missing:
            print(f"  - {t}")


def main():
    roster = load_roster()
    overrides = load_overrides()
    papers = fetch_papers()
    papers = dedupe(papers)
    entries = build_entries(papers, roster, overrides)
    OUTPUT_PATH.write_text(render_js(entries))
    print(f"Wrote {len(entries)} publications to {OUTPUT_PATH}")
    report_untagged(entries)


if __name__ == "__main__":
    main()
