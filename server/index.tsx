import express from 'express';
import path from 'path';
import fs from 'fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import { createStore } from '../shared/store';
import App from '../client/App';
import { fetchWeather } from './weatherService';
import dotenv from 'dotenv';
import { renderFullPage } from './renderFullPage';

dotenv.config();

const PORT = 3000;
const app = express();





// Serwujemy statyczne pliki klienta (z katalogu dist/assets)
app.use(express.static(path.resolve(__dirname, '../dist/assets')));

app.get('/api/weather', async (req, res) => {
  const city = req.query.city as string;
  if (!city) return res.status(400).json({ error: 'Brak parametru city' });
  try {
    const weather = await fetchWeather(city);
    res.json(weather);
  } catch {
    res.status(500).json({ error: 'Błąd pobierania pogody' });
  }
});

app.get('/:city', async (req, res) => {
  const city = req.params.city;
  if (!city) return res.sendStatus(404);

  const store = createStore();

  try {
    const weather = await fetchWeather(city);
    store.dispatch({ type: 'weather/setCurrent', payload: weather });
  } catch {
    store.dispatch({
      type: 'weather/setCurrent',
      payload: {
        city,
        temperature: 20,
        humidity: 60,
        wind: 10,
        fallback: true,
      },
    });
  }

  const appHtml = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
    </Provider>
  );

  const html = renderFullPage(appHtml, `Pogoda dla ${city}`, store.getState());
  res.send(html);
});

app.get('/', (req, res) => {
  const store = createStore();
  const appHtml = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
    </Provider>
  );
  const html = renderFullPage(appHtml, 'Prognoza pogody', store.getState());
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
