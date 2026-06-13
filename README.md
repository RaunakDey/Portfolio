# Raunak Dey — research portfolio

A single-page research portfolio: Bayesian inference, systems modeling, and scientific AI. Static, no build step, no dependencies. Visuals are inline SVG icons plus links to published work — no image files required.

## Go live on GitHub Pages (2 minutes)

1. Create a repo (e.g. `portfolio`) or use an existing one.
2. Drop these files in the repo root: `index.html`, `styles.css`, `script.js`.
3. Commit and push.
4. Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main` / `/root` → Save.
5. Wait ~1 min. Your site is at `https://<username>.github.io/<repo>/`.

Use the live URL in your email signature and as a redirect/link from your personal site.

## Editing

- **Colors / fonts:** the `:root` token block at the top of `styles.css`. Teal = Inference, violet = Systems Modeling.
- **Icons:** each card uses a small inline `<svg>` at the top of `.card__body`; it inherits the pillar color automatically.
- **Copy:** all text lives in `index.html`.
- **The ridgeline hero:** generated in `script.js` (stacked posterior densities). Tweak `ROWS` or the seed to restyle.

## Optional: social preview image

Drop a 1200×630 image at `assets/og.png` and uncomment the `og:image` line in `<head>` so links unfurl with a preview.

## Custom domain (optional)

Add a `CNAME` file with your domain, then point a CNAME DNS record at `<username>.github.io`.
