# The Dimensional Forge — website

Static site for **The Dimensional Forge** (Sean Neal, Indianapolis), served by GitHub Pages at
**https://dimensional-forge.github.io/**. No build step: edit the files, commit, push to `main`,
and Pages redeploys in about a minute.

## Pages

| File | What it is |
|---|---|
| `index.html` | Landing page: hero, services, process, past work (accepted proposals), reviews, about, start a project, shop |
| `portfolio.html` | Portfolio: career milestones, client engagements, patents & credentials, CAD gallery, the Forge Lab |
| `The_Dimensional_Forge_Method.html` | The Forge Method (six phases). Self-contained styles; its nav mirrors `assets/css/styles.css` |
| `print-estimator.html` | 3D print estimator (self-contained) |
| `venn-portfolio.html`, `light-bar-floor-bracket-v2-1.html` | VENN agent write-up and its linked sub-page (self-contained) |
| `404.html` | Not-found page. Uses root-absolute paths (`/assets/...`) because Pages serves it at any URL |

## Layout

```
assets/
  css/styles.css        shared styles for index, portfolio and 404
  js/site.js            embers, mobile nav, nav highlight, VENN widget (all pages that load it)
  js/proposals.js       accepted-proposal data + pop-up (any element with data-proposal="id")
  js/reviews.js         client reviews from the Google Sheet (Apps Script endpoint)
  js/home.js            landing page: inquiry form, featured proposals, Substack card, old-link redirects
  js/model-viewer.js    CAD gallery (Three.js STL viewer, loaded as an ES module)
  img/                  photos, product cut-outs, badges, line art
  models/               STL files for the CAD gallery
favicon.svg, robots.txt, sitemap.xml
latest-post.json        written daily by .github/workflows/fetch-latest-post.yml
```

## Common edits

**Add a CAD model** — copy the STL to `assets/models/`, then add one entry to the JSON list in the
`<script type="application/json" class="mv-data">` block in `portfolio.html`:

```json
{ "name": "Model Name", "category": "Category · type", "src": "assets/models/file.stl",
  "summary": "One or two sentences.", "tags": ["Tag", "Tag"],
  "link": "https://… (optional download page)", "proposal": "proposal-id (optional)" }
```

Keep STLs under ~5 MB; each one downloads only when selected. Only publish client models with the
client's written permission.

**Add a credential** — copy a `pf-cred pf-cred-badge` card in the *Education & Credentials* row of
`portfolio.html`. Put the badge image in `assets/img/` (WebP, ~640 px wide).

**Add an accepted proposal** — add an entry to `PROPOSALS` in `assets/js/proposals.js` and a
`proposal-card` with the same `data-proposal` id in `index.html`.

**Product images** — transparent WebP in `assets/img/`, placed with
`<img class="pf-cutout" …>` inside a row's `pf-media`.

## Conventions

- Brand tokens (`--df-*` colors, gradient, Audiowide / Inter / JetBrains Mono) live at the top of `styles.css`.
- Forge Method phases are 0–5 with the names used on the Method page.
- Text files use LF line endings (`.gitattributes`).
