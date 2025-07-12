import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CityPage from './pages/CityPage';
import SearchForm from './components/SearchForm';
import { Container } from '@components/ui/container';
import { Separator } from '@components/ui/separator';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50">
      <header className="bg-white shadow-sm">
        <Container className="flex items-center justify-between py-4 min-h-16">
          <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-800">
            WeatherSSR
          </Link>
          <div className="w-1/3 hidden sm:block">
            <Routes>
              <Route path="/:city" element={<SearchForm />} />
            </Routes>
          </div>
        </Container>
      </header>
      <Separator />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:city" element={<CityPage />} />
          <Route
            path="*"
            element={
              <Container className="py-20 text-center text-gray-500">
                <h2 className="text-3xl mb-4">404 – Nie znaleziono strony</h2>
                <Link to="/">
                  <button className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    Wróć do strony głównej
                  </button>
                </Link>
              </Container>
            }
          />
        </Routes>
      </main>
      <Separator />
      <footer className="bg-gray-50">
        <Container className="py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} WeatherSSR – Wszystkie prawa zastrzeżone
        </Container>
      </footer>
    </div>
  );
};

export default App;
