# Providence — 30-Day Contemplative Journal

A focused, minimalist 30-day spiritual journal and study application based on Jean-Pierre de Caussade’s spiritual classic, *Abandonment to Divine Providence* (*L'Abandon à la Providence Divine*).

[![Deploy to GitHub Pages](https://github.com/uncannyal20/providence/actions/workflows/deploy.yml/badge.svg)](https://github.com/uncannyal20/providence/actions/workflows/deploy.yml)

Live Application: **[https://uncannyal20.github.io/providence/](https://uncannyal20.github.io/providence/)**

---

## Key Features

- **Contemplative, Distraction-Free Aesthetic:**
  - Editorial serif headings (*Newsreader*) paired with clean sans-serif UI typography (*Plus Jakarta Sans*).
  - Warm parchment palette with Sepia, Light, and Monastic Dark reading themes.
- **The 3-Section Daily Flow:**
  - **Read:** Daily Scripture passage + Caussade excerpt with meditative audio reader and key quote callout.
  - **In-App Reader Drawer:** Slide-over sheet displaying the unabridged public domain chapter text, smoothly auto-scrolling to and softly highlighting the day's specific excerpt.
  - **Reflect:** 1–2 sharp daily reflection prompts with Markdown-supported journaling input, live preview, and debounced autosave.
  - **The Surrender Box (Anchor Area):** A specialized single-field card where you name what you are carrying or clinging to today, featuring a simple one-click "Release to Providence" action with affirmative particle animation and visual archiving.
- **30-Day Spiritual Progression:**
  - **Phase 1 (Days 1–7):** *Understanding Divine Action* — The Sacrament of the Present Moment.
  - **Phase 2 (Days 8–15):** *The Heart of Abandonment* — Consenting with the *Fiat* and walking in pure trust.
  - **Phase 3 (Days 16–22):** *Freedom from Self-Direction* — Relinquishing human calculations and false security.
  - **Phase 4 (Days 23–30):** *Consolation & Interior Freedom* — The fire of divine purification, holy indifference, and perpetual peace.
- **100% Client-Side Privacy:**
  - All journal reflections and surrendered burdens are stored solely in your local browser storage (`localStorage`).
  - Zero analytics, zero cookies, zero external trackers.
  - One-click JSON backup export and import to move your journal across devices.

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linter
npm run lint

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## GitHub Pages Deployment

This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys the app to GitHub Pages on every push to `main`.

To enable GitHub Pages:
1. Go to repository **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. The site will deploy to `https://uncannyal20.github.io/providence/`.
