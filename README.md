# AQI SENTINEL — Bengaluru Air Quality Early-Warning & Risk-Ranking System

> **Bengaluru's Environmental Operating System**  
> *Monitor. Predict. Understand. Act.*

AQI SENTINEL is a production-quality, Bengaluru-restricted environmental intelligence platform. It continuously ingests, analyzes, ranks, and visualizes air quality telemetry, nitrogen dioxide concentrations, traffic bottleneck congestion, industrial stack emissions, and green canopy coverage across 12 key Bengaluru municipal zones.

-------

## Key Features & Architectural Scope

1. **Strict Bengaluru Scope Restriction**: Pinned to Bengaluru municipality bounds (12.9716° N, 77.5946° E). All maps, analytics, safe zone lookups, and AI guidance focus exclusively on Bengaluru.
2. **Data Integrity Guarantee**: Explicitly labels data as `LIVE ●`, `HISTORICAL`, `PREDICTED`, `ESTIMATED`, `USER-SUBMITTED`, or `UNAVAILABLE`. Never fabricates data.
3. **Manual Algorithmic Transparency**:
   - **Merge Sort ($O(N \log N)$)**: Custom implementation in `lib/algorithms/mergeSort.ts` to rank pollution hotspots by composite risk score.
   - **Binary Search ($O(\log N)$)**: Custom implementation in `lib/algorithms/binarySearch.ts` for fast target AQI lookups in Safe Zone Finder.
   - **Pearson Correlation ($r$)**: Custom implementation in `lib/algorithms/correlation.ts` measuring linear relationship between Traffic Density (%) and $NO_2$ Concentration ($\mu\text{g/m}^3$).
   - **Moving Average & Trend Slope**: Custom implementation in `lib/algorithms/movingAverage.ts` for 24-hour pollution spike predictions.
   - Interactive *"How the Algorithm Works"* UI inspection drawers on key pages.
4. **12 Comprehensive Dedicated Views**:
   - `Landing Page`: Futuristic environmental command platform hero with particle canvas & live ticker.
   - `Command Center`: Ranked hotspots & Azure OpenAI powered *"Why is this area high-risk?"* breakdown.
   - `3D Bengaluru Pollution Map`: Leaflet geospatial layer with particle density rings, time slider, and station popups.
   - `Early Warning`: 24-hour spike probabilities, trend slopes, anomaly detectors, and intervention solutions.
   - `Air Analytics Lab`: Multi-pollutant time-series, weather correlations, and Traffic vs $NO_2$ scatter plot.
   - `Traffic & Industry`: Traffic bottlenecks and KSPCB stack emission compliance monitoring against NAAQS standards.
   - `Green Bengaluru`: BBMP canopy priority ranking and tree planting risk reduction models.
   - `Civic Reports`: Citizen complaint submission with Azure OpenAI evidence classification and PDF/JSON exports.
   - `Safe Zone Finder`: Multi-factor weight sliders and Binary Search zone discovery.
   - `Primus AI`: Natural language assistant for low-exposure route optimization (Fastest vs. Safest route).
   - `Exposure Survey`: Personal daily outdoor time and commute mode exposure score output.
   - `Pollution Calendar`: Day-by-day AQI/PM2.5 heat map calendar (Month/Week views).
5. **Dynamic Theme System**: Supports **Midnight Command**, **Aurora Green**, and **Carbon Glass** themes.

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Leaflet / React Leaflet.
- **Backend**: Next.js API Routes & Server Actions.
- **Database**: Supabase PostgreSQL + PostGIS (`supabase/migrations/00001_initial_schema.sql`).
- **AI**: Azure OpenAI Service (`gpt-4o` deployment) for server-side reasoning.
- **Data Adapters**: Open-Meteo Air Quality & Weather API, CPCB Telemetry, KSPCB Standards (NAAQS 2009).

---

## Installation & Setup Instructions

### 1. Prerequisites
- Node.js 18+ and `npm` or `yarn` installed.

### 2. Clone & Install Dependencies
```bash
cd c:\AQISentinek
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your credentials in `.env.local`:
```env
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
AZURE_OPENAI_ENDPOINT=https://dambalkiran-4933-resource.services.ai.azure.com
AZURE_OPENAI_API_VERSION=2025-04-01-preview
AZURE_OPENAI_CHAT_DEPLOYMENT=gpt-4o

NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup (Supabase)
Apply the SQL migration script located in `supabase/migrations/00001_initial_schema.sql` via the Supabase Dashboard SQL Editor or Supabase CLI:
```bash
npx supabase db push
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Production Build
```bash
npm run build
npm run start
```

---

## API Endpoints

- `GET /api/aqi`: Citywide averages and Merge Sort ranked Bengaluru hotspots.
- `GET /api/weather`: Live Open-Meteo weather data for Bengaluru grid.
- `GET /api/traffic`: Bottlenecks and Pearson correlation statistics.
- `GET /api/industry`: KSPCB stack emission compliance status.
- `GET /api/green`: BBMP green cover priority rankings.
- `GET /api/safe-zones?maxAQI=150`: Binary Search safe zone discovery.
- `GET /api/warnings`: Moving average trend analysis and spike predictions.
- `POST /api/reports`: Citizen complaint submission and government report generator.
- `POST /api/primus`: Azure OpenAI assistant reasoning and route comparison.

---

## Verification & Quality Assurance

- **Zero Hardcoded Fake Data**: All visualizations source directly from Open-Meteo APIs, CPCB telemetry, or explicit baseline models with full source attribution.
- **Strict Error Handling**: Graceful fallback handlers for API timeouts and missing parameters.
- **Production Build Validated**: Built with Next.js App Router for optimal SSR/CSR split and static asset optimization.

---

## 👥 Team & Contributors

| Member | GitHub Username | Role |
| :--- | :--- | :--- |
| **Jeevan Gowda H M** | [@jeevangowdahm](https://github.com/jeevangowdahm) | Core Engine |
| **Shashank Sharma** | [@hshashanksharma-ui](https://github.com/hshashanksharma-ui) | UI Development |
| **Ayush** | [@Ayushcodes-hub](https://github.com/Ayushcodes-hub) | Developer  |
| **Abishek Lochan** | [@abisheklochan-a11y](https://github.com/abisheklochan-a11y) | Accessibility & Frontend |
| **Hari Prasad** | [@hariprasadmstar2007-design](https://github.com/hariprasadmstar2007-design) | Project Lead |
| **Bhuvan B P** | [@bhuvanbp0407](https://github.com/bhuvanbp0407) | Developer |

---

