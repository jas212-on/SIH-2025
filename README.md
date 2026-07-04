# Jalmitra — Frontend

> React 18 + Vite 7 + TailwindCSS frontend for the Jalmitra groundwater intelligence platform.

---

## What is Jalmitra?

**Jalmitra** (जलमित्र — "friend of water") makes India's groundwater data — published annually by the **Central Ground Water Board (CGWB)** as dense, specialist-only assessments — accessible to anyone through plain-language conversation. This repository is the React interface: everything a user sees and clicks, from the landing page through chat, mapping, forecasting, and farmer advisory tools, talking to the [Jalmitra backend](../SIHb-2025) over a REST/SSE API.

### Why it exists

CGWB's *Assessment of Dynamic Ground Water Resources of India* is real, detailed, and public — but it's locked in tabular PDFs and spreadsheets. A farmer deciding when to sow, a policymaker planning an intervention, or a citizen who just wants to know "is my district's water table safe?" has no easy way to ask that question and get a straight answer. Jalmitra turns that static annual dataset into something you can talk to.

### The product, one axis at a time

Every page in this app sits somewhere on the same axis the whole platform is built around:

```
Chatbot (describe)  →  Dashboard (monitor)  →  Predictor (forecast)  →  Advisor (recommend)  →  Actor (intervene)
```

Chat and the Map describe the current situation. Compare lets you monitor trends across states/districts. Forecast predicts where a district is headed. Advisory and the Simulator turn that prediction into a recommendation or a testable intervention.

### Who uses it

The UI is explicitly role-aware — the same chat box and the same data change shape depending on who's asking:

- **Farmers** get a sowing/irrigation advisory form, not just chat answers.
- **Policymakers** get the what-if simulator, forecasting, and PDF report export.
- **Researchers** get cited sources, raw CSV/JSON export, and a transparent forecasting method.
- **The general public** gets a plain-language assistant in six Indian languages, no account required.

### Pages at a glance

| Page | Route | Description |
|---|---|---|
| Home | `/` | Landing page — mission, feature highlights, live-data stats |
| Chat | `/chat` | AI-powered groundwater Q&A with streaming SSE, role-selector, multilingual |
| Visualization | `/visualization` | Chart.js charts — bar, line, pie, doughnut, radar |
| Map | `/map` | Interactive India choropleth (react-simple-maps) |
| Compare | `/compare` | Multi-state / multi-metric comparative dashboard |
| Forecast | `/forecast` | Stage-of-extraction projections with risk-threshold crossings |
| Advisory | `/advisory` | Farmer sowing/irrigation recommendation form |
| Simulator | `/simulator` | What-if draft-change scenario testing |
| Field Data | `/field-data` | Crowdsourced well-depth reading submission |
| Reports | `/reports` | Downloadable PDF report generation |
| About | `/about` | Mission, data sources, terms, and support/FAQ |
| Features | `/features` | Full feature catalogue with role-based breakdown |
| Contact | `/contact` | Email, links, and FAQ |
| Documentation | `/documentation` | How the platform and its pipeline work, end to end |
| API Guide | `/api-guide` | REST endpoint reference for the backend |

**Languages supported:** English, हिंदी, తెలుగు, தமிழ், ಕನ್ನಡ, മലയാളം

---

## Quick Start

### 1. Prerequisites

- Node.js 20+
- Backend running at `http://localhost:8000` (see `../SIHb-2025/README.md`)

### 2. Install

```bash
cd SIH-2025
npm install
```

### 3. Configure

```bash
cp .env.example .env
# Edit VITE_API_URL if your backend is not on localhost:8000
```

### 4. Run

```bash
npm run dev
# → http://localhost:3001
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | Backend base URL (no trailing slash) |

There is no dev-server proxy — `src/services/api.js` always calls the backend at the absolute `VITE_API_URL`, in both development and production. Set it in `.env` for local development and as a build-time value (or Docker `--build-arg`) for production, since Vite inlines `import.meta.env.VITE_API_URL` at build time.

---

## Project Structure

```
src/
├── App.jsx                        # Routes + providers (lazy-loaded pages)
├── i18n.js                        # react-i18next setup
├── main.jsx                       # React entry point
├── components/
│   ├── common/
│   │   ├── ErrorBoundary.jsx
│   │   ├── LanguageSwitcher.jsx
│   │   ├── StatusIndicator.jsx
│   │   └── Toast.jsx
│   ├── chat/
│   │   ├── ChatInput.jsx          # Textarea + autocomplete
│   │   ├── ChatMessage.jsx        # Message bubble + feedback stars
│   │   ├── QuickQueries.jsx       # Suggested query chips
│   │   └── RoleSelector.jsx       # Farmer / Policymaker / Researcher / General
│   └── home/
│       ├── FlowBackground.jsx     # Animated landing background
│       ├── Reveal.jsx             # Scroll-reveal animation wrappers
│       ├── RippleButton.jsx
│       └── WaveDivider.jsx
├── config/
│   ├── constants.js               # Languages, roles, states, metrics…
│   └── icons.js
├── hooks/
│   └── useLanguage.js
├── pages/
│   ├── HomePage.jsx                # Landing page (/)
│   ├── ChatPage.jsx                # AI chat (/chat)
│   ├── DataVisualization.jsx       # Chart builder (/visualization)
│   ├── MapPage.jsx                 # India choropleth (/map)
│   ├── ComparePage.jsx             # Comparative dashboard (/compare)
│   ├── ForecastPage.jsx            # Trend forecasts (/forecast)
│   ├── AdvisoryPage.jsx            # Farmer advisory (/advisory)
│   ├── SimulatorPage.jsx           # What-if simulator (/simulator)
│   ├── FieldObservationPage.jsx    # Field data submission (/field-data)
│   ├── ReportsPage.jsx             # Report generation (/reports)
│   ├── AboutPage.jsx               # About Jalmitra (/about)
│   ├── FeaturesPage.jsx            # Feature catalogue (/features)
│   ├── ContactPage.jsx             # Contact + FAQ (/contact)
│   ├── DocumentationPage.jsx       # Platform documentation (/documentation)
│   └── ApiGuidePage.jsx            # Backend API reference (/api-guide)
└── services/
    └── api.js                     # Centralized fetch + SSE client
```

---

## Docker

```bash
# Build (inject backend URL at build time)
docker build \
  --build-arg VITE_API_URL=https://your-backend.railway.app \
  -t jalmitra-frontend .

# Run
docker run -p 3001:80 jalmitra-frontend
```

The image is nginx + static files with SPA fallback (`try_files $uri /index.html`).

---

## Deployment

### Vercel (recommended for frontend)

1. Import the `SIH-2025` folder as a Vercel project
2. Set `VITE_API_URL` in **Project Settings → Environment Variables**
3. Deploy — Vercel handles Vite builds automatically

### Railway / Render

Use the Dockerfile. Set `VITE_API_URL` as a build argument.

---

## Tech Stack

- React 18.2
- Vite 7.1
- TailwindCSS 3.3
- Chart.js 4.5 + react-chartjs-2
- react-simple-maps 3 (India map)
- react-i18next (6 languages)
- react-router-dom 6
