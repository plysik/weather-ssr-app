import React from "react";
import { hydrateRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "@/common/App";

import "@/styles/global.css";
import { parse } from "path";
import { parseOpenWeatherToWeatherData } from "@/shared/utils";
import { makeStore } from "@/store";

const init = (window as any).__INITIAL_DATA__ as {
	current: OpenWeatherResponse;
	comparison: Partial<OpenWeatherResponse>[];
} | null;

const preloadedState = init
	? {
			weather: {
				current: parseOpenWeatherToWeatherData(init.current),
				comparison: init.comparison.map((d) =>
					parseOpenWeatherToWeatherData(d as OpenWeatherResponse),
				),
				status: "idle",
				error: null,
				forecast: [],
			},
		}
	: undefined;
const store = makeStore(preloadedState);

hydrateRoot(
	document.getElementById("root")!,
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>,
);
