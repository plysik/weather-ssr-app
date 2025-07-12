import dotenv from "dotenv";
import express, { type RequestHandler } from "express";
import path from "path";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "../common/App";

dotenv.config();
const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Base URL and API key for OpenWeatherMap
const OPEN_WEATHER_BASE_URL =
	process.env.OPEN_WEATHER_API_URL ||
	"https://api.openweathermap.org/data/2.5/weather";
const API_KEY = process.env.API_KEY!;

/**
 * Builds the full OpenWeatherMap request URL for a given city,
 * including metric units and Polish language.
 */
function buildWeatherUrl(city: string): string {
	const params = new URLSearchParams({
		q: city,
		appid: API_KEY,
		units: "metric",
		lang: "pl",
	});
	return `${OPEN_WEATHER_BASE_URL}?${params.toString()}`;
}

// 1) Serve static assets
app.use(express.static(path.resolve(__dirname, "..", "public")));

// 2.1) Comparison endpoint for popular cities
app.get("/api/weather/comparison", async (_req: Request, res: Response) => {
	const popular = ["Warszawa", "Kraków", "Gdańsk", "Wrocław"];
	try {
		const results = await Promise.all(
			popular.map(async (city) => {
				const resp = await fetch(buildWeatherUrl(city));
				if (!resp.ok) throw new Error(`Error fetching ${city}`);
				return resp.json(); // Partial<OpenWeatherResponse>
			}),
		);
		res.json(results);
	} catch (err: any) {
		res.status(500).json({ message: err.message });
	}
});

// 2.2) Single-city weather endpoint
app.get("/api/weather/:city", async (req: Request, res: Response) => {
	const city = req.params.city;
	try {
		const resp = await fetch(buildWeatherUrl(city));
		if (!resp.ok) {
			return res.status(resp.status).json({ message: resp.statusText });
		}
		const data = await resp.json(); // OpenWeatherResponse
		res.json(data);
	} catch (err: any) {
		res.status(500).json({ message: err.message });
	}
});

// 3) SSR fallback with dynamic <title> and injected initial data
const ssrHandler: RequestHandler = async (req, res, next) => {
	try {
		let initialData: { current: any; comparison: any[] } | null = null;
		const match = req.path.match(/^\/([^/]+)\/?$/);
		if (match) {
			const city = decodeURIComponent(match[1]);

			// 1) Fetch current weather directly from OpenWeatherMap
			const currResp = await fetch(buildWeatherUrl(city));
			if (!currResp.ok) throw new Error(`Error fetching ${city}`);
			const current = await currResp.json();

			// 2) Fetch comparison for popular cities
			const popular = ["Warszawa", "Kraków", "Gdańsk", "Wrocław"];
			const comparison = await Promise.all(
				popular.map(async (c) => {
					const resp = await fetch(buildWeatherUrl(c));
					if (!resp.ok) throw new Error(`Error fetching ${c}`);
					return resp.json();
				}),
			);

			initialData = { current, comparison };
		}

		const title =
			initialData && initialData.current
				? `WeatherSSR – Pogoda dla ${initialData.current.name}`
				: "WeatherSSR";

		const appHtml = renderToString(
			<StaticRouter location={req.url}>
				<App />
			</StaticRouter>,
		);

		res.send(`<!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${title}</title>
          </head>
          <body>
            <div id="root">${appHtml}</div>
            <script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};</script>
            <script src="/bundle.js"></script>
          </body>
        </html>`);
	} catch (err) {
		next(err as any);
	}
};
app.use(ssrHandler);

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
