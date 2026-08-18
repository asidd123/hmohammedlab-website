# Hisham Mohammed Lab: Website

A modern, fast, dependency-free static website for the Mohammed Lab
(CEDAR, Knight Cancer Institute, OHSU). Redesigned from the original
WordPress site at [hmohammedlab.com](https://hmohammedlab.com/).

## Structure

```
index.html          Home: hero, stats, mission, research areas, featured papers
research.html       Research: primary areas + technologies (RIME, scNMT-seq, TITAN)
team.html           Team: current members + alumni
publications.html   Publications: searchable, grouped by year (data in js/publications.js)
contact.html        Join & Contact: addresses, email, recruiting info
css/style.css       All styling (design tokens at the top)
js/main.js          Nav, scroll animations, hero DNA helix
js/publications.js  Publication data + list renderer
assets/             Images (team photos in assets/img/team/)
```

No build step, no frameworks: plain HTML/CSS/JS. Works from any static host.

## Preview locally

```bash
cd "Lab Website"
python3 -m http.server 8000
# open http://localhost:8000
```

## Updating content

- **Add a publication**: add an entry to the `PUBS` array at the top of
  `js/publications.js` (year, title, authors, journal, url). Lab-member names
  wrapped in `**double asterisks**` render bold. The year groups, year-jump
  buttons, and paper count update automatically.
- **Add a team member**: copy any `<article class="member">` block in
  `team.html`, drop a square photo into `assets/img/team/`, and edit the
  name/role/bio/links.
- **Stats on the homepage**: edit the numbers in the `stats-grid` in `index.html`.

## Deploying

Any static host works. Easiest options:

1. **Netlify** (free): drag-and-drop this folder at https://app.netlify.com/drop,
   then add `hmohammedlab.com` as a custom domain and update DNS as instructed.
2. **GitHub Pages**: push this folder to a repo, enable Pages in Settings.
3. **Keep SiteGround**: upload these files via SiteGround's File Manager to
   `public_html` (back up / remove the WordPress install first).

After deploying behind the real domain, the `og:image`/`og:url` meta tags in
`index.html` already point at `hmohammedlab.com`.

## Notes

- Four team photos (Elisabeth, Hugo, William, Dimitri) were recovered from the
  Internet Archive because the originals returned 404 from the live WordPress
  uploads folder.
- Fonts (Fraunces, Inter, IBM Plex Mono) load from Google Fonts.
