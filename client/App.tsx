import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CityPage from './pages/CityPage';
const App = () => {
  const location = useLocation();
  return (
    <Routes>
      <Route path="/:city" element={<CityPage key={location.pathname} />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};

export default App;
