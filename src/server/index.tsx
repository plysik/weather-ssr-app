import path from "node:path";
import dotenv from "dotenv";
import express, { type RequestHandler } from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router-dom/server";
import App from "@/common/App";
import { popularCities } from "@/shared/data";
import { parseOpenWeatherToWeatherData } from "@/shared/utils";
import { makeStore } from "@/store";
import { buildForecastUrl, buildWeatherUrl } from "./utils";

dotenv.config();
const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(express.static(path.resolve(__dirname, "..", "public")));

app.get("/api/weather/comparison", async (_req: Request, res: Response) => {
	try {
		const results = await Promise.all(
			popularCities.map(async (city) => {
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

app.get("/api/weather/forecast/:city", async (req, res) => {
	try {
		const city = req.params.city;
		const basicResp = await fetch(buildWeatherUrl(city));
		if (!basicResp.ok)
			return res
				.status(basicResp.status)
				.json({ message: basicResp.statusText });
		const basicJson = await basicResp.json();
		const {
			coord: { lat, lon },
		} = basicJson;

		const forecastResp = await fetch(buildForecastUrl(lat, lon));
		if (!forecastResp.ok)
			return res
				.status(forecastResp.status)
				.json({ message: forecastResp.statusText });
		const { list } = await forecastResp.json();
		res.json(list);
	} catch (err: any) {
		console.error("Error fetching forecast:", err);
		res.status(500).json({ message: err.message });
	}
});

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
			const comparison = await Promise.all(
				popularCities.map(async (c) => {
					const resp = await fetch(buildWeatherUrl(c));
					if (!resp.ok) throw new Error(`Error fetching ${c}`);
					return resp.json();
				}),
			);

			initialData = { current, comparison };
		}
		const preloadedState = initialData
			? {
					weather: {
						current: parseOpenWeatherToWeatherData(initialData.current),
						comparison: initialData.comparison.map((d) =>
							parseOpenWeatherToWeatherData(d as OpenWeatherResponse),
						),
						status: "idle",
						error: null,
						forecast: [],
					},
				}
			: undefined;
		const store = makeStore(preloadedState);
		const title = initialData?.current
			? `Pogodynka – Pogoda dla ${initialData.current.name}`
			: "Pogodynka";

		const appHtml = renderToString(
			<Provider store={store}>
				<StaticRouter location={req.url}>
					<App />
				</StaticRouter>
			</Provider>,
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
