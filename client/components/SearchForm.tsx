import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SearchForm = () => {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debugger; 
    const city = input.trim();
    if (city) {
      navigate(`/${encodeURIComponent(city)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Wpisz miasto"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit">Szukaj</button>
    </form>
  );
}
export default SearchForm;