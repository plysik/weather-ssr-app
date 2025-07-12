
# WeatherSSR App

A Server-Side Rendered (SSR) React + Express application for checking current and 5-day weather forecasts, with:

- **SSR + Hydration** via `renderToString` & React Router  
- **Redux Toolkit** for state & async thunks  
- **Express API** endpoints for current weather, comparison, and forecast  
- **TypeScript**, **pnpm**  
- **Tailwind CSS** + **shadcn/ui** components + **Lucide** icons  
- Dynamic `<title>`, environment config via `.env`

---

## 🔧 Prerequisites

- Node.js ≥ 18  
- pnpm ≥ 7  
- OpenWeatherMap API key  

---

## 📦 Getting Started

1. **Clone repo**  
   ```bash
   git clone https://github.com/YourUser/weather-ssr-app.git
   cd weather-ssr-app
    ````

2. **Create `.env`** at project root:

   ```ini
   # .env
   API_KEY=your_openweathermap_api_key
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   ```

4. **Run in development**
   This runs both client and server in watch mode, and opens your browser automatically:

   ```bash
   pnpm run dev
   ```

   * Client bundle → `webpack.client.ts` (watch → `public/bundle.js`)
   * Server → `nodemon` rebuilds & restarts `build/server.js`
   * Opens `http://localhost:3000` in your browser

5. **Build for production**

   ```bash
   pnpm run build
   ```

   * Generates optimized client bundle
   * Generates server bundle

6. **Start production server**

   ```bash
   pnpm run start
   ```

   Visit → `http://localhost:3000`

---

## 🚀 Scripts

```jsonc
{
  "scripts": {
    "dev":          "concurrently \"pnpm run watch-client\" \"pnpm run watch-server\" \"pnpm run open:browser\"",
    "open:browser": "wait-on http://localhost:3000 && cmd /c start \"\" http://localhost:3000",
    "watch-client": "webpack --config webpack.client.ts --watch",
    "watch-server": "nodemon --watch src/server --exec \"pnpm run build:server && node build/server.js\"",
    "build:client": "webpack --config webpack.client.ts --mode production",
    "build:server": "webpack --config webpack.server.ts --mode production",
    "build":        "pnpm run build:client && pnpm run build:server",
    "start":        "node build/server.js",
    "format":       "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "biome:check":  "biome check",
    "biome:fix":    "biome fix",
    "check:types":  "tsc --noEmit"
  }
}
```

---

## 🏗️ Architecture

```
/
├─ api/                  # (optional) serverless function for Vercel
├─ components/           # shadcn/ui custom components
├─ public/               # client bundle + static assets
│   └─ bundle.js
├─ src/
│   ├─ client/           # client entry (hydrate)
│   │   └─ index.tsx
│   ├─ common/
│   │   ├─ App.tsx       # routes & layout
│   │   ├─ pages/        # HomePage, CityPage
│   │   ├─ components/   # SearchForm, UI widgets
│   │   ├─ store/        # Redux store + weatherSlice
│   │   └─ typings/      # TS types (WeatherData etc.)
│   ├─ server/           # Express SSR + API utils (buildWeatherUrl, One Call)
│   │   └─ index.tsx
│   └─ styles/           # Tailwind globals.css
│       └─ globals.css
├─ webpack.client.ts     # client bundling
├─ webpack.server.ts     # server bundling
├─ tailwind.config.js
└─ postcss.config.js
```

---

## 📖 Features

* **Home (`/`)**

  * Hero section & prominent SearchForm
  * Quick-link cards for popular Polish cities
  * Full-page SSR on initial search

* **City (`/:city`)**

  * SSR-rendered current weather + icon + description
  * Comparison table vs. popular cities
  * 5-day forecast carousel with day names & icons
  * Client-side “in-page” search refresh via Redux thunk
  * Dynamic `<title>`: `WeatherSSR – Pogoda dla [Miasto]`

* **Styling**

  * Tailwind CSS v4 (JIT, utility-first)
  * shadcn/ui woven with Tailwind + class-variance-authority
  * Lucide React icons
  * Light/Dark mode ready (via `darkMode: 'class'`)

* **State & Data**

  * Redux Toolkit + `createAsyncThunk` for `fetchWeather` & `fetchForecast`
  * Preloaded SSR state hydrating Redux on client to avoid double fetch

* **Tooling**

  * pnpm, TypeScript, Biome (lint + fix)
  * Webpack builder for client & server
  * Environment variables via `dotenv`

---

## ⚙️ Environment Variables

Create a `.env` file in project root:

```ini
API_KEY=your_openweathermap_key
OPEN_WEATHER_API_URL=https://api.openweathermap.org/data/2.5/weather
```

* `API_KEY` – your OpenWeatherMap API key
* `OPEN_WEATHER_API_URL` – base URL for current weather (default above)

---

## ✅ Next Steps

* **Add dark mode toggle**
* **Implement caching** in Redux slice
* **Write unit & integration tests**
* **Deploy to Vercel** (see `api/` function + `vercel.json`)
* **Improve accessibility** (`aria-*`, contrast checks)

Happy coding & enjoy your weather app! 🌤️