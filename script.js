/* ============================================================
   Raunak Dey — Scientific AI portfolio
   Vanilla JS, no dependencies. Safe to host on GitHub Pages as-is.
   ============================================================ */

(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = "© " + new Date().getFullYear();

  /* ---------- mobile nav ---------- */
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.hidden = open;
    });
    menu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        menu.hidden = true;
      })
    );
  }

  /* ---------- copy email ---------- */
  const copyBtn = document.getElementById("copyEmail");
  if (copyBtn) {
    const labelEl = copyBtn.querySelector(".copy__label");
    const original = labelEl ? labelEl.textContent : "";
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.email || "";
      try {
        await navigator.clipboard.writeText(email);
      } catch (_) {
        /* clipboard blocked — the mailto button still works */
      }
      copyBtn.classList.add("copied");
      if (labelEl) labelEl.textContent = "Copied to clipboard";
      setTimeout(() => {
        copyBtn.classList.remove("copied");
        if (labelEl) labelEl.textContent = original;
      }, 1600);
    });
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ============================================================
     SIGNATURE — ridgeline of probability densities
     Stacked Gaussian-mixture posteriors, teal -> violet.
     This is the visual thesis: Bayesian inference, made literal.
     ============================================================ */
  const svg = document.getElementById("ridgeline");
  if (svg) {
    const NS = "http://www.w3.org/2000/svg";
    const W = 1200, H = 520;
    const ROWS = 14;
    const samples = 220;

    // tiny seeded RNG so the curves are stable across reloads
    let seed = 20260613;
    const rng = () => {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const lerp = (a, b, t) => a + (b - a) * t;
    const hexToRgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
    const teal = hexToRgb("#34e3c4");
    const violet = hexToRgb("#9d8bff");

    const step = H / (ROWS + 4);
    const amp = step * 3.1;

    // build each row's gaussian mixture
    const rows = [];
    for (let r = 0; r < ROWS; r++) {
      const comps = 1 + Math.floor(rng() * 3); // 1–3 modes
      const mix = [];
      for (let c = 0; c < comps; c++) {
        mix.push({
          mu: 0.12 + rng() * 0.76,
          sig: 0.04 + rng() * 0.12,
          w: 0.4 + rng() * 0.6,
        });
      }
      rows.push(mix);
    }

    // draw from back (top) to front (bottom) so nearer ridges overlap
    for (let r = ROWS - 1; r >= 0; r--) {
      const mix = rows[r];
      const baseline = step * 2.2 + r * step;
      const t = r / (ROWS - 1);
      const rgb = [
        Math.round(lerp(violet[0], teal[0], t)),
        Math.round(lerp(violet[1], teal[1], t)),
        Math.round(lerp(violet[2], teal[2], t)),
      ];
      const color = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;

      // sample density and find max for normalization
      const ys = [];
      let maxY = 0;
      for (let i = 0; i <= samples; i++) {
        const x = i / samples;
        let y = 0;
        for (const m of mix) {
          const d = (x - m.mu) / m.sig;
          y += m.w * Math.exp(-0.5 * d * d);
        }
        ys.push(y);
        if (y > maxY) maxY = y;
      }

      // build path
      let d = `M 0 ${baseline.toFixed(1)}`;
      for (let i = 0; i <= samples; i++) {
        const px = (i / samples) * W;
        const py = baseline - (ys[i] / maxY) * amp;
        d += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
      }
      d += ` L ${W} ${baseline.toFixed(1)} Z`;

      // filled area
      const fill = document.createElementNS(NS, "path");
      fill.setAttribute("d", d);
      fill.setAttribute("fill", color);
      fill.setAttribute("fill-opacity", "0.05");
      svg.appendChild(fill);

      // crisp stroke
      const line = document.createElementNS(NS, "path");
      line.setAttribute("d", d);
      line.setAttribute("fill", "none");
      line.setAttribute("stroke", color);
      line.setAttribute("stroke-opacity", "0.5");
      line.setAttribute("stroke-width", "1.4");

      if (!prefersReduced) {
        const len = 2600;
        line.style.strokeDasharray = len;
        line.style.strokeDashoffset = len;
        line.style.transition = "stroke-dashoffset 1.6s ease";
        line.style.transitionDelay = (0.04 * (ROWS - r)) + "s";
        requestAnimationFrame(() =>
          requestAnimationFrame(() => { line.style.strokeDashoffset = "0"; })
        );
      }
      svg.appendChild(line);
    }
  }
})();
